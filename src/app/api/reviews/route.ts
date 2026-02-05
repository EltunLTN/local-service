import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/reviews - Get reviews (for a master or by a customer)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const masterId = searchParams.get("masterId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const minRating = parseInt(searchParams.get("minRating") || "0")
    const sortBy = searchParams.get("sortBy") || "newest"

    if (!masterId) {
      return NextResponse.json(
        { success: false, error: "Master ID required" },
        { status: 400 }
      )
    }

    const where: any = {
      masterId,
      isApproved: true,
      isHidden: false,
    }

    if (minRating > 0) {
      where.rating = { gte: minRating }
    }

    let orderBy: any = { createdAt: "desc" }
    if (sortBy === "highest") orderBy = { rating: "desc" }
    if (sortBy === "lowest") orderBy = { rating: "asc" }
    if (sortBy === "helpful") orderBy = { helpfulCount: "desc" }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          order: {
            select: {
              title: true,
              category: {
                select: { name: true },
              },
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    // Get rating breakdown
    const ratingBreakdown = await prisma.review.groupBy({
      by: ["rating"],
      where: { masterId, isApproved: true },
      _count: true,
    })

    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      photos: review.photos,
      reply: review.reply,
      repliedAt: review.repliedAt,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      customer: {
        name: `${review.customer.firstName} ${review.customer.lastName}`,
        avatar: review.customer.avatar,
      },
      service: review.order.title,
      category: review.order.category.name,
    }))

    return NextResponse.json({
      success: true,
      data: transformedReviews,
      ratingBreakdown: ratingBreakdown.reduce((acc, r) => {
        acc[r.rating] = r._count
        return acc
      }, {} as Record<number, number>),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, rating, comment, photos } = body

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Get order and verify ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: { include: { user: true } },
        master: true,
        review: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    if (order.customer.user.email !== session.user.email) {
      return NextResponse.json(
        { success: false, error: "Only the customer can review this order" },
        { status: 403 }
      )
    }

    if (order.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, error: "Can only review completed orders" },
        { status: 400 }
      )
    }

    if (order.review) {
      return NextResponse.json(
        { success: false, error: "Order already reviewed" },
        { status: 400 }
      )
    }

    if (!order.masterId) {
      return NextResponse.json(
        { success: false, error: "Order has no assigned master" },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId,
        customerId: order.customerId,
        masterId: order.masterId,
        rating,
        comment: comment || null,
        photos: photos || [],
      },
    })

    // Update master rating
    const allReviews = await prisma.review.findMany({
      where: { masterId: order.masterId, isApproved: true },
      select: { rating: true },
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.master.update({
      where: { id: order.masterId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    })

    // Notify master
    if (order.master) {
      await prisma.notification.create({
        data: {
          userId: order.master.userId,
          type: "REVIEW_NEW",
          title: "Yeni rəy",
          message: `${order.customer.firstName} sizə ${rating} ulduz verdi`,
          data: { reviewId: review.id, orderId },
        },
      })
    }

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

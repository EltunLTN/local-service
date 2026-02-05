import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/masters/[id] - Get single master by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const master = await prisma.master.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        services: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
        portfolioItems: {
          orderBy: { createdAt: "desc" },
          take: 12,
        },
        reviews: {
          where: { isApproved: true, isHidden: false },
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
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            orders: {
              where: { status: "COMPLETED" },
            },
            favoritedBy: true,
          },
        },
      },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, error: "Master not found" },
        { status: 404 }
      )
    }

    // Calculate rating breakdown
    const ratingBreakdown = await prisma.review.groupBy({
      by: ["rating"],
      where: { masterId: id, isApproved: true },
      _count: true,
    })

    const ratingStats = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }
    ratingBreakdown.forEach((r) => {
      ratingStats[r.rating as keyof typeof ratingStats] = r._count
    })

    // Transform response
    const response = {
      id: master.id,
      name: `${master.firstName} ${master.lastName}`,
      firstName: master.firstName,
      lastName: master.lastName,
      avatar: master.avatar,
      coverImage: master.coverImage,
      bio: master.bio,
      phone: master.phone,
      address: master.address,
      district: master.district,
      lat: master.lat,
      lng: master.lng,
      experience: master.experience,
      hourlyRate: master.hourlyRate,
      isVerified: master.isVerified,
      isInsured: master.isInsured,
      isPremium: master.isPremium,
      isActive: master.isActive,
      rating: master.rating,
      reviewCount: master.reviewCount,
      completedJobs: master.completedJobs,
      responseRate: master.responseRate,
      responseTime: master.responseTime,
      workingDays: master.workingDays,
      workingHoursStart: master.workingHoursStart,
      workingHoursEnd: master.workingHoursEnd,
      languages: master.languages,
      memberSince: master.user.createdAt,
      categories: master.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
        icon: c.category.icon,
        color: c.category.color,
      })),
      services: master.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      })),
      portfolio: master.portfolioItems.map((p) => ({
        id: p.id,
        type: p.type,
        url: p.url,
        thumbnail: p.thumbnail,
        title: p.title,
        description: p.description,
        createdAt: p.createdAt,
      })),
      reviews: master.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        photos: r.photos,
        reply: r.reply,
        repliedAt: r.repliedAt,
        helpfulCount: r.helpfulCount,
        createdAt: r.createdAt,
        customer: {
          name: `${r.customer.firstName} ${r.customer.lastName}`,
          avatar: r.customer.avatar,
        },
        service: r.order.title,
      })),
      ratingBreakdown: ratingStats,
      stats: {
        totalReviews: master._count.reviews,
        completedJobs: master._count.orders,
        favorites: master._count.favoritedBy,
      },
    }

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error("Error fetching master:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/reviews?masterId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const masterId = searchParams.get("masterId")
    const orderId = searchParams.get("orderId")

    const where: any = {}
    if (masterId) where.masterId = masterId
    if (orderId) where.orderId = orderId

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: true,
        master: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        reply: r.reply,
        createdAt: r.createdAt,
        customer: r.customer
          ? { id: r.customer.id, name: `${r.customer.firstName} ${r.customer.lastName}`, avatar: r.customer.avatar }
          : null,
        master: r.master
          ? { id: r.master.id, name: `${r.master.firstName} ${r.master.lastName}` }
          : null,
      })),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Rəylər yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/reviews - Create a review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true },
    })

    if (!user?.customer) {
      return NextResponse.json({ success: false, error: "Müştəri profili tapılmadı" }, { status: 400 })
    }

    const body = await request.json()
    const { orderId, masterId, rating, comment } = body

    if (!orderId || !masterId || !rating) {
      return NextResponse.json({ success: false, error: "Sifariş ID, usta ID və reytinq tələb olunur" }, { status: 400 })
    }

    // Check order exists and is completed
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || order.status !== "COMPLETED") {
      return NextResponse.json({ success: false, error: "Yalnız tamamlanmış sifarişlərə rəy yaza bilərsiniz" }, { status: 400 })
    }

    // Check if already reviewed
    const existing = await prisma.review.findFirst({
      where: { orderId, customerId: user.customer.id },
    })
    if (existing) {
      return NextResponse.json({ success: false, error: "Bu sifarişə artıq rəy yazmısınız" }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        orderId,
        masterId,
        customerId: user.customer.id,
        rating: parseInt(rating),
        comment: comment || null,
      },
    })

    // Update master's average rating
    const reviews = await prisma.review.findMany({
      where: { masterId },
      select: { rating: true },
    })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await prisma.master.update({
      where: { id: masterId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
    })

    return NextResponse.json({ success: true, message: "Rəy əlavə edildi", data: review })
  } catch (error) {
    console.error("Review create error:", error)
    return NextResponse.json({ success: false, error: "Rəy əlavə edilə bilmədi" }, { status: 500 })
  }
}

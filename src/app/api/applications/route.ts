import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/applications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const masterId = searchParams.get("masterId")

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { master: true, customer: true },
    })

    const where: any = {}
    if (orderId) where.orderId = orderId
    if (masterId) where.masterId = masterId
    if (!orderId && !masterId && user?.master) where.masterId = user.master.id

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        master: true,
        order: { include: { category: true, customer: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: applications.map((a) => ({
        id: a.id,
        price: a.price,
        message: a.message,
        estimatedDuration: a.estimatedDuration,
        status: a.status,
        createdAt: a.createdAt,
        master: {
          id: a.master.id,
          name: `${a.master.firstName} ${a.master.lastName}`,
          avatar: a.master.avatar,
          rating: a.master.rating,
          reviewCount: a.master.reviewCount,
          completedJobs: a.master.completedJobs,
          experience: a.master.experience,
          isVerified: a.master.isVerified,
          phone: a.master.phone,
        },
        order: {
          id: a.order.id,
          title: a.order.title,
          status: a.order.status,
          category: a.order.category?.name || "",
          customer: a.order.customer ? `${a.order.customer.firstName} ${a.order.customer.lastName}` : "",
        },
      })),
    })
  } catch (error) {
    console.error("Applications error:", error)
    return NextResponse.json({ success: false, error: "Müraciətlər yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/applications - Master applies to order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { master: true },
    })

    if (!user?.master) {
      return NextResponse.json({ success: false, error: "Usta profili tapılmadı" }, { status: 400 })
    }

    const body = await request.json()
    const { orderId, price, message, estimatedDuration } = body

    if (!orderId || !price) {
      return NextResponse.json({ success: false, error: "Sifariş ID və qiymət tələb olunur" }, { status: 400 })
    }

    // Check if already applied
    const existing = await prisma.jobApplication.findUnique({
      where: { orderId_masterId: { orderId, masterId: user.master.id } },
    })

    if (existing) {
      return NextResponse.json({ success: false, error: "Artıq müraciət etmisiniz" }, { status: 400 })
    }

    const application = await prisma.jobApplication.create({
      data: {
        orderId,
        masterId: user.master.id,
        price: parseFloat(price),
        message: message || null,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
      },
    })

    return NextResponse.json({ success: true, message: "Müraciət göndərildi", data: application })
  } catch (error) {
    console.error("Application create error:", error)
    return NextResponse.json({ success: false, error: "Müraciət göndərilə bilmədi" }, { status: 500 })
  }
}

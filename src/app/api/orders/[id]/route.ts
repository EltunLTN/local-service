import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/orders/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        subcategory: true,
        customer: true,
        master: true,
        review: true,
        applications: {
          include: { master: true },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: "Sifariş tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        photos: JSON.parse(order.photos || "[]"),
        customer: order.customer ? {
          id: order.customer.id,
          name: `${order.customer.firstName} ${order.customer.lastName}`,
          avatar: order.customer.avatar,
        } : null,
        master: order.master ? {
          id: order.master.id,
          name: `${order.master.firstName} ${order.master.lastName}`,
          avatar: order.master.avatar,
          rating: order.master.rating,
          phone: order.master.phone,
          reviewCount: order.master.reviewCount,
          completedJobs: order.master.completedJobs,
        } : null,
        applications: order.applications.map((a) => ({
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
        })),
      },
    })
  } catch (error) {
    console.error("Order GET error:", error)
    return NextResponse.json({ success: false, error: "Sifariş yüklənə bilmədi" }, { status: 500 })
  }
}

// PATCH /api/orders/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, cancelReason, masterId } = body

    const updateData: any = {}
    if (status) {
      updateData.status = status
      if (status === "ACCEPTED") updateData.acceptedAt = new Date()
      if (status === "IN_PROGRESS") updateData.startedAt = new Date()
      if (status === "COMPLETED") updateData.completedAt = new Date()
      if (status === "CANCELLED") {
        updateData.cancelledAt = new Date()
        updateData.cancelReason = cancelReason || null
      }
    }
    if (masterId) updateData.masterId = masterId

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true, customer: true, master: true },
    })

    return NextResponse.json({
      success: true,
      message: "Sifariş yeniləndi",
      data: { ...order, photos: JSON.parse(order.photos || "[]") },
    })
  } catch (error) {
    console.error("Order PATCH error:", error)
    return NextResponse.json({ success: false, error: "Sifariş yenilənə bilmədi" }, { status: 500 })
  }
}

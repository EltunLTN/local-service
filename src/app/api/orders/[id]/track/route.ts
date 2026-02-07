import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/orders/[id]/track
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { category: true, customer: true, master: true },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: "Sifariş tapılmadı" }, { status: 404 })
    }

    const timeline = [
      { status: "PENDING", label: "Sifariş yaradıldı", date: order.createdAt, completed: true },
      { status: "ACCEPTED", label: "Usta qəbul etdi", date: order.acceptedAt, completed: !!order.acceptedAt },
      { status: "IN_PROGRESS", label: "İş başladı", date: order.startedAt, completed: !!order.startedAt },
      { status: "COMPLETED", label: "Tamamlandı", date: order.completedAt, completed: !!order.completedAt },
    ]

    return NextResponse.json({
      success: true,
      data: {
        order: { ...order, photos: JSON.parse(order.photos || "[]") },
        timeline,
        currentStatus: order.status,
      },
    })
  } catch (error) {
    console.error("Order track error:", error)
    return NextResponse.json({ success: false, error: "İzləmə məlumatları yüklənə bilmədi" }, { status: 500 })
  }
}

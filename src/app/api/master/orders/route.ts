import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/orders
export async function GET(request: NextRequest) {
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
      return NextResponse.json({ success: true, data: [] })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = { masterId: user.master.id }
    if (status && status !== "all") where.status = status.toUpperCase()

    const orders = await prisma.order.findMany({
      where,
      include: { category: true, customer: true },
      orderBy: { createdAt: "desc" },
    })

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      title: o.title,
      description: o.description,
      status: o.status,
      category: o.category?.name || "",
      customer: o.customer ? {
        name: `${o.customer.firstName} ${o.customer.lastName}`,
        avatar: o.customer.avatar,
      } : null,
      address: o.address,
      scheduledDate: o.scheduledDate,
      scheduledTime: o.scheduledTime,
      totalPrice: o.totalPrice || o.estimatedPrice || 0,
      createdAt: o.createdAt,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error("Master orders error:", error)
    return NextResponse.json({ success: false, error: "Sifarişlər yüklənə bilmədi" }, { status: 500 })
  }
}

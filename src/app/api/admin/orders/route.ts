import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (status && status !== "all") where.status = status.toUpperCase()
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { orderNumber: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { category: true, customer: true, master: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      title: o.title,
      status: o.status,
      category: o.category?.name || "",
      customer: o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : "",
      master: o.master ? `${o.master.firstName} ${o.master.lastName}` : "Təyin edilməyib",
      totalPrice: o.totalPrice || o.estimatedPrice || 0,
      scheduledDate: o.scheduledDate,
      createdAt: o.createdAt,
    }))

    return NextResponse.json({ success: true, data: formatted, total, page, limit })
  } catch (error) {
    console.error("Admin orders error:", error)
    return NextResponse.json({ success: false, error: "Sifarişlər yüklənə bilmədi" }, { status: 500 })
  }
}

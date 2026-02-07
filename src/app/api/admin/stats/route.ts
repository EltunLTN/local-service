import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalUsers,
      totalMasters,
      totalOrders,
      completedOrders,
      pendingOrders,
      thisMonthOrders,
      lastMonthOrders,
      thisMonthUsers,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "MASTER" } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { finalPrice: true },
      }),
    ])

    const orderGrowth = lastMonthOrders > 0
      ? Math.round(((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100)
      : thisMonthOrders > 0 ? 100 : 0

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true, customer: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalMasters,
        totalOrders,
        completedOrders,
        pendingOrders,
        thisMonthOrders,
        orderGrowth,
        thisMonthUsers,
        totalRevenue: totalRevenue._sum.finalPrice || 0,
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          title: o.title,
          status: o.status,
          customer: o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : "",
          category: o.category?.name || "",
          totalPrice: o.totalPrice || o.estimatedPrice || 0,
          createdAt: o.createdAt,
        })),
      },
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ success: false, error: "Statistika yüklənə bilmədi" }, { status: 500 })
  }
}

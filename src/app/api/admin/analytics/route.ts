import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Current period counts
    const [
      totalUsers,
      totalMasters,
      totalOrders,
      currentPeriodUsers,
      previousPeriodUsers,
      currentPeriodMasters,
      previousPeriodMasters,
      currentPeriodOrders,
      previousPeriodOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.master.count(),
      prisma.order.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.master.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.master.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    ])

    // Revenue calculations
    const currentRevenue = await prisma.order.aggregate({
      where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" },
      _sum: { finalPrice: true },
    })
    const previousRevenue = await prisma.order.aggregate({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, paymentStatus: "PAID" },
      _sum: { finalPrice: true },
    })

    const currentRevenueVal = currentRevenue._sum.finalPrice || 0
    const previousRevenueVal = previousRevenue._sum.finalPrice || 0

    const calcChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100 * 10) / 10
    }

    // Top masters by completed jobs
    const topMasters = await prisma.master.findMany({
      orderBy: { completedJobs: "desc" },
      take: 5,
      select: {
        firstName: true,
        lastName: true,
        completedJobs: true,
        rating: true,
      },
    })

    // Top categories by order count
    const topCategories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { orders: true } } },
      orderBy: { orders: { _count: "desc" } },
      take: 5,
    })

    // Monthly data for the last 12 months
    const monthlyData = []
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      
      const [monthOrders, monthRevenue] = await Promise.all([
        prisma.order.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.order.aggregate({
          where: { createdAt: { gte: monthStart, lte: monthEnd }, paymentStatus: "PAID" },
          _sum: { finalPrice: true },
        }),
      ])

      const months = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"]
      monthlyData.push({
        month: months[monthStart.getMonth()],
        orders: monthOrders,
        revenue: monthRevenue._sum.finalPrice || 0,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          revenue: {
            current: currentRevenueVal,
            previous: previousRevenueVal,
            change: calcChange(currentRevenueVal, previousRevenueVal),
          },
          orders: {
            current: currentPeriodOrders,
            previous: previousPeriodOrders,
            change: calcChange(currentPeriodOrders, previousPeriodOrders),
          },
          users: {
            current: totalUsers,
            previous: previousPeriodUsers || totalUsers,
            change: calcChange(currentPeriodUsers, previousPeriodUsers),
          },
          masters: {
            current: totalMasters,
            previous: previousPeriodMasters || totalMasters,
            change: calcChange(currentPeriodMasters, previousPeriodMasters),
          },
        },
        topMasters: topMasters.map((m) => ({
          name: `${m.firstName} ${m.lastName}`,
          orders: m.completedJobs,
          rating: m.rating,
          revenue: 0,
        })),
        topServices: topCategories.map((c) => ({
          name: c.name,
          orders: c._count.orders,
          revenue: 0,
          growth: 0,
        })),
        monthlyData,
      },
    })
  } catch (error) {
    console.error("Admin analytics error:", error)
    return NextResponse.json({ success: false, error: "Analitika yüklənə bilmədi" }, { status: 500 })
  }
}

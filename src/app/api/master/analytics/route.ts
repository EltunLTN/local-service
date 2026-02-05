import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Ustanın detallı analitikasını al
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { error: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month" // week, month, year

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "year":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      case "month":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    }

    // Get orders for the period
    const orders = await prisma.order.findMany({
      where: {
        masterId: master.id,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    })

    // Get reviews for the period
    const reviews = await prisma.review.findMany({
      where: {
        masterId: master.id,
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Calculate analytics
    const totalOrders = orders.length
    const completedOrders = orders.filter((o) => o.status === "COMPLETED").length
    const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length
    const inProgressOrders = orders.filter((o) => o.status === "IN_PROGRESS").length

    const totalEarnings = orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, o) => sum + (o.finalPrice || o.totalPrice || 0), 0)

    const avgOrderValue = completedOrders > 0 ? totalEarnings / completedOrders : 0

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : master.rating

    // Calculate daily/weekly breakdown
    const dailyStats: Record<string, { orders: number; earnings: number }> = {}
    
    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split("T")[0]
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { orders: 0, earnings: 0 }
      }
      dailyStats[dateKey].orders++
      if (order.status === "COMPLETED") {
        dailyStats[dateKey].earnings += order.finalPrice || order.totalPrice || 0
      }
    })

    // Category breakdown
    const categoryStats: Record<string, { count: number; earnings: number }> = {}
    
    orders.forEach((order) => {
      const categoryId = order.categoryId || "other"
      if (!categoryStats[categoryId]) {
        categoryStats[categoryId] = { count: 0, earnings: 0 }
      }
      categoryStats[categoryId].count++
      if (order.status === "COMPLETED") {
        categoryStats[categoryId].earnings += order.finalPrice || order.totalPrice || 0
      }
    })

    // Response rate calculation
    const respondedOrders = orders.filter(
      (o) => o.status !== "PENDING" && o.status !== "CANCELLED"
    ).length
    const responseRate = totalOrders > 0 ? (respondedOrders / totalOrders) * 100 : 100

    // Completion rate
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 100

    // Customer retention (returning customers)
    const customerIds = orders.map((o) => o.customerId)
    const uniqueCustomers = new Set(customerIds).size
    const returningCustomers = customerIds.length - uniqueCustomers

    return NextResponse.json({
      period,
      summary: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        pendingOrders,
        inProgressOrders,
        totalEarnings,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        responseRate: Math.round(responseRate),
        completionRate: Math.round(completionRate),
        uniqueCustomers,
        returningCustomers,
      },
      dailyStats: Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        ...stats,
      })),
      categoryStats: Object.entries(categoryStats).map(([categoryId, stats]) => ({
        categoryId,
        ...stats,
      })),
      recentReviews: reviews.slice(0, 5).map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json(
      { error: "Server xətası baş verdi" },
      { status: 500 }
    )
  }
}

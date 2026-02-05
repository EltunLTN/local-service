import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"

// GET /api/master/stats - Get master dashboard stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    // Get master
    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta profili tapılmadı" },
        { status: 403 }
      )
    }

    // Get current month range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get statistics
    const [
      totalOrders,
      thisMonthOrders,
      lastMonthOrders,
      completedOrders,
      pendingOrders,
      totalEarnings,
      thisMonthEarnings,
      lastMonthEarnings,
      reviews,
    ] = await Promise.all([
      // Total orders
      prisma.order.count({
        where: { masterId: master.id },
      }),
      // This month orders
      prisma.order.count({
        where: {
          masterId: master.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      // Last month orders
      prisma.order.count({
        where: {
          masterId: master.id,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      // Completed orders
      prisma.order.count({
        where: {
          masterId: master.id,
          status: OrderStatus.COMPLETED,
        },
      }),
      // Pending orders
      prisma.order.count({
        where: {
          masterId: master.id,
          status: OrderStatus.PENDING,
        },
      }),
      // Total earnings
      prisma.order.aggregate({
        where: {
          masterId: master.id,
          status: OrderStatus.COMPLETED,
        },
        _sum: { totalPrice: true },
      }),
      // This month earnings
      prisma.order.aggregate({
        where: {
          masterId: master.id,
          status: OrderStatus.COMPLETED,
          createdAt: { gte: startOfMonth },
        },
        _sum: { totalPrice: true },
      }),
      // Last month earnings
      prisma.order.aggregate({
        where: {
          masterId: master.id,
          status: OrderStatus.COMPLETED,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: { totalPrice: true },
      }),
      // Reviews count
      prisma.review.count({
        where: { masterId: master.id },
      }),
    ])

    // Calculate changes
    const ordersChange = lastMonthOrders > 0
      ? Math.round(((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100)
      : 100

    const thisMonthEarningsValue = thisMonthEarnings._sum?.totalPrice || 0
    const lastMonthEarningsValue = lastMonthEarnings._sum?.totalPrice || 0
    const earningsChange = lastMonthEarningsValue > 0
      ? Math.round(((thisMonthEarningsValue - lastMonthEarningsValue) / lastMonthEarningsValue) * 100)
      : 100

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        thisMonthOrders,
        ordersChange,
        completedOrders,
        pendingOrders,
        totalEarnings: totalEarnings._sum?.totalPrice || 0,
        thisMonthEarnings: thisMonthEarningsValue,
        earningsChange,
        rating: master.rating,
        reviewCount: reviews,
        responseRate: master.responseRate,
        profileViews: Math.floor(Math.random() * 500) + 100,
      },
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/stats
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
      return NextResponse.json({ success: false, error: "Usta profili tapılmadı" }, { status: 404 })
    }

    const masterId = user.master.id
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalOrders, completedOrders, pendingOrders, activeOrders, thisMonthOrders, revenue, pendingApplications] = await Promise.all([
      prisma.order.count({ where: { masterId } }),
      prisma.order.count({ where: { masterId, status: "COMPLETED" } }),
      prisma.order.count({ where: { masterId, status: "PENDING" } }),
      prisma.order.count({ where: { masterId, status: { in: ["ACCEPTED", "IN_PROGRESS"] } } }),
      prisma.order.count({ where: { masterId, createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({ where: { masterId, status: "COMPLETED" }, _sum: { finalPrice: true } }),
      prisma.jobApplication.count({ where: { masterId, status: "PENDING" } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        completedOrders,
        pendingOrders,
        activeOrders,
        thisMonthOrders,
        totalRevenue: revenue._sum.finalPrice || 0,
        rating: user.master.rating,
        reviewCount: user.master.reviewCount,
        pendingApplications,
      },
    })
  } catch (error) {
    console.error("Master stats error:", error)
    return NextResponse.json({ success: false, error: "Statistika yüklənə bilmədi" }, { status: 500 })
  }
}

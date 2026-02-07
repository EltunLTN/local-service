import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/analytics
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

    // Monthly order counts for last 6 months
    const months = []
    for (let i = 5; i >= 0; i--) {
      const start = new Date()
      start.setMonth(start.getMonth() - i, 1)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)

      const count = await prisma.order.count({
        where: { masterId, createdAt: { gte: start, lt: end } },
      })
      const revenue = await prisma.order.aggregate({
        where: { masterId, status: "COMPLETED", createdAt: { gte: start, lt: end } },
        _sum: { finalPrice: true },
      })
      months.push({
        month: start.toLocaleString("az-AZ", { month: "short" }),
        orders: count,
        revenue: revenue._sum.finalPrice || 0,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        monthlyData: months,
        rating: user.master.rating,
        reviewCount: user.master.reviewCount,
        completedJobs: user.master.completedJobs,
      },
    })
  } catch (error) {
    console.error("Master analytics error:", error)
    return NextResponse.json({ success: false, error: "Analitika yüklənə bilmədi" }, { status: 500 })
  }
}

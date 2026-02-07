import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const categoryId = searchParams.get("categoryId")
    const period = searchParams.get("period") || "all" // all, month, week

    const where: any = { isActive: true }

    if (categoryId) {
      where.categories = { some: { categoryId } }
    }

    const masters = await prisma.master.findMany({
      where,
      include: {
        categories: { include: { category: true } },
      },
      orderBy: [
        { rating: "desc" },
        { completedJobs: "desc" },
        { reviewCount: "desc" },
      ],
      take: limit,
    })

    const leaderboard = masters.map((m, i) => ({
      rank: i + 1,
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      avatar: m.avatar,
      rating: m.rating,
      reviewCount: m.reviewCount,
      completedJobs: m.completedJobs,
      experience: m.experience,
      isVerified: m.isVerified,
      isPremium: m.isPremium,
      district: m.district,
      categories: m.categories.map((c) => c.category.name),
    }))

    return NextResponse.json({ success: true, data: leaderboard })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Liderlik cədvəli yüklənə bilmədi" }, { status: 500 })
  }
}

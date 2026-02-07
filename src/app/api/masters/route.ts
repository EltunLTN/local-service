import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/masters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const district = searchParams.get("district")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "rating"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")

    const where: any = { isActive: true }
    if (category) {
      where.categories = { some: { category: { slug: category } } }
    }
    if (district) where.district = district
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { bio: { contains: search } },
      ]
    }

    const orderBy: any = sort === "price" ? { hourlyRate: "asc" } :
                         sort === "experience" ? { experience: "desc" } :
                         sort === "reviews" ? { reviewCount: "desc" } :
                         { rating: "desc" }

    const [masters, total] = await Promise.all([
      prisma.master.findMany({
        where,
        include: {
          user: { select: { email: true } },
          categories: { include: { category: true } },
          _count: { select: { reviews: true, orders: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.master.count({ where }),
    ])

    const formatted = masters.map((m) => ({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      avatar: m.avatar,
      bio: m.bio,
      district: m.district,
      rating: m.rating,
      reviewCount: m.reviewCount,
      completedJobs: m.completedJobs,
      experience: m.experience,
      hourlyRate: m.hourlyRate,
      isVerified: m.isVerified,
      isPremium: m.isPremium,
      responseTime: m.responseTime,
      categories: m.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      })),
    }))

    return NextResponse.json({ success: true, data: formatted, total, page, limit })
  } catch (error) {
    console.error("Masters error:", error)
    return NextResponse.json({ success: false, error: "Ustalar yüklənə bilmədi" }, { status: 500 })
  }
}

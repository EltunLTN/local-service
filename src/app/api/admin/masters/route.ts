import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/masters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { phone: { contains: search } },
      ]
    }
    if (status === "verified") where.isVerified = true
    if (status === "unverified") where.isVerified = false
    if (status === "inactive") where.isActive = false

    const [masters, total] = await Promise.all([
      prisma.master.findMany({
        where,
        include: {
          user: { select: { email: true, createdAt: true } },
          categories: { include: { category: true } },
          _count: { select: { orders: true, reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.master.count({ where }),
    ])

    const formatted = masters.map((m) => ({
      id: m.id,
      userId: m.userId,
      name: `${m.firstName} ${m.lastName}`,
      email: m.user.email,
      phone: m.phone,
      avatar: m.avatar,
      district: m.district || "",
      bio: m.bio || "",
      rating: m.rating,
      reviewCount: m.reviewCount,
      completedJobs: m.completedJobs,
      experience: m.experience,
      hourlyRate: m.hourlyRate,
      responseRate: m.responseRate,
      responseTime: m.responseTime,
      isVerified: m.isVerified,
      isActive: m.isActive,
      isPremium: m.isPremium,
      isInsured: m.isInsured || false,
      status: !m.isActive ? "suspended" : m.isVerified ? "active" : "pending",
      category: m.categories[0]?.category?.name || "",
      categories: m.categories.map((c) => c.category.name),
      orderCount: m._count.orders,
      earnings: 0,
      createdAt: m.createdAt,
    }))

    // Gather unique category names
    const allCategories = Array.from(new Set(formatted.flatMap((m) => m.categories)))

    // Compute stats
    const statsData = {
      total,
      active: formatted.filter((m) => m.status === "active").length,
      pending: formatted.filter((m) => m.status === "pending").length,
      verified: formatted.filter((m) => m.isVerified).length,
      premium: formatted.filter((m) => m.isPremium).length,
      insured: formatted.filter((m) => m.isInsured).length,
    }

    return NextResponse.json({
      success: true,
      data: {
        masters: formatted,
        categories: allCategories,
        stats: statsData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Admin masters error:", error)
    return NextResponse.json({ success: false, error: "Ustalar yüklənə bilmədi" }, { status: 500 })
  }
}

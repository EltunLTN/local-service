import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/masters/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const master = await prisma.master.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { email: true, createdAt: true } },
        categories: { include: { category: true } },
        services: { where: { isActive: true } },
        portfolioItems: { orderBy: { createdAt: "desc" }, take: 20 },
        reviews: {
          where: { isApproved: true, isHidden: false },
          include: {
            customer: { select: { firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: { select: { reviews: true, orders: true, favoritedBy: true } },
      },
    })

    if (!master) {
      return NextResponse.json({ success: false, error: "Usta tapılmadı" }, { status: 404 })
    }

    // Format master for the usta/[id] page expectations
    const formattedMaster = {
      id: master.id,
      name: `${master.firstName} ${master.lastName}`,
      avatar: master.avatar,
      coverImage: master.coverImage,
      bio: master.bio || "",
      phone: master.phone,
      email: master.user.email,
      location: master.district || "Bakı",
      district: master.district || "Bakı",
      distance: 0,
      experience: master.experience,
      hourlyRate: master.hourlyRate,
      rating: master.rating,
      reviewCount: master.reviewCount,
      completedJobs: master.completedJobs,
      responseRate: master.responseRate,
      responseTime: master.responseTime,
      isVerified: master.isVerified,
      isInsured: master.isInsured,
      isPremium: master.isPremium,
      isOnline: master.isActive,
      isActive: master.isActive,
      memberSince: master.createdAt.toISOString(),
      categoryName: master.categories[0]?.category?.name || "",
      category: master.categories[0]?.category?.slug || "",
      categories: master.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      })),
      services: master.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      })),
      languages: master.languages || ["az"],
      workingHours: {
        weekdays: `${master.workingHoursStart} - ${master.workingHoursEnd}`,
        weekends: (master.workingDays || []).includes("saturday") || (master.workingDays || []).includes("sunday")
          ? `${master.workingHoursStart} - ${master.workingHoursEnd}`
          : "İstirahət",
      },
      availability: master.isActive ? "Mövcuddur" : "Mövcud deyil",
      stats: {
        repeatRate: Math.round(master.completedJobs > 0 ? Math.min(master.completedJobs * 2, 85) : 0),
        onTimeRate: Math.round(master.responseRate),
        satisfactionRate: Math.round(master.rating > 0 ? master.rating * 20 : 0),
      },
      favoriteCount: master._count.favoritedBy,
    }

    // Format portfolio
    const formattedPortfolio = master.portfolioItems.map((p) => ({
      id: p.id,
      type: p.type.toLowerCase(),
      url: p.url,
      thumbnail: p.thumbnail || p.url,
      title: p.title,
      description: p.description,
      beforeImage: p.beforeImage,
      afterImage: p.afterImage,
      images: p.images,
      category: p.category,
    }))

    // Format reviews
    const formattedReviews = master.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      content: r.comment || "",
      date: r.createdAt.toISOString(),
      photos: r.photos || [],
      helpful: r.helpfulCount,
      service: "",
      author: {
        name: `${r.customer.firstName} ${r.customer.lastName}`,
        avatar: r.customer.avatar,
      },
      reply: r.reply
        ? { content: r.reply, date: r.repliedAt?.toISOString() || r.createdAt.toISOString() }
        : null,
    }))

    return NextResponse.json({
      success: true,
      data: {
        master: formattedMaster,
        portfolio: formattedPortfolio,
        reviews: formattedReviews,
      },
    })
  } catch (error) {
    console.error("Master detail error:", error)
    return NextResponse.json({ success: false, error: "Usta yüklənə bilmədi" }, { status: 500 })
  }
}

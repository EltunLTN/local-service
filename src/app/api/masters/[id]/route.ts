import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/masters/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const master = await prisma.master.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { email: true } },
        categories: { include: { category: true } },
        services: { where: { isActive: true } },
        portfolioItems: { orderBy: { createdAt: "desc" }, take: 12 },
        reviews: {
          include: { customer: true, order: { select: { title: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    if (!master) {
      return NextResponse.json({ success: false, error: "Usta tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: master.id,
        name: `${master.firstName} ${master.lastName}`,
        firstName: master.firstName,
        lastName: master.lastName,
        avatar: master.avatar,
        coverImage: master.coverImage,
        bio: master.bio,
        phone: master.phone,
        district: master.district,
        address: master.address,
        rating: master.rating,
        reviewCount: master.reviewCount,
        completedJobs: master.completedJobs,
        experience: master.experience,
        hourlyRate: master.hourlyRate,
        isVerified: master.isVerified,
        isPremium: master.isPremium,
        isInsured: master.isInsured,
        responseTime: master.responseTime,
        responseRate: master.responseRate,
        workingDays: master.workingDays,
        workingHoursStart: master.workingHoursStart,
        workingHoursEnd: master.workingHoursEnd,
        languages: master.languages,
        categories: master.categories.map((c) => ({
          id: c.category.id,
          name: c.category.name,
          slug: c.category.slug,
        })),
        services: master.services,
        portfolio: master.portfolioItems.map((p) => ({
          ...p,
        })),
        reviews: master.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          reply: r.reply,
          repliedAt: r.repliedAt,
          photos: r.photos,
          createdAt: r.createdAt,
          customer: r.customer ? {
            name: `${r.customer.firstName} ${r.customer.lastName}`,
            avatar: r.customer.avatar,
          } : null,
          orderTitle: r.order?.title,
        })),
      },
    })
  } catch (error) {
    console.error("Master detail error:", error)
    return NextResponse.json({ success: false, error: "Usta yüklənə bilmədi" }, { status: 500 })
  }
}

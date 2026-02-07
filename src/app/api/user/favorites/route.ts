import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/user/favorites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true },
    })

    if (!user?.customer) {
      return NextResponse.json({ success: true, data: [] })
    }

    const favorites = await prisma.favorite.findMany({
      where: { customerId: user.customer.id },
      include: {
        master: {
          include: { categories: { include: { category: true } } },
        },
      },
    })

    const formatted = favorites.map((f) => ({
      id: f.id,
      master: {
        id: f.master.id,
        name: `${f.master.firstName} ${f.master.lastName}`,
        avatar: f.master.avatar,
        rating: f.master.rating,
        reviewCount: f.master.reviewCount,
        completedJobs: f.master.completedJobs,
        categories: f.master.categories.map((c) => c.category.name),
        isVerified: f.master.isVerified,
      },
      createdAt: f.createdAt,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error("Favorites error:", error)
    return NextResponse.json({ success: false, error: "Favoritlər yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/user/favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true },
    })

    if (!user?.customer) {
      return NextResponse.json({ success: false, error: "Müştəri profili tapılmadı" }, { status: 400 })
    }

    const { masterId } = await request.json()

    const favorite = await prisma.favorite.create({
      data: { customerId: user.customer.id, masterId },
    })

    return NextResponse.json({ success: true, data: favorite })
  } catch (error) {
    console.error("Add favorite error:", error)
    return NextResponse.json({ success: false, error: "Favorit əlavə edilə bilmədi" }, { status: 500 })
  }
}

// DELETE /api/user/favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true },
    })

    if (!user?.customer) {
      return NextResponse.json({ success: false, error: "Müştəri profili tapılmadı" }, { status: 400 })
    }

    const { masterId } = await request.json()

    await prisma.favorite.deleteMany({
      where: { customerId: user.customer.id, masterId },
    })

    return NextResponse.json({ success: true, message: "Favoritdən silindi" })
  } catch (error) {
    console.error("Remove favorite error:", error)
    return NextResponse.json({ success: false, error: "Favorit silinə bilmədi" }, { status: 500 })
  }
}

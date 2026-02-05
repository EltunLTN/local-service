import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/user/favorites - Get user favorites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
      include: {
        favorites: {
          include: {
            master: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
                categories: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    // Format masters from favorites
    const favorites = customer.favorites.map((fav) => ({
      id: fav.master.id,
      name: `${fav.master.firstName} ${fav.master.lastName}`,
      avatar: fav.master.avatar,
      rating: fav.master.rating,
      reviewCount: fav.master.reviewCount,
      completedJobs: fav.master.completedJobs,
      hourlyRate: fav.master.hourlyRate,
      isVerified: fav.master.isVerified,
      isInsured: fav.master.isInsured,
      categories: fav.master.categories.map((c) => c.category),
    }))

    return NextResponse.json({
      success: true,
      data: favorites,
    })
  } catch (error) {
    console.error("Get favorites error:", error)
    return NextResponse.json(
      { success: false, message: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

// POST /api/user/favorites - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const { masterId } = await request.json()

    if (!masterId) {
      return NextResponse.json(
        { success: false, message: "Usta ID tələb olunur" },
        { status: 400 }
      )
    }

    // Get or create customer
    let customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: session.user.id,
          firstName: session.user.name?.split(" ")[0] || "",
          lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        },
      })
    }

    // Check if master exists
    const master = await prisma.master.findUnique({
      where: { id: masterId },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta tapılmadı" },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        customerId_masterId: {
          customerId: customer.id,
          masterId: masterId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json({
        success: true,
        message: "Artıq sevimlilərə əlavə edilib",
      })
    }

    // Add to favorites
    await prisma.favorite.create({
      data: {
        customerId: customer.id,
        masterId: masterId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Sevimlilərə əlavə edildi",
    })
  } catch (error) {
    console.error("Add favorite error:", error)
    return NextResponse.json(
      { success: false, message: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

// DELETE /api/user/favorites - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const { masterId } = await request.json()

    if (!masterId) {
      return NextResponse.json(
        { success: false, message: "Usta ID tələb olunur" },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Müştəri tapılmadı" },
        { status: 404 }
      )
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: {
        customerId_masterId: {
          customerId: customer.id,
          masterId: masterId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Sevimlilərdən silindi",
    })
  } catch (error) {
    console.error("Remove favorite error:", error)
    return NextResponse.json(
      { success: false, message: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

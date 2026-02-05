import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { UserRole } from "@prisma/client"

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        customer: true,
        master: {
          include: {
            services: true,
            portfolioItems: true,
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "İstifadəçi tapılmadı" },
        { status: 404 }
      )
    }

    // Remove sensitive data
    const { password, ...safeUser } = user

    return NextResponse.json({
      success: true,
      data: safeUser,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { success: false, message: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, phone, bio, avatar } = body

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone: phone || undefined,
      },
    })

    // Update customer profile if exists
    if (updatedUser.role === UserRole.CUSTOMER || updatedUser.role === UserRole.MASTER) {
      await prisma.customer.updateMany({
        where: { userId: session.user.id },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          avatar: avatar || undefined,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Profil yeniləndi",
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { success: false, message: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

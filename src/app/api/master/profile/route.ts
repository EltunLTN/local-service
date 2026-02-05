import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/profile - Get master profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        services: true,
      },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: master,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

// PUT /api/master/profile - Update master profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      bio,
      address,
      district,
      experience,
      hourlyRate,
      workingDays,
      workingHoursStart,
      workingHoursEnd,
      languages,
    } = body

    const updatedMaster = await prisma.master.update({
      where: { id: master.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(bio && { bio }),
        ...(address && { address }),
        ...(district && { district }),
        ...(experience && { experience }),
        ...(hourlyRate && { hourlyRate }),
        ...(workingDays && { workingDays }),
        ...(workingHoursStart && { workingHoursStart }),
        ...(workingHoursEnd && { workingHoursEnd }),
        ...(languages && { languages }),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Profil yeniləndi",
      profile: updatedMaster,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

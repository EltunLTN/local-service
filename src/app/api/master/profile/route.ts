import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        master: {
          include: {
            categories: { include: { category: true } },
            services: true,
          },
        },
      },
    })

    if (!user?.master) {
      return NextResponse.json({ success: false, error: "Usta profili tapılmadı" }, { status: 404 })
    }

    const m = user.master
    return NextResponse.json({
      success: true,
      data: {
        ...m,
        email: user.email,
        workingDays: JSON.parse(m.workingDays || "[]"),
        languages: JSON.parse(m.languages || "[]"),
        categories: m.categories.map((c) => ({
          id: c.category.id,
          name: c.category.name,
          slug: c.category.slug,
        })),
      },
    })
  } catch (error) {
    console.error("Master profile error:", error)
    return NextResponse.json({ success: false, error: "Profil yüklənə bilmədi" }, { status: 500 })
  }
}

// PATCH /api/master/profile
export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { firstName, lastName, bio, phone, address, district, experience,
            hourlyRate, workingDays, workingHoursStart, workingHoursEnd,
            languages, avatar, coverImage, categoryIds } = body

    const updateData: any = {}
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (bio !== undefined) updateData.bio = bio
    if (phone) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (district !== undefined) updateData.district = district
    if (experience !== undefined) updateData.experience = experience
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate
    if (workingDays) updateData.workingDays = JSON.stringify(workingDays)
    if (workingHoursStart) updateData.workingHoursStart = workingHoursStart
    if (workingHoursEnd) updateData.workingHoursEnd = workingHoursEnd
    if (languages) updateData.languages = JSON.stringify(languages)
    if (avatar !== undefined) updateData.avatar = avatar
    if (coverImage !== undefined) updateData.coverImage = coverImage

    const master = await prisma.master.update({
      where: { id: user.master.id },
      data: updateData,
    })

    // Update categories if provided
    if (categoryIds && Array.isArray(categoryIds)) {
      await prisma.masterCategory.deleteMany({ where: { masterId: master.id } })
      for (const catId of categoryIds) {
        await prisma.masterCategory.create({
          data: { masterId: master.id, categoryId: catId },
        })
      }
    }

    return NextResponse.json({ success: true, message: "Profil yeniləndi", data: master })
  } catch (error) {
    console.error("Master profile update error:", error)
    return NextResponse.json({ success: false, error: "Profil yenilənə bilmədi" }, { status: 500 })
  }
}

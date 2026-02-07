import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/auth/upgrade-to-master - Upgrade existing customer to master
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const body = await request.json()
    const { email, firstName, lastName, phone, bio, experience, categories, districts } = body

    // Find user by email (from session or from body)
    const userEmail = session?.user?.email || email
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "İstifadəçi tapılmadı" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { master: true, customer: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "İstifadəçi tapılmadı" },
        { status: 404 }
      )
    }

    // If already a master, return error
    if (user.master) {
      return NextResponse.json(
        { success: false, error: "Bu hesab artıq usta kimi qeydiyyatdan keçib" },
        { status: 400 }
      )
    }

    // Update user role to MASTER
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "MASTER" },
    })

    // Create master profile
    await prisma.master.create({
      data: {
        userId: user.id,
        firstName: firstName || user.customer?.firstName || "",
        lastName: lastName || user.customer?.lastName || "",
        phone: phone || user.phone || "",
        bio: bio || null,
        experience: experience ? parseInt(experience) : 0,
        district: districts && districts.length > 0 ? districts.join(", ") : null,
      },
    })

    // If categories provided, link them
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const dbCategories = await prisma.category.findMany({
        where: { slug: { in: categories } },
      })

      for (const cat of dbCategories) {
        await prisma.masterCategory.create({
          data: {
            masterId: (await prisma.master.findUnique({ where: { userId: user.id } }))!.id,
            categoryId: cat.id,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Təbriklər! Artıq usta olaraq qeydiyyatdan keçdiniz. Yenidən daxil olun.",
    })
  } catch (error) {
    console.error("Upgrade to master error:", error)
    return NextResponse.json(
      { success: false, error: "Xəta baş verdi. Yenidən cəhd edin." },
      { status: 500 }
    )
  }
}

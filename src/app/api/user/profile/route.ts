import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/user/profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true, master: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    const profile = user.customer || user.master
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: profile ? `${(profile as any).firstName} ${(profile as any).lastName}` : user.email,
        firstName: (profile as any)?.firstName || "",
        lastName: (profile as any)?.lastName || "",
        avatar: (profile as any)?.avatar || null,
        address: (profile as any)?.address || null,
        district: (profile as any)?.district || null,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ success: false, error: "Profil yüklənə bilmədi" }, { status: 500 })
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, address, district, avatar } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true, master: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    if (phone) {
      await prisma.user.update({ where: { id: user.id }, data: { phone } })
    }

    if (user.customer) {
      await prisma.customer.update({
        where: { id: user.customer.id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(address !== undefined && { address }),
          ...(district !== undefined && { district }),
          ...(avatar !== undefined && { avatar }),
        },
      })
    } else if (user.master) {
      await prisma.master.update({
        where: { id: user.master.id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(address !== undefined && { address }),
          ...(district !== undefined && { district }),
          ...(avatar !== undefined && { avatar }),
        },
      })
    }

    return NextResponse.json({ success: true, message: "Profil yeniləndi" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, error: "Profil yenilənə bilmədi" }, { status: 500 })
  }
}

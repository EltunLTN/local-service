import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/users/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { customer: true, master: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: user.customer
          ? `${user.customer.firstName} ${user.customer.lastName}`
          : user.master
          ? `${user.master.firstName} ${user.master.lastName}`
          : user.email,
        avatar: user.customer?.avatar || user.master?.avatar || null,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        customer: user.customer,
        master: user.master,
      },
    })
  } catch (error) {
    console.error("Admin user GET error:", error)
    return NextResponse.json({ success: false, error: "İstifadəçi yüklənə bilmədi" }, { status: 500 })
  }
}

// PATCH /api/admin/users/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { role, email, phone } = body

    const updateData: any = {}
    if (role) updateData.role = role
    if (email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, message: "İstifadəçi yeniləndi", data: user })
  } catch (error) {
    console.error("Admin user PATCH error:", error)
    return NextResponse.json({ success: false, error: "İstifadəçi yenilənə bilmədi" }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "İstifadəçi silindi" })
  } catch (error) {
    console.error("Admin user DELETE error:", error)
    return NextResponse.json({ success: false, error: "İstifadəçi silinə bilmədi" }, { status: 500 })
  }
}

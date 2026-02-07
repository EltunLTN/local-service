import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/masters/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const master = await prisma.master.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { email: true, createdAt: true } },
        categories: { include: { category: true } },
        services: true,
        reviews: { take: 5, orderBy: { createdAt: "desc" } },
      },
    })

    if (!master) {
      return NextResponse.json({ success: false, error: "Usta tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: master })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// PATCH /api/admin/masters/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const master = await prisma.master.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json({ success: true, data: master })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// DELETE /api/admin/masters/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const master = await prisma.master.findUnique({ where: { id: params.id } })
    if (master) {
      await prisma.user.delete({ where: { id: master.userId } })
    }
    return NextResponse.json({ success: true, message: "Usta silindi" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

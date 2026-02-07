import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!user) {
      return NextResponse.json({ success: true, data: [] })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    })

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bildirişlər yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/notifications - Mark as read
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, markAll } = body

    const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true, readAt: new Date() },
      })
    } else if (id) {
      await prisma.notification.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
      })
    }

    return NextResponse.json({ success: true, message: "Oxundu" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// DELETE /api/notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, deleteAll } = body

    const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    if (deleteAll) {
      await prisma.notification.deleteMany({ where: { userId: user.id } })
    } else if (id) {
      await prisma.notification.delete({ where: { id } })
    }

    return NextResponse.json({ success: true, message: "Silindi" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

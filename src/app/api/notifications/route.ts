import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: session.user.id },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json(
      { success: false, message: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

// POST /api/notifications/read - Mark notification as read
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const { notificationId, readAll } = await request.json()

    if (readAll) {
      // Mark all as read
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      })

      return NextResponse.json({
        success: true,
        message: "Bütün bildirişlər oxundu kimi işarələndi",
      })
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: "Bildiriş ID tələb olunur" },
        { status: 400 }
      )
    }

    // Mark single as read
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: { isRead: true },
    })

    return NextResponse.json({
      success: true,
      message: "Bildiriş oxundu kimi işarələndi",
    })
  } catch (error) {
    console.error("Mark notification read error:", error)
    return NextResponse.json(
      { success: false, message: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

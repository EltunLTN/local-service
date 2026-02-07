import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/availability
export async function GET(request: NextRequest) {
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
      return NextResponse.json({ success: true, data: [] })
    }

    const availability = await prisma.masterAvailability.findMany({
      where: { masterId: user.master.id },
      orderBy: { date: "asc" },
    })

    return NextResponse.json({ success: true, data: availability })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Mövcudluq yüklənə bilmədi" }, { status: 500 })
  }
}

// PUT /api/master/availability
export async function PUT(request: NextRequest) {
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
      return NextResponse.json({ success: false, error: "Usta tapılmadı" }, { status: 404 })
    }

    const body = await request.json()
    const { slots } = body

    if (Array.isArray(slots)) {
      // Delete existing and recreate
      await prisma.masterAvailability.deleteMany({ where: { masterId: user.master.id } })
      for (const slot of slots) {
        await prisma.masterAvailability.create({
          data: {
            masterId: user.master.id,
            date: new Date(slot.date),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable ?? true,
          },
        })
      }
    }

    return NextResponse.json({ success: true, message: "Mövcudluq yeniləndi" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Mövcudluq yenilənə bilmədi" }, { status: 500 })
  }
}

// POST /api/master/availability
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ success: false, error: "Usta tapılmadı" }, { status: 404 })
    }

    const body = await request.json()
    const slot = await prisma.masterAvailability.create({
      data: {
        masterId: user.master.id,
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        isAvailable: body.isAvailable ?? true,
      },
    })

    return NextResponse.json({ success: true, data: slot })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Slot əlavə edilə bilmədi" }, { status: 500 })
  }
}

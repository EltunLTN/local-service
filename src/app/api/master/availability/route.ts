import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Ustanın mövcudluq təqvimini al
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
      include: {
        availability: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    })

    if (!master) {
      return NextResponse.json(
        { error: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    // Format availability for calendar
    const availability = master.availability.map((slot) => ({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable,
    }))

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Get availability error:", error)
    return NextResponse.json(
      { error: "Server xətası baş verdi" },
      { status: 500 }
    )
  }
}

// PUT - Mövcudluğu yenilə
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { error: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { availability } = body

    if (!Array.isArray(availability)) {
      return NextResponse.json(
        { error: "Düzgün format göndərin" },
        { status: 400 }
      )
    }

    // Delete existing future availability
    await prisma.masterAvailability.deleteMany({
      where: {
        masterId: master.id,
        date: {
          gte: new Date(),
        },
      },
    })

    // Create new availability slots
    const newSlots = await Promise.all(
      availability.map((slot: any) =>
        prisma.masterAvailability.create({
          data: {
            masterId: master.id,
            date: new Date(slot.date),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable ?? true,
          },
        })
      )
    )

    return NextResponse.json({
      message: "Mövcudluq yeniləndi",
      availability: newSlots,
    })
  } catch (error) {
    console.error("Update availability error:", error)
    return NextResponse.json(
      { error: "Server xətası baş verdi" },
      { status: 500 }
    )
  }
}

// POST - Tək slot əlavə et
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { error: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { date, startTime, endTime, isAvailable = true } = body

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Tarix və vaxt tələb olunur" },
        { status: 400 }
      )
    }

    const slot = await prisma.masterAvailability.create({
      data: {
        masterId: master.id,
        date: new Date(date),
        startTime,
        endTime,
        isAvailable,
      },
    })

    return NextResponse.json({
      message: "Vaxt slotu əlavə edildi",
      slot,
    })
  } catch (error) {
    console.error("Add availability error:", error)
    return NextResponse.json(
      { error: "Server xətası baş verdi" },
      { status: 500 }
    )
  }
}

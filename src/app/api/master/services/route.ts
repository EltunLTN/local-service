import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/services
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

    const services = await prisma.masterService.findMany({
      where: { masterId: user.master.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xidmətlər yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/master/services
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
      return NextResponse.json({ success: false, error: "Usta profili tapılmadı" }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, price, duration } = body

    const service = await prisma.masterService.create({
      data: {
        masterId: user.master.id,
        name,
        description: description || null,
        price: parseFloat(price),
        duration: parseInt(duration) || 60,
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xidmət əlavə edilə bilmədi" }, { status: 500 })
  }
}

// PUT /api/master/services
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, price, duration, isActive } = body

    const service = await prisma.masterService.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xidmət yenilənə bilmədi" }, { status: 500 })
  }
}

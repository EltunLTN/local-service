import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/services - Get master services
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
      include: {
        services: true,
      },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      services: master.services,
    })
  } catch (error) {
    console.error("Get services error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

// POST /api/master/services - Add new service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, description, price, duration } = body

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: "Ad və qiymət tələb olunur" },
        { status: 400 }
      )
    }

    const service = await prisma.masterService.create({
      data: {
        masterId: master.id,
        name,
        description,
        price,
        duration: duration || 60,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Xidmət əlavə edildi",
      service,
    })
  } catch (error) {
    console.error("Add service error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

// PUT /api/master/services - Update services
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta profili tapılmadı" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { services } = body

    if (!Array.isArray(services)) {
      return NextResponse.json(
        { success: false, message: "Düzgün format göndərin" },
        { status: 400 }
      )
    }

    // Update or create services
    for (const service of services) {
      if (service.id) {
        await prisma.masterService.update({
          where: { id: service.id },
          data: {
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            isActive: service.isActive,
          },
        })
      } else {
        await prisma.masterService.create({
          data: {
            masterId: master.id,
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration || 60,
          },
        })
      }
    }

    const updatedServices = await prisma.masterService.findMany({
      where: { masterId: master.id },
    })

    return NextResponse.json({
      success: true,
      message: "Xidmətlər yeniləndi",
      services: updatedServices,
    })
  } catch (error) {
    console.error("Update services error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

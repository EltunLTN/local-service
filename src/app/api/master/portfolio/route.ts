import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/portfolio
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

    const portfolio = await prisma.portfolioItem.findMany({
      where: { masterId: user.master.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: portfolio,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Portfolio yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/master/portfolio
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
    const item = await prisma.portfolioItem.create({
      data: {
        masterId: user.master.id,
        title: body.title,
        description: body.description || null,
        url: body.url,
        thumbnail: body.thumbnail || null,
        type: body.type || "IMAGE",
        beforeImage: body.beforeImage || null,
        afterImage: body.afterImage || null,
        images: body.images || [],
        category: body.category || null,
        duration: body.duration || null,
        price: body.price || null,
      },
    })

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Portfolio əlavə edilə bilmədi" }, { status: 500 })
  }
}

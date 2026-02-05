import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/master/portfolio - Get master portfolio
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
        portfolioItems: {
          orderBy: { createdAt: "desc" },
        },
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
      portfolio: master.portfolioItems,
    })
  } catch (error) {
    console.error("Get portfolio error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

// POST /api/master/portfolio - Add portfolio item
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
    const { title, description, url, category } = body

    if (!title || !url) {
      return NextResponse.json(
        { success: false, message: "Başlıq və URL tələb olunur" },
        { status: 400 }
      )
    }

    const item = await prisma.portfolioItem.create({
      data: {
        masterId: master.id,
        title,
        description,
        url,
        category,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Portfolio elementi əlavə edildi",
      item,
    })
  } catch (error) {
    console.error("Add portfolio error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

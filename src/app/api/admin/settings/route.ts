import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const settings = await prisma.systemSetting.findMany({
      orderBy: { category: "asc" },
    })

    // Group by category
    const grouped: Record<string, any[]> = {}
    for (const s of settings) {
      if (!grouped[s.category]) grouped[s.category] = []
      grouped[s.category].push(s)
    }

    return NextResponse.json({ success: true, data: settings, grouped })
  } catch (error) {
    console.error("Admin settings error:", error)
    return NextResponse.json({ success: false, error: "Tənzimləmələr yüklənə bilmədi" }, { status: 500 })
  }
}

// PUT /api/admin/settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body

    if (Array.isArray(settings)) {
      for (const s of settings) {
        await prisma.systemSetting.upsert({
          where: { key: s.key },
          update: { value: String(s.value) },
          create: { key: s.key, value: String(s.value), type: s.type || "string", category: s.category || "general" },
        })
      }
    }

    return NextResponse.json({ success: true, message: "Tənzimləmələr yeniləndi" })
  } catch (error) {
    console.error("Admin settings PUT error:", error)
    return NextResponse.json({ success: false, error: "Tənzimləmələr yenilənə bilmədi" }, { status: 500 })
  }
}

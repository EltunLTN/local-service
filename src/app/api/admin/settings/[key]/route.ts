import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/settings/[key]
export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const setting = await prisma.systemSetting.findUnique({ where: { key: params.key } })
    if (!setting) {
      return NextResponse.json({ success: false, error: "Tənzimləmə tapılmadı" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: setting })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// PATCH /api/admin/settings/[key]
export async function PATCH(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const setting = await prisma.systemSetting.upsert({
      where: { key: params.key },
      update: { value: String(body.value) },
      create: { key: params.key, value: String(body.value), type: body.type || "string", category: body.category || "general" },
    })
    return NextResponse.json({ success: true, data: setting })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

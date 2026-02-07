import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/settings - return as flat key-value object
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const settings = await prisma.systemSetting.findMany()

    // Convert array of {key, value, type} to flat object with proper type conversion
    const flat: Record<string, any> = {}
    for (const s of settings) {
      if (s.type === "boolean") {
        flat[s.key] = s.value === "true"
      } else if (s.type === "number") {
        flat[s.key] = parseFloat(s.value)
      } else {
        flat[s.key] = s.value
      }
    }

    return NextResponse.json(flat)
  } catch (error) {
    console.error("Admin settings error:", error)
    return NextResponse.json({ success: false, error: "Tənzimləmələr yüklənə bilmədi" }, { status: 500 })
  }
}

// PUT /api/admin/settings - accept flat key-value object
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // body is a flat object like { site_name: "UstaBul", maintenance_mode: false, ... }
    const entries = Object.entries(body)

    for (const [key, value] of entries) {
      // Skip non-setting keys
      if (key === "success" || key === "error") continue

      const type = typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "string"
      
      // Determine category from key prefix
      let category = "general"
      if (key.startsWith("email_") || key.startsWith("smtp_")) category = "email"
      else if (key.startsWith("push_") || key.startsWith("sms_") || key.includes("notification")) category = "notifications"
      else if (key.startsWith("max_login") || key.startsWith("session_") || key.startsWith("two_factor") || key.startsWith("password_") || key.startsWith("ip_")) category = "security"
      else if (key.startsWith("platform_commission") || key.startsWith("minimum_order") || key.startsWith("master_payout")) category = "commission"

      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), type, category },
      })
    }

    return NextResponse.json({ success: true, message: "Tənzimləmələr yeniləndi" })
  } catch (error) {
    console.error("Admin settings PUT error:", error)
    return NextResponse.json({ success: false, error: "Tənzimləmələr yenilənə bilmədi" }, { status: 500 })
  }
}

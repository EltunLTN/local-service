import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/auth/login-history — Record a login event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    // Get IP from headers
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : 
               request.headers.get("x-real-ip") || 
               "Bilinmir"

    // Get user agent for device info
    const userAgent = request.headers.get("user-agent") || "Bilinmir"
    const device = parseDevice(userAgent)

    await prisma.loginHistory.create({
      data: {
        userId,
        ip,
        device,
        location: "Azərbaycan", // Simplified — could use IP geolocation service
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login history error:", error)
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// GET /api/auth/login-history — Get login history for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    const history = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    const formatted = history.map((h, index) => ({
      id: h.id,
      ip: h.ip || "Bilinmir",
      device: h.device || "Bilinmir",
      location: h.location || "Bilinmir",
      date: formatDate(h.createdAt),
      current: index === 0,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error("Login history fetch error:", error)
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

function parseDevice(userAgent: string): string {
  if (/mobile|android|iphone|ipad/i.test(userAgent)) {
    if (/iphone/i.test(userAgent)) return "iPhone"
    if (/ipad/i.test(userAgent)) return "iPad"
    if (/android/i.test(userAgent)) return "Android"
    return "Mobil cihaz"
  }
  if (/windows/i.test(userAgent)) return "Windows PC"
  if (/macintosh|mac os/i.test(userAgent)) return "Mac"
  if (/linux/i.test(userAgent)) return "Linux PC"
  return "Bilinmir"
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

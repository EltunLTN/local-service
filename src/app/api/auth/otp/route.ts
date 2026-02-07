import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateOTP, sendOTPEmail, verifyOTP } from "@/lib/email"

// POST /api/auth/otp - Send or verify OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action, code } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email tələb olunur" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (action === "send") {
      // Generate and send OTP
      const otpCode = generateOTP()
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      if (user) {
        // Update existing user's OTP
        await prisma.user.update({
          where: { email },
          data: { otpCode, otpExpires },
        })
      }

      const result = await sendOTPEmail(email, otpCode, user?.name || undefined)

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: result.message })
    }

    if (action === "verify") {
      if (!code) {
        return NextResponse.json({ success: false, error: "Təsdiq kodu tələb olunur" }, { status: 400 })
      }

      if (!user) {
        return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 })
      }

      const verification = verifyOTP(user.otpCode, user.otpExpires, code)

      if (!verification.valid) {
        return NextResponse.json({ success: false, error: verification.error }, { status: 400 })
      }

      // Mark email as verified, clear OTP
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: new Date(),
          otpCode: null,
          otpExpires: null,
        },
      })

      return NextResponse.json({ success: true, message: "Email təsdiqləndi" })
    }

    return NextResponse.json({ success: false, error: "Yanlış əməliyyat" }, { status: 400 })
  } catch (error) {
    console.error("OTP error:", error)
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

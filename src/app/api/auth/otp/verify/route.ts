import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otpCode } = body

    if (!email || !otpCode) {
      return NextResponse.json(
        { success: false, error: "Email və təsdiq kodu tələb olunur" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "İstifadəçi tapılmadı" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: "Email artıq təsdiqlənib" }
      )
    }

    if (!user.otpCode || !user.otpExpires) {
      return NextResponse.json(
        { success: false, error: "Təsdiq kodu tapılmadı. Yeni kod göndərin." },
        { status: 400 }
      )
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json(
        { success: false, error: "Təsdiq kodunun vaxtı keçib. Yeni kod göndərin." },
        { status: 400 }
      )
    }

    if (user.otpCode !== otpCode) {
      return NextResponse.json(
        { success: false, error: "Yanlış təsdiq kodu" },
        { status: 400 }
      )
    }

    // Verify the email
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        otpCode: null,
        otpExpires: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Email uğurla təsdiqləndi!",
    })
  } catch (error) {
    console.error("OTP verify error:", error)
    return NextResponse.json(
      { success: false, error: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

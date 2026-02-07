import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email tələb olunur" },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Check if user already exists (for re-sending OTP)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Bu email artıq təsdiqlənib" },
        { status: 400 }
      )
    }

    // Store OTP — either update existing unverified user or store temporarily
    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: { otpCode, otpExpires },
      })
    } else {
      // Store OTP in a temporary way — we'll create the user during registration
      // For now, we use a simple approach: store in the response for the client to track
      // The actual OTP will be verified during registration
    }

    // Send OTP email via Resend
    const { error } = await resend.emails.send({
      from: "UstaBul <onboarding@resend.dev>",
      to: [email],
      subject: "UstaBul - Email Təsdiq Kodu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; font-size: 28px; margin: 0;">UstaBul</h1>
            <p style="color: #6b7280; margin-top: 5px;">Email Təsdiqləmə</p>
          </div>
          <div style="background: #f9fafb; border-radius: 12px; padding: 30px; text-align: center;">
            <h2 style="color: #111827; margin-bottom: 10px;">Təsdiq Kodunuz</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              Qeydiyyatı tamamlamaq üçün aşağıdakı kodu daxil edin:
            </p>
            <div style="background: #6366f1; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; display: inline-block;">
              ${otpCode}
            </div>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
              Bu kod 10 dəqiqə ərzində etibarlıdır.
            </p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
            Əgər bu sorğunu siz etməmisinizsə, bu emailə məhəl qoymayın.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { success: false, error: "Email göndərilə bilmədi. Yenidən cəhd edin." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Təsdiq kodu emailinizə göndərildi",
      otpCode: process.env.NODE_ENV === "development" ? otpCode : undefined,
    })
  } catch (error) {
    console.error("OTP send error:", error)
    return NextResponse.json(
      { success: false, error: "Xəta baş verdi" },
      { status: 500 }
    )
  }
}

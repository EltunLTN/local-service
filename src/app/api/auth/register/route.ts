import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import prisma from "@/lib/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, role } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "Bütün sahələri doldurun" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Düzgün email daxil edin" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Şifrə minimum 6 simvol olmalıdır" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Bu email və ya telefon artıq qeydiyyatdan keçib" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user (unverified)
    const user = await prisma.user.create({
      data: {
        email,
        phone: phone || null,
        password: hashedPassword,
        role: role === "MASTER" ? "MASTER" : "CUSTOMER",
        otpCode,
        otpExpires,
      },
    })

    // Create profile based on role
    if (role === "MASTER") {
      await prisma.master.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone: phone || "",
        },
      })
    } else {
      await prisma.customer.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      })
    }

    // Send OTP email via Resend
    try {
      await resend.emails.send({
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
              <h2 style="color: #111827; margin-bottom: 10px;">Xoş gəlmisiniz, ${firstName}!</h2>
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
    } catch (emailError) {
      console.error("Email send error:", emailError)
      // Don't fail registration if email fails — user can request resend
    }

    return NextResponse.json({
      success: true,
      message: "Qeydiyyat uğurla tamamlandı! Emailinizə göndərilən kodu daxil edin.",
      requiresOtp: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Xəta baş verdi. Yenidən cəhd edin." },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

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

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone: phone || null,
        password: hashedPassword,
        role: role === "MASTER" ? "MASTER" : "CUSTOMER",
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

    return NextResponse.json({
      success: true,
      message: "Qeydiyyat uğurla tamamlandı",
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

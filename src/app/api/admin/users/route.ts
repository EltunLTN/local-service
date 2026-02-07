import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (role && role !== "all") where.role = role.toUpperCase()
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { customer: { firstName: { contains: search } } },
        { customer: { lastName: { contains: search } } },
        { master: { firstName: { contains: search } } },
        { master: { lastName: { contains: search } } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          customer: true,
          master: true,
          _count: { select: { notifications: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      phone: u.phone,
      role: u.role,
      name: u.customer
        ? `${u.customer.firstName} ${u.customer.lastName}`
        : u.master
        ? `${u.master.firstName} ${u.master.lastName}`
        : u.email,
      avatar: u.customer?.avatar || u.master?.avatar || null,
      status: "active",
      createdAt: u.createdAt,
      emailVerified: u.emailVerified,
    }))

    return NextResponse.json({ success: true, data: formatted, total, page, limit })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ success: false, error: "İstifadəçilər yüklənə bilmədi" }, { status: 500 })
  }
}

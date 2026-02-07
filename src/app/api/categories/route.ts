import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        _count: { select: { masters: true } },
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({
      success: true,
      data: categories.map((c) => ({
        ...c,
        masterCount: c._count.masters,
      })),
    })
  } catch (error) {
    console.error("Categories error:", error)
    return NextResponse.json(
      { success: false, error: "Kateqoriyalar yüklənə bilmədi" },
      { status: 500 }
    )
  }
}

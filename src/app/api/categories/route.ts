import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeSubcategories = searchParams.get("includeSubcategories") === "true"
    const includeCount = searchParams.get("includeCount") === "true"

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: includeSubcategories 
          ? {
              where: { isActive: true },
              orderBy: { order: "asc" },
            }
          : false,
        _count: includeCount 
          ? {
              select: {
                masters: true,
                orders: true,
              },
            }
          : false,
      },
      orderBy: { order: "asc" },
    })

    const transformedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      subcategories: includeSubcategories
        ? cat.subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            basePrice: sub.basePrice,
          }))
        : undefined,
      masterCount: includeCount ? cat._count?.masters : undefined,
      orderCount: includeCount ? cat._count?.orders : undefined,
    }))

    return NextResponse.json({ success: true, data: transformedCategories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

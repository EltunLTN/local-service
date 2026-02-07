import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/calculator - Calculate estimated price
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, subcategoryId, area, urgency, options } = body

    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Kateqoriya seçilməyib" }, { status: 400 })
    }

    // Get services in category for price estimation
    const services = await prisma.masterService.findMany({
      where: {
        master: {
          categories: { some: { categoryId } },
          isActive: true,
        },
      },
      select: { price: true },
    })

    let minPrice = 0
    let maxPrice = 0
    let avgPrice = 0

    if (services.length > 0) {
      const prices = services.map((s) => s.price || 0).filter((p) => p > 0)
      if (prices.length > 0) {
        minPrice = Math.min(...prices)
        maxPrice = Math.max(...prices)
        avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
      }
    }

    // Apply multipliers
    let multiplier = 1
    if (urgency === "urgent") multiplier *= 1.5
    else if (urgency === "express") multiplier *= 2
    if (area && area > 50) multiplier *= 1 + (area - 50) * 0.005

    const result = {
      estimated: Math.round(avgPrice * multiplier),
      min: Math.round(minPrice * multiplier),
      max: Math.round(maxPrice * multiplier),
      mastersAvailable: services.length,
      currency: "AZN",
      note: urgency === "urgent" ? "Təcili sifariş əlavə haqqı tətbiq edilir" : null,
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Qiymət hesablana bilmədi" }, { status: 500 })
  }
}

// GET /api/calculator - Get options for calculator
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { subcategories: { where: { isActive: true } } },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
        })),
        urgencyOptions: [
          { value: "normal", label: "Normal (1-3 gün)", multiplier: 1 },
          { value: "urgent", label: "Təcili (24 saat)", multiplier: 1.5 },
          { value: "express", label: "Express (3 saat)", multiplier: 2 },
        ],
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Məlumatlar yüklənə bilmədi" }, { status: 500 })
  }
}

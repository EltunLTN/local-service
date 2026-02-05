import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/masters - Get all masters with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const district = searchParams.get("district")
    const minRating = parseFloat(searchParams.get("minRating") || "0")
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000")
    const minPrice = parseFloat(searchParams.get("minPrice") || "0")
    const isVerified = searchParams.get("isVerified") === "true"
    const isInsured = searchParams.get("isInsured") === "true"
    const isAvailableToday = searchParams.get("isAvailableToday") === "true"
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "recommended"
    
    // Build where clause
    const where: any = {
      isActive: true,
      rating: { gte: minRating },
      hourlyRate: { gte: minPrice, lte: maxPrice },
    }
    
    if (category) {
      where.categories = {
        some: {
          category: { slug: category }
        }
      }
    }
    
    if (district) {
      where.district = district
    }
    
    if (isVerified) {
      where.isVerified = true
    }
    
    if (isInsured) {
      where.isInsured = true
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { 
          services: { 
            some: { 
              name: { contains: search, mode: "insensitive" } 
            } 
          } 
        },
      ]
    }
    
    // Build orderBy
    let orderBy: any = {}
    switch (sortBy) {
      case "rating":
        orderBy = { rating: "desc" }
        break
      case "price_low":
        orderBy = { hourlyRate: "asc" }
        break
      case "price_high":
        orderBy = { hourlyRate: "desc" }
        break
      case "reviews":
        orderBy = { reviewCount: "desc" }
        break
      default:
        orderBy = [
          { isPremium: "desc" },
          { rating: "desc" },
          { completedJobs: "desc" },
        ]
    }
    
    // Fetch masters
    const [masters, total] = await Promise.all([
      prisma.master.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            }
          },
          services: {
            where: { isActive: true },
            take: 5,
          },
          user: {
            select: {
              id: true,
              email: true,
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.master.count({ where }),
    ])
    
    // Transform response
    const transformedMasters = masters.map((master) => ({
      id: master.id,
      name: `${master.firstName} ${master.lastName}`,
      avatar: master.avatar,
      bio: master.bio,
      category: master.categories[0]?.category.name || "",
      categorySlug: master.categories[0]?.category.slug || "",
      rating: master.rating,
      reviewCount: master.reviewCount,
      completedJobs: master.completedJobs,
      hourlyRate: master.hourlyRate,
      isVerified: master.isVerified,
      isInsured: master.isInsured,
      isPremium: master.isPremium,
      district: master.district,
      experience: master.experience,
      responseTime: master.responseTime,
      services: master.services.map((s) => s.name),
    }))
    
    return NextResponse.json({
      success: true,
      data: transformedMasters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      }
    })
  } catch (error) {
    console.error("Error fetching masters:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const role = searchParams.get("role") || "customer"

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true, master: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const where: any = {}

    if (role === "admin" && user.role === "ADMIN") {
      // Admin sees all
    } else if (role === "master" && user.master) {
      where.masterId = user.master.id
    } else if (role === "browse") {
      where.status = "PENDING"
      where.masterId = null
    } else if (user.customer) {
      where.customerId = user.customer.id
    } else {
      return NextResponse.json({ success: true, data: [], total: 0, page, limit })
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          category: true,
          subcategory: true,
          customer: true,
          master: true,
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      title: o.title,
      description: o.description,
      status: o.status,
      category: o.category?.name || "",
      categorySlug: o.category?.slug || "",
      subcategory: o.subcategory?.name || "",
      address: o.address,
      district: o.district,
      scheduledDate: o.scheduledDate,
      scheduledTime: o.scheduledTime,
      urgency: o.urgency,
      estimatedPrice: o.estimatedPrice,
      totalPrice: o.totalPrice,
      finalPrice: o.finalPrice,
      photos: JSON.parse(o.photos || "[]"),
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      customer: o.customer ? {
        id: o.customer.id,
        name: `${o.customer.firstName} ${o.customer.lastName}`,
        avatar: o.customer.avatar,
      } : null,
      master: o.master ? {
        id: o.master.id,
        name: `${o.master.firstName} ${o.master.lastName}`,
        avatar: o.master.avatar,
        rating: o.master.rating,
        phone: o.master.phone,
      } : null,
      applicationCount: o._count.applications,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    }))

    return NextResponse.json({ success: true, data: formatted, total, page, limit })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json({ success: false, error: "Sifarişlər yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true },
    })

    if (!user?.customer) {
      return NextResponse.json({ success: false, error: "Müştəri profili tapılmadı" }, { status: 400 })
    }

    const body = await request.json()
    const {
      title, description, categoryId, subcategoryId, address, district,
      scheduledDate, scheduledTime, urgency, estimatedPrice, photos,
      paymentMethod, lat, lng,
    } = body

    if (!title || !description || !categoryId || !address || !scheduledDate || !scheduledTime) {
      return NextResponse.json({ success: false, error: "Bütün sahələri doldurun" }, { status: 400 })
    }

    let urgencyFee = 0
    if (urgency === "TODAY") urgencyFee = (estimatedPrice || 0) * 0.15
    if (urgency === "URGENT") urgencyFee = (estimatedPrice || 0) * 0.3

    const order = await prisma.order.create({
      data: {
        customerId: user.customer.id,
        categoryId,
        subcategoryId: subcategoryId || null,
        title,
        description,
        address,
        district: district || null,
        lat: lat || null,
        lng: lng || null,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        urgency: urgency || "PLANNED",
        estimatedPrice: estimatedPrice || null,
        totalPrice: estimatedPrice ? estimatedPrice + urgencyFee : null,
        urgencyFee,
        paymentMethod: paymentMethod || "CASH",
        photos: JSON.stringify(photos || []),
      },
      include: { category: true, subcategory: true },
    })

    return NextResponse.json({
      success: true,
      message: "Sifariş uğurla yaradıldı!",
      data: { ...order, photos: JSON.parse(order.photos || "[]") },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ success: false, error: "Sifariş yaradıla bilmədi" }, { status: 500 })
  }
}

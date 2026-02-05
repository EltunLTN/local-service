import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/orders - Get orders for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const role = searchParams.get("role") || "customer" // customer or master

    // Get user's customer or master profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        customer: true,
        master: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Build where clause based on role
    const where: any = {}
    
    if (role === "master" && user.master) {
      where.masterId = user.master.id
    } else if (user.customer) {
      where.customerId = user.customer.id
    } else {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      )
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    // Fetch orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          master: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              rating: true,
              phone: true,
            },
          },
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          review: {
            select: {
              rating: true,
              comment: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    // Transform response
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      title: order.title,
      description: order.description,
      status: order.status,
      address: order.address,
      district: order.district,
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime,
      urgency: order.urgency,
      estimatedPrice: order.estimatedPrice,
      finalPrice: order.finalPrice,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      photos: order.photos,
      createdAt: order.createdAt,
      acceptedAt: order.acceptedAt,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,
      cancelReason: order.cancelReason,
      category: order.category,
      customer: order.customer
        ? {
            id: order.customer.id,
            name: `${order.customer.firstName} ${order.customer.lastName}`,
            avatar: order.customer.avatar,
          }
        : null,
      master: order.master
        ? {
            id: order.master.id,
            name: `${order.master.firstName} ${order.master.lastName}`,
            avatar: order.master.avatar,
            rating: order.master.rating,
            phone: order.master.phone,
          }
        : null,
      review: order.review,
    }))

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      masterId,
      categoryId,
      subcategoryId,
      serviceId,
      title,
      description,
      address,
      district,
      lat,
      lng,
      scheduledDate,
      scheduledTime,
      urgency,
      paymentMethod,
      photos,
      customerName,
      customerPhone,
    } = body

    // Validate required fields
    if (!categoryId || !title || !description || !address || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get or create customer profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    let customerId = user.customer?.id

    // Create customer profile if doesn't exist
    if (!customerId) {
      const nameParts = customerName?.split(" ") || [session.user.name || "User"]
      const customer = await prisma.customer.create({
        data: {
          userId: user.id,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(" ") || "",
          address,
          district,
        },
      })
      customerId = customer.id
    }

    // Calculate urgency fee
    let urgencyFee = 0
    if (urgency === "TODAY") urgencyFee = 10
    if (urgency === "URGENT") urgencyFee = 25

    // Get estimated price from service or subcategory
    let estimatedPrice = null
    if (serviceId) {
      const service = await prisma.masterService.findUnique({
        where: { id: serviceId },
      })
      estimatedPrice = service?.price || null
    } else if (subcategoryId) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: subcategoryId },
      })
      estimatedPrice = subcategory?.basePrice || null
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId,
        masterId: masterId || null,
        categoryId,
        subcategoryId: subcategoryId || null,
        serviceId: serviceId || null,
        title,
        description,
        address,
        district: district || null,
        lat: lat || null,
        lng: lng || null,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        urgency: urgency || "PLANNED",
        estimatedPrice,
        urgencyFee,
        paymentMethod: paymentMethod || "CASH",
        photos: photos || [],
      },
      include: {
        category: true,
        master: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Create notification for master if assigned
    if (masterId) {
      const master = await prisma.master.findUnique({
        where: { id: masterId },
        include: { user: true },
      })

      if (master) {
        await prisma.notification.create({
          data: {
            userId: master.userId,
            type: "ORDER_NEW",
            title: "Yeni sifariş",
            message: `${title} üçün yeni sifariş aldınız`,
            data: { orderId: order.id },
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

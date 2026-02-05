import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            user: {
              select: { phone: true },
            },
          },
        },
        master: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            rating: true,
            isVerified: true,
          },
        },
        category: true,
        subcategory: true,
        service: true,
        review: true,
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    // Verify user has access to this order
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true, master: true },
    })

    const isCustomer = order.customerId === user?.customer?.id
    const isMaster = order.masterId === user?.master?.id
    const isAdmin = user?.role === "ADMIN"

    if (!isCustomer && !isMaster && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { action, cancelReason, finalPrice } = body

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: { include: { user: true } },
        master: { include: { user: true } },
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true, master: true },
    })

    const isCustomer = order.customerId === user?.customer?.id
    const isMaster = order.masterId === user?.master?.id

    // Handle different actions
    let updateData: any = {}
    let notificationData: any = null

    switch (action) {
      case "accept":
        if (!isMaster) {
          return NextResponse.json(
            { success: false, error: "Only master can accept orders" },
            { status: 403 }
          )
        }
        updateData = {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        }
        notificationData = {
          userId: order.customer.user.id,
          type: "ORDER_ACCEPTED",
          title: "Sifariş qəbul edildi",
          message: `${order.master?.firstName} sifarişinizi qəbul etdi`,
        }
        break

      case "start":
        if (!isMaster) {
          return NextResponse.json(
            { success: false, error: "Only master can start orders" },
            { status: 403 }
          )
        }
        updateData = {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        }
        notificationData = {
          userId: order.customer.user.id,
          type: "ORDER_STARTED",
          title: "İş başladı",
          message: `${order.master?.firstName} işə başladı`,
        }
        break

      case "complete":
        if (!isMaster) {
          return NextResponse.json(
            { success: false, error: "Only master can complete orders" },
            { status: 403 }
          )
        }
        updateData = {
          status: "COMPLETED",
          completedAt: new Date(),
          finalPrice: finalPrice || order.estimatedPrice,
        }
        notificationData = {
          userId: order.customer.user.id,
          type: "ORDER_COMPLETED",
          title: "İş tamamlandı",
          message: "Sifarişiniz uğurla tamamlandı. Xahiş edirik rəy bildirin.",
        }
        
        // Update master stats
        if (order.masterId) {
          await prisma.master.update({
            where: { id: order.masterId },
            data: {
              completedJobs: { increment: 1 },
            },
          })
        }
        break

      case "cancel":
        if (!isCustomer && !isMaster) {
          return NextResponse.json(
            { success: false, error: "Only order participants can cancel" },
            { status: 403 }
          )
        }
        updateData = {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelReason: cancelReason || "İstifadəçi tərəfindən ləğv edildi",
        }
        
        // Notify the other party
        const notifyUserId = isCustomer 
          ? order.master?.user?.id 
          : order.customer.user.id
        
        if (notifyUserId) {
          notificationData = {
            userId: notifyUserId,
            type: "ORDER_CANCELLED",
            title: "Sifariş ləğv edildi",
            message: cancelReason || "Sifariş ləğv edildi",
          }
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    // Create notification
    if (notificationData) {
      await prisma.notification.create({
        data: {
          ...notificationData,
          data: { orderId: order.id },
        },
      })
    }

    return NextResponse.json({ success: true, data: updatedOrder })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

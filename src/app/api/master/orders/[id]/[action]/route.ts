import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { OrderStatus, NotificationType } from "@prisma/client"

interface RouteParams {
  params: Promise<{ id: string; action: string }>
}

// POST /api/master/orders/[id]/[action] - Order actions
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const { id, action } = await params

    const master = await prisma.master.findFirst({
      where: { userId: (session.user as any).id },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, message: "Usta profili tapılmadı" },
        { status: 403 }
      )
    }

    const order = await prisma.order.findFirst({
      where: { id, masterId: master.id },
      include: { customer: true },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Sifariş tapılmadı" },
        { status: 404 }
      )
    }

    let newStatus: OrderStatus | null = null
    let notificationType: NotificationType | null = null
    let notificationTitle = ""
    let notificationMessage = ""

    switch (action) {
      case "accept":
        if (order.status !== OrderStatus.PENDING) {
          return NextResponse.json(
            { success: false, message: "Bu sifarişi qəbul etmək mümkün deyil" },
            { status: 400 }
          )
        }
        newStatus = OrderStatus.ACCEPTED
        notificationType = NotificationType.ORDER_ACCEPTED
        notificationTitle = "Sifariş qəbul edildi"
        notificationMessage = `${master.firstName} ${master.lastName} sifarişinizi qəbul etdi`
        break

      case "reject":
        if (order.status !== OrderStatus.PENDING) {
          return NextResponse.json(
            { success: false, message: "Bu sifarişi rədd etmək mümkün deyil" },
            { status: 400 }
          )
        }
        newStatus = OrderStatus.CANCELLED
        notificationType = NotificationType.ORDER_CANCELLED
        notificationTitle = "Sifariş rədd edildi"
        notificationMessage = `${master.firstName} ${master.lastName} sifarişinizi rədd etdi`
        break

      case "start":
        if (order.status !== OrderStatus.ACCEPTED) {
          return NextResponse.json(
            { success: false, message: "Bu sifarişi başlatmaq mümkün deyil" },
            { status: 400 }
          )
        }
        newStatus = OrderStatus.IN_PROGRESS
        notificationType = NotificationType.ORDER_STARTED
        notificationTitle = "İş başladı"
        notificationMessage = `${master.firstName} ${master.lastName} işə başladı`
        break

      case "complete":
        if (order.status !== OrderStatus.IN_PROGRESS) {
          return NextResponse.json(
            { success: false, message: "Bu sifarişi tamamlamaq mümkün deyil" },
            { status: 400 }
          )
        }
        newStatus = OrderStatus.COMPLETED
        notificationType = NotificationType.ORDER_COMPLETED
        notificationTitle = "İş tamamlandı"
        notificationMessage = `${master.firstName} ${master.lastName} işi tamamladı`
        break

      default:
        return NextResponse.json(
          { success: false, message: "Yanlış əməliyyat" },
          { status: 400 }
        )
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
        ...(action === "accept" && { acceptedAt: new Date() }),
        ...(action === "start" && { startedAt: new Date() }),
        ...(action === "complete" && { completedAt: new Date() }),
        ...(action === "reject" && { cancelledAt: new Date() }),
      },
    })

    // Create notification
    if (order.customer && notificationType) {
      await prisma.notification.create({
        data: {
          userId: order.customer.userId,
          type: notificationType,
          title: notificationTitle,
          message: notificationMessage,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Əməliyyat uğurla tamamlandı",
      order: updatedOrder,
    })
  } catch (error) {
    console.error("Order action error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/payments/webhook - Payment webhook (future use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, transactionId } = body

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    let paymentStatus = "PENDING"
    if (status === "success" || status === "completed") paymentStatus = "PAID"
    else if (status === "failed") paymentStatus = "FAILED"
    else if (status === "refunded") paymentStatus = "REFUNDED"

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    })

    return NextResponse.json({ success: true, message: "Payment status updated" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ success: false, error: "Webhook processing failed" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/payments - Initialize payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, amount, method } = body

    if (!orderId || !amount) {
      return NextResponse.json({ success: false, error: "Sifariş ID və məbləğ tələb olunur" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ success: false, error: "Sifariş tapılmadı" }, { status: 404 })
    }

    // Update order with payment info
    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalPrice: parseFloat(amount),
        paymentStatus: "PENDING",
        paymentMethod: method || "CASH",
      },
    })

    // For now, cash is default - no online payment gateway yet
    if (method === "CASH") {
      return NextResponse.json({
        success: true,
        message: "Ödəniş nağd olaraq qeydə alındı",
        data: { paymentMethod: "CASH", status: "PENDING" },
      })
    }

    // Placeholder for future online payment integration
    return NextResponse.json({
      success: true,
      message: "Ödəniş sistemi hazırlanır",
      data: { paymentMethod: method, status: "PENDING" },
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ success: false, error: "Ödəniş xətası" }, { status: 500 })
  }
}

// GET /api/payments?orderId=xxx
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Sifariş ID tələb olunur" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, totalPrice: true, paymentStatus: true, paymentMethod: true },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: "Sifariş tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ödəniş məlumatları yüklənə bilmədi" }, { status: 500 })
  }
}

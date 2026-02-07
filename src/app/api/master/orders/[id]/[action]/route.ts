import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/master/orders/[id]/[action]
export async function POST(request: NextRequest, { params }: { params: { id: string; action: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id, action } = params
    const updateData: any = {}

    switch (action) {
      case "accept":
        updateData.status = "ACCEPTED"
        updateData.acceptedAt = new Date()
        break
      case "start":
        updateData.status = "IN_PROGRESS"
        updateData.startedAt = new Date()
        break
      case "complete":
        updateData.status = "COMPLETED"
        updateData.completedAt = new Date()
        break
      case "reject":
      case "cancel":
        updateData.status = "CANCELLED"
        updateData.cancelledAt = new Date()
        const body = await request.json().catch(() => ({}))
        updateData.cancelReason = body.reason || null
        break
      default:
        return NextResponse.json({ success: false, error: "Yanlış əməliyyat" }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, message: "Sifariş yeniləndi", data: order })
  } catch (error) {
    console.error("Master order action error:", error)
    return NextResponse.json({ success: false, error: "Əməliyyat həyata keçirilə bilmədi" }, { status: 500 })
  }
}

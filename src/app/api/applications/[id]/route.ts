import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/applications/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: { master: true, order: { include: { category: true } } },
    })

    if (!application) {
      return NextResponse.json({ success: false, error: "Müraciət tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// PATCH /api/applications/[id] - Accept/reject/withdraw
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, rejectedReason } = body // action: accept, reject, withdraw

    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: { order: true },
    })

    if (!application) {
      return NextResponse.json({ success: false, error: "Müraciət tapılmadı" }, { status: 404 })
    }

    if (action === "accept") {
      // Accept this application
      await prisma.jobApplication.update({
        where: { id: params.id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      })

      // Update order with master and status
      await prisma.order.update({
        where: { id: application.orderId },
        data: { masterId: application.masterId, status: "ACCEPTED", acceptedAt: new Date() },
      })

      // Reject all other applications for this order
      await prisma.jobApplication.updateMany({
        where: { orderId: application.orderId, id: { not: params.id } },
        data: { status: "REJECTED", rejectedAt: new Date() },
      })

      return NextResponse.json({ success: true, message: "Müraciət qəbul edildi" })
    }

    if (action === "reject") {
      await prisma.jobApplication.update({
        where: { id: params.id },
        data: { status: "REJECTED", rejectedReason: rejectedReason || null, rejectedAt: new Date() },
      })
      return NextResponse.json({ success: true, message: "Müraciət rədd edildi" })
    }

    if (action === "withdraw") {
      await prisma.jobApplication.update({
        where: { id: params.id },
        data: { status: "WITHDRAWN" },
      })
      return NextResponse.json({ success: true, message: "Müraciət geri çəkildi" })
    }

    return NextResponse.json({ success: false, error: "Yanlış əməliyyat" }, { status: 400 })
  } catch (error) {
    console.error("Application PATCH error:", error)
    return NextResponse.json({ success: false, error: "Əməliyyat yerinə yetirilə bilmədi" }, { status: 500 })
  }
}

// DELETE /api/applications/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await prisma.jobApplication.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "Müraciət silindi" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Müraciət silinə bilmədi" }, { status: 500 })
  }
}

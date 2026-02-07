import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/messages - Get user conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { customer: true, master: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const where: any = {}
    if (user.customer) where.customerId = user.customer.id
    else if (user.master) where.masterId = user.master.id
    else {
      return NextResponse.json({ success: true, data: [] })
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        customer: true,
        master: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { lastMessageAt: "desc" },
    })

    const formatted = conversations.map((c) => ({
      id: c.id,
      otherUser: user.customer ? {
        id: c.master.id,
        name: `${c.master.firstName} ${c.master.lastName}`,
        avatar: c.master.avatar,
      } : {
        id: c.customer.id,
        name: `${c.customer.firstName} ${c.customer.lastName}`,
        avatar: c.customer.avatar,
      },
      lastMessage: c.messages[0]?.content || "",
      lastMessageAt: c.messages[0]?.createdAt || c.lastMessageAt,
      unreadCount: 0,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error("Messages error:", error)
    return NextResponse.json({ success: false, error: "Mesajlar yüklənə bilmədi" }, { status: 500 })
  }
}

// POST /api/messages - Send message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { conversationId, content, receiverId } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user || !content) {
      return NextResponse.json({ success: false, error: "Məlumat çatışmır" }, { status: 400 })
    }

    const message = await prisma.conversationMessage.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
      },
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ success: false, error: "Mesaj göndərilə bilmədi" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/messages - Get user conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Get customer or master profile
    const customer = await prisma.customer.findFirst({
      where: { userId },
    })

    const master = await prisma.master.findFirst({
      where: { userId },
    })

    if (!customer && !master) {
      return NextResponse.json(
        { success: false, message: "Profil tapılmadı" },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = {}
    if (customer) {
      where.customerId = customer.id
    }
    if (master) {
      where.masterId = master.id
    }

    // Get conversations
    const conversations = await prisma.conversation.findMany({
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
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    })

    const formattedConversations = conversations.map((conv) => ({
      id: conv.id,
      participant: customer ? conv.master : conv.customer,
      lastMessage: conv.messages[0] || null,
      lastMessageAt: conv.lastMessageAt,
    }))

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Giriş tələb olunur" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { conversationId, receiverId, content } = body

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Mesaj mətni tələb olunur" },
        { status: 400 }
      )
    }

    let conversation

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      })
    } else if (receiverId) {
      // Find or create conversation
      const customer = await prisma.customer.findFirst({ where: { userId } })
      const master = await prisma.master.findFirst({ where: { userId } })

      if (customer) {
        conversation = await prisma.conversation.findFirst({
          where: {
            customerId: customer.id,
            masterId: receiverId,
          },
        })

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              customerId: customer.id,
              masterId: receiverId,
            },
          })
        }
      } else if (master) {
        conversation = await prisma.conversation.findFirst({
          where: {
            masterId: master.id,
            customerId: receiverId,
          },
        })

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              masterId: master.id,
              customerId: receiverId,
            },
          })
        }
      }
    }

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Söhbət tapılmadı" },
        { status: 404 }
      )
    }

    // Create message
    const message = await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        content,
      },
    })

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json(
      { success: false, message: "Server xətası" },
      { status: 500 }
    )
  }
}

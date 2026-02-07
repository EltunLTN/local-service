import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/messages/[id] - Get conversation messages
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.conversationMessage.findMany({
      where: { conversationId: params.id },
      orderBy: { createdAt: "asc" },
    })

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: { customer: true, master: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        conversation,
        messages,
      },
    })
  } catch (error) {
    console.error("Conversation messages error:", error)
    return NextResponse.json({ success: false, error: "Mesajlar yüklənə bilmədi" }, { status: 500 })
  }
}

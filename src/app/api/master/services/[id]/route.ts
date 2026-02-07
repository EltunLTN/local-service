import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// DELETE /api/master/services/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await prisma.masterService.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "Xidmət silindi" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xidmət silinə bilmədi" }, { status: 500 })
  }
}

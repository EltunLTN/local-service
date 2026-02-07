import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/admin/masters/[id]/badge
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { badge, action } = body // badge: "verified" | "premium" | "insured", action: "add" | "remove"

    const updateData: any = {}
    if (badge === "verified") updateData.isVerified = action === "add"
    if (badge === "premium") updateData.isPremium = action === "add"
    if (badge === "insured") updateData.isInsured = action === "add"

    await prisma.master.update({ where: { id: params.id }, data: updateData })
    return NextResponse.json({ success: true, message: `Badge ${action === "add" ? "əlavə edildi" : "silindi"}` })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

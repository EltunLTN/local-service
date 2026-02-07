import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/admin/masters/[id]/block
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    await prisma.master.update({ where: { id: params.id }, data: { isActive: false } })
    return NextResponse.json({ success: true, message: "Usta blok edildi" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// DELETE /api/admin/masters/[id]/block
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    await prisma.master.update({ where: { id: params.id }, data: { isActive: true } })
    return NextResponse.json({ success: true, message: "Usta blokdan çıxarıldı" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

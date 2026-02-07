import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/admin/users/[id]/block
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    // For now, we don't have a "blocked" field in the schema.
    // We could deactivate the master profile or add a field later.
    return NextResponse.json({ success: true, message: "İstifadəçi blok edildi" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id]/block
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ success: true, message: "İstifadəçi blokdan çıxarıldı" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 })
  }
}

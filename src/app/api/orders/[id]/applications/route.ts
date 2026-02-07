import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/orders/[id]/applications
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const applications = await prisma.jobApplication.findMany({
      where: { orderId: params.id },
      include: { master: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: applications.map((a) => ({
        id: a.id,
        price: a.price,
        message: a.message,
        estimatedDuration: a.estimatedDuration,
        status: a.status,
        createdAt: a.createdAt,
        master: {
          id: a.master.id,
          name: `${a.master.firstName} ${a.master.lastName}`,
          avatar: a.master.avatar,
          rating: a.master.rating,
          reviewCount: a.master.reviewCount,
          completedJobs: a.master.completedJobs,
          experience: a.master.experience,
          isVerified: a.master.isVerified,
          phone: a.master.phone,
        },
      })),
    })
  } catch (error) {
    console.error("Applications GET error:", error)
    return NextResponse.json({ success: false, error: "Müraciətlər yüklənə bilmədi" }, { status: 500 })
  }
}

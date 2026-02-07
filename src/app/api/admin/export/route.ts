import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/admin/export
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "orders"
    const format = searchParams.get("format") || "json"

    let data: any[] = []

    if (type === "orders") {
      const orders = await prisma.order.findMany({
        include: { category: true, customer: true, master: true },
        orderBy: { createdAt: "desc" },
      })
      data = orders.map((o) => ({
        "Sifariş №": o.orderNumber,
        "Başlıq": o.title,
        "Status": o.status,
        "Kateqoriya": o.category?.name || "",
        "Müştəri": o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : "",
        "Usta": o.master ? `${o.master.firstName} ${o.master.lastName}` : "Təyin edilməyib",
        "Qiymət": o.totalPrice || o.estimatedPrice || 0,
        "Tarix": o.createdAt.toISOString().split("T")[0],
      }))
    } else if (type === "users") {
      const users = await prisma.user.findMany({
        include: { customer: true, master: true },
        orderBy: { createdAt: "desc" },
      })
      data = users.map((u) => ({
        "Ad": u.customer ? `${u.customer.firstName} ${u.customer.lastName}` : u.master ? `${u.master.firstName} ${u.master.lastName}` : u.email,
        "Email": u.email,
        "Telefon": u.phone || "",
        "Rol": u.role,
        "Qeydiyyat": u.createdAt.toISOString().split("T")[0],
      }))
    } else if (type === "masters") {
      const masters = await prisma.master.findMany({
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
      })
      data = masters.map((m) => ({
        "Ad": `${m.firstName} ${m.lastName}`,
        "Email": m.user.email,
        "Telefon": m.phone,
        "Reytinq": m.rating,
        "Tamamlanmış": m.completedJobs,
        "Təcrübə (il)": m.experience,
        "Təsdiqlənmiş": m.isVerified ? "Bəli" : "Xeyr",
      }))
    }

    if (format === "xlsx") {
      try {
        const XLSX = require("xlsx")
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, type)
        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename=${type}_export_${Date.now()}.xlsx`,
          },
        })
      } catch {
        // xlsx package not available, fall back to JSON
        return NextResponse.json({ success: true, data, format: "json" })
      }
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ success: false, error: "İxrac edilə bilmədi" }, { status: 500 })
  }
}

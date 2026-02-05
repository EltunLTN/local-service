import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/giris", req.url))
      }
    }

    // Master panel routes
    if (pathname.startsWith("/usta-panel")) {
      if (token?.role !== "MASTER" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/giris", req.url))
      }
    }

    // Customer account routes
    if (pathname.startsWith("/hesab")) {
      if (!token) {
        return NextResponse.redirect(new URL("/giris", req.url))
      }
    }

    // Messages route
    if (pathname.startsWith("/mesajlar")) {
      if (!token) {
        return NextResponse.redirect(new URL("/giris", req.url))
      }
    }

    // Notifications route
    if (pathname.startsWith("/bildirisler")) {
      if (!token) {
        return NextResponse.redirect(new URL("/giris", req.url))
      }
    }

    // Settings route
    if (pathname.startsWith("/tenzimlemeler")) {
      if (!token) {
        return NextResponse.redirect(new URL("/giris", req.url))
      }
    }

    // Order creation route
    if (pathname.startsWith("/sifaris")) {
      if (!token) {
        return NextResponse.redirect(new URL("/giris?redirect=" + pathname, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/giris",
          "/qeydiyyat",
          "/usta-ol",
          "/xidmetler",
          "/usta",
          "/kateqoriyalar",
          "/haqqimizda",
          "/elaqe",
          "/sertler",
          "/mexfilik",
          "/api/auth",
          "/api/masters",
          "/api/categories",
        ]

        // Check if current path is public
        const isPublicRoute = publicRoutes.some(
          (route) => pathname === route || pathname.startsWith(route + "/")
        )

        if (isPublicRoute) {
          return true
        }

        // For protected routes, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}

"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

// Routes that should not show navbar/footer
const NO_LAYOUT_ROUTES = ['/admin', '/usta-panel']

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if current path should hide navbar/footer
  const shouldHideLayout = NO_LAYOUT_ROUTES.some(route => pathname?.startsWith(route))
  
  if (shouldHideLayout) {
    return <>{children}</>
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import { Providers } from "@/components/providers"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const manrope = Manrope({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: {
    template: "%s | UstaBul",
    default: "UstaBul - Azərbaycanda Usta Xidməti",
  },
  description: "Elektrik, santexnik, təmir, təmizlik və digər usta xidmətləri. Peşəkar ustaları tapın və sifarış edin.",
  keywords: ["usta", "elektrik", "santexnik", "təmir", "baku", "azerbaycan", "xidmət"],
  authors: [{ name: "UstaBul" }],
  creator: "UstaBul",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "UstaBul",
    title: "UstaBul - Azərbaycanda Usta Xidməti",
    description: "Peşəkar ustaları asanlıqla tapın və sifarış edin.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UstaBul - Azərbaycanda Usta Xidməti",
    description: "Peşəkar ustaları asanlıqla tapın və sifarış edin.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="az" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}

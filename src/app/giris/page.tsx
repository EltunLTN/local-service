"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// Get redirect URL based on user role
function getRedirectUrl(role: string, callbackUrl: string): string {
  // If there's a specific callback, use it (unless it's just "/")
  if (callbackUrl && callbackUrl !== "/") {
    return callbackUrl
  }
  
  // Otherwise redirect based on role
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return "/admin"
    case "MASTER":
      return "/usta-panel"
    default:
      return "/hesab"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        // Get session to determine user role
        const session = await getSession()
        const userRole = (session?.user as any)?.role || "CUSTOMER"
        const redirectUrl = getRedirectUrl(userRole, callbackUrl)
        
        router.push(redirectUrl)
        router.refresh()
      }
    } catch (err) {
      setError("Xəta baş verdi. Yenidən cəhd edin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              UstaBul
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">
            Hesabınıza daxil olun
          </h1>
          <p className="text-gray-600 mt-2">
            Xoş gəlmisiniz! Davam etmək üçün daxil olun.
          </p>
        </div>

        <Card className="p-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={(e) => { if (e.key === "Enter" && !isLoading) handleSubmit(e) }}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Şifrə"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600">Məni xatırla</span>
              </label>
              <Link
                href="/sifre-sifirla"
                className="text-sm text-primary hover:underline"
              >
                Şifrəni unutdun?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Daxil olunur...
                </>
              ) : (
                "Daxil ol"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Hesabınız yoxdur?{" "}
            <Link href="/qeydiyyat" className="text-primary font-medium hover:underline">
              Qeydiyyatdan keçin
            </Link>
          </p>
        </Card>

        {/* Master CTA */}
        <Card className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-orange-500/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Usta olaraq qeydiyyatdan keçin</p>
              <p className="text-sm text-gray-600">Öz işinizi qurun, gəlir əldə edin</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/usta-ol">Usta ol</Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

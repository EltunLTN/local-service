"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  AlertCircle,
  Check,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Password strength
  const getPasswordStrength = () => {
    const { password } = formData
    if (!password) return 0
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength()
  const strengthLabels = ["Çox zəif", "Zəif", "Orta", "Güclü", "Çox güclü"]
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-600",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Bütün sahələri doldurun")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Şifrələr uyğun gəlmir")
      return
    }

    if (formData.password.length < 6) {
      setError("Şifrə minimum 6 simvol olmalıdır")
      return
    }

    if (!formData.acceptTerms) {
      setError("İstifadə şərtlərini qəbul etməlisiniz")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "CUSTOMER",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Qeydiyyat uğursuz oldu")
      }

      // Show OTP verification step
      setShowOtp(true)
      setOtpResendTimer(60)
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi")
    } finally {
      setIsLoading(false)
    }
  }

  // OTP resend timer
  React.useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpResendTimer])

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setError("6 rəqəmli kodu daxil edin")
      return
    }

    setOtpLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otpCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Təsdiq uğursuz oldu")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/giris")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (otpResendTimer > 0) return

    setError("")
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Kod göndərilə bilmədi")
      }

      setOtpResendTimer(60)
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi")
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <Check className="h-10 w-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Qeydiyyat uğurlu!
          </h2>
          <p className="text-gray-600 mb-6">
            Hesabınız təsdiqləndi. Giriş səhifəsinə yönləndirilirsiniz...
          </p>
        </motion.div>
      </div>
    )
  }

  if (showOtp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                UstaBul
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-6">
              Email Təsdiqləmə
            </h1>
            <p className="text-gray-600 mt-2">
              <strong>{formData.email}</strong> ünvanına göndərilən 6 rəqəmli kodu daxil edin
            </p>
          </div>

          <Card className="p-6">
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Təsdiq kodu</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setOtpCode(val)
                  }}
                  className="text-center text-2xl tracking-[0.5em] font-bold"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={otpLoading || otpCode.length !== 6}
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Təsdiqlənir...
                  </>
                ) : (
                  "Təsdiqlə"
                )}
              </Button>

              <div className="text-center">
                {otpResendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Yeni kod göndərmək üçün {otpResendTimer} saniyə gözləyin
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Kodu yenidən göndər
                  </button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
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
            Qeydiyyatdan keçin
          </h1>
          <p className="text-gray-600 mt-2">
            Peşəkar usta xidmətlərindən yararlanın
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Ad"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
              <Input
                type="text"
                name="lastName"
                placeholder="Soyad"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="tel"
                name="phone"
                placeholder="Telefon (opsional)"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Şifrə"
                value={formData.password}
                onChange={handleChange}
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

            {/* Password Strength */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        level <= passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Şifrə gücü: {strengthLabels[passwordStrength - 1] || ""}
                </p>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Şifrəni təkrarla"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">
                <Link href="/sertler" className="text-primary hover:underline">
                  İstifadə şərtlərini
                </Link>{" "}
                və{" "}
                <Link href="/mexfilik" className="text-primary hover:underline">
                  Məxfilik siyasətini
                </Link>{" "}
                qəbul edirəm
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Qeydiyyat...
                </>
              ) : (
                <>
                  Qeydiyyatdan keç
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Artıq hesabınız var?{" "}
            <Link href="/giris" className="text-primary font-medium hover:underline">
              Daxil olun
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

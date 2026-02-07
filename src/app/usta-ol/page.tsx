"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
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
  ArrowLeft,
  Camera,
  MapPin,
  Briefcase,
  Clock,
  BadgeCheck,
  Star,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const categories = [
  { id: "santexnika", name: "Santexnik", icon: "🔧" },
  { id: "elektrik", name: "Elektrik", icon: "⚡" },
  { id: "temizlik", name: "Təmizlik", icon: "🧹" },
  { id: "temir", name: "Ev təmiri", icon: "🏠" },
  { id: "mebel", name: "Mebel ustası", icon: "🪑" },
  { id: "kondisioner", name: "Kondisioner", icon: "❄️" },
  { id: "boyaci", name: "Boyacı", icon: "🎨" },
  { id: "qaynaqci", name: "Qaynaqçı", icon: "🔥" },
  { id: "plitka", name: "Plitka döşəmə", icon: "🧱" },
  { id: "parket", name: "Parket ustası", icon: "🪵" },
  { id: "gips", name: "Gips karton", icon: "📐" },
  { id: "suvaq", name: "Suvaqçı", icon: "🧱" },
  { id: "bag", name: "Bağ işləri", icon: "🌳" },
  { id: "suvarma", name: "Suvarma sistemi", icon: "💧" },
  { id: "paltaryuyan", name: "Paltaryuyan təmiri", icon: "🧺" },
  { id: "soyuducu", name: "Soyuducu təmiri", icon: "🧊" },
  { id: "televizor", name: "TV quraşdırma", icon: "📺" },
  { id: "kamera", name: "Kamera quraşdırma", icon: "📷" },
  { id: "alarm", name: "Alarm sistemi", icon: "🚨" },
  { id: "smart_ev", name: "Smart ev", icon: "🏠" },
  { id: "pəncərə", name: "Pəncərə təmiri", icon: "🪟" },
  { id: "qapı", name: "Qapı ustası", icon: "🚪" },
  { id: "kilid", name: "Kilidçi", icon: "🔐" },
  { id: "xalça", name: "Xalça yuma", icon: "🧹" },
]

const districts = [
  "Binəqədi", "Xətai", "Nərimanov", "Nəsimi", "Nizami",
  "Sabunçu", "Səbail", "Suraxanı", "Xəzər", "Yasamal", "Qaradağ",
  "Pirallahı", "Abşeron", "Sumqayıt", "Xırdalan", "Masazır", "Mərdəkan",
  "Buzovna", "Bilgəh", "Novxanı", "Zirə", "Şüvəlan", "Türkan",
  "Hövsan", "Lökbatan", "Ramana", "Maştağa", "Nardaran",
  "Badamdar", "Biləcəri", "Əhmədli", "Yeni Yasamal", "Həzi Aslanov",
  "8-ci km", "20 Yanvar", "28 May", "Koroğlu", "İnşaatçılar",
]

const steps = [
  { id: 1, title: "Şəxsi məlumatlar", icon: User },
  { id: 2, title: "Peşə seçimi", icon: Briefcase },
  { id: 3, title: "Yer və iş saatları", icon: MapPin },
  { id: 4, title: "Təsdiq", icon: Check },
]

const benefits = [
  { icon: TrendingUp, title: "Müştəri axını", desc: "Hər gün yeni müştərilər" },
  { icon: DollarSign, title: "Əlavə gəlir", desc: "Öz qiymətinizi təyin edin" },
  { icon: Star, title: "Reytinq sistemi", desc: "Keyfiyyətli iş görün" },
  { icon: BadgeCheck, title: "Təsdiqlənmiş profil", desc: "Etibar qazanın" },
]

export default function MasterRegistrationPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    photo: null as File | null,
    photoPreview: "",
    
    // Step 2: Professional Info
    categories: [] as string[],
    experience: "",
    bio: "",
    
    // Step 3: Location & Schedule
    districts: [] as string[],
    workingDays: ["1", "2", "3", "4", "5"] as string[],
    startTime: "09:00",
    endTime: "18:00",
    
    // Step 4: Terms
    acceptTerms: false,
    acceptCommission: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }))
    }
  }

  const toggleCategory = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((c) => c !== catId)
        : [...prev.categories, catId],
    }))
  }

  const toggleDistrict = (district: string) => {
    setFormData((prev) => ({
      ...prev,
      districts: prev.districts.includes(district)
        ? prev.districts.filter((d) => d !== district)
        : [...prev.districts, district],
    }))
  }

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }))
  }

  const validateStep = () => {
    setError("")
    
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
          setError("Bütün sahələri doldurun")
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Şifrələr uyğun gəlmir")
          return false
        }
        if (formData.password.length < 6) {
          setError("Şifrə minimum 6 simvol olmalıdır")
          return false
        }
        return true
        
      case 2:
        if (formData.categories.length === 0) {
          setError("Ən az bir xidmət növü seçin")
          return false
        }
        if (!formData.experience) {
          setError("Təcrübənizi qeyd edin")
          return false
        }
        return true
        
      case 3:
        if (formData.districts.length === 0) {
          setError("Ən az bir rayon seçin")
          return false
        }
        if (formData.workingDays.length === 0) {
          setError("İş günlərini seçin")
          return false
        }
        return true
        
      case 4:
        if (!formData.acceptTerms) {
          setError("İstifadə şərtlərini qəbul etməlisiniz")
          return false
        }
        if (!formData.acceptCommission) {
          setError("Komissiya şərtlərini qəbul etməlisiniz")
          return false
        }
        return true
        
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsLoading(true)
    setError("")

    try {
      // If user is already logged in, try to upgrade to master
      const isLoggedIn = !!session?.user?.email
      const endpoint = isLoggedIn ? "/api/auth/upgrade-to-master" : "/api/auth/register"
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: isLoggedIn ? session.user.email : formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "MASTER",
          bio: formData.bio,
          experience: parseInt(formData.experience),
          categories: formData.categories,
          districts: formData.districts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Qeydiyyat uğursuz oldu")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/giris")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <BadgeCheck className="h-12 w-12 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Müraciətiniz qəbul olundu!
          </h2>
          <p className="text-gray-600 mb-6">
            Usta profiliniz yoxlamadan sonra aktivləşdiriləcək.
            24 saat ərzində sizinlə əlaqə saxlayacağıq.
          </p>
          <div className="p-4 bg-blue-50 rounded-lg text-left">
            <p className="text-sm text-blue-700">
              <strong>Növbəti addımlar:</strong>
            </p>
            <ul className="mt-2 text-sm text-blue-600 space-y-1">
              <li>• Email-inizdəki təsdiq linkini klikləyin</li>
              <li>• Şəxsiyyət sənədinizi yükləyin</li>
              <li>• Sertifikatlarınızı əlavə edin (varsa)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Side - Benefits */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-8">
              <Link href="/" className="inline-block mb-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  UstaBul
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Usta olaraq qoşulun
              </h1>
              <p className="text-gray-600 mb-8">
                Bakının ən böyük usta platformasında yerinizi tutun.
                Hər gün minlərlə müştəri xidmət axtarır.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{benefit.title}</p>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm text-orange-800">
                  <strong>🎁 Xüsusi təklif:</strong> İlk 30 gün komissiyasız!
                  Bütün qazancınız sizin olsun.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-3">
            <Card className="p-6 md:p-8">
              {/* Mobile Logo */}
              <div className="text-center mb-6 lg:hidden">
                <Link href="/" className="inline-block">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    UstaBul
                  </span>
                </Link>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            step >= s.id
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-400"
                          )}
                        >
                          {step > s.id ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <s.icon className="h-5 w-5" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs mt-2 hidden sm:block",
                            step >= s.id ? "text-primary" : "text-gray-400"
                          )}
                        >
                          {s.title}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-1 mx-2 rounded",
                            step > s.id ? "bg-primary" : "bg-gray-200"
                          )}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Şəxsi məlumatlar
                    </h2>

                    {/* Photo Upload */}
                    <div className="flex justify-center mb-6">
                      <label className="cursor-pointer">
                        <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                          {formData.photoPreview ? (
                            <img
                              src={formData.photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <p className="text-xs text-center mt-2 text-gray-500">
                          Foto əlavə edin
                        </p>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="Ad *"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Soyad *"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Telefon * (050-xxx-xx-xx)"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Şifrə *"
                        value={formData.password}
                        onChange={handleChange}
                        className="pr-10"
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

                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Şifrəni təkrarla *"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                )}

                {/* Step 2: Professional Info */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      Peşə məlumatları
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Xidmət növləri (minimum 1) *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={cn(
                              "p-3 rounded-xl border-2 text-center transition-all",
                              formData.categories.includes(cat.id)
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <span className="text-2xl block mb-1">{cat.icon}</span>
                            <span className="text-xs font-medium">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Təcrübə (il) *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Seçin...</option>
                        <option value="1">1 ildən az</option>
                        <option value="2">1-2 il</option>
                        <option value="3">3-5 il</option>
                        <option value="5">5-10 il</option>
                        <option value="10">10+ il</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Özünüz haqqında (opsional)
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Təcrübəniz, bacarıqlarınız, niyə sizi seçməli olduqlarını yazın..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Location & Schedule */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      Yer və iş saatları
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Xidmət göstərdiyiniz rayonlar (minimum 1) *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {districts.map((district) => (
                          <button
                            key={district}
                            type="button"
                            onClick={() => toggleDistrict(district)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                              formData.districts.includes(district)
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                          >
                            {district}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        İş günləri *
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: "1", name: "B.e" },
                          { id: "2", name: "Ç.a" },
                          { id: "3", name: "Ç" },
                          { id: "4", name: "C.a" },
                          { id: "5", name: "C" },
                          { id: "6", name: "Ş" },
                          { id: "0", name: "B" },
                        ].map((day) => (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleWorkingDay(day.id)}
                            className={cn(
                              "w-10 h-10 rounded-lg font-medium transition-all",
                              formData.workingDays.includes(day.id)
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                          >
                            {day.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlanğıc saatı
                        </label>
                        <Input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bitmə saatı
                        </label>
                        <Input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      Təsdiq
                    </h2>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ad Soyad:</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefon:</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Xidmətlər:</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                          {formData.categories.map((catId) => {
                            const cat = categories.find((c) => c.id === catId)
                            return (
                              <Badge key={catId} variant="outline" size="sm">
                                {cat?.icon} {cat?.name}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Təcrübə:</span>
                        <span className="font-medium">{formData.experience} il</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Rayonlar:</span>
                        <span className="font-medium text-right max-w-[200px]">
                          {formData.districts.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleChange}
                          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600">
                          <Link href="/sertler" className="text-primary hover:underline">
                            İstifadə şərtlərini
                          </Link>{" "}
                          və{" "}
                          <Link href="/mexfilik" className="text-primary hover:underline">
                            Məxfilik siyasətini
                          </Link>{" "}
                          oxudum və qəbul edirəm
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="acceptCommission"
                          checked={formData.acceptCommission}
                          onChange={handleChange}
                          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600">
                          Hər uğurlu sifariş üzrə <strong>15% xidmət haqqı</strong> tutulacağını 
                          qəbul edirəm. (İlk 30 gün pulsuz!)
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Geri
                  </Button>
                )}
                
                <div className="flex-1" />
                
                {step < 4 ? (
                  <Button onClick={handleNext}>
                    Növbəti
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Göndərilir...
                      </>
                    ) : (
                      <>
                        Qeydiyyatı tamamla
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Artıq usta hesabınız var?{" "}
                <Link href="/giris" className="text-primary font-medium hover:underline">
                  Daxil olun
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

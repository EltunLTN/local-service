"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Camera,
  Upload,
  X,
  AlertCircle,
  Star,
  Phone,
  MessageSquare,
  Zap,
  Shield,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, MotionCard } from "@/components/ui/card"
import { Badge, VerifiedBadge, InsuredBadge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { SimpleRating } from "@/components/ui/rating"
import {
  SERVICE_CATEGORIES,
  TIME_SLOTS,
  URGENCY_OPTIONS,
  PAYMENT_METHODS,
  BAKU_DISTRICTS,
} from "@/lib/constants"

// Form addımları
const STEPS = [
  { id: 1, title: "Xidmət", icon: FileText },
  { id: 2, title: "Yer & Vaxt", icon: Calendar },
  { id: 3, title: "Detallar", icon: Camera },
  { id: 4, title: "Ödəniş", icon: CreditCard },
  { id: 5, title: "Təsdiq", icon: Check },
]

// Seçilmiş usta (URL-dan yüklənəcək, hələlik boş)
const SELECTED_MASTER = {
  id: "",
  name: "Usta seçilməyib",
  avatar: "",
  category: "",
  rating: 0,
  reviewCount: 0,
  hourlyRate: 0,
  isVerified: false,
  isInsured: false,
  responseTime: 0,
}

// Progress Bar komponenti
function ProgressSteps({
  currentStep,
  steps,
}: {
  currentStep: number
  steps: typeof STEPS
}) {
  return (
    <div className="hidden md:flex items-center justify-between max-w-2xl mx-auto mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.id ? 1.1 : 1,
                backgroundColor:
                  currentStep >= step.id ? "var(--primary)" : "#E5E7EB",
              }}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                currentStep >= step.id ? "text-white" : "text-gray-400"
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-6 w-6" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </motion.div>
            <span
              className={cn(
                "text-sm mt-2 font-medium",
                currentStep >= step.id ? "text-primary" : "text-gray-400"
              )}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 mx-2">
              <div className="h-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: currentStep > step.id ? "100%" : "0%",
                  }}
                  className="h-full bg-primary"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Mobile Progress Bar
function MobileProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  return (
    <div className="md:hidden mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          Addım {currentStep}/{totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {STEPS[currentStep - 1]?.title}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          className="h-full bg-primary"
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

// Xidmət seçimi komponenti
function ServiceSelection({
  selectedCategory,
  setSelectedCategory,
  selectedService,
  setSelectedService,
}: {
  selectedCategory: string
  setSelectedCategory: (id: string) => void
  selectedService: string
  setSelectedService: (id: string) => void
}) {
  const category = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Kateqoriya seçin</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCategory(cat.id)
                setSelectedService("")
              }}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-colors",
                selectedCategory === cat.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: cat.color + "20" }}
              >
                <span className="text-xl">
                  {cat.id === "elektrik" && "⚡"}
                  {cat.id === "santexnik" && "🔧"}
                  {cat.id === "temir" && "🏠"}
                  {cat.id === "temizlik" && "✨"}
                  {cat.id === "kondisioner" && "❄️"}
                  {cat.id === "mebel" && "🛋️"}
                  {cat.id === "bag" && "🌿"}
                  {cat.id === "texnika" && "📺"}
                </span>
              </div>
              <p className="font-medium text-gray-900">{cat.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {category && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Xidmət seçin</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {category.subcategories.map((service) => (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedService(service.id)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left flex items-center justify-between transition-colors",
                  selectedService === service.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-500">{service.price}₼-dan</p>
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    selectedService === service.id
                      ? "border-primary bg-primary"
                      : "border-gray-300"
                  )}
                >
                  {selectedService === service.id && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Yer və vaxt seçimi
function LocationTimeSelection({
  selectedDistrict,
  setSelectedDistrict,
  address,
  setAddress,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  urgency,
  setUrgency,
}: {
  selectedDistrict: string
  setSelectedDistrict: (v: string) => void
  address: string
  setAddress: (v: string) => void
  selectedDate: string
  setSelectedDate: (v: string) => void
  selectedTime: string
  setSelectedTime: (v: string) => void
  urgency: string
  setUrgency: (v: string) => void
}) {
  // Generate next 7 days
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("az-AZ", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("az-AZ", { month: "short" }),
      isToday: i === 0,
    }
  })

  return (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <MapPin className="inline h-5 w-5 mr-2 text-primary" />
          Ünvan
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rayon
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Rayon seçin</option>
              {BAKU_DISTRICTS.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dəqiq ünvan
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Küçə, bina, mənzil..."
            />
          </div>
        </div>
      </div>

      {/* Date */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <Calendar className="inline h-5 w-5 mr-2 text-primary" />
          Tarix
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((d) => (
            <motion.button
              key={d.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(d.value)}
              className={cn(
                "flex-shrink-0 w-20 p-3 rounded-xl border-2 text-center transition-colors",
                selectedDate === d.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <p className="text-xs text-gray-500">{d.day}</p>
              <p className="text-xl font-bold text-gray-900">{d.date}</p>
              <p className="text-xs text-gray-500">{d.month}</p>
              {d.isToday && (
                <Badge size="sm" variant="success" className="mt-1">
                  Bu gün
                </Badge>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <Clock className="inline h-5 w-5 mr-2 text-primary" />
          Vaxt aralığı
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TIME_SLOTS.map((slot) => (
            <motion.button
              key={slot.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTime(slot.id)}
              className={cn(
                "p-3 rounded-xl border-2 transition-colors",
                selectedTime === slot.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <p className="font-medium text-gray-900">{slot.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Urgency */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <Zap className="inline h-5 w-5 mr-2 text-primary" />
          Təcililik
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {URGENCY_OPTIONS.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUrgency(option.id)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-colors",
                urgency === option.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{option.label}</p>
                {option.price > 0 && (
                  <Badge variant="warning" size="sm">
                    +{option.price}₼
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{option.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Detallar komponenti
function DetailsSection({
  description,
  setDescription,
  photos,
  setPhotos,
}: {
  description: string
  setDescription: (v: string) => void
  photos: File[]
  setPhotos: (v: File[]) => void
}) {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotos([...photos, ...files].slice(0, 5))
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <FileText className="inline h-5 w-5 mr-2 text-primary" />
          Problem təsviri
        </h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Problemi ətraflı izah edin. Nə etmək lazımdır, nə problem var..."
          rows={5}
          className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">
          Minimum 20 simvol ({description.length}/20)
        </p>
      </div>

      {/* Photos */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <Camera className="inline h-5 w-5 mr-2 text-primary" />
          Şəkillər (opsional)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Problemi daha yaxşı anlamaq üçün şəkil əlavə edin (max 5)
        </p>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
            >
              <img
                src={URL.createObjectURL(photo)}
                alt={`Şəkil ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {photos.length < 5 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Yüklə</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Məsləhət</p>
          <p className="text-sm text-blue-700">
            Daha dəqiq qiymət almaq üçün problemi ətraflı izah edin və mümkünsə
            şəkil əlavə edin.
          </p>
        </div>
      </div>
    </div>
  )
}

// Ödəniş seçimi
function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  phone,
  setPhone,
  name,
  setName,
}: {
  paymentMethod: string
  setPaymentMethod: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  name: string
  setName: (v: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <Phone className="inline h-5 w-5 mr-2 text-primary" />
          Əlaqə məlumatları
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Ad, Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınızı daxil edin"
          />
          <Input
            label="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+994 XX XXX XX XX"
            type="tel"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          <CreditCard className="inline h-5 w-5 mr-2 text-primary" />
          Ödəniş üsulu
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <motion.button
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod(method.id)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-colors",
                paymentMethod === method.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  {method.id === "cash" && "💵"}
                  {method.id === "card" && "💳"}
                  {method.id === "later" && "⏰"}
                </div>
                <span className="font-medium text-gray-900">{method.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
        <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-green-900">Təhlükəsiz ödəniş</p>
          <p className="text-sm text-green-700">
            Ödənişiniz işin keyfiyyətli tamamlanmasından sonra ustaya köçürülür.
          </p>
        </div>
      </div>
    </div>
  )
}

// Təsdiq və icmal
function ConfirmationSection({
  selectedCategory,
  selectedService,
  selectedDistrict,
  address,
  selectedDate,
  selectedTime,
  urgency,
  description,
  paymentMethod,
  name,
  phone,
}: {
  selectedCategory: string
  selectedService: string
  selectedDistrict: string
  address: string
  selectedDate: string
  selectedTime: string
  urgency: string
  description: string
  paymentMethod: string
  name: string
  phone: string
}) {
  const category = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)
  const service = category?.subcategories.find((s) => s.id === selectedService)
  const district = BAKU_DISTRICTS.find((d) => d.id === selectedDistrict)
  const timeSlot = TIME_SLOTS.find((t) => t.id === selectedTime)
  const urgencyOption = URGENCY_OPTIONS.find((u) => u.id === urgency)
  const payment = PAYMENT_METHODS.find((p) => p.id === paymentMethod)

  const basePrice = service?.price || 0
  const urgencyPrice = urgencyOption?.price || 0
  const totalPrice = basePrice + urgencyPrice

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("az-AZ", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
        Sifariş icmalı
      </h3>

      {/* Master Card */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={SELECTED_MASTER.name}
            src={SELECTED_MASTER.avatar}
            size="lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900">{SELECTED_MASTER.name}</h4>
              {SELECTED_MASTER.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-sm text-gray-500">{SELECTED_MASTER.category}</p>
            <div className="flex items-center gap-2 mt-1">
              <SimpleRating value={SELECTED_MASTER.rating} size="sm" />
              <span className="text-xs text-gray-500">
                ({SELECTED_MASTER.reviewCount} rəy)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Details */}
      <Card className="divide-y">
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Xidmət</span>
          <span className="font-medium text-gray-900">{service?.name}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Ünvan</span>
          <span className="font-medium text-gray-900 text-right">
            {district?.name}, {address}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Tarix</span>
          <span className="font-medium text-gray-900">
            {formatSelectedDate(selectedDate)}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Vaxt</span>
          <span className="font-medium text-gray-900">{timeSlot?.label}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Təcililik</span>
          <span className="font-medium text-gray-900">
            {urgencyOption?.label}
            {urgencyPrice > 0 && (
              <span className="text-orange-500"> (+{urgencyPrice}₼)</span>
            )}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Ödəniş</span>
          <span className="font-medium text-gray-900">{payment?.label}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Əlaqə</span>
          <div className="text-right">
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{phone}</p>
          </div>
        </div>
      </Card>

      {/* Description Preview */}
      {description && (
        <Card className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">Problem təsviri</h4>
          <p className="text-gray-600 text-sm">{description}</p>
        </Card>
      )}

      {/* Price Summary */}
      <Card className="p-4 bg-primary/5 border-primary">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Xidmət haqqı</span>
            <span className="text-gray-900">{basePrice}₼-dan</span>
          </div>
          {urgencyPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Təcililik əlavəsi</span>
              <span className="text-gray-900">+{urgencyPrice}₼</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-primary/20">
            <span className="font-bold text-gray-900">Təxmini cəm</span>
            <span className="font-bold text-primary text-xl">
              {totalPrice}₼-dan
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          * Dəqiq qiymət usta ilə razılaşdırılacaq
        </p>
      </Card>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          defaultChecked
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
          qəbul edirəm
        </span>
      </label>
    </div>
  )
}

// Success Screen
function SuccessScreen({ orderId }: { orderId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
      >
        <Check className="h-12 w-12 text-green-600" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Sifarişiniz qəbul edildi!
      </h2>
      <p className="text-gray-600 mb-6">
        Sifariş nömrəniz: <strong>#{orderId}</strong>
      </p>

      <Card className="p-6 max-w-md mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <UserAvatar
            name={SELECTED_MASTER.name}
            src={SELECTED_MASTER.avatar}
            size="lg"
          />
          <div className="text-left">
            <h3 className="font-bold text-gray-900">{SELECTED_MASTER.name}</h3>
            <p className="text-sm text-gray-500">
              ~{SELECTED_MASTER.responseTime} dəqiqə içində cavab verəcək
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-left">
          Usta sifarişinizi nəzərdən keçirir. Qısa zamanda sizinlə əlaqə
          saxlayacaq.
        </p>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link href="/sifarisler">Sifarişlərim</Link>
        </Button>
        <Button asChild>
          <Link href="/">Ana səhifə</Link>
        </Button>
      </div>
    </motion.div>
  )
}

export default function CreateOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Form state
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("kateqoriya") || "elektrik"
  )
  const [selectedService, setSelectedService] = useState(
    searchParams.get("xidmet") || ""
  )
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [address, setAddress] = useState("")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [selectedTime, setSelectedTime] = useState("09-12")
  const [urgency, setUrgency] = useState("planned")
  const [description, setDescription] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!selectedCategory && !!selectedService
      case 2:
        return !!selectedDistrict && !!address && !!selectedDate && !!selectedTime
      case 3:
        return description.length >= 20
      case 4:
        return !!paymentMethod && !!name && phone.length >= 10
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setOrderId("UB" + Math.random().toString(36).substr(2, 9).toUpperCase())
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-2xl">
          <SuccessScreen orderId={orderId} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Sifariş yarat
          </h1>
          <p className="text-gray-600">
            Xidmət sifarişi üçün aşağıdakı addımları tamamlayın
          </p>
        </div>

        {/* Progress */}
        <ProgressSteps currentStep={currentStep} steps={STEPS} />
        <MobileProgress currentStep={currentStep} totalSteps={5} />

        {/* Form Content */}
        <Card className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <ServiceSelection
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                />
              )}
              {currentStep === 2 && (
                <LocationTimeSelection
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  address={address}
                  setAddress={setAddress}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  urgency={urgency}
                  setUrgency={setUrgency}
                />
              )}
              {currentStep === 3 && (
                <DetailsSection
                  description={description}
                  setDescription={setDescription}
                  photos={photos}
                  setPhotos={setPhotos}
                />
              )}
              {currentStep === 4 && (
                <PaymentSection
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  phone={phone}
                  setPhone={setPhone}
                  name={name}
                  setName={setName}
                />
              )}
              {currentStep === 5 && (
                <ConfirmationSection
                  selectedCategory={selectedCategory}
                  selectedService={selectedService}
                  selectedDistrict={selectedDistrict}
                  address={address}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  urgency={urgency}
                  description={description}
                  paymentMethod={paymentMethod}
                  name={name}
                  phone={phone}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>

            {currentStep < 5 ? (
              <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
                Davam et
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Göndərilir...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Sifarişi təsdiqlə
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Validation Error */}
        {!validateStep(currentStep) && currentStep !== 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 justify-center mt-4 text-amber-600"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              Davam etmək üçün bütün məlumatları doldurun
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

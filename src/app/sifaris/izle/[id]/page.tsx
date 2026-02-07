"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Star,
  AlertCircle,
  XCircle,
  Loader2,
  Navigation,
  Shield,
  RefreshCw,
  ChevronRight,
  User,
  CreditCard,
  FileWarning,
  Ban,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { cn, formatPrice, formatDate, formatRelativeTime } from "@/lib/utils"
import toast from "react-hot-toast"

// Types
interface TimelineStage {
  key: string
  label: string
  description: string
  index: number
  timestamp: string | null
  isCompleted: boolean
  isCurrent: boolean
}

interface Master {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
  phone: string
  rating: number
  reviewCount: number
  completedJobs: number
  isVerified: boolean
  lat: number | null
  lng: number | null
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
}

interface TrackingData {
  order: {
    id: string
    orderNumber: string
    title: string
    description: string
    status: string
    address: string
    district: string | null
    lat: number | null
    lng: number | null
    scheduledDate: string
    scheduledTime: string
    urgency: string
    estimatedPrice: number | null
    finalPrice: number | null
    totalPrice: number | null
    paymentMethod: string
    paymentStatus: string
    photos: string[]
    createdAt: string
    acceptedAt: string | null
    startedAt: string | null
    completedAt: string | null
    cancelledAt: string | null
    cancelReason: string | null
  }
  customer: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
  master: Master | null
  category: Category
  subcategory: { id: string; name: string } | null
  timeline: TimelineStage[]
  currentStageIndex: number
  estimatedTimeRemaining: number | null
  canCancel: boolean
  applicationCount: number
}

// Stage icons
const STAGE_ICONS: Record<string, React.ElementType> = {
  PENDING: Clock,
  SEARCHING: Loader2,
  ACCEPTED: CheckCircle,
  ON_THE_WAY: Navigation,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle,
}

// Urgency labels
const URGENCY_LABELS: Record<string, { label: string; color: string }> = {
  PLANNED: { label: "Planlaşdırılmış", color: "bg-blue-100 text-blue-700" },
  TODAY: { label: "Bu gün", color: "bg-orange-100 text-orange-700" },
  URGENT: { label: "Təcili", color: "bg-red-100 text-red-700" },
}

// Payment method labels
const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Nağd",
  CARD: "Kart",
  LATER: "Sonra",
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status: authStatus } = useSession()
  
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const orderId = params?.id as string

  // Fetch tracking data
  const fetchTracking = useCallback(async (showRefreshIndicator = false) => {
    if (!orderId) return

    try {
      if (showRefreshIndicator) setRefreshing(true)
      
      const res = await fetch(`/api/orders/${orderId}/track`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Məlumat yüklənə bilmədi")
      }

      setTrackingData(data.data)
      setError(null)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [orderId])

  // Initial fetch and auth check
  useEffect(() => {
    if (authStatus === "loading") return
    
    if (!session) {
      router.push(`/giris?redirect=/sifaris/izle/${orderId}`)
      return
    }

    fetchTracking()
  }, [session, authStatus, orderId, router, fetchTracking])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!trackingData || trackingData.order.status === "COMPLETED" || trackingData.order.status === "CANCELLED") {
      return
    }

    const interval = setInterval(() => {
      fetchTracking(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [trackingData, fetchTracking])

  // Cancel order handler
  const handleCancelOrder = async () => {
    if (!trackingData?.canCancel) return

    try {
      setCancelling(true)
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", cancelReason: "Müştəri tərəfindən ləğv edildi" }),
      })

      if (!res.ok) {
        throw new Error("Sifariş ləğv edilə bilmədi")
      }

      toast.success("Sifariş ləğv edildi")
      setCancelModalOpen(false)
      fetchTracking()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xəta baş verdi")
    } finally {
      setCancelling(false)
    }
  }

  // Format time duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} dəqiqə`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} saat ${mins} dəqiqə` : `${hours} saat`
  }

  // Calculate time spent at stage
  const getTimeAtStage = (stage: TimelineStage, nextStage?: TimelineStage): string | null => {
    if (!stage.timestamp) return null
    
    const start = new Date(stage.timestamp)
    const end = nextStage?.timestamp ? new Date(nextStage.timestamp) : new Date()
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / 60000)
    
    if (diffMinutes < 1) return "indicə"
    return formatDuration(diffMinutes)
  }

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Xəta baş verdi</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
            <Button onClick={() => fetchTracking()}>
              Yenidən cəhd et
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!trackingData) return null

  const { order, master, category, subcategory, timeline, currentStageIndex, estimatedTimeRemaining, canCancel } = trackingData
  const isCancelled = order.status === "CANCELLED"
  const isCompleted = order.status === "COMPLETED"

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Sifariş izləmə</h1>
              <p className="text-xs text-gray-500">#{order.orderNumber.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchTracking(true)}
            disabled={refreshing}
            className="text-gray-600"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            {refreshing ? "Yenilənir..." : "Yenilə"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Status Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 overflow-hidden">
            {/* Current Status Banner */}
            <div className={cn(
              "px-6 py-4 text-white",
              isCancelled ? "bg-gradient-to-r from-red-500 to-red-600" :
              isCompleted ? "bg-gradient-to-r from-green-500 to-green-600" :
              "bg-gradient-to-r from-primary to-primary/80"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCancelled ? (
                    <XCircle className="h-8 w-8" />
                  ) : isCompleted ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {(() => {
                        const IconComponent = STAGE_ICONS[timeline[currentStageIndex]?.key] || Clock
                        return <IconComponent className={cn(
                          "h-8 w-8",
                          timeline[currentStageIndex]?.key === "SEARCHING" && "animate-spin"
                        )} />
                      })()}
                    </motion.div>
                  )}
                  <div>
                    <h2 className="font-bold text-lg">
                      {isCancelled ? "Sifariş ləğv edildi" :
                       isCompleted ? "Sifariş tamamlandı" :
                       timeline[currentStageIndex]?.label}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {isCancelled ? order.cancelReason :
                       isCompleted ? "Xidmətdən razı qaldınızsa rəy yazın" :
                       timeline[currentStageIndex]?.description}
                    </p>
                  </div>
                </div>
                
                {estimatedTimeRemaining && !isCancelled && !isCompleted && (
                  <div className="text-right">
                    <p className="text-white/80 text-xs">Təxmini vaxt</p>
                    <p className="font-bold">{formatDuration(estimatedTimeRemaining)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <div className="relative">
                {timeline.map((stage, index) => {
                  const nextStage = timeline[index + 1]
                  const timeAtStage = stage.isCompleted || stage.isCurrent 
                    ? getTimeAtStage(stage, stage.isCompleted ? nextStage : undefined) 
                    : null
                  
                  return (
                    <motion.div
                      key={stage.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "relative pl-10 pb-8 last:pb-0",
                        isCancelled && index > 0 && "opacity-40"
                      )}
                    >
                      {/* Connecting Line */}
                      {index < timeline.length - 1 && (
                        <div 
                          className={cn(
                            "absolute left-[15px] top-8 w-0.5 h-[calc(100%-24px)]",
                            stage.isCompleted ? "bg-primary" : "bg-gray-200"
                          )}
                        />
                      )}
                      
                      {/* Stage Icon */}
                      <div className={cn(
                        "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center",
                        stage.isCompleted 
                          ? "bg-primary text-white" 
                          : stage.isCurrent 
                            ? "bg-primary/20 text-primary ring-4 ring-primary/20" 
                            : "bg-gray-100 text-gray-400"
                      )}>
                        {stage.isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : stage.isCurrent ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <div className="h-3 w-3 rounded-full bg-primary" />
                          </motion.div>
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-gray-300" />
                        )}
                      </div>

                      {/* Stage Content */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-semibold",
                            stage.isCompleted || stage.isCurrent ? "text-gray-900" : "text-gray-400"
                          )}>
                            {stage.label}
                          </h3>
                          {stage.isCurrent && !isCancelled && !isCompleted && (
                            <Badge variant="default" size="sm" pulse>
                              Aktiv
                            </Badge>
                          )}
                        </div>
                        <p className={cn(
                          "text-sm mt-0.5",
                          stage.isCompleted || stage.isCurrent ? "text-gray-600" : "text-gray-400"
                        )}>
                          {stage.description}
                        </p>
                        {stage.timestamp && (stage.isCompleted || stage.isCurrent) && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>
                              {new Date(stage.timestamp).toLocaleTimeString("az-AZ", { 
                                hour: "2-digit", 
                                minute: "2-digit" 
                              })}
                            </span>
                            {timeAtStage && (
                              <span className="text-gray-400">• {timeAtStage}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Last update info */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Son yenilənmə: {lastRefresh.toLocaleTimeString("az-AZ")}</span>
              <span>Hər 30 saniyədə avtomatik yenilənir</span>
            </div>
          </Card>
        </motion.div>

        {/* Master Card */}
        {master && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Usta məlumatları
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <UserAvatar
                      src={master.avatar || undefined}
                      name={`${master.firstName} ${master.lastName}`}
                      size="lg"
                    />
                    {/* Live location indicator */}
                    {order.status === "IN_PROGRESS" && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Navigation className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {master.firstName} {master.lastName}
                      </h4>
                      {master.isVerified && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{master.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({master.reviewCount})</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span>{master.completedJobs} iş</span>
                    </div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = `tel:${master.phone}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Zəng et
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/mesajlar?order=${order.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mesaj yaz
                    </Link>
                  </Button>
                </div>

                {/* View Profile Link */}
                <Link
                  href={`/usta/${master.id}`}
                  className="mt-4 flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                >
                  Profili gör
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sifariş detalları</h3>
              
              {/* Service Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: category.color ? `${category.color}20` : '#f3f4f6' }}
                  >
                    {category.icon || "🔧"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.title}</p>
                    <p className="text-sm text-gray-500">
                      {category.name}
                      {subcategory && ` → ${subcategory.name}`}
                    </p>
                  </div>
                  <Badge className={URGENCY_LABELS[order.urgency]?.color || "bg-gray-100 text-gray-700"} size="sm">
                    {URGENCY_LABELS[order.urgency]?.label || order.urgency}
                  </Badge>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>
                    {formatDate(order.scheduledDate)}, {order.scheduledTime}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{order.address}</p>
                    {order.district && (
                      <p className="text-sm text-gray-400">{order.district}</p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                    </span>
                  </div>
                  <div className="text-right">
                    {order.finalPrice ? (
                      <>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.finalPrice)}
                        </p>
                        <p className="text-xs text-gray-500">Yekun qiymət</p>
                      </>
                    ) : order.totalPrice ? (
                      <>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.totalPrice)}
                        </p>
                        <p className="text-xs text-gray-500">Razılaşdırılmış qiymət</p>
                      </>
                    ) : order.estimatedPrice ? (
                      <>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.estimatedPrice)}
                        </p>
                        <p className="text-xs text-gray-500">Təxmini qiymət</p>
                      </>
                    ) : (
                      <p className="text-gray-500">Müəyyən edilməyib</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Photos */}
        {order.photos && order.photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-6">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Əlavə şəkillər</h3>
                <div className="grid grid-cols-3 gap-2">
                  {order.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={photo}
                        alt={`Şəkil ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {/* Write Review - only after completion */}
          {isCompleted && (
            <Button className="w-full" size="lg" asChild>
              <Link href={`/hesab/sifarisler/${order.id}/rey`}>
                <Star className="h-5 w-5 mr-2" />
                Rəy yazın
              </Link>
            </Button>
          )}

          {/* Contact Master - when master is assigned */}
          {master && !isCompleted && !isCancelled && (
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              asChild
            >
              <Link href={`/mesajlar?order=${order.id}`}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Usta ilə əlaqə
              </Link>
            </Button>
          )}

          {/* Report Issue */}
          {!isCancelled && (
            <Button 
              variant="ghost" 
              className="w-full text-gray-600" 
              size="lg"
              asChild
            >
              <Link href={`/destek?order=${order.id}`}>
                <FileWarning className="h-5 w-5 mr-2" />
                Problem bildir
              </Link>
            </Button>
          )}

          {/* Cancel Order */}
          {canCancel && !isCancelled && (
            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
              size="lg"
              onClick={() => setCancelModalOpen(true)}
            >
              <Ban className="h-5 w-5 mr-2" />
              Sifarişi ləğv et
            </Button>
          )}
        </motion.div>
      </main>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !cancelling && setCancelModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ban className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Sifarişi ləğv etmək istəyirsiniz?
                </h3>
                <p className="text-gray-600 mb-6">
                  Bu əməliyyatı geri qaytarmaq mümkün deyil. Əminsiniz?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCancelModalOpen(false)}
                    disabled={cancelling}
                  >
                    Xeyr
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Gözləyin...
                      </>
                    ) : (
                      "Bəli, ləğv et"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useState, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Briefcase,
  Loader2,
  Info,
  ChevronRight,
  Award,
  Shield,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn, formatPrice, formatDate, formatRelativeTime, formatDistance } from "@/lib/utils"
import toast from "react-hot-toast"

// Types
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
  bio: string | null
  experience: number
}

interface Application {
  id: string
  orderId: string
  masterId: string
  price: number
  message: string | null
  estimatedDuration: number | null
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
  rejectedReason: string | null
  createdAt: string
  master: Master
}

interface Order {
  id: string
  orderNumber: string
  title: string
  description: string
  status: string
  address: string
  district: string
  scheduledDate: string
  scheduledTime: string
  estimatedPrice: number | null
  urgency: string
  photos: string[]
  category: {
    id: string
    name: string
    icon: string | null
  }
  customer: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
  master: Master | null
  createdAt: string
}

// Status config
const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Gözləyir", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  ACCEPTED: { label: "Qəbul edildi", color: "text-blue-700", bgColor: "bg-blue-100" },
  IN_PROGRESS: { label: "İcra edilir", color: "text-purple-700", bgColor: "bg-purple-100" },
  COMPLETED: { label: "Tamamlandı", color: "text-green-700", bgColor: "bg-green-100" },
  CANCELLED: { label: "Ləğv edildi", color: "text-red-700", bgColor: "bg-red-100" },
}

const APPLICATION_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Gözləyir", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  ACCEPTED: { label: "Qəbul edildi", color: "text-green-700", bgColor: "bg-green-100" },
  REJECTED: { label: "Rədd edildi", color: "text-red-700", bgColor: "bg-red-100" },
  WITHDRAWN: { label: "Geri çəkildi", color: "text-gray-700", bgColor: "bg-gray-100" },
}

const URGENCY_CONFIG: Record<string, { label: string; color: string }> = {
  PLANNED: { label: "Planlı", color: "bg-gray-100 text-gray-700" },
  TODAY: { label: "Bu gün", color: "bg-orange-100 text-orange-700" },
  URGENT: { label: "Təcili", color: "bg-red-100 text-red-700" },
}

export default function CustomerOrderApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: orderId } = use(params)
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  // Auth check
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  // Fetch order and applications
  useEffect(() => {
    if (session && orderId) {
      fetchOrderAndApplications()
    }
  }, [session, orderId])

  const fetchOrderAndApplications = async () => {
    try {
      setIsLoading(true)
      
      // Fetch order details
      const orderRes = await fetch(`/api/orders/${orderId}`)
      if (!orderRes.ok) {
        if (orderRes.status === 404) {
          toast.error("Sifariş tapılmadı")
          router.push("/hesab")
          return
        }
        throw new Error("Sifariş yüklənmədi")
      }
      const orderData = await orderRes.json()
      setOrder(orderData.data || orderData.order)
      
      // Fetch applications for this order
      const appRes = await fetch(`/api/applications?orderId=${orderId}`)
      if (appRes.ok) {
        const appData = await appRes.json()
        setApplications(appData.data || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Məlumatlar yüklənmədi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (application: Application) => {
    if (isProcessing) return
    
    try {
      setIsProcessing(true)
      
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        toast.success("Usta qəbul edildi!")
        router.push(`/hesab/sifarisler`)
      } else {
        toast.error(data.message || "Xəta baş verdi")
      }
    } catch (error) {
      console.error("Error accepting application:", error)
      toast.error("Xəta baş verdi")
    } finally {
      setIsProcessing(false)
    }
  }

  const openRejectModal = (application: Application) => {
    setSelectedApplication(application)
    setRejectReason("")
    setRejectModalOpen(true)
  }

  const handleReject = async () => {
    if (!selectedApplication || isProcessing) return
    
    try {
      setIsProcessing(true)
      
      const res = await fetch(`/api/applications/${selectedApplication.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "REJECTED",
          rejectedReason: rejectReason.trim() || undefined,
        }),
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        toast.success("Müraciət rədd edildi")
        setRejectModalOpen(false)
        setSelectedApplication(null)
        fetchOrderAndApplications()
      } else {
        toast.error(data.message || "Xəta baş verdi")
      }
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast.error("Xəta baş verdi")
    } finally {
      setIsProcessing(false)
    }
  }

  // Loading state
  if (authStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sifariş tapılmadı</h2>
          <p className="text-gray-600 mb-4">Bu sifariş mövcud deyil və ya silinib.</p>
          <Button onClick={() => router.push("/hesab")}>
            Hesaba qayıt
          </Button>
        </div>
      </div>
    )
  }

  const orderStatus = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING
  const urgencyConfig = URGENCY_CONFIG[order.urgency] || URGENCY_CONFIG.PLANNED
  const pendingApplications = applications.filter(a => a.status === "PENDING")
  const acceptedApplication = applications.find(a => a.status === "ACCEPTED")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                Sifariş #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500">Müraciətlər və təfərrüatlar</p>
            </div>
            <Badge className={cn("shrink-0", orderStatus.bgColor, orderStatus.color)}>
              {orderStatus.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Order Details Card */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{order.title}</h2>
              <p className="text-gray-600 text-sm">{order.category.name}</p>
            </div>
            <Badge className={urgencyConfig.color}>
              {urgencyConfig.label}
            </Badge>
          </div>

          <p className="text-gray-700 mb-4">{order.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(order.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{order.scheduledTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{order.address}</span>
            </div>
          </div>

          {order.estimatedPrice && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Təxmini qiymət:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(order.estimatedPrice)}
                </span>
              </div>
            </div>
          )}

          {/* Order Photos */}
          {order.photos && order.photos.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Şəkillər:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {order.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Şəkil ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Accepted Master - Show if order has been accepted */}
        {order.status !== "PENDING" && (acceptedApplication || order.master) && (
          <Card className="p-6 border-green-200 bg-green-50/50">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Qəbul edilmiş usta</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <UserAvatar
                src={(acceptedApplication?.master || order.master)?.avatar || ""}
                name={`${(acceptedApplication?.master || order.master)?.firstName} ${(acceptedApplication?.master || order.master)?.lastName}`}
                size="lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {(acceptedApplication?.master || order.master)?.firstName}{" "}
                  {(acceptedApplication?.master || order.master)?.lastName}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{(acceptedApplication?.master || order.master)?.rating.toFixed(1)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{(acceptedApplication?.master || order.master)?.reviewCount} rəy</span>
                </div>
                {acceptedApplication && (
                  <p className="text-lg font-bold text-green-700 mt-1">
                    {formatPrice(acceptedApplication.price)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const phone = (acceptedApplication?.master || order.master)?.phone
                    if (phone) window.location.href = `tel:${phone}`
                  }}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Zəng
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/mesajlar?masterId=${(acceptedApplication?.master || order.master)?.id}`}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Mesaj
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Applications Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Usta müraciətləri
            </h3>
            {order.status === "PENDING" && (
              <Badge variant="outline">
                {pendingApplications.length} gözləyən müraciət
              </Badge>
            )}
          </div>

          {applications.length === 0 ? (
            // Empty state
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Hələ müraciət yoxdur
              </h4>
              <p className="text-gray-600 max-w-sm mx-auto">
                Ustalar sifarişinizi görüb müraciət etdikdə burada görünəcək. 
                Adətən ilk müraciətlər bir neçə saat ərzində gəlir.
              </p>
            </Card>
          ) : (
            // Applications list
            <div className="space-y-4">
              <AnimatePresence>
                {applications.map((application, index) => {
                  const appStatus = APPLICATION_STATUS_CONFIG[application.status]
                  const isPending = application.status === "PENDING"
                  
                  return (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        "p-5 transition-all",
                        isPending && "border-primary/20 hover:border-primary/40",
                        application.status === "ACCEPTED" && "border-green-200 bg-green-50/30",
                        application.status === "REJECTED" && "opacity-60"
                      )}>
                        {/* Master Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <Link href={`/usta/${application.master.id}`}>
                            <UserAvatar
                              src={application.master.avatar || ""}
                              name={`${application.master.firstName} ${application.master.lastName}`}
                              size="lg"
                            />
                          </Link>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link 
                                href={`/usta/${application.master.id}`}
                                className="font-semibold text-gray-900 hover:text-primary"
                              >
                                {application.master.firstName} {application.master.lastName}
                              </Link>
                              {application.master.isVerified && (
                                <span className="inline-flex items-center gap-0.5 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                  <Shield className="h-3 w-3" />
                                  Təsdiqlənmiş
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-medium">{application.master.rating.toFixed(1)}</span>
                                <span className="text-gray-400">({application.master.reviewCount})</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                <span>{application.master.completedJobs} iş</span>
                              </div>
                              {application.master.experience > 0 && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span>{application.master.experience} il təcrübə</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(application.price)}
                            </p>
                            {application.estimatedDuration && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                ~{application.estimatedDuration} saat
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Cover Letter */}
                        {application.message && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {application.message}
                            </p>
                          </div>
                        )}

                        {/* Status & Actions */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-3">
                            <Badge className={cn(appStatus.bgColor, appStatus.color)}>
                              {appStatus.label}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {formatRelativeTime(application.createdAt)}
                            </span>
                          </div>

                          {isPending && order.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openRejectModal(application)}
                                disabled={isProcessing}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rədd et
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAccept(application)}
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Qəbul et
                              </Button>
                            </div>
                          )}

                          {application.status === "REJECTED" && application.rejectedReason && (
                            <p className="text-sm text-gray-500 italic">
                              Səbəb: {application.rejectedReason}
                            </p>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Info Box */}
        {order.status === "PENDING" && pendingApplications.length > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Qərar vermək üçün vaxt ayırın</p>
                <p className="text-blue-700">
                  Ustaların rəylərini, reytinqlərini və təklif etdikləri qiymətləri 
                  müqayisə edin. Bir ustanı qəbul etdikdən sonra digər müraciətlər 
                  avtomatik rədd ediləcək.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Müraciəti rədd et</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <span>
                  {selectedApplication.master.firstName} {selectedApplication.master.lastName} - 
                  {" "}{formatPrice(selectedApplication.price)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              label="Səbəb (istəyə bağlı)"
              placeholder="Rədd etmə səbəbini yazın..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Səbəb ustaya göstəriləcək
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
              disabled={isProcessing}
            >
              Ləğv et
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Rədd et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  Filter,
  Plus,
  Users,
  Eye,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, formatPrice, formatDate, formatRelativeTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface Order {
  id: string
  orderNumber: string
  title: string
  description: string
  status: string
  address: string
  district: string | null
  scheduledDate: string
  scheduledTime: string
  estimatedPrice: number | null
  finalPrice: number | null
  urgency: string
  category: {
    name: string
  }
  master: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
    rating: number
  } | null
  _count?: {
    applications: number
  }
  createdAt: string
}

// Status configuration
const STATUS_CONFIG: Record<string, { 
  label: string
  color: string
  bgColor: string
  icon: typeof Clock
}> = {
  PENDING: { 
    label: "Gözləyir", 
    color: "text-yellow-700", 
    bgColor: "bg-yellow-100",
    icon: Clock 
  },
  ACCEPTED: { 
    label: "Qəbul edildi", 
    color: "text-blue-700", 
    bgColor: "bg-blue-100",
    icon: CheckCircle 
  },
  IN_PROGRESS: { 
    label: "İcra edilir", 
    color: "text-purple-700", 
    bgColor: "bg-purple-100",
    icon: AlertCircle 
  },
  COMPLETED: { 
    label: "Tamamlandı", 
    color: "text-green-700", 
    bgColor: "bg-green-100",
    icon: CheckCircle 
  },
  CANCELLED: { 
    label: "Ləğv edildi", 
    color: "text-red-700", 
    bgColor: "bg-red-100",
    icon: XCircle 
  },
}

const URGENCY_CONFIG: Record<string, { label: string; color: string }> = {
  PLANNED: { label: "Planlı", color: "bg-gray-100 text-gray-700" },
  TODAY: { label: "Bu gün", color: "bg-orange-100 text-orange-700" },
  URGENT: { label: "Təcili", color: "bg-red-100 text-red-700" },
}

export default function CustomerOrdersPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Auth check
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  // Fetch orders
  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session, filter])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      params.append("role", "customer")
      if (filter !== "all") {
        params.append("status", filter)
      }
      
      const res = await fetch(`/api/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || data.data || [])
      } else {
        toast.error("Sifarişlər yüklənmədi")
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Sifarişlər yüklənmədi")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter orders by search query
  const filteredOrders = orders.filter(order => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      order.title.toLowerCase().includes(query) ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.description.toLowerCase().includes(query)
    )
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/hesab")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Sifarişlərim</h1>
              <p className="text-sm text-gray-500">
                Bütün sifarişlərinizi izləyin
              </p>
            </div>
            <Button asChild>
              <Link href="/sifaris/yarat">
                <Plus className="h-4 w-4 mr-2" />
                Yeni sifariş
              </Link>
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Sifariş axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hamısı</SelectItem>
                <SelectItem value="PENDING">Gözləyən</SelectItem>
                <SelectItem value="ACCEPTED">Qəbul edilmiş</SelectItem>
                <SelectItem value="IN_PROGRESS">İcra olunan</SelectItem>
                <SelectItem value="COMPLETED">Tamamlanmış</SelectItem>
                <SelectItem value="CANCELLED">Ləğv edilmiş</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredOrders.length === 0 ? (
          // Empty state
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? "Nəticə tapılmadı" : "Hələ sifariş yoxdur"}
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-4">
              {searchQuery 
                ? "Axtarış kriteriyalarını dəyişdirin"
                : "İlk sifarişinizi verin və peşəkar ustaları tapın"}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/sifaris/yarat">
                  <Plus className="h-4 w-4 mr-2" />
                  Sifariş ver
                </Link>
              </Button>
            )}
          </Card>
        ) : (
          // Orders list
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
                const urgencyConfig = URGENCY_CONFIG[order.urgency] || URGENCY_CONFIG.PLANNED
                const StatusIcon = statusConfig.icon
                const isPending = order.status === "PENDING"
                const hasApplications = (order._count?.applications || 0) > 0
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/hesab/sifarisler/${order.id}`}>
                      <Card className={cn(
                        "p-4 transition-all hover:shadow-md cursor-pointer",
                        isPending && hasApplications && "border-primary/30 bg-primary/5"
                      )}>
                        <div className="flex items-start gap-4">
                          {/* Status Icon */}
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                            statusConfig.bgColor
                          )}>
                            <StatusIcon className={cn("h-6 w-6", statusConfig.color)} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {order.title}
                              </h3>
                              <Badge className={cn(statusConfig.bgColor, statusConfig.color)}>
                                {statusConfig.label}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {order.category.name} · #{order.orderNumber}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDate(order.scheduledDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{order.scheduledTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{order.district || order.address}</span>
                              </div>
                            </div>

                            {/* Master or Applications Info */}
                            <div className="mt-3 pt-3 border-t flex items-center justify-between">
                              {order.master ? (
                                <div className="flex items-center gap-2">
                                  <UserAvatar
                                    src={order.master.avatar || ""}
                                    name={`${order.master.firstName} ${order.master.lastName}`}
                                    size="sm"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    {order.master.firstName} {order.master.lastName}
                                  </span>
                                </div>
                              ) : isPending && hasApplications ? (
                                <div className="flex items-center gap-2 text-primary">
                                  <Users className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    {order._count?.applications} müraciət gözləyir
                                  </span>
                                </div>
                              ) : isPending ? (
                                <span className="text-sm text-gray-500">
                                  Ustalar axtarılır...
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  -
                                </span>
                              )}

                              <div className="flex items-center gap-2">
                                {order.finalPrice || order.estimatedPrice ? (
                                  <span className="font-semibold text-gray-900">
                                    {formatPrice(order.finalPrice || order.estimatedPrice!)}
                                  </span>
                                ) : null}
                                <Badge className={urgencyConfig.color}>
                                  {urgencyConfig.label}
                                </Badge>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Phone,
  MessageSquare,
  ChevronRight,
  Eye,
  Check,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

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
  estimatedPrice: number
  urgency: string
  customer: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
    user: {
      phone: string | null
    }
  }
  category: {
    name: string
  }
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Gözləyir", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  ACCEPTED: { label: "Qəbul edildi", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  IN_PROGRESS: { label: "İcra edilir", color: "bg-purple-100 text-purple-800", icon: AlertCircle },
  COMPLETED: { label: "Tamamlandı", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Ləğv edildi", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function MasterOrdersPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session, filter])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filter !== "all") params.append("status", filter)
      
      const res = await fetch(`/api/master/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Sifarişlər yüklənmədi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (orderId: string) => {
    try {
      const res = await fetch(`/api/master/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      })
      
      if (res.ok) {
        toast.success("Sifariş qəbul edildi")
        fetchOrders()
      } else {
        toast.error("Xəta baş verdi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const handleReject = async (orderId: string) => {
    try {
      const res = await fetch(`/api/master/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      })
      
      if (res.ok) {
        toast.success("Sifariş rədd edildi")
        fetchOrders()
      } else {
        toast.error("Xəta baş verdi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const handleComplete = async (orderId: string) => {
    try {
      const res = await fetch(`/api/master/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      })
      
      if (res.ok) {
        toast.success("Sifariş tamamlandı")
        fetchOrders()
      } else {
        toast.error("Xəta baş verdi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    return order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (authStatus === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/usta-panel">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Sifarişlərim</h1>
            <p className="text-gray-600">Bütün sifarişlərinizi idarə edin</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sifariş axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { value: "all", label: "Hamısı" },
              { value: "PENDING", label: "Gözləyən" },
              { value: "ACCEPTED", label: "Qəbul edilən" },
              { value: "IN_PROGRESS", label: "İcra edilən" },
              { value: "COMPLETED", label: "Tamamlanan" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sifariş tapılmadı</h3>
            <p className="text-gray-600">Hələ heç bir sifariş yoxdur</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
              const StatusIcon = statusConfig.icon

              return (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{order.title}</h3>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            {order.urgency === "URGENT" && (
                              <Badge variant="error">Təcili</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{order.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {order.district || order.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.scheduledDate).toLocaleDateString("az-AZ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {order.scheduledTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Customer Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {order.customer.avatar ? (
                                <img src={order.customer.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <span className="text-sm font-medium text-gray-600">
                                  {order.customer.firstName[0]}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.customer.firstName} {order.customer.lastName}
                              </p>
                              {order.customer.user?.phone && (
                                <p className="text-sm text-gray-500">{order.customer.user.phone}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {order.estimatedPrice ? `${order.estimatedPrice} ₼` : "Razılaşma ilə"}
                            </p>
                            <p className="text-xs text-gray-500">#{order.orderNumber.slice(-6)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-40">
                      {order.status === "PENDING" && (
                        <>
                          <Button onClick={() => handleAccept(order.id)} size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Qəbul et
                          </Button>
                          <Button onClick={() => handleReject(order.id)} variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Rədd et
                          </Button>
                        </>
                      )}
                      {order.status === "ACCEPTED" && (
                        <Button onClick={() => handleComplete(order.id)} size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Başla
                        </Button>
                      )}
                      {order.status === "IN_PROGRESS" && (
                        <Button onClick={() => handleComplete(order.id)} size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Tamamla
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/mesajlar?customer=${order.customer.id}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Mesaj
                        </Link>
                      </Button>
                      {order.customer.user?.phone && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`tel:${order.customer.user.phone}`}>
                            <Phone className="h-4 w-4 mr-1" />
                            Zəng et
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

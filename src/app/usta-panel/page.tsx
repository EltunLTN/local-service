"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import {
  Home,
  FileText,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  User,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Eye,
  Phone,
  Check,
  X,
  AlertCircle,
  Wallet,
  Award,
} from "lucide-react"
import { cn, formatRelativeTime, formatDistance } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, MotionCard } from "@/components/ui/card"
import { Badge, VerifiedBadge, InsuredBadge, PremiumBadge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { SimpleRating } from "@/components/ui/rating"
import { ORDER_STATUSES } from "@/lib/constants"

// Sidebar navigation
const SIDEBAR_ITEMS: { id: string; label: string; icon: any; href: string; badge?: number }[] = [
  { id: "overview", label: "İcmal", icon: Home, href: "/usta-panel" },
  { id: "jobs", label: "Mövcud işlər", icon: Briefcase, href: "/usta-panel/isler" },
  { id: "orders", label: "Sifarişlər", icon: FileText, href: "/usta-panel/sifarisler" },
  { id: "calendar", label: "Təqvim", icon: Calendar, href: "/usta-panel/teqvim" },
  { id: "messages", label: "Mesajlar", icon: MessageSquare, href: "/usta-panel/mesajlar" },
  { id: "earnings", label: "Gəlirlər", icon: DollarSign, href: "/usta-panel/gelirler" },
  { id: "analytics", label: "Analitika", icon: BarChart3, href: "/usta-panel/analitika" },
  { id: "profile", label: "Profil", icon: User, href: "/usta-panel/profil" },
  { id: "settings", label: "Tənzimləmələr", icon: Settings, href: "/usta-panel/tenzimlemeler" },
]

// Stat Card komponenti
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  change,
  changeType = "increase",
}: {
  icon: React.ElementType
  label: string
  value: number | string
  suffix?: string
  change?: number
  changeType?: "increase" | "decrease"
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}
            {suffix}
          </p>
          {change !== undefined && (
            <p
              className={cn(
                "text-xs flex items-center gap-1 mt-1",
                changeType === "increase" ? "text-green-600" : "text-red-600"
              )}
            >
              {changeType === "increase" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {changeType === "increase" ? "+" : "-"}
              {change}% bu ay
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}

// Pending Order Card
function PendingOrderCard({
  order,
  onAccept,
  onReject,
}: {
  order: any
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <MotionCard className="p-5">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar name={order.customer.name} src={order.customer.avatar} size="md" />
            <div>
              <h3 className="font-semibold text-gray-900">{order.customer.name}</h3>
              <p className="text-sm text-gray-500">{order.customer.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-gray-900">{order.price}₼</p>
            <p className="text-xs text-gray-500">
              {formatRelativeTime(new Date(order.createdAt))}
            </p>
          </div>
        </div>

        {/* Service Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{order.service}</h4>
            {order.urgency === "urgent" && (
              <Badge variant="error" size="sm">
                Təcili
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{order.description}</p>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(order.date).toLocaleDateString("az-AZ")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {order.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {order.address}
          </span>
          <span className="flex items-center gap-1">
            🚗 {formatDistance(order.distance)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onReject}>
            <X className="mr-2 h-4 w-4" />
            Rədd et
          </Button>
          <Button className="flex-1" onClick={onAccept}>
            <Check className="mr-2 h-4 w-4" />
            Qəbul et
          </Button>
        </div>
      </div>
    </MotionCard>
  )
}

// Schedule Item
function ScheduleItem({ order }: { order: any }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
      <div
        className={cn(
          "w-2 h-12 rounded-full",
          order.status === "completed" && "bg-green-500",
          order.status === "in_progress" && "bg-blue-500",
          order.status === "upcoming" && "bg-gray-300"
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{order.service}</p>
        <p className="text-sm text-gray-500">{order.customer.name}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">{order.time}</p>
        <Badge
          size="sm"
          variant={
            order.status === "completed"
              ? "success"
              : order.status === "in_progress"
              ? "default"
              : "secondary"
          }
        >
          {order.status === "completed" && "Bitdi"}
          {order.status === "in_progress" && "Davam edir"}
          {order.status === "upcoming" && "Gözləyir"}
        </Badge>
      </div>
    </div>
  )
}

// Sidebar
function Sidebar({
  activeItem,
  setActiveItem,
  masterStats,
  userName,
}: {
  activeItem: string
  setActiveItem: (id: string) => void
  masterStats: any
  userName: string
}) {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <Card className="sticky top-24 p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <UserAvatar name={userName} size="lg" />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-gray-900">{userName}</h3>
              <VerifiedBadge size="sm" />
            </div>
            <p className="text-sm text-gray-500">Usta</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 pb-4 border-b">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{masterStats.rating}</p>
            <p className="text-xs text-gray-500">Reytinq</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {masterStats.totalOrders}
            </p>
            <p className="text-xs text-gray-500">İş sayı</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                activeItem === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Upgrade CTA */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-orange-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-semibold text-gray-900">Premium ol</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Daha çox sifariş al, daha çox qazan
          </p>
          <Button size="sm" className="w-full">
            Yüksəlt
          </Button>
        </div>
      </Card>
    </aside>
  )
}

// Mobile Nav
function MobileNav({ activeItem }: { activeItem: string }) {
  return (
    <div className="lg:hidden overflow-x-auto mb-6">
      <div className="flex gap-2 pb-2">
        {SIDEBAR_ITEMS.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors",
              activeItem === item.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            {item.badge && (
              <span className="w-4 h-4 rounded-full bg-white text-primary text-xs flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function MasterDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("overview")
  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [todaySchedule, setTodaySchedule] = useState<any[]>([])
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [masterStats, setMasterStats] = useState({
    totalEarnings: 0, thisMonthEarnings: 0, earningsChange: 0,
    totalOrders: 0, thisMonthOrders: 0, ordersChange: 0,
    rating: 0, ratingChange: 0, reviewCount: 0,
    profileViews: 0, viewsChange: 0, responseRate: 0, completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris")
    }
  }, [status, router])

  // Fetch data
  useEffect(() => {
    if (status !== "authenticated") return
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/master/stats").then(r => r.json()).catch(() => ({ data: {} })),
          fetch("/api/master/orders").then(r => r.json()).catch(() => ({ data: [] })),
        ])

        const s = statsRes.data || {}
        setMasterStats({
          totalEarnings: s.totalEarnings || 0,
          thisMonthEarnings: s.thisMonthEarnings || 0,
          earningsChange: s.earningsChange || 0,
          totalOrders: s.totalOrders || 0,
          thisMonthOrders: s.thisMonthOrders || 0,
          ordersChange: s.ordersChange || 0,
          rating: s.rating || 0,
          ratingChange: s.ratingChange || 0,
          reviewCount: s.reviewCount || 0,
          profileViews: s.profileViews || 0,
          viewsChange: s.viewsChange || 0,
          responseRate: s.responseRate || 0,
          completionRate: s.completionRate || 0,
        })

        const allOrders = ordersRes.data || []
        setPendingOrders(allOrders.filter((o: any) => o.status === "PENDING"))
        setTodaySchedule(allOrders.filter((o: any) => {
          const today = new Date().toDateString()
          return o.scheduledDate && new Date(o.scheduledDate).toDateString() === today
        }))
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [status])

  const handleAccept = async (orderId: string) => {
    try {
      await fetch(`/api/master/orders/${orderId}/accept`, { method: "POST" })
      setPendingOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch {}
  }

  const handleReject = async (orderId: string) => {
    try {
      await fetch(`/api/master/orders/${orderId}/cancel`, { method: "POST" })
      setPendingOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch {}
  }

  // Show loading while checking session
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Mobile Nav */}
        <MobileNav activeItem={activeItem} />

        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} masterStats={masterStats} userName={session?.user?.name || "Usta"} />

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Salam, {session.user?.name || "Usta"}! 👋
                </h1>
                <p className="text-gray-600">Usta panelinizə xoş gəlmisiniz</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-700">Onlayn</span>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/usta-panel/profil">
                    <Settings className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </Button>
              </div>
            </div>

            {/* Earnings Alert */}
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-orange-500/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bu aykı gəliriniz</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {masterStats.thisMonthEarnings}₼
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/usta-panel/gelirler">
                    Ətraflı
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={DollarSign}
                label="Ümumi gəlir"
                value={masterStats.totalEarnings}
                suffix="₼"
              />
              <StatCard
                icon={Briefcase}
                label="Bu ay sifarişlər"
                value={masterStats.thisMonthOrders}
                change={masterStats.ordersChange}
              />
              <StatCard
                icon={Eye}
                label="Profil baxışları"
                value={masterStats.profileViews}
                change={masterStats.viewsChange}
              />
              <StatCard
                icon={Star}
                label="Reytinq"
                value={masterStats.rating}
                change={masterStats.ratingChange * 100}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pending Orders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Yeni sifarişlər
                    {pendingOrders.length > 0 && (
                      <span className="ml-2 w-6 h-6 inline-flex items-center justify-center rounded-full bg-primary text-white text-sm">
                        {pendingOrders.length}
                      </span>
                    )}
                  </h2>
                  <Link
                    href="/usta-panel/sifarisler"
                    className="text-primary text-sm hover:underline"
                  >
                    Hamısı
                  </Link>
                </div>

                {pendingOrders.length > 0 ? (
                  <div className="space-y-4">
                    {pendingOrders.slice(0, 2).map((order) => (
                      <PendingOrderCard
                        key={order.id}
                        order={order}
                        onAccept={() => handleAccept(order.id)}
                        onReject={() => handleReject(order.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Yeni sifariş yoxdur
                    </h3>
                    <p className="text-gray-500">
                      Yeni sifarişlər gəldikdə burada görünəcək
                    </p>
                  </Card>
                )}
              </div>

              {/* Today's Schedule */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Bugünkü cədvəl
                  </h2>
                  <Link
                    href="/usta-panel/teqvim"
                    className="text-primary text-sm hover:underline"
                  >
                    Təqvim
                  </Link>
                </div>

                <Card className="p-4">
                  <div className="space-y-3">
                    {todaySchedule.length > 0 ? todaySchedule.map((order: any) => (
                      <ScheduleItem key={order.id} order={order} />
                    )) : <p className="text-sm text-gray-500 text-center py-4">Bugün üçün iş yoxdur</p>}
                  </div>
                </Card>
              </div>
            </div>

            {/* Recent Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Son rəylər</h2>
                <Link
                  href="/usta-panel/profil#reviews"
                  className="text-primary text-sm hover:underline"
                >
                  Hamısını gör
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {recentReviews.map((review: any) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        name={review.customer.name}
                        src={review.customer.avatar}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {review.customer.name}
                          </h4>
                          <SimpleRating value={review.rating} size="sm" />
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {review.comment}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {review.service} •{" "}
                          {formatRelativeTime(new Date(review.date))}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Performans göstəriciləri</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Cavab faizi</span>
                    <span className="text-sm font-bold text-gray-900">
                      {masterStats.responseRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${masterStats.responseRate}%` }}
                      className="h-full bg-green-500 rounded-full"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tamamlama faizi</span>
                    <span className="text-sm font-bold text-gray-900">
                      {masterStats.completionRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${masterStats.completionRate}%` }}
                      className="h-full bg-blue-500 rounded-full"
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Müştəri razılığı</span>
                    <span className="text-sm font-bold text-gray-900">99%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "99%" }}
                      className="h-full bg-primary rounded-full"
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Vaxtında gəlmə</span>
                    <span className="text-sm font-bold text-gray-900">96%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "96%" }}
                      className="h-full bg-orange-500 rounded-full"
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

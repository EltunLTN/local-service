"use client"

import React, { useState } from "react"
import Link from "next/link"
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
const SIDEBAR_ITEMS = [
  { id: "overview", label: "İcmal", icon: Home, href: "/usta-panel" },
  { id: "orders", label: "Sifarişlər", icon: FileText, href: "/usta-panel/sifarisler", badge: 5 },
  { id: "calendar", label: "Təqvim", icon: Calendar, href: "/usta-panel/teqvim" },
  { id: "messages", label: "Mesajlar", icon: MessageSquare, href: "/usta-panel/mesajlar", badge: 8 },
  { id: "earnings", label: "Gəlirlər", icon: DollarSign, href: "/usta-panel/gelirler" },
  { id: "analytics", label: "Analitika", icon: BarChart3, href: "/usta-panel/analitika" },
  { id: "profile", label: "Profil", icon: User, href: "/usta-panel/profil" },
  { id: "settings", label: "Tənzimləmələr", icon: Settings, href: "/usta-panel/tenzimlemeler" },
]

// Demo statistika
const DEMO_STATS = {
  totalEarnings: 2450,
  thisMonthEarnings: 680,
  earningsChange: 15,
  totalOrders: 150,
  thisMonthOrders: 18,
  ordersChange: 8,
  rating: 4.9,
  ratingChange: 0.1,
  reviewCount: 127,
  profileViews: 342,
  viewsChange: 23,
  responseRate: 98,
  completionRate: 96,
}

// Demo gözləyən sifarişlər
const DEMO_PENDING_ORDERS = [
  {
    id: "UB789456",
    service: "Elektrik sistemi yoxlanışı",
    customer: {
      name: "Kamran Əliyev",
      avatar: "",
      phone: "+994 50 111 22 33",
    },
    date: "2024-01-21",
    time: "09:00 - 12:00",
    address: "Yasamal, Nizami küç. 45",
    distance: 2300,
    price: 40,
    urgency: "normal",
    description: "Mənzildə elektrik sistemi yoxlanmalıdır. Bəzi rozetkalar işləmir.",
    createdAt: "2024-01-20T08:30:00",
  },
  {
    id: "UB789457",
    service: "LED işıqlandırma",
    customer: {
      name: "Leyla Həsənova",
      avatar: "",
      phone: "+994 51 222 33 44",
    },
    date: "2024-01-21",
    time: "15:00 - 18:00",
    address: "Nəsimi, Təbriz küç. 12",
    distance: 4500,
    price: 55,
    urgency: "urgent",
    description: "Ofis üçün LED panel işıqlandırma quraşdırılması. 6 ədəd panel.",
    createdAt: "2024-01-20T10:15:00",
  },
  {
    id: "UB789458",
    service: "Kabel çəkilməsi",
    customer: {
      name: "Orxan Məmmədov",
      avatar: "",
      phone: "+994 55 333 44 55",
    },
    date: "2024-01-22",
    time: "09:00 - 12:00",
    address: "Xətai, Babək pr. 78",
    distance: 6200,
    price: 80,
    urgency: "normal",
    description: "Yeni mənzildə tam kabel çəkilməsi işləri.",
    createdAt: "2024-01-20T14:45:00",
  },
]

// Demo bugünkü işlər
const DEMO_TODAY_SCHEDULE = [
  {
    id: "UB789450",
    service: "Rozetka quraşdırılması",
    customer: {
      name: "Anar Qurbanov",
      avatar: "",
    },
    time: "09:00 - 10:30",
    address: "Yasamal, Şərifzadə küç. 22",
    status: "completed",
    price: 30,
  },
  {
    id: "UB789451",
    service: "Lüstr quraşdırılması",
    customer: {
      name: "Nigar Əhmədova",
      avatar: "",
    },
    time: "11:00 - 12:30",
    address: "Səbail, İstiqlaliyyət küç. 15",
    status: "in_progress",
    price: 25,
  },
  {
    id: "UB789452",
    service: "Elektrik paneli təmiri",
    customer: {
      name: "Fərid İsmayılov",
      avatar: "",
    },
    time: "14:00 - 16:00",
    address: "Nərimanov, Atatürk pr. 45",
    status: "upcoming",
    price: 80,
  },
]

// Demo son rəylər
const DEMO_RECENT_REVIEWS = [
  {
    id: "1",
    customer: { name: "Rəşad Əliyev", avatar: "" },
    rating: 5,
    comment: "Əla usta! İşini çox peşəkar şəkildə gördü.",
    service: "Elektrik sistemi yoxlanışı",
    date: "2024-01-18",
  },
  {
    id: "2",
    customer: { name: "Aynur Hüseynova", avatar: "" },
    rating: 5,
    comment: "Çox səliqəli və etibarlı insandır.",
    service: "Kabel çəkilməsi",
    date: "2024-01-15",
  },
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
  order: (typeof DEMO_PENDING_ORDERS)[0]
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
function ScheduleItem({ order }: { order: (typeof DEMO_TODAY_SCHEDULE)[0] }) {
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
}: {
  activeItem: string
  setActiveItem: (id: string) => void
}) {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <Card className="sticky top-24 p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <UserAvatar name="Əli Məmmədov" size="lg" />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-gray-900">Əli Məmmədov</h3>
              <VerifiedBadge size="sm" />
            </div>
            <p className="text-sm text-gray-500">Elektrik ustası</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 pb-4 border-b">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{DEMO_STATS.rating}</p>
            <p className="text-xs text-gray-500">Reytinq</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {DEMO_STATS.totalOrders}
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
  const [activeItem, setActiveItem] = useState("overview")
  const [pendingOrders, setPendingOrders] = useState(DEMO_PENDING_ORDERS)

  const handleAccept = (orderId: string) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId))
    // Show success toast
  }

  const handleReject = (orderId: string) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId))
    // Show info toast
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Mobile Nav */}
        <MobileNav activeItem={activeItem} />

        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Salam, Əli! 👋
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
                      {DEMO_STATS.thisMonthEarnings}₼
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
                value={DEMO_STATS.totalEarnings}
                suffix="₼"
              />
              <StatCard
                icon={Briefcase}
                label="Bu ay sifarişlər"
                value={DEMO_STATS.thisMonthOrders}
                change={DEMO_STATS.ordersChange}
              />
              <StatCard
                icon={Eye}
                label="Profil baxışları"
                value={DEMO_STATS.profileViews}
                change={DEMO_STATS.viewsChange}
              />
              <StatCard
                icon={Star}
                label="Reytinq"
                value={DEMO_STATS.rating}
                change={DEMO_STATS.ratingChange * 100}
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
                    {DEMO_TODAY_SCHEDULE.map((order) => (
                      <ScheduleItem key={order.id} order={order} />
                    ))}
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
                {DEMO_RECENT_REVIEWS.map((review) => (
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
                      {DEMO_STATS.responseRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${DEMO_STATS.responseRate}%` }}
                      className="h-full bg-green-500 rounded-full"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tamamlama faizi</span>
                    <span className="text-sm font-bold text-gray-900">
                      {DEMO_STATS.completionRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${DEMO_STATS.completionRate}%` }}
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

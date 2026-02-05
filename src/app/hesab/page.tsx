"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Home,
  FileText,
  MessageSquare,
  Heart,
  Settings,
  Bell,
  User,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Calendar,
  Search,
  Plus,
  MoreVertical,
  Phone,
  ExternalLink,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, MotionCard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { SimpleRating } from "@/components/ui/rating"
import { Input } from "@/components/ui/input"
import { ORDER_STATUSES } from "@/lib/constants"
import { formatRelativeTime } from "@/lib/utils"

// Sidebar navigation
const SIDEBAR_ITEMS = [
  { id: "overview", label: "İcmal", icon: Home, href: "/hesab" },
  { id: "orders", label: "Sifarişlərim", icon: FileText, href: "/hesab/sifarisler" },
  { id: "messages", label: "Mesajlar", icon: MessageSquare, href: "/hesab/mesajlar", badge: 3 },
  { id: "favorites", label: "Sevimlilər", icon: Heart, href: "/hesab/sevimliler" },
  { id: "notifications", label: "Bildirişlər", icon: Bell, href: "/hesab/bildirisler" },
  { id: "settings", label: "Tənzimləmələr", icon: Settings, href: "/hesab/tenzimlemeler" },
]

// Demo sifarişlər
const DEMO_ORDERS = [
  {
    id: "UB123456",
    service: "Elektrik sistemi yoxlanışı",
    master: {
      id: "1",
      name: "Əli Məmmədov",
      avatar: "",
      rating: 4.9,
    },
    status: "in_progress",
    date: "2024-01-20",
    time: "09:00 - 12:00",
    price: 40,
    address: "Yasamal, Bakı",
    createdAt: "2024-01-18T10:30:00",
  },
  {
    id: "UB123455",
    service: "Kondisioner təmizliyi",
    master: {
      id: "4",
      name: "Tural Quliyev",
      avatar: "",
      rating: 4.9,
    },
    status: "pending",
    date: "2024-01-22",
    time: "15:00 - 18:00",
    price: 40,
    address: "Nəsimi, Bakı",
    createdAt: "2024-01-18T14:20:00",
  },
  {
    id: "UB123454",
    service: "Kran təmiri",
    master: {
      id: "2",
      name: "Vüqar Həsənov",
      avatar: "",
      rating: 5.0,
    },
    status: "completed",
    date: "2024-01-15",
    time: "12:00 - 15:00",
    price: 25,
    address: "Xətai, Bakı",
    createdAt: "2024-01-14T09:15:00",
    review: {
      rating: 5,
      comment: "Əla iş gördü!",
    },
  },
  {
    id: "UB123453",
    service: "LED işıqlandırma",
    master: {
      id: "1",
      name: "Əli Məmmədov",
      avatar: "",
      rating: 4.9,
    },
    status: "completed",
    date: "2024-01-10",
    time: "09:00 - 12:00",
    price: 55,
    address: "Yasamal, Bakı",
    createdAt: "2024-01-09T11:00:00",
  },
  {
    id: "UB123452",
    service: "Ev təmizliyi",
    master: {
      id: "6",
      name: "Elşən Nəsirov",
      avatar: "",
      rating: 4.6,
    },
    status: "cancelled",
    date: "2024-01-08",
    time: "09:00 - 12:00",
    price: 50,
    address: "Binəqədi, Bakı",
    createdAt: "2024-01-07T16:45:00",
    cancelReason: "Usta müraciət etmədi",
  },
]

// Demo statistika
const DEMO_STATS = {
  totalOrders: 12,
  completedOrders: 8,
  pendingOrders: 2,
  totalSpent: 450,
}

// Demo sevimli ustalar
const DEMO_FAVORITES = [
  {
    id: "1",
    name: "Əli Məmmədov",
    category: "Elektrik",
    rating: 4.9,
    reviewCount: 127,
    isOnline: true,
  },
  {
    id: "2",
    name: "Vüqar Həsənov",
    category: "Santexnik",
    rating: 5.0,
    reviewCount: 89,
    isOnline: false,
  },
]

// Order Card komponenti
function OrderCard({ order }: { order: (typeof DEMO_ORDERS)[0] }) {
  const status = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]

  return (
    <MotionCard className="p-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Master Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <UserAvatar name={order.master.name} src={order.master.avatar} size="md" />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{order.service}</h3>
            <p className="text-sm text-gray-500">{order.master.name}</p>
          </div>
        </div>

        {/* Order Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="h-4 w-4" />
            {new Date(order.date).toLocaleDateString("az-AZ")}
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            {order.time}
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            {order.address}
          </div>
        </div>

        {/* Status & Price */}
        <div className="flex items-center gap-4">
          <Badge
            variant={
              order.status === "completed"
                ? "success"
                : order.status === "cancelled"
                ? "error"
                : order.status === "pending"
                ? "warning"
                : "default"
            }
          >
            {status.label}
          </Badge>
          <span className="font-bold text-gray-900">{order.price}₼</span>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/hesab/sifarisler/${order.id}`}>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Review prompt */}
      {order.status === "completed" && !order.review && (
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">Bu xidməti qiymətləndirin</p>
          <Button size="sm" variant="outline">
            <Star className="mr-2 h-4 w-4" />
            Rəy yaz
          </Button>
        </div>
      )}

      {/* Show review if exists */}
      {order.review && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <SimpleRating value={order.review.rating} size="sm" />
            <span className="text-sm text-gray-600">{order.review.comment}</span>
          </div>
        </div>
      )}
    </MotionCard>
  )
}

// Stat Card
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  trend,
}: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  trend?: number
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
          {trend && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />+{trend}% bu ay
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

// Sidebar komponenti
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
          <UserAvatar name="Rəşad Əliyev" size="lg" />
          <div>
            <h3 className="font-semibold text-gray-900">Rəşad Əliyev</h3>
            <p className="text-sm text-gray-500">Müştəri hesabı</p>
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
      </Card>
    </aside>
  )
}

// Mobile Navigation
function MobileNav({ activeItem }: { activeItem: string }) {
  return (
    <div className="lg:hidden overflow-x-auto mb-6">
      <div className="flex gap-2 pb-2">
        {SIDEBAR_ITEMS.map((item) => (
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

export default function CustomerDashboard() {
  const [activeItem, setActiveItem] = useState("overview")
  const [orderFilter, setOrderFilter] = useState("all")

  // Filter orders
  const filteredOrders = DEMO_ORDERS.filter((order) => {
    if (orderFilter === "all") return true
    return order.status === orderFilter
  })

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
                  Xoş gəlmisiniz, Rəşad! 👋
                </h1>
                <p className="text-gray-600">Hesab icmalınız</p>
              </div>
              <Button asChild>
                <Link href="/sifaris/yarat">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni sifariş
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={FileText}
                label="Ümumi sifarişlər"
                value={DEMO_STATS.totalOrders}
              />
              <StatCard
                icon={CheckCircle}
                label="Tamamlanmış"
                value={DEMO_STATS.completedOrders}
                trend={12}
              />
              <StatCard
                icon={Clock}
                label="Gözləyən"
                value={DEMO_STATS.pendingOrders}
              />
              <StatCard
                icon={Star}
                label="Ümumi xərc"
                value={DEMO_STATS.totalSpent}
                suffix="₼"
              />
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Son sifarişlər</h2>
                <Link
                  href="/hesab/sifarisler"
                  className="text-primary text-sm hover:underline"
                >
                  Hamısını gör
                </Link>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[
                  { value: "all", label: "Hamısı" },
                  { value: "pending", label: "Gözləyən" },
                  { value: "in_progress", label: "İcra olunur" },
                  { value: "completed", label: "Tamamlanmış" },
                  { value: "cancelled", label: "Ləğv edilmiş" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setOrderFilter(filter.value)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
                      orderFilter === filter.value
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 border hover:bg-gray-50"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Sifariş tapılmadı
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Bu kateqoriyada sifariş yoxdur
                    </p>
                    <Button asChild>
                      <Link href="/sifaris/yarat">Sifariş yarat</Link>
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            {/* Favorite Masters */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Sevimli ustalar</h2>
                <Link
                  href="/hesab/sevimliler"
                  className="text-primary text-sm hover:underline"
                >
                  Hamısını gör
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {DEMO_FAVORITES.map((master) => (
                  <MotionCard key={master.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        name={master.name}
                        size="lg"
                        isOnline={master.isOnline}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {master.name}
                        </h3>
                        <p className="text-sm text-gray-500">{master.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <SimpleRating value={master.rating} size="sm" />
                          <span className="text-xs text-gray-500">
                            ({master.reviewCount})
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/usta/${master.id}`}>Profil</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/sifaris/yarat?usta=${master.id}`}>
                            Sifariş
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </MotionCard>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sürətli əməliyyatlar</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/xidmetler"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-gray-700">Usta axtar</span>
                </Link>
                <Link
                  href="/sifaris/yarat"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Sifariş yarat</span>
                </Link>
                <Link
                  href="/hesab/mesajlar"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">Mesajlar</span>
                </Link>
                <Link
                  href="/destek"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">Dəstək</span>
                </Link>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

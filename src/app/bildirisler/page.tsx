"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  MessageSquare,
  Star,
  Package,
  Wallet,
  AlertCircle,
  Trash2,
  Settings,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

// Types
interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  readAt?: string
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Notification type to icon mapping
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "ORDER_NEW":
      return { icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600" }
    case "ORDER_ACCEPTED":
      return { icon: Check, iconBg: "bg-green-100", iconColor: "text-green-600" }
    case "ORDER_STARTED":
      return { icon: Package, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" }
    case "ORDER_COMPLETED":
      return { icon: CheckCheck, iconBg: "bg-green-100", iconColor: "text-green-600" }
    case "ORDER_CANCELLED":
      return { icon: X, iconBg: "bg-red-100", iconColor: "text-red-600" }
    case "REVIEW_NEW":
      return { icon: Star, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" }
    case "MESSAGE_NEW":
      return { icon: MessageSquare, iconBg: "bg-blue-100", iconColor: "text-blue-600" }
    case "PAYMENT_RECEIVED":
      return { icon: Wallet, iconBg: "bg-purple-100", iconColor: "text-purple-600" }
    case "SYSTEM":
    default:
      return { icon: Bell, iconBg: "bg-gray-100", iconColor: "text-gray-600" }
  }
}

// Get notification link based on type and data
const getNotificationLink = (notification: Notification): string => {
  const data = notification.data as Record<string, string> | undefined
  
  switch (notification.type) {
    case "ORDER_NEW":
    case "ORDER_ACCEPTED":
    case "ORDER_STARTED":
    case "ORDER_COMPLETED":
    case "ORDER_CANCELLED":
      return data?.orderId ? `/hesab?tab=orders&id=${data.orderId}` : "/hesab"
    case "MESSAGE_NEW":
      return "/mesajlar"
    case "REVIEW_NEW":
      return "/hesab"
    case "PAYMENT_RECEIVED":
      return "/hesab"
    case "SYSTEM":
    default:
      return "/hesab"
  }
}

// Format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "İndi"
  if (diffMin < 60) return `${diffMin} dəq əvvəl`
  if (diffHour < 24) return `${diffHour} saat əvvəl`
  if (diffDay === 1) return "Dünən"
  if (diffDay < 7) return `${diffDay} gün əvvəl`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} həftə əvvəl`
  return `${Math.floor(diffDay / 30)} ay əvvəl`
}

// Get filter category for notification type
const getNotificationCategory = (type: string): string => {
  if (type.startsWith("ORDER_")) return "order"
  if (type === "MESSAGE_NEW") return "message"
  return "other"
}

const filterTabs = [
  { id: "all", label: "Hamısı" },
  { id: "unread", label: "Oxunmamış" },
  { id: "order", label: "Sifarişlər" },
  { id: "message", label: "Mesajlar" },
]

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [activeFilter, setActiveFilter] = useState("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris")
    }
  }, [status, router])

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)

      const response = await fetch(`/api/notifications?page=${page}&limit=20`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Bildirişlər yüklənə bilmədi")
      }

      if (append) {
        setNotifications((prev) => [...prev, ...result.data])
      } else {
        setNotifications(result.data)
      }
      setPagination(result.pagination)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xəta baş verdi")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    if (status === "authenticated") {
      fetchNotifications()
    }
  }, [status, fetchNotifications])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return !notification.isRead
    return getNotificationCategory(notification.type) === activeFilter
  })

  // Mark single as read
  const handleMarkAsRead = async (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    if (!notification || notification.isRead) return

    setActionInProgress(id)
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message)
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xəta baş verdi")
    } finally {
      setActionInProgress(null)
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return

    setIsMarkingAllRead(true)
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message)
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success("Bütün bildirişlər oxunmuş kimi işarələndi")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xəta baş verdi")
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  // Delete single notification
  const handleDelete = async (id: string) => {
    setActionInProgress(id)
    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message)
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast.success("Bildiriş silindi")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xəta baş verdi")
    } finally {
      setActionInProgress(null)
    }
  }

  // Delete all notifications
  const handleClearAll = async () => {
    if (notifications.length === 0) return

    setIsDeletingAll(true)
    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteAll: true }),
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message)
      }

      setNotifications([])
      setPagination(null)
      toast.success("Bütün bildirişlər silindi")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xəta baş verdi")
    } finally {
      setIsDeletingAll(false)
    }
  }

  // Load more
  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      fetchNotifications(pagination.page + 1, true)
    }
  }

  // Loading state while checking session
  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Yüklənir...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - will redirect
  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bildirişlər</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount} oxunmamış bildiriş
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead}
              >
                {isMarkingAllRead ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4 mr-2" />
                )}
                Hamısını oxunmuş et
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/tenzimlemeler">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Card className="p-1 mb-6">
          <div className="flex gap-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeFilter === tab.id
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {tab.label}
                {tab.id === "unread" && unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Notification List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const { icon: Icon, iconBg, iconColor } = getNotificationIcon(notification.type)
                const link = getNotificationLink(notification)
                const isActionInProgress = actionInProgress === notification.id

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={cn(
                        "p-4 hover:shadow-md transition-shadow",
                        !notification.isRead && "bg-primary/5 border-primary/20"
                      )}
                    >
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                            iconBg
                          )}
                        >
                          <Icon className={cn("h-6 w-6", iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={link}
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="block group"
                            >
                              <h3 className="font-medium text-gray-900 group-hover:text-primary">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                            </Link>
                            <button
                              onClick={() => handleDelete(notification.id)}
                              disabled={isActionInProgress}
                              className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors disabled:opacity-50"
                            >
                              {isActionInProgress ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={isActionInProgress}
                                className="text-xs text-primary hover:underline disabled:opacity-50"
                              >
                                Oxunmuş et
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Bildiriş yoxdur
                </h3>
                <p className="text-sm text-gray-500">
                  {activeFilter === "all"
                    ? "Hələ heç bir bildirişiniz yoxdur"
                    : "Bu filtrdə bildiriş tapılmadı"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {pagination && pagination.page < pagination.totalPages && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Yüklənir...
                </>
              ) : (
                "Daha çox yüklə"
              )}
            </Button>
          </div>
        )}

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-red-500"
              onClick={handleClearAll}
              disabled={isDeletingAll}
            >
              {isDeletingAll ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Hamısını sil
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

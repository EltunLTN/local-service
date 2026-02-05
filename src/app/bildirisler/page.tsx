"use client"

import React, { useState } from "react"
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
  BadgeCheck,
  Trash2,
  Settings,
  Filter,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Demo notifications
const notifications = [
  {
    id: "1",
    type: "order",
    title: "Sifarişiniz qəbul edildi",
    message: "Əli Həsənov sifarişinizi qəbul etdi. Sabah 10:00-da gələcək.",
    time: "5 dəq əvvəl",
    isRead: false,
    icon: Check,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    link: "/hesab",
  },
  {
    id: "2",
    type: "message",
    title: "Yeni mesaj",
    message: "Vüsal Məmmədov sizə mesaj göndərdi: 'Sabahkı vaxt uyğundur?'",
    time: "1 saat əvvəl",
    isRead: false,
    icon: MessageSquare,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    link: "/mesajlar",
  },
  {
    id: "3",
    type: "review",
    title: "Yeni rəy",
    message: "Sifarişinizə rəy yazın və 10 bonus qazanın!",
    time: "3 saat əvvəl",
    isRead: false,
    icon: Star,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    link: "/hesab",
  },
  {
    id: "4",
    type: "order",
    title: "Sifariş tamamlandı",
    message: "Santexnik xidməti uğurla tamamlandı. Təşəkkür edirik!",
    time: "1 gün əvvəl",
    isRead: true,
    icon: CheckCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    link: "/hesab",
  },
  {
    id: "5",
    type: "payment",
    title: "Ödəniş uğurlu",
    message: "85 AZN məbləğində ödəniş həyata keçirildi.",
    time: "1 gün əvvəl",
    isRead: true,
    icon: Wallet,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    link: "/hesab",
  },
  {
    id: "6",
    type: "promo",
    title: "Xüsusi təklif!",
    message: "İlk sifarişinizdə 20% endirim! Kod: YENI20",
    time: "2 gün əvvəl",
    isRead: true,
    icon: BadgeCheck,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    link: "/xidmetler",
  },
  {
    id: "7",
    type: "system",
    title: "Profil yeniləməsi",
    message: "Zəhmət olmasa telefon nömrənizi təsdiqləyin.",
    time: "3 gün əvvəl",
    isRead: true,
    icon: AlertCircle,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    link: "/hesab/tenzimlemeler",
  },
]

const filterTabs = [
  { id: "all", label: "Hamısı" },
  { id: "unread", label: "Oxunmamış" },
  { id: "order", label: "Sifarişlər" },
  { id: "message", label: "Mesajlar" },
]

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [notificationList, setNotificationList] = useState(notifications)

  const unreadCount = notificationList.filter((n) => !n.isRead).length

  const filteredNotifications = notificationList.filter((notification) => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return !notification.isRead
    return notification.type === activeFilter
  })

  const handleMarkAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleDelete = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id))
  }

  const handleClearAll = () => {
    setNotificationList([])
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
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Hamısını oxunmuş et
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
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
              filteredNotifications.map((notification) => (
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
                          notification.iconBg
                        )}
                      >
                        <notification.icon
                          className={cn("h-6 w-6", notification.iconColor)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={notification.link}
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
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {notification.time}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-primary hover:underline"
                            >
                              Oxunmuş et
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
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

        {/* Clear All Button */}
        {notificationList.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-red-500"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hamısını sil
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

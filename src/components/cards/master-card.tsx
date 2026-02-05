"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  MessageSquare, 
  Star,
  CheckCircle,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge, VerifiedBadge, InsuredBadge, OnlineBadge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { formatPrice, formatDistance } from "@/lib/utils"
import type { Master } from "@/types"

interface MasterCardProps {
  master: Master
  showDistance?: boolean
  distance?: number
  variant?: "default" | "compact" | "horizontal"
  className?: string
}

export function MasterCard({ 
  master, 
  showDistance = true, 
  distance,
  variant = "default",
  className 
}: MasterCardProps) {
  const {
    id,
    name,
    avatar,
    rating,
    reviewCount,
    completedJobs,
    hourlyRate,
    isOnline,
    isVerified,
    isInsured,
    categories,
    experience,
    bio,
  } = master

  // Horizontal variant - axtarış nəticələri üçün
  if (variant === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(46, 91, 255, 0.16)" }}
        className={cn(
          "group bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300",
          "hover:border-primary-light",
          className
        )}
      >
        <div className="flex gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <UserAvatar 
              src={avatar} 
              name={name} 
              size="lg" 
              isOnline={isOnline} 
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link 
                  href={`/usta/${id}`}
                  className="text-lg font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1"
                >
                  {name}
                </Link>
                <p className="text-sm text-gray-600 mt-0.5">
                  {categories[0]} | {experience} il təcrübə
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({reviewCount})</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {isOnline && <OnlineBadge />}
              {isVerified && <VerifiedBadge size="sm" />}
              {isInsured && <InsuredBadge size="sm" />}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>{completedJobs} iş tamamlanıb</span>
              </div>
              {showDistance && distance && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{formatDistance(distance * 1000)}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Bu gün mövcud</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div>
                <span className="text-2xl font-bold text-primary">{formatPrice(hourlyRate)}</span>
                <span className="text-gray-500 text-sm">/saat</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/usta/${id}`}>Ətraflı</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/sifaris/yarat?usta=${id}`}>Sifariş ver</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Compact variant - carousel üçün
  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className={cn(
          "bg-white rounded-xl border border-gray-200 p-4 transition-all duration-300",
          "hover:shadow-hover hover:border-primary-light",
          "min-w-[200px]",
          className
        )}
      >
        <div className="flex flex-col items-center text-center">
          <UserAvatar src={avatar} name={name} size="lg" isOnline={isOnline} />
          <Link 
            href={`/usta/${id}`}
            className="mt-3 font-semibold text-gray-900 hover:text-primary transition-colors"
          >
            {name}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{categories[0]}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{completedJobs} iş</p>
        </div>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(46, 91, 255, 0.16)" }}
      className={cn(
        "group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300",
        "hover:border-primary-light",
        className
      )}
    >
      {/* Card Header with gradient */}
      <div className="relative h-20 bg-gradient-to-r from-primary to-purple-600">
        {isOnline && (
          <div className="absolute top-3 right-3">
            <OnlineBadge />
          </div>
        )}
      </div>

      <div className="p-5 -mt-10">
        {/* Avatar */}
        <div className="relative inline-block">
          <UserAvatar 
            src={avatar} 
            name={name} 
            size="xl" 
            className="border-4 border-white shadow-lg"
          />
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Name & Rating */}
        <div className="mt-3">
          <Link 
            href={`/usta/${id}`}
            className="text-lg font-bold text-gray-900 hover:text-primary transition-colors"
          >
            {name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">({reviewCount} rəy)</span>
          </div>
        </div>

        {/* Category & Experience */}
        <p className="text-sm text-gray-600 mt-2">
          {categories[0]} | {experience} il təcrübə
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {isVerified && <VerifiedBadge size="sm" />}
          {isInsured && <InsuredBadge size="sm" />}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{completedJobs}</p>
            <p className="text-xs text-gray-500">Tamamlanmış iş</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{formatPrice(hourlyRate)}</p>
            <p className="text-xs text-gray-500">saat başına</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/mesajlar?usta=${id}`}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Mesaj
            </Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href={`/sifaris/yarat?usta=${id}`}>
              Sifariş ver
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default MasterCard

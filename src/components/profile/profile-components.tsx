'use client'

import * as React from 'react'
import { Star, MapPin, Clock, Shield, Award, Zap, Phone, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn, formatDistance } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge, VerifiedBadge, InsuredBadge, OnlineBadge, PremiumBadge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'

interface MasterProfileHeaderProps {
  master: {
    id: string
    name: string
    avatar?: string
    coverImage?: string
    category: string
    categoryName: string
    rating: number
    reviewCount: number
    completedJobs: number
    hourlyRate: number
    isVerified: boolean
    isInsured: boolean
    isOnline: boolean
    isPremium?: boolean
    distance?: number
    location: string
    experience: number
    responseTime: number
  }
  onMessage?: () => void
  onCall?: () => void
  onBook?: () => void
  showActions?: boolean
}

export function MasterProfileHeader({
  master,
  onMessage,
  onCall,
  onBook,
  showActions = true,
}: MasterProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary to-blue-600 relative overflow-hidden">
        {master.coverImage ? (
          <Image
            src={master.coverImage}
            alt=""
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 p-4">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-white rounded-lg" />
              ))}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 md:-mt-20 pb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 -mt-20 md:-mt-16 mx-auto md:mx-0">
                <div className="relative">
                  <UserAvatar
                    name={master.name}
                    src={master.avatar}
                    size="2xl"
                    className="border-4 border-white shadow-lg"
                  />
                  {master.isOnline && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {master.name}
                  </h1>
                  {master.isVerified && <VerifiedBadge />}
                  {master.isInsured && <InsuredBadge />}
                  {master.isPremium && <PremiumBadge />}
                </div>

                <p className="text-gray-600 mb-3">{master.categoryName}</p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{master.rating}</span>
                    <span>({master.reviewCount} rəy)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{master.completedJobs} iş tamamlanıb</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{master.experience} il təcrübə</span>
                  </div>
                </div>

                {/* Location & Response Time */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{master.location}</span>
                    {master.distance && (
                      <span className="text-primary">({formatDistance(master.distance)})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Zap className="h-4 w-4" />
                    <span>Orta cavab müddəti: {master.responseTime} dəq</span>
                  </div>
                </div>
              </div>

              {/* Actions & Price */}
              {showActions && (
                <div className="flex flex-col items-center md:items-end gap-4 mt-4 md:mt-0">
                  <div className="text-center md:text-right">
                    <p className="text-sm text-gray-500">Saatlıq tarif</p>
                    <p className="text-3xl font-bold text-primary">{master.hourlyRate}₼</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onCall}
                      className="gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Zəng
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onMessage}
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Mesaj
                    </Button>
                  </div>

                  <Button onClick={onBook} className="w-full md:w-auto">
                    Sifariş ver
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component
interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  suffix?: string
  trend?: number
  className?: string
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  suffix,
  trend,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'bg-white rounded-xl p-4 border border-gray-100 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend !== undefined && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">
          {value}{suffix}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  )
}

// Service Item Component
interface ServiceItemProps {
  name: string
  price: number
  duration: string
  description?: string
  onSelect?: () => void
  isSelected?: boolean
}

export function ServiceItem({
  name,
  price,
  duration,
  description,
  onSelect,
  isSelected,
}: ServiceItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onSelect}
      className={cn(
        'flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-gray-100 hover:border-gray-200'
      )}
    >
      <div>
        <h4 className="font-medium text-gray-900">{name}</h4>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-primary">{price}₼</p>
      </div>
    </motion.div>
  )
}

// Review Summary Component
interface ReviewSummaryProps {
  rating: number
  reviewCount: number
  breakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function ReviewSummary({ rating, reviewCount, breakdown }: ReviewSummaryProps) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-50 rounded-xl">
      {/* Overall Rating */}
      <div className="text-center md:text-left">
        <p className="text-5xl font-bold text-gray-900">{rating}</p>
        <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-5 w-5',
                i < Math.round(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-200'
              )}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">{reviewCount} rəy əsasında</p>
      </div>

      {/* Rating Breakdown */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown[star as keyof typeof breakdown]
          const percentage = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-6">{star}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: (5 - star) * 0.1 }}
                  className="h-full bg-yellow-400 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

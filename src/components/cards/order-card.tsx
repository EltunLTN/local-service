"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Clock, 
  MapPin, 
  Calendar,
  User,
  ChevronRight,
  MessageSquare,
  Phone,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { cn, formatPrice, formatDate, formatRelativeTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { ORDER_STATUSES } from "@/lib/constants"
import type { Order } from "@/types"

interface OrderCardProps {
  order: Order
  variant?: "default" | "compact" | "detailed"
  userRole?: "customer" | "master"
  onAccept?: () => void
  onReject?: () => void
  onCancel?: () => void
  className?: string
}

// Status icon mapping
const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  accepted: <CheckCircle className="h-4 w-4" />,
  in_progress: <Loader2 className="h-4 w-4 animate-spin" />,
  completed: <CheckCircle className="h-4 w-4" />,
  cancelled: <X className="h-4 w-4" />,
}

export function OrderCard({ 
  order, 
  variant = "default",
  userRole = "customer",
  onAccept,
  onReject,
  onCancel,
  className 
}: OrderCardProps) {
  const {
    id,
    orderNumber,
    serviceName,
    status,
    scheduledDate,
    timeSlot,
    address,
    price,
    master,
    customer,
    urgency,
  } = order

  const statusConfig = ORDER_STATUSES[status]
  const isUrgent = urgency === "urgent"
  const isPending = status === "pending"
  const isActive = ["pending", "accepted", "in_progress"].includes(status)
  const otherParty = userRole === "customer" ? master : customer

  // Compact variant
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-white rounded-lg border border-gray-200 p-4",
          "hover:shadow-md transition-shadow duration-200",
          className
        )}
      >
        <Link href={`/sifarislerim/${id}`} className="block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${statusConfig.color}20` }}
              >
                <div style={{ color: statusConfig.color }}>
                  {statusIcons[status]}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900">{serviceName}</p>
                <p className="text-sm text-gray-500">#{orderNumber}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      </motion.div>
    )
  }

  // Detailed variant - Master panel üçün (gələn sifarişlər)
  if (variant === "detailed" && userRole === "master") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-white rounded-xl border overflow-hidden",
          isUrgent ? "border-red-200" : "border-gray-200",
          className
        )}
      >
        {/* Urgent banner */}
        {isUrgent && (
          <div className="bg-red-500 text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Təcili Sifariş
          </div>
        )}

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{serviceName}</h3>
              <p className="text-sm text-gray-500 mt-0.5">Sifariş #{orderNumber}</p>
            </div>
            <Badge 
              style={{ 
                backgroundColor: `${statusConfig.color}20`,
                color: statusConfig.color 
              }}
            >
              {statusConfig.label}
            </Badge>
          </div>

          {/* Customer info */}
          {customer && (
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <UserAvatar src={customer.avatar} name={customer.name} size="md" />
              <div>
                <p className="font-medium text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{timeSlot.start} - {timeSlot.end}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{address.fullAddress}</span>
            </div>
          </div>

          {/* Price */}
          {price && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Təxmini məbləğ:</span>
                <span className="text-xl font-bold text-primary">{formatPrice(price)}</span>
              </div>
            </div>
          )}

          {/* Actions for pending orders */}
          {isPending && (
            <div className="flex gap-3 mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1 text-error border-error hover:bg-error/10"
                onClick={onReject}
              >
                Rədd et
              </Button>
              <Button 
                className="flex-1"
                onClick={onAccept}
              >
                Qəbul et
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-5",
        "hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{serviceName}</h3>
            {isUrgent && (
              <Badge variant="error" size="sm">Təcili</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">#{orderNumber}</p>
        </div>
        <Badge 
          style={{ 
            backgroundColor: `${statusConfig.color}20`,
            color: statusConfig.color 
          }}
          className="flex items-center gap-1.5"
        >
          {statusIcons[status]}
          {statusConfig.label}
        </Badge>
      </div>

      {/* Other party info */}
      {otherParty && (
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar src={otherParty.avatar} name={otherParty.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-900">{otherParty.name}</p>
            <p className="text-xs text-gray-500">
              {userRole === "customer" ? "Usta" : "Müştəri"}
            </p>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(scheduledDate)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{timeSlot.start} - {timeSlot.end}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{address.district}</span>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        {price && (
          <div>
            <span className="text-xl font-bold text-primary">{formatPrice(price)}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          {isActive && otherParty && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/mesajlar?order=${id}`}>
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={`tel:${otherParty.phone}`}>
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
            </>
          )}
          
          {isActive && userRole === "customer" && status !== "in_progress" && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-error"
              onClick={onCancel}
            >
              Ləğv et
            </Button>
          )}
          
          <Button variant="outline" size="sm" asChild>
            <Link href={`/sifarislerim/${id}`}>
              Ətraflı
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default OrderCard

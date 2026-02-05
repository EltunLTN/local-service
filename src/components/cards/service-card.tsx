"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Zap, 
  Droplets, 
  Hammer, 
  Sparkles, 
  AirVent,
  Sofa,
  Flower2,
  Tv,
  ChevronRight,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceCategory } from "@/types"

// İkon mapping
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Droplets,
  Hammer,
  Sparkles,
  AirVent,
  Sofa,
  Flower2,
  Tv,
}

interface ServiceCategoryCardProps {
  category: ServiceCategory
  variant?: "default" | "compact" | "featured"
  index?: number
  className?: string
}

export function ServiceCategoryCard({ 
  category, 
  variant = "default",
  index = 0,
  className 
}: ServiceCategoryCardProps) {
  const { id, name, slug, icon, color, description, subcategories } = category
  const Icon = iconMap[icon] || Zap

  // Featured variant - Ana səhifə hero üçün
  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          y: -8, 
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)"
        }}
        className={cn(
          "group relative bg-white rounded-2xl p-6 cursor-pointer overflow-hidden",
          "border border-gray-100 transition-all duration-300",
          "hover:border-transparent",
          className
        )}
      >
        {/* Background gradient on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundColor: color }}
        />

        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon 
            className="h-8 w-8 transition-colors duration-300"
            style={{ color }}
          />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>

        {/* Subcategories preview */}
        <div className="flex flex-wrap gap-1.5">
          {subcategories.slice(0, 3).map((sub) => (
            <span 
              key={sub.id}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
            >
              {sub.name}
            </span>
          ))}
          {subcategories.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              +{subcategories.length - 3}
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>

        {/* Link overlay */}
        <Link href={`/xidmetler/${slug}`} className="absolute inset-0">
          <span className="sr-only">{name} xidmətlərinə bax</span>
        </Link>
      </motion.div>
    )
  }

  // Compact variant - Grid üçün
  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative bg-white rounded-xl p-4 text-center cursor-pointer",
          "border border-gray-100 transition-all duration-300",
          "hover:shadow-lg hover:border-transparent",
          className
        )}
      >
        <Link href={`/xidmetler/${slug}`} className="block">
          <div 
            className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-7 w-7" style={{ color }} />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
        </Link>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300",
        "hover:shadow-hover hover:border-primary-light",
        className
      )}
    >
      <Link href={`/xidmetler/${slug}`}>
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{description}</p>
            <p className="text-xs text-primary mt-2">
              {subcategories.length} xidmət
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  )
}

// Service Item Card - Alt kateqoriya üçün
interface ServiceItemProps {
  service: {
    id: string
    name: string
    price: number
    description?: string
  }
  categorySlug: string
  onSelect?: () => void
  selected?: boolean
}

export function ServiceItemCard({ service, categorySlug, onSelect, selected }: ServiceItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200",
        selected 
          ? "border-primary bg-primary-light shadow-md" 
          : "border-gray-200 hover:border-primary-light hover:shadow-sm"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className={cn(
            "font-medium",
            selected ? "text-primary" : "text-gray-900"
          )}>
            {service.name}
          </h4>
          {service.description && (
            <p className="text-sm text-gray-500 mt-0.5">{service.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold text-primary">{service.price}₼</p>
          <p className="text-xs text-gray-500">başlanğıc</p>
        </div>
      </div>
    </motion.div>
  )
}

export default ServiceCategoryCard

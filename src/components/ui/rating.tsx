"use client"

import * as React from "react"
import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  showCount?: boolean
  count?: number
  readonly?: boolean
  onChange?: (value: number) => void
  className?: string
}

export function Rating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  showCount = false,
  count = 0,
  readonly = true,
  onChange,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const displayValue = hoverValue ?? value
  const fullStars = Math.floor(displayValue)
  const hasHalfStar = displayValue % 1 >= 0.5

  const handleClick = (starValue: number) => {
    if (!readonly && onChange) {
      onChange(starValue)
    }
  }

  const handleMouseEnter = (starValue: number) => {
    if (!readonly) {
      setHoverValue(starValue)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null)
    }
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= fullStars
          const isHalf = starValue === fullStars + 1 && hasHalfStar

          return (
            <button
              key={index}
              type="button"
              className={cn(
                "transition-all duration-200",
                readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
              )}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              aria-label={`${starValue} ulduz`}
            >
              {isHalf ? (
                <div className="relative">
                  <Star
                    className={cn(sizeClasses[size], "text-gray-300")}
                    fill="currentColor"
                  />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star
                      className={cn(sizeClasses[size], "text-yellow-400")}
                      fill="currentColor"
                    />
                  </div>
                </div>
              ) : (
                <Star
                  className={cn(
                    sizeClasses[size],
                    isFilled ? "text-yellow-400" : "text-gray-300"
                  )}
                  fill="currentColor"
                />
              )}
            </button>
          )
        })}
      </div>
      
      {showValue && (
        <span className="text-sm font-semibold text-gray-900">
          {value.toFixed(1)}
        </span>
      )}
      
      {showCount && (
        <span className="text-sm text-gray-500">
          ({count} rəy)
        </span>
      )}
    </div>
  )
}

// Simple star display
interface SimpleRatingProps {
  value: number
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
}

export function SimpleRating({ value, size = "md", className }: SimpleRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
    "2xl": "h-8 w-8",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
    "2xl": "text-xl",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className={cn(sizeClasses[size], "text-yellow-400")} fill="currentColor" />
      <span className={cn(textSizes[size], "font-semibold text-gray-900")}>{value.toFixed(1)}</span>
    </div>
  )
}

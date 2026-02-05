"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Skeleton loader
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
}

function Skeleton({
  className,
  variant = "text",
  width,
  height,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height ?? (variant === "text" ? 16 : undefined),
      }}
      {...props}
    />
  )
}

// Spinner loader
interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "white" | "gray"
  className?: string
}

function Spinner({ size = "md", color = "primary", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  const colorClasses = {
    primary: "border-gray-200 border-t-primary",
    white: "border-white/30 border-t-white",
    gray: "border-gray-300 border-t-gray-600",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

// Full page loader
interface PageLoaderProps {
  text?: string
}

function PageLoader({ text = "Yüklənir..." }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-gray-600">{text}</p>
    </div>
  )
}

// Card skeleton
function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton width="100%" height={12} />
      <Skeleton width="80%" height={12} />
      <div className="flex gap-2 pt-2">
        <Skeleton width={80} height={32} variant="rectangular" />
        <Skeleton width={80} height={32} variant="rectangular" />
      </div>
    </div>
  )
}

// Master card skeleton
function MasterCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={64} height={64} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={18} />
          <Skeleton width="50%" height={14} />
          <div className="flex items-center gap-2">
            <Skeleton width={60} height={12} />
            <Skeleton width={60} height={12} />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton width={70} height={24} variant="rectangular" />
        <Skeleton width={70} height={24} variant="rectangular" />
      </div>
      <Skeleton width="100%" height={12} />
      <div className="flex justify-between items-center pt-2">
        <Skeleton width={60} height={20} />
        <div className="flex gap-2">
          <Skeleton width={90} height={40} variant="rectangular" />
          <Skeleton width={90} height={40} variant="rectangular" />
        </div>
      </div>
    </div>
  )
}

// List skeleton
interface ListSkeletonProps {
  count?: number
}

function ListSkeleton({ count = 5 }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={10} />
          </div>
          <Skeleton width={60} height={24} variant="rectangular" />
        </div>
      ))}
    </div>
  )
}

// Dots loader
function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

export {
  Skeleton,
  Spinner,
  PageLoader,
  CardSkeleton,
  MasterCardSkeleton,
  ListSkeleton,
  DotsLoader,
}

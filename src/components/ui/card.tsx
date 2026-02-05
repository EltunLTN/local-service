import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "gradient" | "glass"
  padding?: "none" | "sm" | "md" | "lg"
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", hover = false, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }

    const variantClasses = {
      default: "bg-white border border-gray-200",
      interactive: "bg-white border border-gray-200 cursor-pointer",
      gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100",
      glass: "bg-white/70 backdrop-blur-lg border border-white/20",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl shadow-card transition-all duration-300",
          variantClasses[variant],
          paddingClasses[padding],
          hover && "hover:-translate-y-1 hover:shadow-hover hover:border-primary-light",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

// Animated Card with Framer Motion
const MotionCard = React.forwardRef<HTMLDivElement, CardProps & HTMLMotionProps<"div">>(
  ({ className, variant = "default", padding = "md", hover = true, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }

    const variantClasses = {
      default: "bg-white border border-gray-200",
      interactive: "bg-white border border-gray-200 cursor-pointer",
      gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100",
      glass: "bg-white/70 backdrop-blur-lg border border-white/20",
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl shadow-card",
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        whileHover={hover ? { 
          y: -4, 
          boxShadow: "0 12px 32px rgba(46, 91, 255, 0.16)",
          borderColor: "rgba(46, 91, 255, 0.2)"
        } : undefined}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        {...props}
      />
    )
  }
)
MotionCard.displayName = "MotionCard"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, MotionCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

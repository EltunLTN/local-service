import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-primary-light text-primary",
        secondary:
          "bg-gray-100 text-gray-700",
        success:
          "bg-success/10 text-success",
        warning:
          "bg-warning/10 text-warning",
        error:
          "bg-error/10 text-error",
        outline:
          "border border-gray-300 text-gray-700 bg-white",
        verified:
          "bg-primary-light text-primary",
        insured:
          "bg-success/10 text-success",
        premium:
          "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  pulse?: boolean
}

function Badge({ 
  className, 
  variant, 
  size, 
  icon, 
  pulse = false,
  children, 
  ...props 
}: BadgeProps) {
  return (
    <div 
      className={cn(
        badgeVariants({ variant, size }), 
        pulse && "animate-pulse",
        className
      )} 
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  )
}

// Pre-built badges
const VerifiedBadge = ({ size }: { size?: "sm" | "default" | "lg" }) => (
  <Badge variant="verified" size={size}>
    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
    Doğrulanmış
  </Badge>
)

const InsuredBadge = ({ size }: { size?: "sm" | "default" | "lg" }) => (
  <Badge variant="insured" size={size}>
    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 1a.75.75 0 01.596.296l1.538 1.99 2.417.607a.75.75 0 01.447 1.112l-1.09 2.108.245 2.483a.75.75 0 01-.91.798L10 9.586l-3.243.808a.75.75 0 01-.91-.798l.245-2.483-1.09-2.108a.75.75 0 01.447-1.112l2.417-.607 1.538-1.99A.75.75 0 0110 1z" clipRule="evenodd" />
    </svg>
    Sığortalı
  </Badge>
)

const OnlineBadge = () => (
  <Badge variant="success" size="sm" pulse>
    <span className="h-2 w-2 rounded-full bg-success" />
    Onlayn
  </Badge>
)

const UrgentBadge = () => (
  <Badge variant="error" size="sm">
    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
    Təcili
  </Badge>
)

const PremiumBadge = ({ size }: { size?: "sm" | "default" | "lg" }) => (
  <Badge variant="premium" size={size}>
    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
    </svg>
    Premium
  </Badge>
)

export { Badge, badgeVariants, VerifiedBadge, InsuredBadge, OnlineBadge, UrgentBadge, PremiumBadge }

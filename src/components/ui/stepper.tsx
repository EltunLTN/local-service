'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'compact' | 'numbered'
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
  orientation = 'horizontal',
  variant = 'default',
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const isClickable = onStepClick && (isCompleted || isCurrent || currentStep > step.id - 1)

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex items-center',
                isHorizontal ? 'flex-col' : 'flex-row gap-4',
                isClickable && 'cursor-pointer'
              )}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? 'var(--primary)'
                    : isCurrent
                    ? 'var(--primary)'
                    : '#E5E7EB',
                }}
                className={cn(
                  'relative flex items-center justify-center rounded-full transition-colors',
                  variant === 'compact' ? 'w-8 h-8' : 'w-12 h-12',
                  (isCompleted || isCurrent) ? 'text-white' : 'text-gray-400'
                )}
              >
                {isCompleted ? (
                  <Check className={variant === 'compact' ? 'h-4 w-4' : 'h-5 w-5'} />
                ) : variant === 'numbered' ? (
                  <span className="font-semibold text-base">
                    {step.id}
                  </span>
                ) : variant === 'compact' ? (
                  step.icon ? (
                    <step.icon className="h-4 w-4" />
                  ) : (
                    <span className="font-semibold text-sm">{step.id}</span>
                  )
                ) : step.icon ? (
                  <step.icon className="h-5 w-5" />
                ) : (
                  <span className="font-semibold text-base">
                    {step.id}
                  </span>
                )}

                {/* Current step pulse */}
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                )}
              </motion.div>

              {/* Step Text */}
              {variant !== 'compact' && (
                <div className={cn(
                  isHorizontal ? 'text-center mt-2' : 'flex-1'
                )}>
                  <p className={cn(
                    'font-medium text-sm',
                    (isCompleted || isCurrent) ? 'text-gray-900' : 'text-gray-400'
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'bg-gray-200 transition-colors',
                  isHorizontal 
                    ? 'flex-1 h-0.5 mx-3' 
                    : 'w-0.5 h-8 ml-6 my-1',
                  isCompleted && 'bg-primary'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Mobile Step Indicator
interface MobileStepIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function MobileStepIndicator({
  currentStep,
  totalSteps,
  className,
}: MobileStepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            index === currentStep - 1
              ? 'w-8 bg-primary'
              : index < currentStep - 1
              ? 'w-1.5 bg-primary/60'
              : 'w-1.5 bg-gray-200'
          )}
        />
      ))}
    </div>
  )
}

// Progress Steps with Labels
interface ProgressStepsProps {
  steps: { title: string; icon?: React.ComponentType<{ className?: string }> }[]
  currentStep: number
  className?: string
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > index + 1
        const isCurrent = currentStep === index + 1

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : step.icon ? (
                  <step.icon className="h-5 w-5" />
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </motion.div>
              <span
                className={cn(
                  'text-sm mt-2 font-medium',
                  (isCompleted || isCurrent) ? 'text-gray-900' : 'text-gray-400'
                )}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4',
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

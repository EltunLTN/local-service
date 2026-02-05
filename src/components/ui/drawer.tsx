'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollLock } from '@/hooks'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  position?: 'left' | 'right' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  title?: string
}

const sizeClasses = {
  sm: 'w-[280px]',
  md: 'w-[350px]',
  lg: 'w-[450px]',
  xl: 'w-[550px]',
  full: 'w-full',
}

const bottomSizeClasses = {
  sm: 'h-1/4',
  md: 'h-1/3',
  lg: 'h-1/2',
  xl: 'h-2/3',
  full: 'h-full',
}

export function Drawer({
  isOpen,
  onClose,
  children,
  className,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  title,
}: DrawerProps) {
  // Lock scroll when drawer is open
  useScrollLock(isOpen)

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const getAnimationProps = () => {
    switch (position) {
      case 'left':
        return {
          initial: { x: '-100%' },
          animate: { x: 0 },
          exit: { x: '-100%' },
        }
      case 'right':
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' },
        }
      case 'bottom':
        return {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' },
        }
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return cn('left-0 top-0 h-full', sizeClasses[size])
      case 'right':
        return cn('right-0 top-0 h-full', sizeClasses[size])
      case 'bottom':
        return cn('bottom-0 left-0 w-full', bottomSizeClasses[size])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Drawer */}
          <motion.div
            {...getAnimationProps()}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'absolute bg-white shadow-2xl flex flex-col',
              position === 'bottom' && 'rounded-t-2xl',
              getPositionClasses(),
              className
            )}
          >
            {/* Header */}
            {(showCloseButton || title) && (
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                {position !== 'right' && showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Geri"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                )}
                
                {title && (
                  <h2 className={cn(
                    "font-semibold text-gray-900",
                    position === 'right' && 'flex-1',
                    position !== 'right' && 'flex-1 text-center'
                  )}>
                    {title}
                  </h2>
                )}
                
                {position === 'right' && showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Bağla"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Bottom Sheet (mobile-optimized drawer from bottom)
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  title?: string
  snapPoints?: number[]
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  className,
  title,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose()
              }
            }}
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh]',
              className
            )}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Title */}
            {title && (
              <div className="px-4 pb-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-center">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

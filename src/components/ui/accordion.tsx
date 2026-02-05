'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextValue {
  expandedItems: string[]
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

function useAccordion() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion')
  }
  return context
}

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: React.ReactNode
  className?: string
}

export function Accordion({ 
  type = 'single', 
  defaultValue, 
  children, 
  className 
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }
    return []
  })

  const toggleItem = React.useCallback((value: string) => {
    setExpandedItems((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value]
      } else {
        return prev.includes(value) 
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      }
    })
  }, [type])

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, type }}>
      <div className={cn('space-y-2', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const { expandedItems } = useAccordion()
  const isExpanded = expandedItems.includes(value)

  return (
    <div 
      className={cn(
        'border border-gray-200 rounded-lg overflow-hidden',
        isExpanded && 'border-primary/30',
        className
      )}
      data-state={isExpanded ? 'open' : 'closed'}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ value?: string }>, { value })
        }
        return child
      })}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  value?: string
}

export function AccordionTrigger({ children, className, value }: AccordionTriggerProps) {
  const { expandedItems, toggleItem } = useAccordion()
  const isExpanded = value ? expandedItems.includes(value) : false

  return (
    <button
      type="button"
      onClick={() => value && toggleItem(value)}
      className={cn(
        'flex items-center justify-between w-full p-4 text-left font-medium',
        'hover:bg-gray-50 transition-colors',
        isExpanded && 'bg-gray-50',
        className
      )}
      aria-expanded={isExpanded}
    >
      {children}
      <ChevronDown 
        className={cn(
          'h-5 w-5 text-gray-500 transition-transform duration-200',
          isExpanded && 'rotate-180'
        )} 
      />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
  value?: string
}

export function AccordionContent({ children, className, value }: AccordionContentProps) {
  const { expandedItems } = useAccordion()
  const isExpanded = value ? expandedItems.includes(value) : false

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={cn('p-4 pt-0 text-gray-600', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// FAQ Component
interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  className?: string
}

export function FAQ({ items, className }: FAQProps) {
  return (
    <Accordion type="single" className={className}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

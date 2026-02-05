'use client'

import { useEffect } from 'react'

export function useScrollLock(lock: boolean = true): void {
  useEffect(() => {
    if (!lock) return
    
    const originalStyle = window.getComputedStyle(document.body).overflow
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    
    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    
    return () => {
      // Restore scroll
      document.body.style.overflow = originalStyle
      document.body.style.paddingRight = ''
    }
  }, [lock])
}

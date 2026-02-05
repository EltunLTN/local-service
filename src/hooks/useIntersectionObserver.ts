'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean, IntersectionObserverEntry | undefined] {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    freezeOnceVisible = false,
  } = options

  const elementRef = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = isVisible && freezeOnceVisible

  useEffect(() => {
    const element = elementRef.current
    if (!element || frozen) return

    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry)
        setIsVisible(observerEntry.isIntersecting)
      },
      { root, rootMargin, threshold }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [root, rootMargin, threshold, frozen])

  return [elementRef, isVisible, entry]
}

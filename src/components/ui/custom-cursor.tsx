"use client"

import React, { useEffect, useState, useRef } from "react"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: -100, y: -100 })
  const isVisibleRef = useRef(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
        cursorRef.current.style.opacity = '1'
      }
      isVisibleRef.current = true
    }

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
      }
      isVisibleRef.current = false
    }

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
      }
      isVisibleRef.current = true
    }

    const handleElementHover = () => {
      const hoverElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, .hoverable'
      )

      hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true))
        el.addEventListener("mouseleave", () => setIsHovering(false))
      })
    }

    if (!isMobile) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true })
      document.addEventListener("mouseleave", handleMouseLeave)
      document.addEventListener("mouseenter", handleMouseEnter)
      handleElementHover()

      const observer = new MutationObserver(handleElementHover)
      observer.observe(document.body, { childList: true, subtree: true })

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseleave", handleMouseLeave)
        document.removeEventListener("mouseenter", handleMouseEnter)
        observer.disconnect()
        window.removeEventListener("resize", checkMobile)
      }
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Circular Cursor */}
      <div
        ref={cursorRef}
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: '-12px',
          left: '-12px',
          opacity: 0,
        }}
      >
        <div
          style={{
            width: isHovering ? '40px' : '24px',
            height: isHovering ? '40px' : '24px',
            borderRadius: '50%',
            border: `3px solid ${isHovering ? '#2E5BFF' : '#2E5BFF'}`,
            backgroundColor: isHovering ? 'rgba(46, 91, 255, 0.15)' : 'transparent',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.15s ease-out, height 0.15s ease-out, background-color 0.15s ease-out',
            boxShadow: isHovering ? '0 0 15px rgba(46, 91, 255, 0.4)' : 'none',
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#2E5BFF',
            transform: 'translate(-50%, -50%)',
            opacity: isHovering ? 0 : 1,
            transition: 'opacity 0.15s ease-out',
          }}
        />
      </div>

      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  )
}

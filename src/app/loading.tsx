import React from "react"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 animate-pulse" />
          
          {/* Spinning loader */}
          <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-4 space-y-2">
          <p className="text-lg font-medium text-text-primary">Yüklənir...</p>
          <p className="text-sm text-text-muted">Bir az gözləyin</p>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  )
}

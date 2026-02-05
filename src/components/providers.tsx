"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"
import { CustomCursor } from "@/components/ui/custom-cursor"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        
        {/* Custom Wrench Cursor */}
        <CustomCursor />
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1A1F36",
              color: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#00D084",
                secondary: "#FFFFFF",
              },
              style: {
                background: "#1A1F36",
              },
            },
            error: {
              iconTheme: {
                primary: "#FF4757",
                secondary: "#FFFFFF",
              },
              style: {
                background: "#1A1F36",
              },
            },
          }}
        />
        
        {/* React Query Devtools - only in development */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </SessionProvider>
  )
}

// Auth Session Provider wrapper for protected routes
export function AuthProvider({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>
}

// Query Provider wrapper for data fetching
export function QueryProvider({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

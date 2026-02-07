"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HesabTenzimlemelerPage() {
  const router = useRouter()
  useEffect(() => { router.replace("/tenzimlemeler") }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Yönləndirilir...</p>
    </div>
  )
}

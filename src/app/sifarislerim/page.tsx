"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SifarislerimRedirectPage() {
  const router = useRouter()
  useEffect(() => { router.replace("/hesab/sifarisler") }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Yönləndirilir...</p>
    </div>
  )
}

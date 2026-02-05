"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Search, ArrowLeft, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-background to-gray-100">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <span className="text-[150px] md:text-[200px] font-bold text-gray-200 select-none">
              404
            </span>
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="text-6xl md:text-8xl">🔧</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Səhifə Tapılmadı
          </h1>
          <p className="text-text-muted">
            Axtardığınız səhifə mövcud deyil, köçürülüb və ya silinib. 
            URL-i yoxlayın və ya aşağıdakı linklərə keçin.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Ana Səhifə
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/xidmetler">
              <Search className="w-5 h-5 mr-2" />
              Xidmətlər
            </Link>
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-text-muted mb-4">Faydalı linklər:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/kateqoriyalar"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Kateqoriyalar
            </Link>
            <Link
              href="/haqqimizda"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Haqqımızda
            </Link>
            <Link
              href="/elaqe"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Əlaqə
            </Link>
            <Link
              href="/usta-ol"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Usta ol
            </Link>
          </div>
        </motion.div>

        {/* Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Link
            href="/elaqe"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Köməyə ehtiyacınız var?
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-white/80">
              Ev təmiri, ustalar və xidmətlər haqqında faydalı məqalələr
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tezliklə
            </h2>
            <p className="text-gray-600 mb-8">
              Blog bölməsi hazırlanır. Tezliklə ev təmiri, xidmətlər və faydalı 
              məsləhətlər haqqında məqalələr burada paylaşılacaq.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ana Səhifəyə Qayıt
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

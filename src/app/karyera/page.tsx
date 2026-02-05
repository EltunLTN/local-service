"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Briefcase, MapPin, Clock, ChevronRight, Users, Heart, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const OPEN_POSITIONS = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Mühəndislik",
    location: "Bakı / Remote",
    type: "Tam iş günü",
    description: "React, Next.js və TypeScript ilə təcrübəli frontend developer axtarırıq.",
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Mühəndislik",
    location: "Bakı",
    type: "Tam iş günü",
    description: "Node.js, PostgreSQL və API inkişafında təcrübəli backend developer.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Dizayn",
    location: "Bakı / Remote",
    type: "Tam iş günü",
    description: "Figma ilə işləyən, mobil və web dizayn təcrübəsi olan dizayner.",
  },
  {
    id: 4,
    title: "Marketing Manager",
    department: "Marketinq",
    location: "Bakı",
    type: "Tam iş günü",
    description: "Digital marketinq strategiyaları və kampaniya idarəçiliyi üzrə mütəxəssis.",
  },
  {
    id: 5,
    title: "Müştəri Xidmətləri Mütəxəssisi",
    department: "Əməliyyatlar",
    location: "Bakı",
    type: "Tam iş günü",
    description: "Müştəri məmnuniyyəti və problem həlli üzrə təcrübəli mütəxəssis.",
  },
]

const VALUES = [
  {
    icon: Heart,
    title: "Müştəri Odaqlılıq",
    description: "Hər qərar müştərinin ehtiyacları nəzərə alınaraq qəbul edilir.",
  },
  {
    icon: Zap,
    title: "İnnovasiya",
    description: "Yeni texnologiyaları və yanaşmaları tətbiq etməyə həvəsliyik.",
  },
  {
    icon: Users,
    title: "Komanda Əməkdaşlığı",
    description: "Birlikdə çalışaraq daha böyük uğurlara imza atırıq.",
  },
  {
    icon: Target,
    title: "Nəticə Yönümlülük",
    description: "Ölçülən və real nəticələr əldə etməyə fokuslanırıq.",
  },
]

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Gələcəyi Birlikdə Quraq
            </h1>
            <p className="text-xl text-white/80 mb-8">
              UstaBul komandası olaraq Azərbaycanın ən böyük usta platformasını 
              yaradırıq. Bizə qoşul!
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Açıq Vakansiyalar
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Dəyərlərimiz
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Açıq Vakansiyalar
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Aşağıdakı vakansiyalara müraciət edə bilərsiniz. Uyğun vakansiya tapmadınız? 
            CV-nizi <Link href="mailto:hr@ustabul.az" className="text-primary hover:underline">hr@ustabul.az</Link> ünvanına göndərin.
          </p>

          <div className="max-w-4xl mx-auto space-y-4">
            {OPEN_POSITIONS.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {position.title}
                        </h3>
                        <Badge variant="secondary">{position.department}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{position.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Button className="group-hover:bg-primary-600" asChild>
                      <Link href={`mailto:hr@ustabul.az?subject=Müraciət: ${position.title}`}>
                        Müraciət Et
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Niyə UstaBul?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Rəqabətli maaş və bonuslar",
                "Əla ofis mühiti",
                "Uzaqdan iş imkanı",
                "Peşəkar inkişaf imkanları",
                "Nahar kompensasiyası",
                "Sağlamlıq sığortası",
                "Komanda tədbirləri",
                "Texnoloji avadanlıq",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

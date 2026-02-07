"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const stats = [
  { value: "Yeni", label: "Platforma" },
  { value: "100%", label: "Yoxlanılmış ustalar" },
  { value: "7/24", label: "Dəstək xidməti" },
  { value: "4.8", label: "Hədəf reytinq" },
]

const values = [
  {
    icon: Shield,
    title: "Etibarlılıq",
    description: "Bütün ustalarımız yoxlanılır və təsdiqlənir. Sizin təhlükəsizliyiniz bizim prioritetimizdir.",
  },
  {
    icon: Star,
    title: "Keyfiyyət",
    description: "Yüksək keyfiyyətli xidmət standartları. Müştəri məmnuniyyəti əsas hədəfimizdir.",
  },
  {
    icon: Clock,
    title: "Sürətlilik",
    description: "Tez cavab vermə və işin vaxtında yerinə yetirilməsi. Vaxtınıza hörmət edirik.",
  },
  {
    icon: Heart,
    title: "Müştəri yönümlü",
    description: "Hər bir müştəriyə fərdi yanaşma. Sizin ehtiyaclarınız bizim üçün vacibdir.",
  },
]

const team: { name: string; role: string; image: string; bio: string }[] = []

const milestones = [
  { year: "2025", title: "Şirkətin qurulması", desc: "UstaBul ideyası yarandı və platforma hazırlandı" },
  { year: "2026", title: "Beta versiya", desc: "Platformanın ilk versiyası istifadəyə verildi" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bakının ən etibarlı usta platforması
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Ev xidmətlərini sadə, sürətli və etibarlı edən
              platformayıq. Keyfiyyətli usta xidməti bir kliklə.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Link href="/xidmetler" className="flex items-center gap-2">
                  Xidmətləri kəşf et
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/usta-ol">Usta ol</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
                <Target className="h-5 w-5" />
                Missiyamız
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ev xidmətlərini hər kəs üçün əlçatan etmək
              </h2>
              <p className="text-gray-600 mb-6">
                Biz inanırıq ki, hər kəs keyfiyyətli ev xidmətlərini asanlıqla əldə edə bilməlidir.
                Platformamız vasitəsilə müştəriləri etibarlı ustalarla birləşdiririk,
                şəffaflıq və keyfiyyət təmin edirik.
              </p>
              <ul className="space-y-3">
                {[
                  "Yoxlanılmış və təsdiqlənmiş ustalar",
                  "Şəffaf qiymətlər, gizli ödənişlər yoxdur",
                  "Müştəri rəyləri ilə keyfiyyət nəzarəti",
                  "7/24 müştəri dəstəyi",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
                <div className="w-3/4 aspect-square rounded-2xl bg-white shadow-xl flex items-center justify-center">
                  <div className="text-center">
                    <Target className="h-20 w-20 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-900">Missiyamız</p>
                    <p className="text-sm text-gray-500 mt-2 px-4">Keyfiyyətli ev xidmətlərini hər kəs üçün əlçatan etmək</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dəyərlərimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bu dəyərlər bizim hər bir qərarımızda, hər bir addımımızda yol göstəricimizdir.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Yolculuğumuz
            </h2>
            <p className="text-gray-600">İdeyadan Azərbaycanın lider platformasına</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-primary/20" />
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center gap-8 mb-8 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <Card className="inline-block p-4">
                      <div className="font-bold text-primary mb-1">{milestone.year}</div>
                      <div className="font-semibold text-gray-900">{milestone.title}</div>
                      <div className="text-sm text-gray-600">{milestone.desc}</div>
                    </Card>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white flex-shrink-0 z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Komandamız
            </h2>
            <p className="text-gray-600">Peşəkar komandamız hər gün platformanı inkişaf etdirmək üçün çalışır</p>
          </motion.div>

          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Böyüyən komanda</h3>
              <p className="text-gray-600">
                UstaBul komandası genişlənir. Əgər texnologiya ilə ev xidmətlərini dəyişdirmək istəyirsinizsə, 
                <Link href="/karyera" className="text-primary hover:underline ml-1">vakansiyalarımıza baxın</Link>.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Siz də ailəmizə qoşulun
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              İstər müştəri, istər usta olaraq - UstaBul ailəsinə xoş gəlmisiniz!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Link href="/qeydiyyat">Müştəri ol</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/usta-ol">Usta ol</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

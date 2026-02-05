"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Wrench,
  Zap,
  Paintbrush,
  Sofa,
  AirVent,
  Droplets,
  Home,
  Hammer,
  Sparkles,
  Lock,
  Tv,
  Car,
  TreeDeciduous,
  Truck,
  Baby,
  Dog,
  Camera,
  Utensils,
  Scissors,
} from "lucide-react"
import { Card } from "@/components/ui/card"

const categories = [
  {
    id: "santexnika",
    name: "Santexnik",
    icon: Droplets,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    description: "Kran təmiri, boru dəyişimi, kanalizasiya",
    masterCount: 156,
    startingPrice: 20,
    popular: true,
    subcategories: ["Kran təmiri", "Unitaz quraşdırma", "Boru təmiri", "Su sayğacı"],
  },
  {
    id: "elektrik",
    name: "Elektrik",
    icon: Zap,
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50",
    description: "Elektrik xətləri, rozetka, işıqlandırma",
    masterCount: 134,
    startingPrice: 25,
    popular: true,
    subcategories: ["Rozetka quraşdırma", "Elektrik təmiri", "LED işıqlandırma", "Kabel çəkilişi"],
  },
  {
    id: "temir",
    name: "Ev təmiri",
    icon: Home,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    description: "Kompleks ev təmiri, dekorasiya",
    masterCount: 98,
    startingPrice: 100,
    popular: true,
    subcategories: ["Mətbəx təmiri", "Vanna təmiri", "Otaq təmiri", "Balkon təmiri"],
  },
  {
    id: "kondisioner",
    name: "Kondisioner",
    icon: AirVent,
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50",
    description: "Quraşdırma, təmizlik, təmir",
    masterCount: 87,
    startingPrice: 40,
    popular: true,
    subcategories: ["Quraşdırma", "Təmizlik", "Freon doldurma", "Təmir"],
  },
  {
    id: "mebel",
    name: "Mebel ustası",
    icon: Sofa,
    color: "bg-amber-600",
    lightColor: "bg-amber-50",
    description: "Mebel yığımı, təmiri, sifariş mebel",
    masterCount: 112,
    startingPrice: 30,
    popular: false,
    subcategories: ["Mebel yığımı", "Mebel təmiri", "Sifariş mebel", "Döşəmə"],
  },
  {
    id: "boyaci",
    name: "Boyacı",
    icon: Paintbrush,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    description: "Divar boyama, dekorativ boyalar",
    masterCount: 76,
    startingPrice: 15,
    popular: false,
    subcategories: ["Divar boyama", "Tavan boyama", "Dekorativ boya", "Astar"],
  },
  {
    id: "temizlik",
    name: "Təmizlik",
    icon: Sparkles,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    description: "Ev, ofis, mənzil təmizliyi",
    masterCount: 143,
    startingPrice: 35,
    popular: true,
    subcategories: ["Ev təmizliyi", "Ofis təmizliyi", "Pəncərə", "Xalça yuma"],
  },
  {
    id: "qaynaqci",
    name: "Qaynaqçı",
    icon: Hammer,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    description: "Metal qaynaq, barmaqlıq, qapı",
    masterCount: 54,
    startingPrice: 50,
    popular: false,
    subcategories: ["Barmaqlıq", "Metal qapı", "Metal konstruksiya", "Təmir"],
  },
  {
    id: "cilingir",
    name: "Çilingir",
    icon: Lock,
    color: "bg-gray-600",
    lightColor: "bg-gray-50",
    description: "Qapı açma, kilid dəyişmə",
    masterCount: 45,
    startingPrice: 20,
    popular: false,
    subcategories: ["Qapı açma", "Kilid dəyişmə", "Açar hazırlama", "Seyf açma"],
  },
  {
    id: "televizor",
    name: "TV təmiri",
    icon: Tv,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    description: "Televizor, monitor təmiri",
    masterCount: 38,
    startingPrice: 30,
    popular: false,
    subcategories: ["LED TV", "Smart TV", "Monitor", "Anten quraşdırma"],
  },
  {
    id: "avto",
    name: "Avto xidmətləri",
    icon: Car,
    color: "bg-slate-600",
    lightColor: "bg-slate-50",
    description: "Avto yardım, evdə təmir",
    masterCount: 67,
    startingPrice: 40,
    popular: false,
    subcategories: ["Akkumulyator", "Təkər dəyişmə", "Yağ dəyişmə", "Diaqnostika"],
  },
  {
    id: "bag",
    name: "Bağçılıq",
    icon: TreeDeciduous,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    description: "Bağ dizaynı, ağac əkilməsi",
    masterCount: 29,
    startingPrice: 50,
    popular: false,
    subcategories: ["Bağ dizaynı", "Ağac əkmə", "Çəmən biçimi", "Bağ təmizliyi"],
  },
  {
    id: "dasinma",
    name: "Daşınma",
    icon: Truck,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    description: "Ev köçürülməsi, yük daşıma",
    masterCount: 82,
    startingPrice: 80,
    popular: false,
    subcategories: ["Ev köçürülməsi", "Yük daşıma", "Mebel daşıma", "Paketləmə"],
  },
  {
    id: "usaq",
    name: "Uşaq baxıcısı",
    icon: Baby,
    color: "bg-pink-500",
    lightColor: "bg-pink-50",
    description: "Dayə xidmətləri",
    masterCount: 91,
    startingPrice: 15,
    popular: false,
    subcategories: ["Dayə", "Dərs hazırlığı", "Uşaq qeydiyyatı"],
  },
  {
    id: "heyvan",
    name: "Heyvan baxıcısı",
    icon: Dog,
    color: "bg-lime-500",
    lightColor: "bg-lime-50",
    description: "Ev heyvanlarına qulluq",
    masterCount: 34,
    startingPrice: 20,
    popular: false,
    subcategories: ["It gəzdirmə", "Pişik baxımı", "Veterinar xidməti"],
  },
  {
    id: "foto",
    name: "Fotoqraf",
    icon: Camera,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    description: "Toy, ad günü çəkilişi",
    masterCount: 56,
    startingPrice: 100,
    popular: false,
    subcategories: ["Toy çəkilişi", "Ailə fotosessiyası", "Biznes foto", "Məhsul foto"],
  },
  {
    id: "asci",
    name: "Aşçı",
    icon: Utensils,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    description: "Evdə aşçılıq xidməti",
    masterCount: 43,
    startingPrice: 80,
    popular: false,
    subcategories: ["Şənlik yeməkləri", "Günlük yemək", "Ketering"],
  },
  {
    id: "berber",
    name: "Bərbər",
    icon: Scissors,
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    description: "Evdə bərbər xidməti",
    masterCount: 67,
    startingPrice: 15,
    popular: false,
    subcategories: ["Kişi saç", "Saqqal", "Uşaq saç"],
  },
]

export default function CategoriesPage() {
  const popularCategories = categories.filter((c) => c.popular)
  const allCategories = categories

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Xidmət kateqoriyaları</h1>
          <p className="text-gray-600 mt-2">
            Ehtiyacınıza uyğun xidməti seçin, peşəkar ustalar tapın
          </p>
        </div>

        {/* Popular Categories */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            🔥 Populyar xidmətlər
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/xidmetler?category=${category.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all group cursor-pointer h-full">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${category.lightColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <category.icon className={`h-7 w-7 ${category.color.replace("bg-", "text-")}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-600">
                            <span className="font-medium text-primary">{category.masterCount}</span> usta
                          </span>
                          <span className="text-sm text-gray-600">
                            {category.startingPrice}₼-dan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            {sub}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="px-2 py-1 text-xs text-primary font-medium">
                            +{category.subcategories.length - 3} daha
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Bütün kateqoriyalar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/xidmetler?category=${category.id}`}>
                  <Card className="p-4 hover:shadow-md transition-all group cursor-pointer text-center h-full">
                    <div
                      className={`w-12 h-12 rounded-xl ${category.lightColor} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <category.icon
                        className={`h-6 w-6 ${category.color.replace("bg-", "text-")}`}
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.masterCount} usta
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">
              Axtardığınız xidməti tapmadınız?
            </h2>
            <p className="text-white/80 mb-6">
              Bizə yazın, sizin üçün ən uyğun ustanı tapaq
            </p>
            <Link
              href="/sifaris/yarat"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sifariş yarat
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}

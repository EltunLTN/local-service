"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"
import { 
  Search, 
  Zap, 
  Droplets, 
  Hammer, 
  Sparkles, 
  AirVent,
  Sofa,
  Flower2,
  Tv,
  Star,
  CheckCircle,
  Users,
  Clock,
  Shield,
  ArrowRight,
  Play,
  MapPin,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, MotionCard } from "@/components/ui/card"
import { Badge, VerifiedBadge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { Rating, SimpleRating } from "@/components/ui/rating"
import { SERVICE_CATEGORIES, POPULAR_SERVICES } from "@/lib/constants"
import { cn } from "@/lib/utils"

// Animasiya variantları
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
}

// Icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-8 w-8" />,
  Droplets: <Droplets className="h-8 w-8" />,
  Hammer: <Hammer className="h-8 w-8" />,
  Sparkles: <Sparkles className="h-8 w-8" />,
  AirVent: <AirVent className="h-8 w-8" />,
  Sofa: <Sofa className="h-8 w-8" />,
  Flower2: <Flower2 className="h-8 w-8" />,
  Tv: <Tv className="h-8 w-8" />,
}

// Hero bölməsi - Modern Bento Grid Design
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeService, setActiveService] = useState(0)

  const suggestions = POPULAR_SERVICES.filter(service =>
    service.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Auto-rotate featured services
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % SERVICE_CATEGORIES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const serviceHighlights = [
    { icon: Zap, label: "Elektrik", color: "#FFC837" },
    { icon: Droplets, label: "Santexnik", color: "#2E5BFF" },
    { icon: Hammer, label: "Təmir", color: "#00D084" },
    { icon: AirVent, label: "Kondisioner", color: "#7B3FF2" },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(46, 91, 255, 0.08) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(46, 91, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(46, 91, 255, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(123, 63, 242, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.4, 0.6],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 208, 132, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container-custom relative z-10 py-20 lg:py-28">
        {/* Main Grid Layout - Bento Style */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side - Main Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative p-8 lg:p-12 rounded-3xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl overflow-hidden"
            >
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm text-gray-700">500+ aktiv usta hazır</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
                >
                  Eviniz üçün
                  <br />
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
                    Mükəmməl Usta
                  </span>
                  <br />
                  Axtarırsınız? ✨
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-8 max-w-lg"
                >
                  Azərbaycanın ən böyük usta platformasında elektrik, santexnik, 
                  təmir və daha çox xidmət - saniyələr içində!
                </motion.p>

                {/* Search Box - Glass Style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Hansı xidmət axtarırsınız?"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full pl-14 pr-36 h-16 text-lg rounded-2xl bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-lg"
                    />
                    <Button
                      size="lg"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Axtar
                    </Button>
                  </div>

                  {/* Search Suggestions */}
                  {showSuggestions && searchQuery && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20"
                    >
                      {suggestions.slice(0, 5).map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          onClick={() => {
                            setSearchQuery(suggestion)
                            setShowSuggestions(false)
                          }}
                        >
                          <Search className="h-4 w-4 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Quick Service Tags */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  <span className="text-gray-500 text-sm">Populyar:</span>
                  {POPULAR_SERVICES.slice(0, 4).map((service, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(service)}
                      className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-600 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      {service}
                    </button>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Service Highlight Cards - Horizontal Scroll on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {serviceHighlights.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 rounded-2xl bg-white border border-gray-200 shadow-md cursor-pointer group hover:shadow-xl transition-shadow"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <service.icon className="h-5 w-5" style={{ color: service.color }} />
                  </div>
                  <p className="text-gray-900 font-medium text-sm">{service.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Bento Grid Cards */}
          <div className="lg:col-span-5 hidden lg:grid grid-rows-3 gap-4 h-[600px]">
            {/* Top Row - Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm mb-1">Platforma statusu</p>
                <p className="text-2xl font-bold text-gray-900">Aktiv</p>
                <p className="text-green-600 text-sm mt-1">✓ Hazırdır</p>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Middle Row - Active Master Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="row-span-2 rounded-3xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border border-gray-200 shadow-lg p-6 relative overflow-hidden"
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  className="absolute w-40 h-40 rounded-full bg-primary/30 blur-3xl"
                  animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <p className="text-gray-600 text-sm mb-4">Nə təklif edirik</p>
                
                {/* Feature 1 */}
                <div className="flex items-center gap-4 mb-4 p-4 rounded-2xl bg-white shadow-md">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold">Yoxlanılmış ustalar</p>
                    <p className="text-gray-500 text-sm">Bütün ustalar təsdiqlənir</p>
                  </div>
                </div>

                {/* More features */}
                <div className="flex-1 space-y-3">
                  {[
                    { icon: Clock, label: "Sürətli cavab", desc: "24 saat içində" },
                    { icon: Star, label: "Reytinq sistemi", desc: "Şəffaf rəylər" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white hover:shadow-md transition-all">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">{feature.label}</p>
                        <p className="text-gray-500 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="mt-4 w-full bg-gradient-to-r from-primary to-purple-600">
                  <Link href="/ustalar" className="flex items-center justify-center">
                    Bütün ustaları gör
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-gray-600 text-sm">100% Təhlükəsiz Ödəniş</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-gray-600 text-sm">Zəmanətli Xidmət</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-purple-500" />
              <span className="text-gray-600 text-sm">24/7 Dəstək</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="text-gray-600 text-sm">Yüksək Məmnuniyyət</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Kateqoriya kartı
interface CategoryCardProps {
  id: string
  name: string
  icon: string
  color: string
  description: string
  index: number
}

function CategoryCard({ id, name, icon, color, description, index }: CategoryCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/xidmetler/${id}`}>
        <Card
          hover
          className="group relative overflow-hidden cursor-pointer h-full"
        >
          <div className="flex flex-col items-center text-center p-2">
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{ backgroundColor: `${color}20` }}
              whileHover={{ rotate: 15 }}
            >
              <div style={{ color: color }}>
                {categoryIcons[icon]}
              </div>
            </motion.div>
            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          </div>
          
          {/* Hover effect border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          />
        </Card>
      </Link>
    </motion.div>
  )
}

// Xidmət kateqoriyaları bölməsi
function CategoriesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Xidmət Kateqoriyaları
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
            Ehtiyacınıza uyğun xidməti seçin və dərhal peşəkar usta ilə əlaqə saxlayın
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {SERVICE_CATEGORIES.map((category, index) => (
            <CategoryCard
              key={category.id}
              {...category}
              index={index}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/xidmetler">
              Bütün xidmətlərə bax
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// Statistika bölməsi
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: <CheckCircle className="h-8 w-8" />, value: "100%", label: "Yoxlanılmış Ustalar", color: "#00D084" },
    { icon: <Users className="h-8 w-8" />, value: "8+", label: "Xidmət Kateqoriyası", color: "#2E5BFF" },
    { icon: <Star className="h-8 w-8" />, value: "5/5", label: "Reytinq Sistemi", color: "#FFC837" },
    { icon: <Clock className="h-8 w-8" />, value: "24/7", label: "Dəstək Xidməti", color: "#7B3FF2" },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div style={{ color: stat.color }}>
                  {stat.icon}
                </div>
              </motion.div>
              <motion.div
                className="text-4xl font-extrabold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 * index + 0.3 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Necə işləyir bölməsi
function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = [
    {
      number: "01",
      title: "Sifariş yarat",
      description: "Ehtiyacınız olan xidməti seçin və sifarişinizi yaradın",
      icon: <Search className="h-6 w-6" />,
    },
    {
      number: "02",
      title: "Usta seç",
      description: "Uyğun ustaları görün, rəyləri oxuyun və seçiminizi edin",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "03",
      title: "İş başlasın",
      description: "Usta sifarişinizi qəbul etsin və işə başlasın",
      icon: <Hammer className="h-6 w-6" />,
    },
    {
      number: "04",
      title: "Ödəniş et",
      description: "İş tamamlandıqdan sonra rahat ödəniş edin",
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ]

  return (
    <section className="py-20" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Necə İşləyir?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
            4 sadə addımda peşəkar xidmət alın
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative"
        >
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative text-center"
              >
                {/* Step Number */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl relative z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.number}
                </motion.div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 z-20">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Top ustalar bölməsi
function TopMastersSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [masters, setMasters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/masters?limit=4&sort=rating")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length > 0) {
          setMasters(data.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && masters.length === 0) return null

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              Ən Yaxşı Ustalar
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-xl">
              Ən yüksək reytinqli və təcrübəli ustalarımız
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Button variant="outline" asChild>
              <Link href="/ustalar">
                Hamısını gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {masters.map((master, index) => (
            <motion.div key={master.id} variants={scaleIn}>
              <Link href={`/usta/${master.id}`}>
                <MotionCard className="group cursor-pointer">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <UserAvatar
                        name={master.name}
                        src={master.avatar || ""}
                        size="xl"
                      />
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {master.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{master.categories?.[0]?.name || "Usta"}</p>

                    <div className="flex items-center justify-center gap-2 mb-3">
                      <SimpleRating value={master.rating} />
                      <span className="text-sm text-gray-500">
                        ({master.reviewCount} rəy)
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-4">
                      <span>💼 {master.completedJobs} iş</span>
                    </div>

                    {master.isVerified && (
                      <div className="flex justify-center">
                        <VerifiedBadge size="sm" />
                      </div>
                    )}
                  </div>
                </MotionCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// CTA bölməsi
function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary to-purple-600 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-4 border-white" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-4 border-white" />
          </div>

          <div className="relative px-8 py-16 md:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
                Usta olmaq istəyirsiniz?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Platformamıza qoşulun, yeni müştərilər tapın və gəlirinizi artırın. 
                Qeydiyyat tamamilə pulsuzdur!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  className="bg-orange-500 text-white hover:bg-orange-600 font-bold shadow-lg"
                >
                  <Link href="/usta-ol" className="flex items-center">
                    Usta kimi qeydiyyat
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/nece-isleyir">Daha ətraflı</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonial bölməsi
function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Təhlükəsiz Ödəniş",
      content: "Bütün ödənişlər platforma vasitəsilə təhlükəsiz şəkildə həyata keçirilir.",
    },
    {
      id: 2,
      icon: CheckCircle,
      title: "Zəmanətli Xidmət",
      content: "Hər bir iş üçün keyfiyyət zəmanəti verilir. Narazı qalsanız, biz kömək edirik.",
    },
    {
      id: 3,
      icon: Users,
      title: "Yoxlanılmış Ustalar",
      content: "Bütün ustalar qeydiyyatdan keçir və profil məlumatları yoxlanılır.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Niyə UstaBul?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
            Etibar və keyfiyyət üzərində qurulmuş platforma
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={fadeInUp}>
              <Card className="h-full">
                <div className="flex flex-col h-full text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">
                    {feature.content}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Ana səhifə komponenti
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <StatsSection />
      <HowItWorksSection />
      <TopMastersSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}

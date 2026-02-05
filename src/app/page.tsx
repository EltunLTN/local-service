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

// Hero bölməsi
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = POPULAR_SERVICES.filter(service =>
    service.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-white to-purple-50">
        {/* Floating Blobs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                24/7 xidmət mövcuddur
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 font-display"
            >
              Evinizdə Usta{" "}
              <span className="text-gradient">Problem?</span>
              <br />
              Dərhal Həll Edin! 🔧
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Peşəkar ustaları saniyələr içində tapın. Elektrik, santexnik, təmir 
              və daha çox xidmət - bir klik uzaqlığında!
            </motion.p>

            {/* Search Box */}
            <motion.div variants={fadeInUp} className="relative max-w-xl mx-auto lg:mx-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Hansı xidmət axtarırsınız?"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-12 pr-32 h-14 text-lg rounded-2xl border-2 border-gray-200 shadow-lg focus:shadow-xl transition-shadow"
                />
                <Button
                  size="lg"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  Axtar
                </Button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchQuery && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-20"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
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

            {/* Popular Services */}
            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="text-sm text-gray-500">💡 Populyar:</span>
              {POPULAR_SERVICES.slice(0, 4).map((service, index) => (
                <Link
                  key={index}
                  href={`/xidmetler?q=${encodeURIComponent(service)}`}
                  className="text-sm text-primary hover:text-primary-hover hover:underline"
                >
                  {service}
                </Link>
              ))}
            </motion.div>

            {/* Stats Mini */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex items-center gap-8 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-900">500+</strong> Usta
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-900">4.9</strong> Ortalama reytinq
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square">
              {/* Main Circle */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 animate-pulse" />
              
              {/* Center Image Placeholder */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Hammer className="h-20 w-20 mx-auto mb-4" />
                  <p className="font-bold text-xl">Peşəkar Ustalar</p>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                className="absolute top-8 right-0 bg-white rounded-xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sifariş tamamlandı!</p>
                    <p className="text-xs text-gray-500">2 dəqiqə əvvəl</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-16 left-0 bg-white rounded-xl p-4 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <UserAvatar name="Əli M." size="sm" />
                  <div>
                    <p className="font-semibold text-sm">Əli Məmmədov</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs">4.9 (127 rəy)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
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
    { icon: <CheckCircle className="h-8 w-8" />, value: "10,000+", label: "Tamamlanmış İş", color: "#00D084" },
    { icon: <Users className="h-8 w-8" />, value: "500+", label: "Peşəkar Usta", color: "#2E5BFF" },
    { icon: <Star className="h-8 w-8" />, value: "4.9/5", label: "Ortalama Reytinq", color: "#FFC837" },
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

  // Demo ustalar
  const masters = [
    {
      id: "1",
      name: "Əli Məmmədov",
      avatar: "",
      category: "Elektrik",
      rating: 4.9,
      reviewCount: 127,
      completedJobs: 150,
      isVerified: true,
      isOnline: true,
    },
    {
      id: "2",
      name: "Vüqar Həsənov",
      avatar: "",
      category: "Santexnik",
      rating: 5.0,
      reviewCount: 89,
      completedJobs: 200,
      isVerified: true,
      isOnline: false,
    },
    {
      id: "3",
      name: "Rəşad Əliyev",
      avatar: "",
      category: "Ev Təmiri",
      rating: 4.8,
      reviewCount: 156,
      completedJobs: 180,
      isVerified: true,
      isOnline: true,
    },
    {
      id: "4",
      name: "Tural Quliyev",
      avatar: "",
      category: "Kondisioner",
      rating: 4.9,
      reviewCount: 94,
      completedJobs: 120,
      isVerified: true,
      isOnline: false,
    },
  ]

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
                        src={master.avatar}
                        size="xl"
                        isOnline={master.isOnline}
                      />
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {master.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{master.category}</p>

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
                  className="bg-white text-primary hover:bg-gray-100"
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

  const testimonials = [
    {
      id: 1,
      name: "Nigar Həsənova",
      avatar: "",
      role: "Ev sahibi",
      content: "Əla xidmət! Elektrik ustası çox peşəkar idi və işi sürətlə bitirdi. Mütləq tövsiyə edirəm!",
      rating: 5,
    },
    {
      id: 2,
      name: "Rəşad Əhmədov",
      avatar: "",
      role: "Sahibkar",
      content: "Ofisimiz üçün kondisioner quraşdırılması lazım idi. UstaBul vasitəsilə çox yaxşı usta tapdıq.",
      rating: 5,
    },
    {
      id: 3,
      name: "Leyla Məmmədova",
      avatar: "",
      role: "Mənzil sahibi",
      content: "Santexnik işləri üçün mükəmməl platformadır. Ustanın reytinqlərini görüb seçmək çox rahatdır.",
      rating: 5,
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
            Müştərilərimiz Nə Deyir?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
            Minlərlə məmnun müştərimizin rəylərini oxuyun
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id} variants={fadeInUp}>
              <Card className="h-full">
                <div className="flex flex-col h-full">
                  <Rating value={testimonial.rating} size="sm" className="mb-4" />
                  <p className="text-gray-600 mb-6 flex-1">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={testimonial.name}
                      src={testimonial.avatar}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
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

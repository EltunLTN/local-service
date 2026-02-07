"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Crown,
  Star,
  Briefcase,
  Clock,
  Heart,
  Trophy,
  Medal,
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Shield,
  Zap,
  Users,
  Timer,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

// Types
interface LeaderboardMaster {
  rank: number
  id: string
  name: string
  avatar: string | null
  isVerified: boolean
  isPremium: boolean
  isInsured: boolean
  category: string
  categorySlug: string
  rating: number
  reviewCount: number
  completedJobs: number
  responseTime: number
  responseRate: number
  experience: number
  favoritesCount: number
  district: string | null
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const crownVariants = {
  initial: { rotate: -10, scale: 0.8 },
  animate: {
    rotate: [0, -5, 5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

// Period tabs configuration
const periods = [
  { id: "month", label: "Bu ay", icon: Clock },
  { id: "year", label: "Bu il", icon: TrendingUp },
  { id: "all", label: "Bütün vaxtlar", icon: Trophy },
]

// Category tabs configuration
const categories = [
  { 
    id: "rating", 
    label: "Ən yüksək reytinq", 
    icon: Star,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    description: "Müştəri rəylərinə görə ən yüksək qiymətləndirilən ustalar"
  },
  { 
    id: "jobs", 
    label: "Ən çox iş tamamlayan", 
    icon: Briefcase,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    description: "Ən çox sifarişi uğurla tamamlayan ustalar"
  },
  { 
    id: "response", 
    label: "Ən sürətli cavab", 
    icon: Zap,
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    description: "Müştəri sorğularına ən tez cavab verən ustalar"
  },
  { 
    id: "popular", 
    label: "Ən populyar", 
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    description: "Ən çox bəyənilən və izlənən ustalar"
  },
]

// Rank badge component
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <motion.div
        variants={crownVariants}
        initial="initial"
        animate="animate"
        className="relative"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -inset-1 rounded-full bg-yellow-400/30 blur-md -z-10"
        />
      </motion.div>
    )
  }
  
  if (rank === 2) {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-400/30"
      >
        <Medal className="w-5 h-5 text-white" />
      </motion.div>
    )
  }
  
  if (rank === 3) {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-600/30"
      >
        <Award className="w-5 h-5 text-white" />
      </motion.div>
    )
  }
  
  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
      <span className="text-lg font-bold text-gray-600">{rank}</span>
    </div>
  )
}

// Master card component for leaderboard
function LeaderboardCard({ 
  master, 
  categoryType 
}: { 
  master: LeaderboardMaster
  categoryType: string 
}) {
  const isTop3 = master.rank <= 3
  const categoryConfig = categories.find(c => c.id === categoryType)
  
  // Get the primary stat based on category
  const getPrimaryStat = () => {
    switch (categoryType) {
      case "rating":
        return (
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-bold text-gray-900">{master.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({master.reviewCount} rəy)</span>
          </div>
        )
      case "jobs":
        return (
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-5 h-5 text-green-500" />
            <span className="text-lg font-bold text-gray-900">{master.completedJobs}</span>
            <span className="text-sm text-gray-500">iş</span>
          </div>
        )
      case "response":
        return (
          <div className="flex items-center gap-1.5">
            <Timer className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-bold text-gray-900">
              {master.responseTime < 60 
                ? `${master.responseTime} dəq` 
                : `${Math.round(master.responseTime / 60)} saat`}
            </span>
            <span className="text-sm text-gray-500">({master.responseRate}%)</span>
          </div>
        )
      case "popular":
        return (
          <div className="flex items-center gap-1.5">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span className="text-lg font-bold text-gray-900">{master.favoritesCount}</span>
            <span className="text-sm text-gray-500">bəyənmə</span>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 } 
      }}
      className={cn(
        "group relative bg-white rounded-2xl border transition-all duration-300",
        isTop3 
          ? "border-transparent shadow-lg hover:shadow-xl" 
          : "border-gray-200 hover:border-primary-light hover:shadow-lg",
        master.rank === 1 && "ring-2 ring-yellow-400/50"
      )}
    >
      {/* Top 3 gradient background */}
      {isTop3 && (
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-10 -z-10",
          master.rank === 1 && "bg-gradient-to-br from-yellow-400 to-orange-500",
          master.rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-500",
          master.rank === 3 && "bg-gradient-to-br from-amber-600 to-amber-800",
        )} />
      )}
      
      <div className="p-5">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <RankBadge rank={master.rank} />
          
          {/* Avatar */}
          <div className="relative">
            <UserAvatar
              src={master.avatar || undefined}
              name={master.name}
              size="lg"
            />
            {master.isPremium && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </motion.div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                href={`/usta/${master.id}`}
                className="text-lg font-bold text-gray-900 hover:text-primary transition-colors truncate"
              >
                {master.name}
              </Link>
              {master.isVerified && (
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              {master.isInsured && (
                <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-0.5 truncate">
              {master.category} {master.district && `• ${master.district}`}
            </p>
          </div>
          
          {/* Primary stat */}
          <div className="hidden sm:flex flex-col items-end">
            {getPrimaryStat()}
          </div>
          
          {/* Action */}
          <Link href={`/usta/${master.id}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="group-hover:bg-primary group-hover:text-white transition-all"
            >
              Profilə bax
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        {/* Mobile primary stat */}
        <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
          {getPrimaryStat()}
        </div>
        
        {/* Secondary stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
          {categoryType !== "rating" && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{master.rating.toFixed(1)}</span>
            </div>
          )}
          {categoryType !== "jobs" && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>{master.completedJobs} iş</span>
            </div>
          )}
          {categoryType !== "response" && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{master.experience} il təcrübə</span>
            </div>
          )}
          {categoryType !== "popular" && master.favoritesCount > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-gray-400" />
              <span>{master.favoritesCount}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Empty state component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <Trophy className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Hələlik məlumat yoxdur
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Bu kateqoriya üzrə liderlik cədvəli hələ formalaşmayıb. Tezliklə ustalar burada görünəcək.
      </p>
    </motion.div>
  )
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="w-14 h-14 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-8 w-28 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Main page component
export default function LeaderboardPage() {
  const [period, setPeriod] = useState("month")
  const [category, setCategory] = useState("rating")
  const [masters, setMasters] = useState<LeaderboardMaster[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/leaderboard?period=${period}&category=${category}`)
        const data = await response.json()
        
        if (data.success) {
          setMasters(data.data)
        } else {
          toast.error(data.error || "Məlumat yüklənərkən xəta baş verdi")
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error)
        toast.error("Liderlik cədvəli yüklənərkən xəta baş verdi")
      } finally {
        setLoading(false)
      }
    }
    
    fetchLeaderboard()
  }, [period, category])
  
  const currentCategory = categories.find(c => c.id === category)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-light/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-indigo-900 py-16 lg:py-24">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-[10%] opacity-20"
        >
          <Trophy className="w-16 h-16 text-yellow-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-32 right-[15%] opacity-20"
        >
          <Crown className="w-12 h-12 text-yellow-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-[10%] opacity-20"
        >
          <Star className="w-10 h-10 text-white" />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Usta Liderlik Cədvəli</span>
            </motion.div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              🏆 Ən Yaxşı Ustalar
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              UstaBul platformasında ən yüksək performans göstərən ustaları kəşf edin. 
              Reytinq, tamamlanmış işlər və cavab sürətinə görə liderləri görün.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10">
              {[
                { icon: Users, value: "500+", label: "Aktiv usta" },
                { icon: Briefcase, value: "10K+", label: "Tamamlanmış iş" },
                { icon: Star, value: "4.8", label: "Orta reytinq" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <span className="text-sm text-white/60">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Period Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-lg shadow-gray-200/50">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                    period === p.id
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <p.icon className="w-4 h-4" />
                  {p.label}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-300 text-left group",
                  category === cat.id
                    ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    category === cat.id
                      ? "bg-white/20"
                      : `${cat.bgColor}`
                  )}>
                    <cat.icon className={cn(
                      "w-5 h-5",
                      category === cat.id ? "text-white" : cat.textColor
                    )} />
                  </div>
                </div>
                <h3 className={cn(
                  "font-semibold text-sm",
                  category === cat.id ? "text-white" : "text-gray-900"
                )}>
                  {cat.label}
                </h3>
                {category === cat.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-xl -z-10"
                  />
                )}
              </button>
            ))}
          </motion.div>
          
          {/* Category description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-gray-600 mb-8"
            >
              {currentCategory?.description}
            </motion.p>
          </AnimatePresence>
          
          {/* Leaderboard List */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <LoadingSkeleton />
            ) : masters.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div
                key={`${period}-${category}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {masters.map((master) => (
                  <LeaderboardCard 
                    key={master.id} 
                    master={master} 
                    categoryType={category}
                  />
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Bottom CTA */}
          {masters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Card className="inline-block p-8 bg-gradient-to-br from-primary-light/30 to-purple-100/30 border-none">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Siz də lider ola bilərsiniz!
                </h3>
                <p className="text-gray-600 mb-4 max-w-md">
                  UstaBul-da qeydiyyatdan keçin, sifarişləri tamamlayın və liderlik cədvəlində yerinizi tutun.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/usta-ol">
                    <Button className="bg-gradient-to-r from-primary to-primary-dark">
                      Usta ol
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/kateqoriyalar">
                    <Button variant="outline">
                      Ustaları kəşf et
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

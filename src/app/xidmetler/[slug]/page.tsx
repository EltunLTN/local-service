"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  ChevronDown,
  X,
  SlidersHorizontal,
  Grid,
  List,
  Heart,
  Phone,
  MessageSquare,
  Shield,
  Check,
  ArrowLeft,
  Zap,
  Droplets,
  Hammer,
  Sparkles,
  AirVent,
  Sofa,
  Flower2,
  Tv,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, MotionCard } from "@/components/ui/card"
import { Badge, VerifiedBadge, InsuredBadge, OnlineBadge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { Rating, SimpleRating } from "@/components/ui/rating"
import { MasterCardSkeleton } from "@/components/ui/loading"
import {
  SERVICE_CATEGORIES,
  RATING_OPTIONS,
  DISTANCE_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constants"
import { formatDistance } from "@/lib/utils"

// Filter panel component
function FilterPanel({
  isOpen,
  onClose,
  filters,
  setFilters,
}: {
  isOpen: boolean
  onClose: () => void
  filters: any
  setFilters: (filters: any) => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:shadow-none lg:z-0 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-bold text-lg">Filterlər</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Reytinq</h4>
                <div className="space-y-2">
                  {RATING_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={() =>
                          setFilters({ ...filters, rating: option.value })
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Məsafə</h4>
                <div className="space-y-2">
                  {DISTANCE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="distance"
                        value={option.value}
                        checked={filters.distance === option.value}
                        onChange={() =>
                          setFilters({ ...filters, distance: option.value })
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Mövcudluq</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availableToday}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          availableToday: e.target.checked,
                        })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Bu gün mövcud</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isOnline}
                      onChange={(e) =>
                        setFilters({ ...filters, isOnline: e.target.checked })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">İndi online</span>
                  </label>
                </div>
              </div>

              {/* Verification Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Sertifikat</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isVerified}
                      onChange={(e) =>
                        setFilters({ ...filters, isVerified: e.target.checked })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <Shield className="h-4 w-4 text-primary" />
                      Təsdiqlənmiş
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isInsured}
                      onChange={(e) =>
                        setFilters({ ...filters, isInsured: e.target.checked })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <Check className="h-4 w-4 text-success" />
                      Sığortalı
                    </span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    rating: 0,
                    distance: null,
                    availableToday: false,
                    isOnline: false,
                    isVerified: false,
                    isInsured: false,
                  })
                }
              >
                Filterləri təmizlə
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// Icon mapping
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  elektrik: Zap,
  santexnik: Droplets,
  temir: Hammer,
  temizlik: Sparkles,
  kondisioner: AirVent,
  mebel: Sofa,
  bag: Flower2,
  elektronika: Tv,
}

// Master Card Component
function MasterCard({ master }: { master: any }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <UserAvatar
              name={master.name}
              src={master.avatar}
              size="lg"
              isOnline={master.isOnline}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <Link
                  href={`/usta/${master.id}`}
                  className="font-semibold text-gray-900 hover:text-primary transition-colors"
                >
                  {master.name}
                </Link>
                <div className="flex items-center gap-2 mt-0.5">
                  {master.isVerified && <VerifiedBadge />}
                  {master.isInsured && <InsuredBadge />}
                </div>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  )}
                />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {master.bio}
            </p>

            {/* Rating and stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{master.rating}</span>
                <span className="text-gray-500">({master.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{formatDistance(master.distance)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{master.responseTime} dəq</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mt-4 flex flex-wrap gap-2">
          {master.services.slice(0, 3).map((service) => (
            <Badge key={service} variant="secondary" size="sm">
              {service}
            </Badge>
          ))}
          {master.services.length > 3 && (
            <Badge variant="outline" size="sm">
              +{master.services.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {master.hourlyRate}₼
            </span>
            <span className="text-sm text-gray-500">/saat</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Phone className="h-4 w-4 mr-1" />
              Zəng
            </Button>
            <Button size="sm" asChild>
              <Link href={`/usta/${master.id}`}>Profil</Link>
            </Button>
          </div>
        </div>
      </div>
    </MotionCard>
  )
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  // Find category info
  const category = SERVICE_CATEGORIES.find((c) => c.slug === slug)
  const CategoryIcon = categoryIcons[slug] || Zap

  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [sortBy, setSortBy] = useState("recommended")
  const [filters, setFilters] = useState({
    rating: 0,
    distance: null as number | null,
    availableToday: false,
    isOnline: false,
    isVerified: false,
    isInsured: false,
  })
  const [masters, setMasters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch masters from API
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/masters?categoryId=${slug}`)
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setMasters(json.data)
        }
      } catch (error) {
        console.error("Ustalar yüklənmədi:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMasters()
  }, [slug])

  // Filter masters by category
  const categoryMasters = useMemo(() => {
    return masters.filter((m: any) => m.category === slug)
  }, [slug, masters])

  // Apply filters
  const filteredMasters = useMemo(() => {
    let result = [...categoryMasters]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.bio.toLowerCase().includes(query) ||
          m.services.some((s) => s.toLowerCase().includes(query))
      )
    }

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter((m) => m.rating >= filters.rating)
    }

    // Distance filter
    if (filters.distance) {
      result = result.filter((m) => m.distance <= filters.distance!)
    }

    // Availability filters
    if (filters.availableToday) {
      result = result.filter((m) => m.availability.includes("Bu gün"))
    }
    if (filters.isOnline) {
      result = result.filter((m) => m.isOnline)
    }

    // Verification filters
    if (filters.isVerified) {
      result = result.filter((m) => m.isVerified)
    }
    if (filters.isInsured) {
      result = result.filter((m) => m.isInsured)
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "price_low":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate)
        break
      case "price_high":
        result.sort((a, b) => b.hourlyRate - a.hourlyRate)
        break
      case "distance":
        result.sort((a, b) => a.distance - b.distance)
        break
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return result
  }, [categoryMasters, searchQuery, filters, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/xidmetler"
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Xidmətlər
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <CategoryIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {category?.name || slug}
              </h1>
              <p className="text-white/80">
                {filteredMasters.length} usta tapıldı
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Usta və ya xidmət axtar..."
                className="pl-12 h-14 text-lg bg-white border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <Card className="sticky top-24 p-6">
              <h3 className="font-bold text-lg mb-6">Filterlər</h3>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Reytinq</h4>
                <div className="space-y-2">
                  {RATING_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={() =>
                          setFilters({ ...filters, rating: option.value })
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Məsafə</h4>
                <div className="space-y-2">
                  {DISTANCE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="distance"
                        value={option.value}
                        checked={filters.distance === option.value}
                        onChange={() =>
                          setFilters({ ...filters, distance: option.value })
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Mövcudluq</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availableToday}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          availableToday: e.target.checked,
                        })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Bu gün mövcud</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isOnline}
                      onChange={(e) =>
                        setFilters({ ...filters, isOnline: e.target.checked })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">İndi online</span>
                  </label>
                </div>
              </div>

              {/* Verification */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Sertifikat</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isVerified}
                      onChange={(e) =>
                        setFilters({ ...filters, isVerified: e.target.checked })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <Shield className="h-4 w-4 text-primary" />
                      Təsdiqlənmiş
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isInsured}
                      onChange={(e) =>
                        setFilters({ ...filters, isInsured: e.target.checked })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <Check className="h-4 w-4 text-success" />
                      Sığortalı
                    </span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    rating: 0,
                    distance: null,
                    availableToday: false,
                    isOnline: false,
                    isVerified: false,
                    isInsured: false,
                  })
                }
              >
                Filterləri təmizlə
              </Button>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filterlər
                </Button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 px-3 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {filteredMasters.length} nəticə
                </span>
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list"
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid"
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredMasters.length > 0 ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "space-y-4"
                )}
              >
                {filteredMasters.map((master, index) => (
                  <motion.div
                    key={master.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MasterCard master={master} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Usta tapılmadı
                </h3>
                <p className="text-gray-500 mb-6">
                  Bu kateqoriyada axtarış kriteriyalarınıza uyğun usta yoxdur.
                  Filterləri dəyişməyə və ya bütün ustalara baxmağa cəhd edin.
                </p>
                <Button asChild>
                  <Link href="/xidmetler">Bütün xidmətlərə bax</Link>
                </Button>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

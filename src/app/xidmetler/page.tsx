// @ts-nocheck
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Grid,
  List,
  Heart,
  Phone,
  MessageSquare,
  Shield,
  Check,
  Zap,
  Droplets,
  Hammer,
  Sparkles,
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
// formatDistance removed - unused

// Filtr komponenti
interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Checkbox komponenti
interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
  count?: number
}

function FilterCheckbox({ label, checked, onChange, count }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
          checked
            ? "bg-primary border-primary"
            : "border-gray-300 group-hover:border-primary"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
      <span className="text-sm text-gray-700 flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </label>
  )
}

// Qiymət slider
interface PriceSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

function PriceSlider({ min, max, value, onChange }: PriceSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-primary">{value[0]}₼</span>
        <span className="text-gray-400">-</span>
        <span className="font-medium text-primary">{value[1]}₼</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  )
}

// Usta kartı
interface MasterCardProps {
  master: any
  view: "grid" | "list"
}

function MasterCard({ master, view }: MasterCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  if (view === "list") {
    return (
      <MotionCard className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0 flex items-start gap-4">
            <div className="relative">
              <UserAvatar
                name={master.name}
                src={master.avatar}
                size="lg"
                isOnline={master.isOnline}
              />
            </div>
            <div className="md:hidden flex-1">
              <h3 className="font-bold text-lg text-gray-900">{master.name}</h3>
              <p className="text-sm text-gray-500">{master.categoryName}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="hidden md:block">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                  {master.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {master.categoryName} | {master.experience} il təcrübə
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SimpleRating value={master.rating} />
                <span className="text-sm text-gray-500">({master.reviewCount})</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{master.bio}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {(master.services || []).slice(0, 3).map((service: string, i: number) => (
                <Badge key={i} variant="secondary" size="sm">
                  {service}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {master.district && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {master.district}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {master.availability || "Mövcuddur"}
              </span>
              <span className="flex items-center gap-1">
                💼 {master.completedJobs} iş
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {master.isVerified && <VerifiedBadge size="sm" />}
              {master.isInsured && <InsuredBadge size="sm" />}
              {master.isOnline && <OnlineBadge />}
            </div>
          </div>

          {/* Actions */}
          <div className="flex md:flex-col items-center md:items-end justify-between gap-4 md:min-w-[160px]">
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">
                {master.hourlyRate}₼
              </span>
              <span className="text-sm text-gray-500">/saat</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(isFavorite && "text-red-500")}
              >
                <Heart
                  className={cn("h-5 w-5", isFavorite && "fill-current")}
                />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/usta/${master.id}`}>Ətraflı</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/sifaris/yarat?usta=${master.id}`}>
                  Sifariş ver
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </MotionCard>
    )
  }

  // Grid view
  return (
    <MotionCard className="group">
      <div className="relative">
        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-0 right-0 z-10 p-2"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            )}
          />
        </button>

        {/* Avatar & Name */}
        <div className="text-center mb-4">
          <div className="relative inline-block mb-3">
            <UserAvatar
              name={master.name}
              src={master.avatar}
              size="xl"
              isOnline={master.isOnline}
            />
          </div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
            {master.name}
          </h3>
          <p className="text-sm text-gray-500">{master.categoryName}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <SimpleRating value={master.rating} />
          <span className="text-sm text-gray-500">({master.reviewCount})</span>
        </div>

        {/* Info */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
          {master.district && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {master.district}
            </span>
          )}
          <span>💼 {master.completedJobs} iş</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {master.isVerified && <VerifiedBadge size="sm" />}
          {master.isInsured && <InsuredBadge size="sm" />}
        </div>

        {/* Price & Actions */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">{master.availability || "Mövcuddur"}</span>
            <div>
              <span className="text-xl font-bold text-gray-900">
                {master.hourlyRate}₼
              </span>
              <span className="text-xs text-gray-500">/saat</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/usta/${master.id}`}>Ətraflı</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/sifaris/yarat?usta=${master.id}`}>Sifariş</Link>
            </Button>
          </div>
        </div>
      </div>
    </MotionCard>
  )
}

export default function ServicesPage() {
  // Filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [maxDistance, setMaxDistance] = useState<number | null>(null)
  const [isAvailableToday, setIsAvailableToday] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isInsured, setIsInsured] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [masters, setMasters] = useState<any[]>([])

  // Filter sections open state
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
    distance: false,
    availability: false,
  })

  // Fetch masters from API
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/masters")
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
  }, [])

  // Filter masters
  const filteredMasters = masters.filter((master: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !master.name.toLowerCase().includes(query) &&
        !(master.categoryName || "").toLowerCase().includes(query) &&
        !(master.services || []).some((s: string) => s.toLowerCase().includes(query))
      ) {
        return false
      }
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(master.category)) {
      return false
    }
    if (master.hourlyRate < priceRange[0] || master.hourlyRate > priceRange[1]) {
      return false
    }
    if (minRating && master.rating < minRating) {
      return false
    }
    if (isVerified && !master.isVerified) {
      return false
    }
    if (isInsured && !master.isInsured) {
      return false
    }
    return true
  })

  // Sort masters
  const sortedMasters = [...filteredMasters].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price_low":
        return a.hourlyRate - b.hourlyRate
      case "price_high":
        return b.hourlyRate - a.hourlyRate
      case "distance":
        return 0
      case "reviews":
        return b.reviewCount - a.reviewCount
      default:
        return 0
    }
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setPriceRange([0, 100])
    setMinRating(null)
    setMaxDistance(null)
    setIsAvailableToday(false)
    setIsVerified(false)
    setIsInsured(false)
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100 ||
    minRating !== null ||
    maxDistance !== null ||
    isAvailableToday ||
    isVerified ||
    isInsured

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-0">
      {/* Category Filter */}
      <FilterSection
        title="Kateqoriya"
        isOpen={openSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="space-y-1">
          {SERVICE_CATEGORIES.slice(0, 6).map((category) => (
            <FilterCheckbox
              key={category.id}
              label={category.name}
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
              count={
                masters.filter((m: any) => m.category === category.id || (m.categories || []).some((c: any) => c.slug === category.id)).length
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Qiymət Aralığı"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <PriceSlider
          min={0}
          max={100}
          value={priceRange}
          onChange={setPriceRange}
        />
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection
        title="Reytinq"
        isOpen={openSections.rating}
        onToggle={() => toggleSection("rating")}
      >
        <div className="space-y-2">
          {RATING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 py-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === option.value}
                onChange={() => setMinRating(option.value)}
                className="w-4 h-4 text-primary accent-primary"
              />
              <span className="text-sm">{option.label} və yuxarı</span>
            </label>
          ))}
          {minRating && (
            <button
              onClick={() => setMinRating(null)}
              className="text-xs text-primary hover:underline"
            >
              Təmizlə
            </button>
          )}
        </div>
      </FilterSection>

      {/* Distance Filter */}
      <FilterSection
        title="Məsafə"
        isOpen={openSections.distance}
        onToggle={() => toggleSection("distance")}
      >
        <div className="space-y-2">
          {DISTANCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 py-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="distance"
                checked={maxDistance === option.value}
                onChange={() => setMaxDistance(option.value)}
                className="w-4 h-4 text-primary accent-primary"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
          {maxDistance && (
            <button
              onClick={() => setMaxDistance(null)}
              className="text-xs text-primary hover:underline"
            >
              Təmizlə
            </button>
          )}
        </div>
      </FilterSection>

      {/* Availability Filter */}
      <FilterSection
        title="Mövcudluq"
        isOpen={openSections.availability}
        onToggle={() => toggleSection("availability")}
      >
        <div className="space-y-2">
          <FilterCheckbox
            label="Bu gün mövcud"
            checked={isAvailableToday}
            onChange={() => setIsAvailableToday(!isAvailableToday)}
          />
          <FilterCheckbox
            label="Doğrulanmış"
            checked={isVerified}
            onChange={() => setIsVerified(!isVerified)}
          />
          <FilterCheckbox
            label="Sığortalı"
            checked={isInsured}
            onChange={() => setIsInsured(!isInsured)}
          />
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Filtrləri təmizlə
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Usta və ya xidmət axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtrlər
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {selectedCategories.length + (minRating ? 1 : 0) + (maxDistance ? 1 : 0)}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-500">Aktiv filtrlər:</span>
              {selectedCategories.map((catId) => {
                const category = SERVICE_CATEGORIES.find((c) => c.id === catId)
                return (
                  <Badge
                    key={catId}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleCategory(catId)}
                  >
                    {category?.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )
              })}
              {minRating && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setMinRating(null)}
                >
                  ⭐ {minRating}+
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {maxDistance && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setMaxDistance(null)}
                >
                  📍 {maxDistance}km
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Hamısını təmizlə
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-36 bg-white rounded-xl border p-5">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Filtrlər</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                <strong className="text-gray-900">{sortedMasters.length}</strong> usta
                tapıldı
              </p>
            </div>

            {/* Results */}
            {isLoading ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                )}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MasterCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedMasters.length === 0 ? (
              <Card className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Usta tapılmadı
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Axtarış kriteriyalarınıza uyğun usta tapılmadı. Filtrləri
                  dəyişdirməyi sınayın.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Filtrləri təmizlə
                </Button>
              </Card>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                )}
              >
                {sortedMasters.map((master, index) => (
                  <motion.div
                    key={master.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MasterCard master={master} view={viewMode} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {sortedMasters.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Daha çox yüklə
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">Filtrlər</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterContent />
                <div className="mt-6 pt-4 border-t">
                  <Button
                    className="w-full"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    {sortedMasters.length} nəticəni göstər
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

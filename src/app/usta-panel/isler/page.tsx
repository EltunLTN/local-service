"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  User,
  ChevronRight,
  Loader2,
  X,
  Send,
  AlertCircle,
  Info,
  CheckCircle,
  DollarSign,
  Navigation,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn, formatPrice, formatDate, formatRelativeTime, formatDistance, truncate } from "@/lib/utils"
import { SERVICE_CATEGORIES, BAKU_DISTRICTS } from "@/lib/constants"
import toast from "react-hot-toast"

// Types
interface Customer {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
}

interface Job {
  id: string
  orderNumber: string
  title: string
  description: string
  status: string
  address: string
  district: string | null
  lat: number | null
  lng: number | null
  scheduledDate: string
  scheduledTime: string
  estimatedPrice: number | null
  urgency: string
  photos: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  customer: Customer
  createdAt: string
  _count?: {
    applications: number
  }
}

interface MasterProfile {
  id: string
  lat: number | null
  lng: number | null
}

// Urgency config
const URGENCY_CONFIG: Record<string, { label: string; color: string; priority: number }> = {
  URGENT: { label: "Təcili", color: "bg-red-100 text-red-700", priority: 3 },
  TODAY: { label: "Bu gün", color: "bg-orange-100 text-orange-700", priority: 2 },
  PLANNED: { label: "Planlı", color: "bg-gray-100 text-gray-700", priority: 1 },
}

export default function MasterBrowseJobsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  
  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Master profile for distance calculation
  const [masterProfile, setMasterProfile] = useState<MasterProfile | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [districtFilter, setDistrictFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  
  // Apply modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applicationForm, setApplicationForm] = useState({
    price: "",
    message: "",
    estimatedDuration: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())

  // Auth check
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  // Fetch master profile for distance calculation
  useEffect(() => {
    if (session) {
      fetchMasterProfile()
    }
  }, [session])

  // Fetch jobs
  useEffect(() => {
    if (session) {
      fetchJobs()
    }
  }, [session])

  const fetchMasterProfile = async () => {
    try {
      const res = await fetch("/api/master/profile")
      if (res.ok) {
        const data = await res.json()
        setMasterProfile(data.master || data.data)
      }
    } catch (error) {
      console.error("Error fetching master profile:", error)
    }
  }

  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      
      // Fetch pending orders (available for bidding)
      const res = await fetch("/api/orders?status=PENDING&role=browse&limit=50")
      
      if (res.ok) {
        const data = await res.json()
        setJobs(data.orders || data.data || [])
      } else {
        console.error("Failed to fetch jobs")
      }
      
      // Also fetch already applied jobs
      const appRes = await fetch("/api/applications")
      if (appRes.ok) {
        const appData = await appRes.json()
        const appliedIds = new Set<string>(
          (appData.data || []).map((app: any) => app.orderId)
        )
        setAppliedJobs(appliedIds)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast.error("İşlər yüklənmədi")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs]
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.address.toLowerCase().includes(query)
      )
    }
    
    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(job => job.category.slug === categoryFilter)
    }
    
    // District filter
    if (districtFilter !== "all") {
      result = result.filter(job => 
        job.district?.toLowerCase() === districtFilter.toLowerCase()
      )
    }
    
    // Urgency filter
    if (urgencyFilter !== "all") {
      result = result.filter(job => job.urgency === urgencyFilter)
    }
    
    // Add distance if master has location
    if (masterProfile?.lat && masterProfile?.lng) {
      result = result.map(job => ({
        ...job,
        distance: job.lat && job.lng
          ? calculateDistance(masterProfile.lat!, masterProfile.lng!, job.lat, job.lng)
          : null
      }))
    }
    
    // Sort by urgency priority, then by date
    result.sort((a, b) => {
      const priorityA = URGENCY_CONFIG[a.urgency]?.priority || 0
      const priorityB = URGENCY_CONFIG[b.urgency]?.priority || 0
      if (priorityB !== priorityA) return priorityB - priorityA
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    
    return result
  }, [jobs, searchQuery, categoryFilter, districtFilter, urgencyFilter, masterProfile])

  const openApplyModal = (job: Job) => {
    setSelectedJob(job)
    setApplicationForm({
      price: job.estimatedPrice ? String(job.estimatedPrice) : "",
      message: "",
      estimatedDuration: "",
    })
    setApplyModalOpen(true)
  }

  const handleApply = async () => {
    if (!selectedJob || isSubmitting) return
    
    // Validation
    if (!applicationForm.price || parseFloat(applicationForm.price) <= 0) {
      toast.error("Düzgün qiymət daxil edin")
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedJob.id,
          price: parseFloat(applicationForm.price),
          message: applicationForm.message.trim() || null,
          estimatedDuration: applicationForm.estimatedDuration 
            ? parseInt(applicationForm.estimatedDuration) 
            : null,
        }),
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        toast.success("Müraciətiniz göndərildi!")
        setApplyModalOpen(false)
        setAppliedJobs(prev => new Set(prev).add(selectedJob.id))
        setSelectedJob(null)
      } else {
        toast.error(data.message || "Xəta baş verdi")
      }
    } catch (error) {
      console.error("Error applying:", error)
      toast.error("Xəta baş verdi")
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setDistrictFilter("all")
    setUrgencyFilter("all")
  }

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || 
    districtFilter !== "all" || urgencyFilter !== "all"

  // Loading state
  if (authStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mövcud işlər</h1>
              <p className="text-sm text-gray-500">
                Müştəri sifarişlərinə müraciət edin
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchJobs(true)}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Yenilə
            </Button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="İş axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                rightIcon={
                  searchQuery ? (
                    <button onClick={() => setSearchQuery("")}>
                      <X className="h-4 w-4" />
                    </button>
                  ) : undefined
                }
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtrlər
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kateqoriya" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Bütün kateqoriyalar</SelectItem>
                      {SERVICE_CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rayon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Bütün rayonlar</SelectItem>
                      {BAKU_DISTRICTS.map(district => (
                        <SelectItem key={district.id} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Təcililik" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      <SelectItem value="URGENT">Təcili</SelectItem>
                      <SelectItem value="TODAY">Bu gün</SelectItem>
                      <SelectItem value="PLANNED">Planlı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-end pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-gray-500"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Filtrləri təmizlə
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredJobs.length} iş tapıldı
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          // Empty state
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? "Nəticə tapılmadı" : "Hal-hazırda iş yoxdur"}
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-4">
              {hasActiveFilters 
                ? "Axtarış kriteriyalarını dəyişdirin və ya filtrləri təmizləyin" 
                : "Yeni sifarişlər daxil olduqda burada görünəcək"}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Filtrləri təmizlə
              </Button>
            )}
          </Card>
        ) : (
          // Jobs grid
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => {
                const urgencyConfig = URGENCY_CONFIG[job.urgency] || URGENCY_CONFIG.PLANNED
                const hasApplied = appliedJobs.has(job.id)
                const jobWithDistance = job as Job & { distance?: number | null }
                
                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      "p-4 h-full flex flex-col transition-all hover:shadow-md",
                      hasApplied && "opacity-70 bg-gray-50"
                    )}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Badge className={urgencyConfig.color}>
                          {urgencyConfig.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(job.createdAt)}
                        </span>
                      </div>

                      {/* Title & Category */}
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-primary mb-2">
                        {job.category.name}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                        {job.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {job.customer.firstName} {job.customer.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                          <span>{formatDate(job.scheduledDate)}</span>
                          <span className="text-gray-400">•</span>
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span>{job.scheduledTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {job.district || job.address}
                          </span>
                          {jobWithDistance.distance != null && (
                            <>
                              <span className="text-gray-400">•</span>
                              <Navigation className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-primary font-medium">
                                {formatDistance(jobWithDistance.distance)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          {job.estimatedPrice ? (
                            <p className="font-bold text-gray-900">
                              {formatPrice(job.estimatedPrice)}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">Qiymət razılaşma ilə</p>
                          )}
                          {job._count && job._count.applications > 0 && (
                            <p className="text-xs text-gray-500">
                              {job._count.applications} müraciət
                            </p>
                          )}
                        </div>

                        {hasApplied ? (
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Müraciət edildi
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => openApplyModal(job)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Müraciət et
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Tips */}
        {filteredJobs.length > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200 mt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Müraciət etmək üçün məsləhətlər</p>
                <ul className="text-blue-700 space-y-1 list-disc list-inside">
                  <li>Rəqabətqabiliyyətli qiymət təklif edin</li>
                  <li>Müştəriyə özünüzü tanıdan mesaj yazın</li>
                  <li>Təxmini iş müddətini göstərin</li>
                  <li>Tez cavab verin - ilk müraciətlər üstünlük qazanır</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Apply Modal */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>İşə müraciət et</DialogTitle>
            <DialogDescription>
              {selectedJob && (
                <span>{selectedJob.title} - {selectedJob.category.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4 py-4">
              {/* Job Summary */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{selectedJob.customer.firstName} {selectedJob.customer.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(selectedJob.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 col-span-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{selectedJob.address}</span>
                  </div>
                </div>
                {selectedJob.estimatedPrice && (
                  <div className="mt-2 pt-2 border-t">
                    <span className="text-gray-600">Müştəri büdcəsi: </span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(selectedJob.estimatedPrice)}
                    </span>
                  </div>
                )}
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Təklif etdiyiniz qiymət (AZN) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="50"
                  value={applicationForm.price}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, price: e.target.value }))}
                  leftIcon={<DollarSign className="h-4 w-4" />}
                  min="1"
                  step="0.01"
                />
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Təxmini müddət (saat)
                </label>
                <Input
                  type="number"
                  placeholder="2"
                  value={applicationForm.estimatedDuration}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                  leftIcon={<Clock className="h-4 w-4" />}
                  min="1"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müştəriyə mesaj
                </label>
                <Textarea
                  placeholder="Özünüzü tanıdın, niyə sizi seçməlidirlər..."
                  value={applicationForm.message}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Yaxşı yazılmış mesaj qəbul şansınızı artırır
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApplyModalOpen(false)}
              disabled={isSubmitting}
            >
              Ləğv et
            </Button>
            <Button
              onClick={handleApply}
              disabled={isSubmitting || !applicationForm.price}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Müraciət göndər
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

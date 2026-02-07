// @ts-nocheck
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Heart,
  Share2,
  Shield,
  Award,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  ThumbsUp,
  Flag,
  MoreVertical,
  Briefcase,
  Users,
  TrendingUp,
  Zap,
  Wrench,
  Camera,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, MotionCard } from "@/components/ui/card"
import { Badge, VerifiedBadge, InsuredBadge, OnlineBadge, PremiumBadge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import { Rating, SimpleRating } from "@/components/ui/rating"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDate, formatRelativeTime, formatDistance } from "@/lib/utils"
import toast from "react-hot-toast"

// Məsafəni formatla (metr və km)
function formatDistanceText(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

// Stats Card komponenti
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
}) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-xl">
      <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
      <div className="text-2xl font-bold text-gray-900">
        {value}
        {suffix}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

// Review Card komponenti
function ReviewCard({ review, onReport }: { review: any, onReport: (reviewId: string) => void }) {
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)

  const handleHelpful = () => {
    if (!isHelpful) {
      setHelpfulCount((prev: number) => prev + 1)
    } else {
      setHelpfulCount((prev: number) => prev - 1)
    }
    setIsHelpful(!isHelpful)
  }

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <UserAvatar name={review.author.name} src={review.author.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.author.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <SimpleRating value={review.rating} size="sm" />
                <span>•</span>
                <span>{formatRelativeTime(new Date(review.date))}</span>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <Badge variant="secondary" size="sm" className="mb-3">
            {review.service}
          </Badge>

          <p className="text-gray-700 mb-3">{review.content}</p>

          {/* Review photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.photos.map((photo, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center"
                >
                  <Camera className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>
          )}

          {/* Reply */}
          {review.reply && (
            <div className="mt-3 pl-4 border-l-2 border-primary/30">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-primary">Ustanın cavabı: </span>
                {review.reply.content}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatRelativeTime(new Date(review.reply.date))}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t">
            <button
              onClick={handleHelpful}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                isHelpful ? "text-primary" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ThumbsUp className={cn("h-4 w-4", isHelpful && "fill-current")} />
              Faydalı ({helpfulCount})
            </button>
            <button 
              onClick={() => onReport(review.id)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <Flag className="h-4 w-4" />
              Şikayət
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function MasterProfilePage() {
  const params = useParams()
  const masterId = params?.id as string || "1"
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<any>(null)
  const [reviewsFilter, setReviewsFilter] = useState("all")
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReviewId, setReportReviewId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState("")
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, content: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [master, setMaster] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  // Fetch master data from API
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/masters/${masterId}`)
        const json = await res.json()
        if (json.success && json.data) {
          const d = json.data
          setMaster(d.master || d)
          setPortfolio(d.portfolio || [])
          setReviews(d.reviews || [])
        }
      } catch (error) {
        console.error("Usta məlumatları yüklənmədi:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMaster()
  }, [masterId])

  // Handle report review
  const handleReportReview = (reviewId: string) => {
    setReportReviewId(reviewId)
    setShowReportDialog(true)
  }

  const submitReport = () => {
    if (reportReason.trim()) {
      toast.success("Şikayətiniz qəbul olundu. 24 saat ərzində araşdırılacaq.")
      setShowReportDialog(false)
      setReportReason("")
      setReportReviewId(null)
    } else {
      toast.error("Şikayət səbəbini yazın")
    }
  }

  // Handle submit review
  const submitReview = () => {
    if (newReview.content.trim().length < 10) {
      toast.error("Rəy minimum 10 simvol olmalıdır")
      return
    }
    toast.success("Rəyiniz göndərildi və yoxlamadan sonra dərc ediləcək!")
    setShowWriteReview(false)
    setNewReview({ rating: 5, content: "" })
  }

  // Filter reviews
  const filteredReviews = reviews.filter((review: any) => {
    if (reviewsFilter === "all") return true
    if (reviewsFilter === "5") return review.rating === 5
    if (reviewsFilter === "4") return review.rating === 4
    if (reviewsFilter === "low") return review.rating < 4
    return true
  })

  // Rating breakdown
  const ratingBreakdown = {
    5: 95,
    4: 25,
    3: 5,
    2: 1,
    1: 1,
  }
  const totalReviews = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0)

  if (isLoading || !master) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover & Profile Header */}
      <div className="bg-gradient-to-r from-primary/10 to-orange-500/10">
        <div className="container-custom">
          {/* Cover Image Area */}
          <div className="h-32 md:h-48 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-b-3xl" />
          </div>

          {/* Profile Info */}
          <div className="relative pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
              {/* Avatar */}
              <div className="relative -mt-16 md:-mt-20 z-10">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                  <UserAvatar
                    name={master.name}
                    src={master.avatar}
                    size="xl"
                    className="w-full h-full text-4xl"
                  />
                </div>
                {master.isOnline && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Name & Quick Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {master.name}
                  </h1>
                  {master.isVerified && <VerifiedBadge />}
                  {master.isPremium && <PremiumBadge />}
                </div>
                <p className="text-gray-600 mb-3">
                  {master.categoryName} | {master.experience} il təcrübə
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {master.location} · <span className="font-medium text-primary">{formatDistanceText(master.distance)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {master.responseTime} dəq cavab
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(master.memberSince).getFullYear()}-dən üzv
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(isFavorite && "text-red-500")}
                >
                  <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const url = window.location.href
                    const text = `${master.name} - ${master.categoryName} ustası UstaBul-da`
                    if (navigator.share) {
                      navigator.share({ title: master.name, text, url })
                    } else {
                      navigator.clipboard.writeText(url)
                      toast.success("Link kopyalandı!")
                    }
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" asChild>
                  <a href={`tel:${master.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Zəng et
                  </a>
                </Button>
                <Button asChild>
                  <Link href={`/sifaris/yarat?usta=${master.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Sifariş ver
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            {/* Price & Rating Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    {master.hourlyRate}₼
                  </span>
                  <span className="text-gray-500">/saat</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-bold">{master.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {master.reviewCount} rəy
                  </span>
                </div>
              </div>

              <Button className="w-full mb-3" size="lg" asChild>
                <Link href={`/sifaris/yarat?usta=${master.id}`}>
                  Sifariş ver
                </Link>
              </Button>

              <p className="text-center text-sm text-gray-500">
                <Clock className="inline h-4 w-4 mr-1" />
                {master.availability}
              </p>
            </Card>

            {/* Stats Card */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Statistika</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={Briefcase}
                  label="Tamamlanmış iş"
                  value={master.completedJobs}
                />
                <StatCard
                  icon={Users}
                  label="Təkrar müştəri"
                  value={master.stats.repeatRate}
                  suffix="%"
                />
                <StatCard
                  icon={Clock}
                  label="Vaxtında gəlmə"
                  value={master.stats.onTimeRate}
                  suffix="%"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Məmnuniyyət"
                  value={master.stats.satisfactionRate}
                  suffix="%"
                />
              </div>
            </Card>

            {/* Badges Card */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Sertifikatlar</h3>
              <div className="space-y-3">
                {master.isVerified && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Doğrulanmış</p>
                      <p className="text-xs text-blue-600">
                        Şəxsiyyət yoxlanılıb
                      </p>
                    </div>
                  </div>
                )}
                {master.isInsured && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Sığortalı</p>
                      <p className="text-xs text-green-600">
                        İş sığortası mövcuddur
                      </p>
                    </div>
                  </div>
                )}
                {master.isPremium && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">Premium</p>
                      <p className="text-xs text-purple-600">
                        Top reytinqli usta
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Working Hours */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">İş saatları</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">B.e - Cümə</span>
                  <span className="font-medium">{master.workingHours.weekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Şənbə - Bazar</span>
                  <span className="font-medium">{master.workingHours.weekends}</span>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Əlaqə</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${master.phone}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium">{master.phone}</span>
                </a>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Dillər:</p>
                <div className="flex flex-wrap gap-2">
                  {master.languages.map((lang: string) => (
                    <Badge key={lang} variant="secondary" size="sm">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList variant="underline" className="mb-6">
                <TabsTrigger value="about">Haqqında</TabsTrigger>
                <TabsTrigger value="services">Xidmətlər</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Rəylər</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Haqqımda</h2>
                    <p className="text-gray-700 leading-relaxed">{master.bio}</p>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Bacarıqlar
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {master.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                <Card className="overflow-hidden">
                  <div className="divide-y">
                    {master.services.map((service: { id: string; name: string; price: number; duration: string }) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {service.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ~{service.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">
                            {service.price}₼
                          </span>
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              href={`/sifaris/yarat?usta=${master.id}&xidmet=${service.id}`}
                            >
                              Seç
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolio.map((item: any) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 cursor-pointer group"
                      onClick={() => setSelectedPortfolioItem(item)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium">{item.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="space-y-6">
                  {/* Rating Overview */}
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Overall Rating */}
                      <div className="text-center md:text-left md:pr-8 md:border-r">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {master.rating}
                        </div>
                        <Rating value={master.rating} readonly size="lg" />
                        <p className="text-sm text-gray-500 mt-2">
                          {master.reviewCount} rəy əsasında
                        </p>
                      </div>

                      {/* Rating Breakdown */}
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="w-12 text-sm text-gray-600">
                              {rating} ulduz
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${
                                    (ratingBreakdown[rating as keyof typeof ratingBreakdown] /
                                      totalReviews) *
                                    100
                                  }%`,
                                }}
                                className="h-full bg-yellow-400 rounded-full"
                                transition={{ duration: 0.5, delay: 0.1 * (5 - rating) }}
                              />
                            </div>
                            <span className="w-10 text-sm text-gray-500 text-right">
                              {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Filtr:</span>
                    {[
                      { value: "all", label: "Hamısı" },
                      { value: "5", label: "5 ulduz" },
                      { value: "4", label: "4 ulduz" },
                      { value: "low", label: "Digər" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setReviewsFilter(option.value)}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-full transition-colors",
                          reviewsFilter === option.value
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Write Review Button */}
                  <div className="mb-4">
                    <Button onClick={() => setShowWriteReview(true)} className="w-full md:w-auto">
                      <Star className="mr-2 h-4 w-4" />
                      Rəy yaz
                    </Button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} onReport={handleReportReview} />
                    ))}
                  </div>

                  {/* Load More */}
                  <div className="text-center">
                    <Button variant="outline">Daha çox yüklə</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Portfolio Modal */}
      <Dialog
        open={!!selectedPortfolioItem}
        onOpenChange={() => setSelectedPortfolioItem(null)}
      >
        <DialogContent size="lg" className="max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedPortfolioItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedPortfolioItem?.url && (
              <img 
                src={selectedPortfolioItem.url} 
                alt={selectedPortfolioItem.title}
                className="w-full rounded-lg mb-4"
              />
            )}
            <p className="text-gray-600">{selectedPortfolioItem?.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              {selectedPortfolioItem &&
                formatDate(new Date(selectedPortfolioItem.date))}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Review Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rəyi şikayət et</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">Bu rəyi niyə şikayət edirsiniz?</p>
            <div className="space-y-2">
              {["Spam və ya reklam", "Kobud/təhqiredici dil", "Yanlış məlumat", "Digər"].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setReportReason(reason)}
                  className={cn(
                    "w-full p-3 text-left rounded-lg border transition-colors",
                    reportReason === reason 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {reason}
                </button>
              ))}
            </div>
            {reportReason === "Digər" && (
              <textarea
                placeholder="Əlavə məlumat yazın..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                onChange={(e) => setReportReason(e.target.value)}
              />
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowReportDialog(false)} className="flex-1">
                Ləğv et
              </Button>
              <Button onClick={submitReport} className="flex-1">
                Göndər
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Write Review Dialog */}
      <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rəy yaz</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reytinq</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                    className="p-1"
                  >
                    <Star 
                      className={cn(
                        "h-8 w-8 transition-colors",
                        rating <= newReview.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rəyiniz</label>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Təcrübəniz haqqında yazın..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowWriteReview(false)} className="flex-1">
                Ləğv et
              </Button>
              <Button onClick={submitReview} className="flex-1">
                Göndər
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

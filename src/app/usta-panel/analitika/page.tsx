"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Clock,
  Calendar,
  ArrowLeft,
  Loader2,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import toast from "react-hot-toast"

interface AnalyticsData {
  overview: {
    totalViews: number
    profileViews: number
    searchAppearances: number
    contactClicks: number
    viewsChange: number
    profileViewsChange: number
  }
  orders: {
    total: number
    completed: number
    cancelled: number
    pending: number
    completionRate: number
  }
  ratings: {
    average: number
    total: number
    distribution: { rating: number; count: number }[]
    recentReviews: {
      id: string
      rating: number
      comment: string
      customer: string
      createdAt: string
    }[]
  }
  performance: {
    responseRate: number
    responseTime: number
    onTimeDelivery: number
    repeatCustomers: number
  }
  monthlyData: {
    month: string
    orders: number
    earnings: number
  }[]
}

export default function MasterAnalyticsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  useEffect(() => {
    if (session) {
      fetchAnalytics()
    }
  }, [session, period])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/master/analytics?period=${period}`)
      if (res.ok) {
        const result = await res.json()
        setData(result.analytics)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authStatus === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/usta-panel">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Analitika</h1>
              <p className="text-gray-600">Performansınızı izləyin</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { value: "week", label: "Həftə" },
              { value: "month", label: "Ay" },
              { value: "year", label: "İl" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={period === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <>
            {/* Overview Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Profil baxışları</span>
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{data.overview.profileViews}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {data.overview.profileViewsChange >= 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">+{data.overview.profileViewsChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">{data.overview.profileViewsChange}%</span>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Axtarış görünüşləri</span>
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">{data.overview.searchAppearances}</p>
                <p className="text-sm text-gray-500 mt-2">Axtarış nəticələrində</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Əlaqə kliklər</span>
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold">{data.overview.contactClicks}</p>
                <p className="text-sm text-gray-500 mt-2">Müştəri müraciəti</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Orta reytinq</span>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold">{data.ratings.average.toFixed(1)}</p>
                <p className="text-sm text-gray-500 mt-2">{data.ratings.total} rəy</p>
              </Card>
            </div>

            {/* Orders & Performance */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Sifariş statistikası</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Ümumi sifarişlər</span>
                    </div>
                    <span className="font-bold">{data.orders.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <span>Tamamlanmış</span>
                    </div>
                    <span className="font-bold text-green-600">{data.orders.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <span>Gözləyən</span>
                    </div>
                    <span className="font-bold text-yellow-600">{data.orders.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <span>Ləğv edilmiş</span>
                    </div>
                    <span className="font-bold text-red-600">{data.orders.cancelled}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tamamlama nisbəti</span>
                    <span className="font-bold text-green-600">{data.orders.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${data.orders.completionRate}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Performans göstəriciləri</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Cavab nisbəti</span>
                      <span className="font-bold">{data.performance.responseRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${data.performance.responseRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Vaxtında tamamlama</span>
                      <span className="font-bold">{data.performance.onTimeDelivery}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${data.performance.onTimeDelivery}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Orta cavab müddəti</span>
                    <span className="font-bold">{data.performance.responseTime} dəq</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Təkrar müştərilər</span>
                    <span className="font-bold">{data.performance.repeatCustomers}%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Rating Distribution & Recent Reviews */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Reytinq paylanması</h2>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = data.ratings.distribution.find((d) => d.rating === rating)?.count || 0
                    const percentage = data.ratings.total > 0 ? (count / data.ratings.total) * 100 : 0
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="font-medium">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Son rəylər</h2>
                {data.ratings.recentReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Hələ rəy yoxdur</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.ratings.recentReviews.map((review) => (
                      <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{review.customer}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString("az-AZ")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Analitika məlumatları yüklənmədi</p>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  MapPin,
  User,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface ScheduledOrder {
  id: string
  title: string
  scheduledDate: string
  scheduledTime: string
  status: string
  address: string
  customer: {
    firstName: string
    lastName: string
  }
}

interface Availability {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

const DAYS = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"]
const MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"]

export default function MasterCalendarPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [orders, setOrders] = useState<ScheduledOrder[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, currentDate])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      
      const [ordersRes, availabilityRes] = await Promise.all([
        fetch(`/api/master/orders?year=${year}&month=${month + 1}`),
        fetch(`/api/master/availability?year=${year}&month=${month + 1}`),
      ])
      
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data.orders || [])
      }
      
      if (availabilityRes.ok) {
        const data = await availabilityRes.json()
        setAvailability(data.availability || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []
    
    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getOrdersForDate = (date: Date) => {
    return orders.filter(order => {
      const orderDate = new Date(order.scheduledDate)
      return orderDate.toDateString() === date.toDateString()
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const toggleAvailability = async (date: Date) => {
    try {
      const res = await fetch("/api/master/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.toISOString(),
          isAvailable: true,
        }),
      })
      
      if (res.ok) {
        toast.success("Mövcudluq yeniləndi")
        fetchData()
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  if (authStatus === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)
  const selectedDateOrders = selectedDate ? getOrdersForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/usta-panel">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Təqvim</h1>
            <p className="text-gray-600">Sifarişlərinizi və mövcudluğunuzu idarə edin</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const dateOrders = getOrdersForDate(date)
                const hasOrders = dateOrders.length > 0
                const isSelected = selectedDate?.toDateString() === date.toDateString()

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square p-1 rounded-lg text-sm relative transition-colors
                      ${isToday(date) ? "bg-primary/10 font-bold" : ""}
                      ${isSelected ? "ring-2 ring-primary" : ""}
                      ${hasOrders ? "bg-blue-50" : "hover:bg-gray-100"}
                    `}
                  >
                    <span className={isToday(date) ? "text-primary" : ""}>
                      {date.getDate()}
                    </span>
                    {hasOrders && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dateOrders.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Selected Date Details */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">
              {selectedDate ? (
                <>
                  {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}
                  <span className="text-gray-500 font-normal ml-2">
                    {DAYS[selectedDate.getDay()]}
                  </span>
                </>
              ) : (
                "Tarix seçin"
              )}
            </h3>

            {selectedDate && (
              <>
                {selectedDateOrders.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateOrders.map((order) => (
                      <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{order.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {order.status === "ACCEPTED" ? "Qəbul edilib" : 
                             order.status === "IN_PROGRESS" ? "İcra edilir" : "Gözləyir"}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {order.scheduledTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.address}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.customer.firstName} {order.customer.lastName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Bu tarixdə sifariş yoxdur</p>
                  </div>
                )}

                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => toggleAvailability(selectedDate)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Mövcudluq əlavə et
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  ArrowLeft,
  Loader2,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface EarningsStats {
  totalEarnings: number
  monthlyEarnings: number
  weeklyEarnings: number
  pendingPayments: number
  completedOrders: number
  averageOrderValue: number
  growthPercentage: number
}

interface Transaction {
  id: string
  type: "earning" | "withdrawal" | "refund"
  amount: number
  description: string
  status: string
  createdAt: string
  order?: {
    orderNumber: string
    title: string
  }
}

export default function MasterEarningsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<EarningsStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, period])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [statsRes, transactionsRes] = await Promise.all([
        fetch(`/api/master/earnings?period=${period}`),
        fetch(`/api/master/transactions?period=${period}`),
      ])
      
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats)
      }
      
      if (transactionsRes.ok) {
        const data = await transactionsRes.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/master/earnings/export?period=${period}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `gelirler-${period}.xlsx`
        a.click()
        toast.success("Fayl yükləndi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const handleWithdraw = async () => {
    toast.success("Çıxarış tələbi göndərildi")
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
              <h1 className="text-2xl font-bold">Gəlirlər</h1>
              <p className="text-gray-600">Qazanclarınızı izləyin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleWithdraw}>
              <Wallet className="h-4 w-4 mr-2" />
              Pul çıxar
            </Button>
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { value: "week", label: "Bu həftə" },
            { value: "month", label: "Bu ay" },
            { value: "year", label: "Bu il" },
            { value: "all", label: "Hamısı" },
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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Ümumi qazanc</span>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.totalEarnings || 0} ₼</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {(stats?.growthPercentage || 0) >= 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">+{stats?.growthPercentage}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">{stats?.growthPercentage}%</span>
                    </>
                  )}
                  <span className="text-gray-500">keçən aydan</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Bu ay</span>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.monthlyEarnings || 0} ₼</p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats?.completedOrders || 0} tamamlanmış sifariş
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Gözləyən ödənişlər</span>
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.pendingPayments || 0} ₼</p>
                <p className="text-sm text-gray-500 mt-2">Ödəniş gözləyir</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Orta sifariş</span>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.averageOrderValue || 0} ₼</p>
                <p className="text-sm text-gray-500 mt-2">Sifariş başına</p>
              </Card>
            </div>

            {/* Transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Əməliyyat tarixçəsi</h2>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Əməliyyat tarixçəsi boşdur</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "earning"
                              ? "bg-green-100"
                              : transaction.type === "withdrawal"
                              ? "bg-blue-100"
                              : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "earning" ? (
                            <ArrowDownRight className="h-5 w-5 text-green-600" />
                          ) : transaction.type === "withdrawal" ? (
                            <ArrowUpRight className="h-5 w-5 text-blue-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.order && (
                            <p className="text-sm text-gray-500">
                              #{transaction.order.orderNumber.slice(-6)} - {transaction.order.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString("az-AZ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.type === "earning"
                              ? "text-green-600"
                              : transaction.type === "withdrawal"
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "earning" ? "+" : "-"}
                          {transaction.amount} ₼
                        </p>
                        <Badge
                          variant="secondary"
                          className={
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {transaction.status === "completed" ? "Tamamlandı" : "Gözləyir"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

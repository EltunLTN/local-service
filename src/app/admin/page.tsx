'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Wrench,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Flag,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types for API response
interface AdminStats {
  totalUsers: number
  totalMasters: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  activeChats: number
  newUsersToday: number
  ordersToday: number
  reportsToReview: number
  userGrowth?: number
  orderGrowth?: number
  revenueGrowth?: number
  recentOrders?: Array<{
    id: string
    customer: string
    master: string
    service: string
    amount: number
    status: string
    date: string
  }>
  recentReports?: Array<{
    id: number
    type: string
    reason: string
    reporter: string
    target: string
    date: string
    status: string
  }>
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down'
  icon: React.ElementType
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm',
              changeType === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {changeType === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-xl">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  }

  const labels: Record<string, string> = {
    PENDING: 'Gözləyir',
    IN_PROGRESS: 'Davam edir',
    COMPLETED: 'Tamamlandı',
    CANCELLED: 'Ləğv edildi',
    pending: 'Gözləyir',
    reviewing: 'Araşdırılır',
    resolved: 'Həll olundu',
  }

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      styles[status] || 'bg-gray-100 text-gray-800'
    )}>
      {labels[status] || status}
    </span>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Fetch admin stats
  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Admin Panel
        {isLoadingStats && (
          <RefreshCw className="inline-block ml-2 h-5 w-5 animate-spin text-gray-400" />
        )}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ümumi İstifadəçilər"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          change={`+${stats?.newUsersToday || 0} bu gün`}
          changeType="up"
          icon={Users}
        />
        <StatCard
          title="Aktiv Ustalar"
          value={stats?.totalMasters || 0}
          change="+5 bu həftə"
          changeType="up"
          icon={Wrench}
        />
        <StatCard
          title="Ümumi Sifarişlər"
          value={stats?.totalOrders?.toLocaleString() || '0'}
          change={`+${stats?.ordersToday || 0} bu gün`}
          changeType="up"
          icon={ShoppingCart}
        />
        <StatCard
          title="Ümumi Gəlir"
          value={`${stats?.totalRevenue?.toLocaleString() || 0} ₼`}
          change={`+${stats?.revenueGrowth || 0}% bu ay`}
          changeType="up"
          icon={CreditCard}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.pendingOrders || 0}</p>
              <p className="text-sm text-gray-500">Gözləyən Sifarişlər</p>
            </div>
          </div>
          <Link href="/admin/sifarisler?status=pending" className="text-sm text-primary hover:underline">
            Hamısına bax →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.activeChats || 0}</p>
              <p className="text-sm text-gray-500">Aktiv Söhbətlər</p>
            </div>
          </div>
          <Link href="/admin/mesajlar" className="text-sm text-primary hover:underline">
            Hamısına bax →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.reportsToReview || 0}</p>
              <p className="text-sm text-gray-500">Nəzərdən Keçiriləcək Şikayət</p>
            </div>
          </div>
          <Link href="/admin/sikayetler" className="text-sm text-primary hover:underline">
            Hamısına bax →
          </Link>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Son Sifarişlər</h2>
            <Link href="/admin/sifarisler" className="text-sm text-primary hover:underline">
              Hamısı
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Sifariş
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Xidmət
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Məbləğ
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.recentOrders || []).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.customer}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{order.service}</p>
                      <p className="text-xs text-gray-500">{order.master}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {order.amount} ₼
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Son Şikayətlər</h2>
            <Link href="/admin/sikayetler" className="text-sm text-primary hover:underline">
              Hamısı
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {(stats?.recentReports || []).map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{report.reason}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {report.target}
                    </p>
                    <p className="text-xs text-gray-400">
                      {report.reporter} • {report.date}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

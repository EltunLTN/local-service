'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Wrench,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  Flag,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

// Sidebar navigation
const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Panel', href: '/admin' },
  { id: 'users', icon: Users, label: 'İstifadəçilər', href: '/admin/istifadecilar' },
  { id: 'masters', icon: Wrench, label: 'Ustalar', href: '/admin/ustalar' },
  { id: 'orders', icon: ShoppingCart, label: 'Sifarişlər', href: '/admin/sifarisler' },
  { id: 'payments', icon: CreditCard, label: 'Ödənişlər', href: '/admin/odenisler' },
  { id: 'messages', icon: MessageSquare, label: 'Mesajlar', href: '/admin/mesajlar' },
  { id: 'reports', icon: Flag, label: 'Şikayətlər', href: '/admin/sikayetler' },
  { id: 'analytics', icon: BarChart3, label: 'Analitika', href: '/admin/analitika' },
  { id: 'settings', icon: Settings, label: 'Tənzimləmələr', href: '/admin/tenzimlemeler' },
]

// No hardcoded data - all fetched from API

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{
            height: `${((value - min) / range) * 100}%`,
            minHeight: '4px',
            backgroundColor: color,
            opacity: 0.3 + (i / data.length) * 0.7,
          }}
        />
      ))}
    </div>
  )
}

function StatCard({ 
  title, 
  current, 
  previous, 
  change, 
  chartData, 
  color,
  prefix = '',
  suffix = ''
}: {
  title: string
  current: number
  previous: number
  change: number
  chartData: number[]
  color: string
  prefix?: string
  suffix?: string
}) {
  const isPositive = change >= 0
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {prefix}{current.toLocaleString()}{suffix}
          </p>
        </div>
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        )}>
          {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <MiniChart data={chartData} color={color} />
      <p className="text-xs text-gray-500 mt-2">
        Əvvəlki dövr: {prefix}{previous.toLocaleString()}{suffix}
      </p>
    </div>
  )
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateRange, setDateRange] = useState('month')
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/analytics')
      const json = await res.json()
      if (json.success) {
        setAnalyticsData(json.data)
      } else {
        toast.error('Analitika yüklənə bilmədi')
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
      toast.error('Analitika yüklənə bilmədi')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callback=/admin/analitika')
    } else if (status === 'authenticated') {
      const isAdmin = session?.user?.role === 'ADMIN'
      if (!isAdmin) {
        router.push('/')
      } else {
        fetchAnalytics()
      }
    }
  }, [session, status, router, fetchAnalytics])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = analyticsData?.stats || { revenue: { current: 0, previous: 0, change: 0 }, orders: { current: 0, previous: 0, change: 0 }, users: { current: 0, previous: 0, change: 0 }, masters: { current: 0, previous: 0, change: 0 } }
  const topServices = analyticsData?.topServices || []
  const topMasters = analyticsData?.topMasters || []
  const monthlyData = analyticsData?.monthlyData || []
  const maxRevenue = Math.max(...monthlyData.map((d: any) => d.revenue), 1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">UstaBul</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                item.id === 'analytics'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Analitika</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="week">Son 7 gün</option>
                <option value="month">Son 30 gün</option>
                <option value="quarter">Son 3 ay</option>
                <option value="year">Son 1 il</option>
              </select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Hesabat
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Ümumi Gəlir"
              current={stats.revenue.current}
              previous={stats.revenue.previous}
              change={stats.revenue.change}
              chartData={monthlyData.map((d: any) => d.revenue)}
              color="#2E5BFF"
              suffix=" ₼"
            />
            <StatCard
              title="Sifarişlər"
              current={stats.orders.current}
              previous={stats.orders.previous}
              change={stats.orders.change}
              chartData={monthlyData.map((d: any) => d.orders)}
              color="#00D084"
            />
            <StatCard
              title="İstifadəçilər"
              current={stats.users.current}
              previous={stats.users.previous}
              change={stats.users.change}
              chartData={[]}
              color="#7B3FF2"
            />
            <StatCard
              title="Ustalar"
              current={stats.masters.current}
              previous={stats.masters.previous}
              change={stats.masters.change}
              chartData={[]}
              color="#FFC837"
            />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Aylıq Gəlir</h2>
            {monthlyData.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Hələ məlumat yoxdur</p>
            ) : (
            <div className="flex items-end gap-2 h-64">
              {monthlyData.map((item: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">
                      {item.revenue > 1000 ? `${(item.revenue / 1000).toFixed(0)}k` : item.revenue}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-primary to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.revenue / maxRevenue) * 200}px`, minHeight: '4px' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Services */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Ən Populyar Xidmətlər</h2>
              <div className="space-y-4">
                {topServices.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Hələ məlumat yoxdur</p>
                ) : topServices.map((service: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <span className={cn(
                          'text-sm font-medium',
                          service.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {service.growth >= 0 ? '+' : ''}{service.growth}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{service.orders} sifariş</span>
                        <span>{service.revenue.toLocaleString()} ₼</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Masters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Ən Yaxşı Ustalar</h2>
              <div className="space-y-4">
                {topMasters.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Hələ məlumat yoxdur</p>
                ) : topMasters.map((master: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                        {master.name[0]}
                      </div>
                      {i < 3 && (
                        <span className={cn(
                          'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                          i === 0 ? 'bg-yellow-400 text-yellow-900' :
                          i === 1 ? 'bg-gray-300 text-gray-700' :
                          'bg-orange-400 text-orange-900'
                        )}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{master.name}</p>
                        <span className="text-yellow-500 text-sm">★ {master.rating}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{master.orders} sifariş</span>
                        <span>{master.revenue.toLocaleString()} ₼</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
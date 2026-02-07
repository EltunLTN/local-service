'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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

// Demo analytics data
const ANALYTICS_DATA = {
  revenue: {
    current: 45680,
    previous: 38450,
    change: 18.8,
    chartData: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
  },
  orders: {
    current: 1247,
    previous: 1089,
    change: 14.5,
    chartData: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 85],
  },
  users: {
    current: 3456,
    previous: 2987,
    change: 15.7,
    chartData: [120, 145, 132, 168, 155, 178, 190, 185, 205, 218, 225, 240],
  },
  masters: {
    current: 287,
    previous: 245,
    change: 17.1,
    chartData: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42],
  },
}

const TOP_SERVICES = [
  { name: 'Elektrik Təmiri', orders: 342, revenue: 12450, growth: 23 },
  { name: 'Santexnik İşləri', orders: 289, revenue: 10280, growth: 15 },
  { name: 'Ev Təmiri', orders: 245, revenue: 18500, growth: 32 },
  { name: 'Kondisioner Quraşdırma', orders: 198, revenue: 15600, growth: -5 },
  { name: 'Mebel Təmiri', orders: 156, revenue: 8900, growth: 12 },
]

const TOP_MASTERS = [
  { name: 'Əli Məmmədov', orders: 127, rating: 4.9, revenue: 9850 },
  { name: 'Vüqar Həsənov', orders: 98, rating: 5.0, revenue: 7600 },
  { name: 'Rəşad Əliyev', orders: 89, rating: 4.8, revenue: 6800 },
  { name: 'Tural Quliyev', orders: 76, rating: 4.9, revenue: 5900 },
  { name: 'Kamran Əlizadə', orders: 65, rating: 4.7, revenue: 4800 },
]

const MONTHLY_DATA = [
  { month: 'Yan', orders: 850, revenue: 28500 },
  { month: 'Fev', orders: 920, revenue: 32400 },
  { month: 'Mar', orders: 1050, revenue: 38900 },
  { month: 'Apr', orders: 980, revenue: 35600 },
  { month: 'May', orders: 1120, revenue: 42300 },
  { month: 'İyn', orders: 1280, revenue: 48700 },
  { month: 'İyl', orders: 1350, revenue: 52100 },
  { month: 'Avq', orders: 1420, revenue: 55800 },
  { month: 'Sen', orders: 1180, revenue: 45200 },
  { month: 'Okt', orders: 1250, revenue: 48500 },
  { month: 'Noy', orders: 1380, revenue: 53200 },
  { month: 'Dek', orders: 1520, revenue: 58900 },
]

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

  // Check admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callback=/admin/analitika')
    } else if (status === 'authenticated') {
      const isAdmin = session?.user?.role === 'ADMIN'
      if (!isAdmin) {
        router.push('/')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue))

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
              current={ANALYTICS_DATA.revenue.current}
              previous={ANALYTICS_DATA.revenue.previous}
              change={ANALYTICS_DATA.revenue.change}
              chartData={ANALYTICS_DATA.revenue.chartData}
              color="#2E5BFF"
              suffix=" ₼"
            />
            <StatCard
              title="Sifarişlər"
              current={ANALYTICS_DATA.orders.current}
              previous={ANALYTICS_DATA.orders.previous}
              change={ANALYTICS_DATA.orders.change}
              chartData={ANALYTICS_DATA.orders.chartData}
              color="#00D084"
            />
            <StatCard
              title="İstifadəçilər"
              current={ANALYTICS_DATA.users.current}
              previous={ANALYTICS_DATA.users.previous}
              change={ANALYTICS_DATA.users.change}
              chartData={ANALYTICS_DATA.users.chartData}
              color="#7B3FF2"
            />
            <StatCard
              title="Ustalar"
              current={ANALYTICS_DATA.masters.current}
              previous={ANALYTICS_DATA.masters.previous}
              change={ANALYTICS_DATA.masters.change}
              chartData={ANALYTICS_DATA.masters.chartData}
              color="#FFC837"
            />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Aylıq Gəlir</h2>
            <div className="flex items-end gap-2 h-64">
              {MONTHLY_DATA.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">
                      {(item.revenue / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-primary to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Services */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Ən Populyar Xidmətlər</h2>
              <div className="space-y-4">
                {TOP_SERVICES.map((service, i) => (
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
                {TOP_MASTERS.map((master, i) => (
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

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
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  RefreshCw,
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
  { id: 'reports', icon: Flag, label: 'Şikeyətlər', href: '/admin/sikayetler' },
  { id: 'analytics', icon: BarChart3, label: 'Analitika', href: '/admin/analitika' },
  { id: 'settings', icon: Settings, label: 'Tənzimləmələr', href: '/admin/tenzimlemeler' },
]

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Tamamlandı' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Gözləyir' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Uğursuz' },
    refunded: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Geri qaytarıldı' },
  }
  const { bg, text, label } = config[status] || config.pending
  
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', bg, text)}>
      {label}
    </span>
  )
}

export default function PaymentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [payments, setPayments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)

  // Check admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callback=/admin/odenisler')
    } else if (status === 'authenticated') {
      const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.email === 'admin@demo.az'
      if (!isAdmin) {
        router.push('/')
      }
    }
  }, [session, status, router])

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/admin/orders')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setPayments(json.data)
        }
      } catch (error) {
        console.error('Ödənişlər yüklənmədi:', error)
      }
    }
    if (status === 'authenticated') {
      fetchPayments()
    }
  }, [status])

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.master.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    fees: payments.reduce((sum, p) => sum + p.fee, 0),
  }

  const handleRefund = (paymentId: string) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: 'refunded' } : p
    ))
    toast.success('Ödəniş geri qaytarıldı')
  }

  const handleRetry = (paymentId: string) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: 'pending' } : p
    ))
    toast.success('Ödəniş yenidən cəhd edilir')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

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
                item.id === 'payments'
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
              <h1 className="text-xl font-bold text-gray-900">Ödənişlər</h1>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Hesabat Yüklə
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total} ₼</p>
                  <p className="text-sm text-gray-500">Ümumi Dövriyyə</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed} ₼</p>
                  <p className="text-sm text-gray-500">Tamamlanmış</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending} ₼</p>
                  <p className="text-sm text-gray-500">Gözləyən</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.fees} ₼</p>
                  <p className="text-sm text-gray-500">Komissiya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ödəniş ID, müştəri və ya usta axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="all">Bütün Statuslar</option>
                <option value="completed">Tamamlanmış</option>
                <option value="pending">Gözləyən</option>
                <option value="failed">Uğursuz</option>
                <option value="refunded">Geri Qaytarılmış</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ödəniş ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Sifariş</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Müştəri</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Usta</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Məbləğ</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Metod</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tarix</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-primary">{payment.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/sifarisler?id=${payment.orderId}`} className="text-sm text-primary hover:underline">
                          {payment.orderId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">{payment.customer}</td>
                      <td className="px-4 py-3 text-sm">{payment.master}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{payment.amount} ₼</p>
                          <p className="text-xs text-gray-500">Komissiya: {payment.fee} ₼</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{payment.method}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{payment.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-500"
                            title="Detallar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => handleRefund(payment.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-500"
                              title="Geri Qaytar"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                          {payment.status === 'failed' && (
                            <button
                              onClick={() => handleRetry(payment.id)}
                              className="p-1 hover:bg-blue-100 rounded text-blue-500"
                              title="Yenidən Cəhd Et"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Ödəniş Detalları</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Ödəniş ID</span>
                <span className="font-mono">{selectedPayment.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Sifariş ID</span>
                <span className="font-mono">{selectedPayment.orderId}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Müştəri</span>
                <span>{selectedPayment.customer}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Usta</span>
                <span>{selectedPayment.master}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Ümumi Məbləğ</span>
                <span className="font-bold">{selectedPayment.amount} ₼</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Komissiya (10%)</span>
                <span className="text-red-500">-{selectedPayment.fee} ₼</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Ustaya Ödəniləcək</span>
                <span className="font-bold text-green-600">{selectedPayment.netAmount} ₼</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Ödəniş Metodu</span>
                <span>{selectedPayment.method}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={selectedPayment.status} />
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Tarix</span>
                <span>{selectedPayment.date}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedPayment(null)}>
                Bağla
              </Button>
              {selectedPayment.status === 'completed' && (
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    handleRefund(selectedPayment.id)
                    setSelectedPayment(null)
                  }}
                >
                  Geri Qaytar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

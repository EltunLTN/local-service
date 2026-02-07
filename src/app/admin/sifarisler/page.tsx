'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  X,
  Phone,
  User,
  Wrench,
  CreditCard,
  Home,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Order type definition
interface Order {
  id: string
  customer: { name: string; phone: string }
  master: { name: string; phone: string }
  category: string
  service: string
  amount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  address: string
  date: string
  time: string
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ElementType; style: string; label: string }> = {
    PENDING: { 
      icon: Clock, 
      style: 'bg-yellow-100 text-yellow-800', 
      label: 'Gözləyir' 
    },
    IN_PROGRESS: { 
      icon: AlertCircle, 
      style: 'bg-blue-100 text-blue-800', 
      label: 'Davam edir' 
    },
    COMPLETED: { 
      icon: CheckCircle, 
      style: 'bg-green-100 text-green-800', 
      label: 'Tamamlandı' 
    },
    CANCELLED: { 
      icon: XCircle, 
      style: 'bg-red-100 text-red-800', 
      label: 'Ləğv edildi' 
    },
  }

  const { icon: Icon, style, label } = config[status] || config.PENDING

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', style)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

function PaymentBadge({ status, method }: { status: string; method: string }) {
  const statusStyles: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    PAID: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  const methodLabels: Record<string, string> = {
    CASH: 'Nağd',
    CARD: 'Kart',
    LATER: 'Sonra',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Ödənilməyib',
    PAID: 'Ödənilib',
    FAILED: 'Uğursuz',
  }

  return (
    <div className="flex flex-col gap-1">
      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', statusStyles[status] || statusStyles.PENDING)}>
        {statusLabels[status] || statusLabels.PENDING}
      </span>
      <span className="text-xs text-gray-500">{methodLabels[method] || method}</span>
    </div>
  )
}

export default function AdminOrdersPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [exporting, setExporting] = useState(false)

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/orders')
      
      if (!response.ok) {
        throw new Error('Sifarişləri yükləmək mümkün olmadı')
      }
      
      const data = await response.json()
      setOrders(data.orders || data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Xəta baş verdi'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Check authentication and fetch orders
  useEffect(() => {
    if (sessionStatus === 'loading') return
    
    if (!session) {
      router.push('/giris')
      return
    }
    
    fetchOrders()
  }, [session, sessionStatus, router])

  // Export handler
  const handleExport = async () => {
    try {
      setExporting(true)
      toast.loading('Export edilir...', { id: 'export' })
      const response = await fetch('/api/admin/export?type=orders')
      if (!response.ok) throw new Error('Export xətası')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sifarisler_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Export tamamlandı', { id: 'export' })
    } catch (error) {
      toast.error('Export xətası baş verdi', { id: 'export' })
    } finally {
      setExporting(false)
    }
  }

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.master.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const matchesDate = !dateFilter || order.date === dateFilter
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [orders, searchQuery, statusFilter, dateFilter])

  // Calculate stats from real data
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    inProgress: orders.filter((o) => o.status === 'IN_PROGRESS').length,
    completed: orders.filter((o) => o.status === 'COMPLETED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  }), [orders])

  // Loading state
  if (sessionStatus === 'loading' || (loading && orders.length === 0)) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-gray-500">Sifarişlər yüklənir...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && orders.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <XCircle className="h-12 w-12 text-red-500" />
          <div>
            <p className="text-lg font-medium text-gray-900">Xəta baş verdi</p>
            <p className="text-gray-500">{error}</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Yenidən cəhd et
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sifarişlər</h1>
          <p className="text-gray-500">Bütün sifarişləri idarə edin</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Yenilə
          </button>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">Ümumi</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600">Gözləyir</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
          <p className="text-sm text-blue-600">Davam edir</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          <p className="text-sm text-green-600">Tamamlandı</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          <p className="text-sm text-red-600">Ləğv edildi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sifariş ID, müştəri və ya usta axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Bütün statuslar</option>
            <option value="PENDING">Gözləyir</option>
            <option value="IN_PROGRESS">Davam edir</option>
            <option value="COMPLETED">Tamamlandı</option>
            <option value="CANCELLED">Ləğv edildi</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Sifariş
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Müştəri
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Usta
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
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Ödəniş
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Tarix
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    Sifariş tapılmadı
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary">{order.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{order.master.name}</p>
                      <p className="text-xs text-gray-500">{order.master.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{order.service}</p>
                      <p className="text-xs text-gray-500">{order.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.amount} ₼</p>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={order.paymentStatus} method={order.paymentMethod} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {order.date}
                      </div>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-gray-100 rounded-lg" 
                        title="Ətraflı"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {filteredOrders.length} nəticədən göstərilir
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sifariş Detalları</h2>
                <p className="text-primary font-medium">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <OrderStatusBadge status={selectedOrder.status} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Ödəniş</p>
                  <PaymentBadge status={selectedOrder.paymentStatus} method={selectedOrder.paymentMethod} />
                </div>
              </div>

              {/* Customer Info */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">Müştəri Məlumatları</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ad</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedOrder.customer.phone}`} className="text-primary hover:underline">
                        {selectedOrder.customer.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Info */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">Usta Məlumatları</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ad</p>
                    <p className="font-medium">{selectedOrder.master.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedOrder.master.phone}`} className="text-primary hover:underline">
                        {selectedOrder.master.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">Xidmət Məlumatları</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Kateqoriya</p>
                    <p className="font-medium">{selectedOrder.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Xidmət</p>
                    <p className="font-medium">{selectedOrder.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Məbləğ</p>
                    <p className="font-bold text-xl text-primary">{selectedOrder.amount} ₼</p>
                  </div>
                </div>
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Ünvan</h3>
                  </div>
                  <p className="text-gray-700">{selectedOrder.address}</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Tarix</h3>
                  </div>
                  <p className="font-medium">{selectedOrder.date}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.time}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">Ödəniş Məlumatları</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {selectedOrder.paymentStatus === 'PAID' ? 'Ödənilib' : 
                       selectedOrder.paymentStatus === 'PENDING' ? 'Gözləyir' : 'Uğursuz'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Metod</p>
                    <p className="font-medium">
                      {selectedOrder.paymentMethod === 'CASH' ? 'Nağd' : 
                       selectedOrder.paymentMethod === 'CARD' ? 'Kart' : 'Sonra'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Məbləğ</p>
                    <p className="font-bold text-primary">{selectedOrder.amount} ₼</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

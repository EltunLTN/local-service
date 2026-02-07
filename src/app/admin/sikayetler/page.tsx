'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag,
  MessageSquare,
  User,
  Star,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Ban,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const TYPE_ICONS: Record<string, React.ElementType> = {
  review: Star,
  master: User,
  order: ShoppingCart,
  message: MessageSquare,
}

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-100 text-gray-800',
}

const PRIORITY_LABELS: Record<string, string> = {
  high: 'Yüksək',
  medium: 'Orta',
  low: 'Aşağı',
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ElementType; style: string; label: string }> = {
    pending: { icon: Clock, style: 'bg-yellow-100 text-yellow-800', label: 'Gözləyir' },
    reviewing: { icon: Eye, style: 'bg-blue-100 text-blue-800', label: 'Araşdırılır' },
    resolved: { icon: CheckCircle, style: 'bg-green-100 text-green-800', label: 'Həll edildi' },
    rejected: { icon: XCircle, style: 'bg-gray-100 text-gray-800', label: 'Rədd edildi' },
  }

  const { icon: Icon, style, label } = config[status] || config.pending

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', style)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [expandedReport, setExpandedReport] = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState<{ id: number; action: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/admin/orders')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          // Map orders with complaints/reports if available
          setReports(json.data)
        }
      } catch (error) {
        console.error('Şikayətlər yüklənmədi:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  // Handle review action (mark as reviewing)
  const handleReview = async (reportId: number) => {
    setLoadingAction({ id: reportId, action: 'review' })
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'reviewing' } : r
    ))
    setLoadingAction(null)
    toast.success('Şikayət araşdırılmağa başlandı')
  }

  // Handle resolve action
  const handleResolve = async (reportId: number) => {
    setLoadingAction({ id: reportId, action: 'resolve' })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'resolved', resolvedAt: now, resolution: 'Şikayət həll edildi' } : r
    ))
    setLoadingAction(null)
    toast.success('Şikayət həll edildi')
  }

  // Handle reject action
  const handleReject = async (reportId: number) => {
    setLoadingAction({ id: reportId, action: 'reject' })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'rejected', resolvedAt: now, resolution: 'Şikayət rədd edildi - əsassız' } : r
    ))
    setLoadingAction(null)
    toast.success('Şikayət rədd edildi')
  }

  // Handle block master action
  const handleBlockMaster = async (reportId: number, masterName: string) => {
    setLoadingAction({ id: reportId, action: 'block' })
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'resolved', resolvedAt: now, resolution: `${masterName} bloklandı` } : r
    ))
    setLoadingAction(null)
    toast.success(`${masterName} bloklandı`)
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.master.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewing: reports.filter((r) => r.status === 'reviewing').length,
    resolved: reports.filter((r) => r.status === 'resolved' || r.status === 'rejected').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Şikayətlər</h1>
          <p className="text-gray-500">İstifadəçi şikayətlərini idarə edin</p>
        </div>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-500">Ümumi</p>
          </div>
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-sm text-yellow-600">Gözləyir</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.reviewing}</p>
            <p className="text-sm text-blue-600">Araşdırılır</p>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
            <p className="text-sm text-green-600">Həll edildi</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Şikayət axtar..."
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
              <option value="pending">Gözləyir</option>
              <option value="reviewing">Araşdırılır</option>
              <option value="resolved">Həll edildi</option>
              <option value="rejected">Rədd edildi</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Bütün növlər</option>
              <option value="review">Şərh</option>
              <option value="master">Usta</option>
              <option value="order">Sifariş</option>
              <option value="message">Mesaj</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const TypeIcon = TYPE_ICONS[report.type] || Flag
            const isExpanded = expandedReport === report.id

            return (
              <div
                key={report.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                      'p-3 rounded-xl',
                      report.status === 'pending' ? 'bg-red-50' : 'bg-gray-50'
                    )}>
                      <TypeIcon className={cn(
                        'h-5 w-5',
                        report.status === 'pending' ? 'text-red-500' : 'text-gray-500'
                      )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-gray-900">{report.reason}</h3>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {report.typeLabel}
                            </span>
                            <span className={cn(
                              'px-2 py-0.5 text-xs rounded',
                              PRIORITY_STYLES[report.priority]
                            )}>
                              {PRIORITY_LABELS[report.priority]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{report.target.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={report.status} />
                          <ChevronDown className={cn(
                            'h-5 w-5 text-gray-400 transition-transform',
                            isExpanded && 'rotate-180'
                          )} />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Şikayət edən: {report.reporter.name}</span>
                        <span>•</span>
                        <span>{report.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Təsvir</h4>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                          {report.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Əlaqəli usta</h4>
                        <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                            {report.master.name[0]}
                          </div>
                          <span className="text-sm">{report.master.name}</span>
                        </div>
                      </div>
                    </div>

                    {report.resolution && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Qərar</h4>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                          {report.resolution}
                        </p>
                      </div>
                    )}

                    {(report.status === 'pending' || report.status === 'reviewing') && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {report.status === 'pending' && (
                          <button 
                            onClick={() => handleReview(report.id)}
                            disabled={loadingAction?.id === report.id}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {loadingAction?.id === report.id && loadingAction?.action === 'review' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            Araşdır
                          </button>
                        )}
                        <button 
                          onClick={() => handleResolve(report.id)}
                          disabled={loadingAction?.id === report.id}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {loadingAction?.id === report.id && loadingAction?.action === 'resolve' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Həll et
                        </button>
                        <button 
                          onClick={() => handleReject(report.id)}
                          disabled={loadingAction?.id === report.id}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {loadingAction?.id === report.id && loadingAction?.action === 'reject' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Rədd et
                        </button>
                        <button 
                          onClick={() => handleBlockMaster(report.id, report.master.name)}
                          disabled={loadingAction?.id === report.id}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {loadingAction?.id === report.id && loadingAction?.action === 'block' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
                          Ustanı blokla
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Flag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Şilayət yoxdur</p>
          </div>
        )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Star,
  CheckCircle,
  XCircle,
  Shield,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Ban,
  Award,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  Briefcase,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Master {
  id: string
  name: string
  email: string
  phone: string
  category: string
  categories: string[]
  district: string
  rating: number
  reviewCount: number
  completedJobs: number
  status: string
  isVerified: boolean
  isInsured: boolean
  isPremium: boolean
  isActive: boolean
  createdAt: string
  earnings: number
  avatar: string
  bio: string
  experience: number
  hourlyRate: number
  responseRate: number
  responseTime: number
  userId: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Stats {
  total: number
  active: number
  pending: number
  verified: number
  premium: number
  insured: number
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
  }
  
  const labels: Record<string, string> = {
    active: 'Aktiv',
    pending: 'Təsdiq gözləyir',
    suspended: 'Dayandırılıb',
  }

  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status] || 'bg-gray-100 text-gray-800')}>
      {labels[status] || status}
    </span>
  )
}

export default function AdminMastersPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()

  const [masters, setMasters] = useState<Master[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    pending: 0,
    verified: 0,
    premium: 0,
    insured: 0,
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    district: '',
    hourlyRate: '',
    experience: '',
    bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch masters from API
  const fetchMasters = useCallback(async () => {
    try {
      setPageLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (categoryFilter !== 'all') params.set('category', categoryFilter)
      
      const response = await fetch(`/api/admin/masters?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Ustalar yüklənmədi')
      }
      
      if (data.success) {
        setMasters(data.data.masters)
        setCategories(data.data.categories)
        setStats(data.data.stats)
        setPagination(data.data.pagination)
      } else {
        throw new Error(data.message || 'Xəta baş verdi')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta baş verdi')
      toast.error('Ustalar yüklənmədi')
    } finally {
      setPageLoading(false)
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, categoryFilter])

  // Check authentication
  useEffect(() => {
    if (sessionStatus === 'loading') return
    
    if (!session) {
      router.push('/giris')
      return
    }
    
    if ((session.user as any)?.role !== 'ADMIN') {
      router.push('/')
      toast.error('Bu səhifəyə giriş icazəniz yoxdur')
      return
    }
  }, [session, sessionStatus, router])

  // Fetch masters on mount and when filters change
  useEffect(() => {
    if (sessionStatus === 'authenticated' && (session?.user as any)?.role === 'ADMIN') {
      fetchMasters()
    }
  }, [fetchMasters, sessionStatus, session])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStatus === 'authenticated') {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, sessionStatus])

  // Export masters
  const handleExport = async () => {
    try {
      toast.loading('Export edilir...', { id: 'export' })
      const response = await fetch('/api/admin/export?type=masters')
      if (!response.ok) throw new Error('Export xətası')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ustalar_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Export tamamlandı', { id: 'export' })
    } catch (error) {
      toast.error('Export xətası baş verdi', { id: 'export' })
    }
  }

  // View master
  const handleView = (master: Master) => {
    setSelectedMaster(master)
    setShowViewModal(true)
  }

  // Edit master
  const handleEdit = (master: Master) => {
    const [firstName, ...lastNameParts] = master.name.split(' ')
    const lastName = lastNameParts.join(' ')
    
    setSelectedMaster(master)
    setEditForm({
      firstName,
      lastName,
      phone: master.phone,
      district: master.district,
      hourlyRate: master.hourlyRate.toString(),
      experience: master.experience.toString(),
      bio: master.bio,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedMaster) return
    setLoading(true)
    
    try {
      const response = await fetch(`/api/admin/masters/${selectedMaster.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Xəta baş verdi')
      }
      
      // Update local state
      setMasters(prev => prev.map(m => 
        m.id === selectedMaster.id 
          ? { 
              ...m, 
              name: `${editForm.firstName} ${editForm.lastName}`,
              phone: editForm.phone,
              district: editForm.district,
              hourlyRate: parseFloat(editForm.hourlyRate),
              experience: parseInt(editForm.experience),
              bio: editForm.bio,
            }
          : m
      ))
      setShowEditModal(false)
      toast.success('Usta yeniləndi')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  // Block/Unblock master
  const handleToggleBlock = async (master: Master) => {
    const isBlocking = master.status !== 'suspended'
    
    try {
      const response = await fetch(`/api/admin/masters/${master.id}/block`, {
        method: isBlocking ? 'POST' : 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Xəta baş verdi')
      }
      
      setMasters(prev => prev.map(m => 
        m.id === master.id 
          ? { ...m, status: isBlocking ? 'suspended' : 'active', isActive: !isBlocking }
          : m
      ))
      
      toast.success(isBlocking ? 'Usta bloklandı' : 'Usta aktivləşdirildi')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi')
    }
  }

  // Open badge modal
  const handleBadgeClick = (master: Master) => {
    setSelectedMaster(master)
    setShowBadgeModal(true)
  }

  // Toggle badge
  const handleToggleBadge = async (badge: 'verified' | 'premium' | 'insured') => {
    if (!selectedMaster) return
    
    const badgeFieldMap: Record<string, keyof Master> = {
      verified: 'isVerified',
      premium: 'isPremium',
      insured: 'isInsured',
    }
    
    const currentValue = selectedMaster[badgeFieldMap[badge]]
    const newValue = !currentValue
    
    try {
      const response = await fetch(`/api/admin/masters/${selectedMaster.id}/badge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badge, value: newValue }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Xəta baş verdi')
      }
      
      // Update local state
      setMasters(prev => prev.map(m => 
        m.id === selectedMaster.id 
          ? { ...m, [badgeFieldMap[badge]]: newValue }
          : m
      ))
      
      // Update selected master
      setSelectedMaster(prev => prev ? { ...prev, [badgeFieldMap[badge]]: newValue } : null)
      
      toast.success(data.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi')
    }
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Loading state
  if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && pageLoading && masters.length === 0)) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-500">Yüklənir...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && masters.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Xəta baş verdi</h2>
              <p className="text-gray-500 mb-4">{error}</p>
            </div>
            <button 
              onClick={fetchMasters}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Yenidən cəhd et
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ustalar</h1>
          <p className="text-gray-500">Platformadakı bütün xidmət göstəricilər</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">Ümumi Ustalar</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          <p className="text-sm text-green-600">Aktiv</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600">Gözləyir</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-2xl font-bold text-blue-700">{stats.verified}</p>
          <p className="text-sm text-blue-600">Təsdiqlənmiş</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Usta axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Bütün statuslar</option>
            <option value="active">Aktiv</option>
            <option value="pending">Gözləyir</option>
            <option value="suspended">Dayandırılıb</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Bütün kateqoriyalar</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={fetchMasters}
            disabled={pageLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", pageLoading && "animate-spin")} />
            Yenilə
          </button>
        </div>
      </div>

      {/* Masters Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
        {pageLoading && masters.length > 0 && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Usta
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Kateqoriya
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Reytinq
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  İşlər
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Qazanc
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Badges
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {masters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Usta tapılmadı
                  </td>
                </tr>
              ) : (
                masters.map((master) => (
                  <tr key={master.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {master.avatar ? (
                          <img
                            src={master.avatar}
                            alt={master.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                            {master.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{master.name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {master.district}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{master.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{master.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({master.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{master.completedJobs}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{master.earnings.toLocaleString()} ₼</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={master.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleBadgeClick(master)}
                        className="flex gap-1 hover:opacity-80"
                        title="Badge-ləri idarə et"
                      >
                        {master.isVerified && (
                          <span className="p-1 bg-blue-100 rounded" title="Təsdiqlənmiş">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </span>
                        )}
                        {master.isInsured && (
                          <span className="p-1 bg-green-100 rounded" title="Sığortalı">
                            <Shield className="h-4 w-4 text-green-600" />
                          </span>
                        )}
                        {master.isPremium && (
                          <span className="p-1 bg-yellow-100 rounded" title="Premium">
                            <Award className="h-4 w-4 text-yellow-600" />
                          </span>
                        )}
                        {!master.isVerified && !master.isInsured && !master.isPremium && (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleView(master)}
                          className="p-2 hover:bg-gray-100 rounded-lg" 
                          title="Bax"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleEdit(master)}
                          className="p-2 hover:bg-gray-100 rounded-lg" 
                          title="Redaktə"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        {master.status !== 'suspended' ? (
                          <button 
                            onClick={() => handleToggleBlock(master)}
                            className="p-2 hover:bg-red-50 rounded-lg" 
                            title="Dayandır"
                          >
                            <Ban className="h-4 w-4 text-red-500" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleBlock(master)}
                            className="p-2 hover:bg-green-50 rounded-lg" 
                            title="Aktivləşdir"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </button>
                        )}
                      </div>
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
            {pagination.total} nəticədən {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} göstərilir
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "px-3 py-1 rounded-lg",
                    pagination.page === pageNum 
                      ? "bg-primary text-white" 
                      : "hover:bg-gray-100"
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
            <button 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Master Modal */}
      {showViewModal && selectedMaster && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Usta Məlumatları</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                {selectedMaster.avatar ? (
                  <img
                    src={selectedMaster.avatar}
                    alt={selectedMaster.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                    {selectedMaster.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedMaster.name}</h3>
                  <p className="text-gray-500">{selectedMaster.category}</p>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge status={selectedMaster.status} />
                    {selectedMaster.isVerified && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Təsdiqlənmiş
                      </span>
                    )}
                    {selectedMaster.isPremium && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                        <Award className="h-3 w-3" /> Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Star className="h-4 w-4 fill-yellow-400" />
                  </div>
                  <p className="font-bold text-xl">{selectedMaster.rating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{selectedMaster.reviewCount} rəy</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center text-primary mb-1">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <p className="font-bold text-xl">{selectedMaster.completedJobs}</p>
                  <p className="text-xs text-gray-500">Tamamlanmış iş</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center text-green-500 mb-1">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <p className="font-bold text-xl text-green-600">{selectedMaster.earnings.toLocaleString()} ₼</p>
                  <p className="text-xs text-gray-500">Qazanc</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center text-blue-500 mb-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <p className="font-bold text-xl">{selectedMaster.responseTime}</p>
                  <p className="text-xs text-gray-500">dəq cavab</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium">{selectedMaster.email}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Telefon</span>
                  </div>
                  <p className="font-medium">{selectedMaster.phone}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Rayon</span>
                  </div>
                  <p className="font-medium">{selectedMaster.district}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Qeydiyyat tarixi</span>
                  </div>
                  <p className="font-medium">{selectedMaster.createdAt}</p>
                </div>
              </div>

              {/* Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">Təcrübə</span>
                  </div>
                  <p className="font-medium">{selectedMaster.experience} il</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Saatlıq qiymət</span>
                  </div>
                  <p className="font-medium">{selectedMaster.hourlyRate} ₼</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Cavab nisbəti</span>
                  </div>
                  <p className="font-medium">{selectedMaster.responseRate}%</p>
                </div>
              </div>

              {/* Bio */}
              {selectedMaster.bio && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Haqqında</p>
                  <p className="text-gray-700">{selectedMaster.bio}</p>
                </div>
              )}

              {/* Categories */}
              {selectedMaster.categories && selectedMaster.categories.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-2">Kateqoriyalar</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaster.categories.map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
                Bağla
              </button>
              <button 
                onClick={() => {
                  setShowViewModal(false)
                  handleEdit(selectedMaster)
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Redaktə et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Master Modal */}
      {showEditModal && selectedMaster && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Ustanı Redaktə et</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rayon</label>
                <input
                  type="text"
                  value={editForm.district}
                  onChange={(e) => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saatlıq qiymət (₼)</label>
                  <input
                    type="number"
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Təcrübə (il)</label>
                  <input
                    type="number"
                    value={editForm.experience}
                    onChange={(e) => setEditForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Haqqında</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
                Ləğv et
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Yadda saxla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Management Modal */}
      {showBadgeModal && selectedMaster && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Badge İdarəetmə</h2>
                <p className="text-sm text-gray-500">{selectedMaster.name}</p>
              </div>
              <button onClick={() => setShowBadgeModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Verified Badge */}
              <div 
                onClick={() => handleToggleBadge('verified')}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors",
                  selectedMaster.isVerified 
                    ? "border-blue-200 bg-blue-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedMaster.isVerified ? "bg-blue-100" : "bg-gray-100"
                  )}>
                    <CheckCircle className={cn(
                      "h-5 w-5",
                      selectedMaster.isVerified ? "text-blue-600" : "text-gray-400"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">Təsdiqlənmiş</p>
                    <p className="text-sm text-gray-500">Şəxsiyyət təsdiqlənib</p>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  selectedMaster.isVerified ? "bg-blue-500" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                    selectedMaster.isVerified ? "translate-x-6" : "translate-x-0.5"
                  )} />
                </div>
              </div>

              {/* Premium Badge */}
              <div 
                onClick={() => handleToggleBadge('premium')}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors",
                  selectedMaster.isPremium 
                    ? "border-yellow-200 bg-yellow-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedMaster.isPremium ? "bg-yellow-100" : "bg-gray-100"
                  )}>
                    <Award className={cn(
                      "h-5 w-5",
                      selectedMaster.isPremium ? "text-yellow-600" : "text-gray-400"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">Premium</p>
                    <p className="text-sm text-gray-500">Premium üstünlüklər</p>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  selectedMaster.isPremium ? "bg-yellow-500" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                    selectedMaster.isPremium ? "translate-x-6" : "translate-x-0.5"
                  )} />
                </div>
              </div>

              {/* Insured Badge */}
              <div 
                onClick={() => handleToggleBadge('insured')}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors",
                  selectedMaster.isInsured 
                    ? "border-green-200 bg-green-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedMaster.isInsured ? "bg-green-100" : "bg-gray-100"
                  )}>
                    <Shield className={cn(
                      "h-5 w-5",
                      selectedMaster.isInsured ? "text-green-600" : "text-gray-400"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">Sığortalı</p>
                    <p className="text-sm text-gray-500">Sığorta ilə təmin olunub</p>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  selectedMaster.isInsured ? "bg-green-500" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                    selectedMaster.isInsured ? "translate-x-6" : "translate-x-0.5"
                  )} />
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowBadgeModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
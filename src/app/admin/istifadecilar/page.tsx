'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  Trash2,
  Edit,
  Eye,
  Download,
  X,
  Ban,
  Loader2,
  ShoppingCart,
  Wallet,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  orders: number
  spent: number
  createdAt: string
  avatar: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    banned: 'bg-red-100 text-red-800',
  }
  
  const labels: Record<string, string> = {
    active: 'Aktiv',
    inactive: 'Deaktiv',
    banned: 'Bloklanıb',
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

export default function AdminUsersPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', status: '' })
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setPageLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'İstifadəçilər yüklənmədi')
      }
      
      if (data.success) {
        setUsers(data.data.users)
        setPagination(data.data.pagination)
      } else {
        throw new Error(data.message || 'Xəta baş verdi')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta baş verdi')
      toast.error('İstifadəçilər yüklənmədi')
    } finally {
      setPageLoading(false)
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter])

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

  // Fetch users on mount and when filters change
  useEffect(() => {
    if (sessionStatus === 'authenticated' && (session?.user as any)?.role === 'ADMIN') {
      fetchUsers()
    }
  }, [fetchUsers, sessionStatus, session])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStatus === 'authenticated') {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, sessionStatus])

  // Filter users locally for display
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id))
    }
  }

  // Export users
  const handleExport = async () => {
    try {
      toast.loading('Export edilir...', { id: 'export' })
      const response = await fetch('/api/admin/export?type=users')
      if (!response.ok) throw new Error('Export xətası')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `istifadecilar_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Export tamamlandı', { id: 'export' })
    } catch (error) {
      toast.error('Export xətası baş verdi', { id: 'export' })
    }
  }

  // View user
  const handleView = (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  // Edit user
  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditForm({ name: user.name, email: user.email, phone: user.phone, status: user.status })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) return
    setLoading(true)
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Xəta baş verdi')
      }
      
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...editForm }
          : u
      ))
      setShowEditModal(false)
      toast.success('İstifadəçi yeniləndi')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  // Delete user
  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    setLoading(true)
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Xəta baş verdi')
      }
      
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setSelectedUsers(prev => prev.filter(id => id !== selectedUser.id))
      setShowDeleteModal(false)
      toast.success('İstifadəçi silindi')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  // Block single user
  const handleBlockUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Xəta baş verdi')
      }
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'banned' } : u
      ))
      toast.success('İstifadəçi bloklandı')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi')
    }
  }

  // Block multiple users
  const handleBlockSelected = async () => {
    setLoading(true)
    
    try {
      const promises = selectedUsers.map(userId => 
        fetch(`/api/admin/users/${userId}/block`, { method: 'POST' })
      )
      
      await Promise.all(promises)
      
      setUsers(prev => prev.map(u => 
        selectedUsers.includes(u.id) ? { ...u, status: 'banned' } : u
      ))
      setSelectedUsers([])
      toast.success(`${selectedUsers.length} istifadəçi bloklandı`)
    } catch (err) {
      toast.error('Bəzi istifadəçilər bloklana bilmədi')
    } finally {
      setLoading(false)
    }
  }

  // Send email
  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.message) {
      toast.error('Mövzu və mesajı doldurun')
      return
    }
    setLoading(true)
    
    // Simulate email sending (you can implement real email API)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setLoading(false)
    setShowEmailModal(false)
    setEmailForm({ subject: '', message: '' })
    setSelectedUsers([])
    toast.success(`${selectedUsers.length} istifadəçiyə email göndərildi`)
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Loading state
  if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && pageLoading && users.length === 0)) {
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
  if (error && users.length === 0) {
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
              onClick={fetchUsers}
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
            <h1 className="text-2xl font-bold text-gray-900">İstifadəçilər</h1>
            <p className="text-gray-500">Platformadakı bütün müştərilər</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="İstifadəçi axtar..."
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
              <option value="active">Aktiv</option>
              <option value="inactive">Deaktiv</option>
              <option value="banned">Bloklanıb</option>
            </select>
            <button
              onClick={fetchUsers}
              disabled={pageLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={cn("h-4 w-4", pageLoading && "animate-spin")} />
              Yenilə
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedUsers.length} istifadəçi seçildi
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowEmailModal(true)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-white rounded-lg hover:bg-gray-50 border border-gray-200 flex items-center gap-1 disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
                Email göndər
              </button>
              <button 
                onClick={handleBlockSelected}
                disabled={loading}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                Blokla
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {pageLoading && users.length > 0 && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    İstifadəçi
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Əlaqə
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Sifarişlər
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Xərclənib
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Qeydiyyat
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{user.orders}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{user.spent} ₼</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleView(user)}
                          className="p-2 hover:bg-gray-100 rounded-lg" 
                          title="Bax"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-gray-100 rounded-lg" 
                          title="Redaktə"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user)}
                          className="p-2 hover:bg-red-50 rounded-lg" 
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">İstifadəçi Məlumatları</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Telefon</span>
                  </div>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm">Sifarişlər</span>
                  </div>
                  <p className="font-bold text-xl">{selectedUser.orders}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">Xərclənib</span>
                  </div>
                  <p className="font-bold text-xl text-primary">{selectedUser.spent} ₼</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Qeydiyyat tarixi</span>
                </div>
                <p className="font-medium">{selectedUser.createdAt}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">İstifadəçini Redaktə et</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="active">Aktiv</option>
                  <option value="inactive">Deaktiv</option>
                  <option value="banned">Bloklanıb</option>
                </select>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">İstifadəçini sil?</h2>
              <p className="text-gray-500 text-center">
                <span className="font-semibold">{selectedUser.name}</span> adlı istifadəçini silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Ləğv et
              </button>
              <button 
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Email göndər</h2>
                <p className="text-sm text-gray-500">{selectedUsers.length} istifadəçiyə göndəriləcək</p>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mövzu</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Email mövzusu..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Email mesajı..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
                Ləğv et
              </button>
              <button 
                onClick={handleSendEmail}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Mail className="h-4 w-4" />
                Göndər
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

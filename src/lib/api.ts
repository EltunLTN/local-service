import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import type { Master, Order, Review, User, SearchFilters } from '@/types'

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response type
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error handling
interface ApiError {
  message: string
  code?: string
  status?: number
}

// Generic request handler
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await api.request<T>(config)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>
    throw {
      message: axiosError.response?.data?.message || 'Xəta baş verdi',
      status: axiosError.response?.status,
    } as ApiError
  }
}

// =============================================
// AUTH API
// =============================================
export const authApi = {
  register: async (data: {
    name: string
    email: string
    phone: string
    password: string
  }) => {
    return request<ApiResponse<User>>({
      method: 'POST',
      url: '/auth/register',
      data,
    })
  },

  login: async (data: { email: string; password: string }) => {
    return request<ApiResponse<{ user: User; token: string }>>({
      method: 'POST',
      url: '/auth/login',
      data,
    })
  },

  forgotPassword: async (email: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
    })
  },

  resetPassword: async (token: string, password: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: '/auth/reset-password',
      data: { token, password },
    })
  },

  verifyPhone: async (phone: string, code: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: '/auth/verify-phone',
      data: { phone, code },
    })
  },
}

// =============================================
// MASTERS API
// =============================================
export const mastersApi = {
  getAll: async (filters?: Partial<SearchFilters>) => {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }

    return request<ApiResponse<Master[]>>({
      method: 'GET',
      url: `/masters?${params.toString()}`,
    })
  },

  getById: async (id: string) => {
    return request<ApiResponse<Master>>({
      method: 'GET',
      url: `/masters/${id}`,
    })
  },

  getReviews: async (masterId: string, page: number = 1, limit: number = 10) => {
    return request<ApiResponse<Review[]>>({
      method: 'GET',
      url: `/masters/${masterId}/reviews`,
      params: { page, limit },
    })
  },

  getPortfolio: async (masterId: string) => {
    return request<ApiResponse<{ id: string; type: string; url: string; title: string }[]>>({
      method: 'GET',
      url: `/masters/${masterId}/portfolio`,
    })
  },

  getServices: async (masterId: string) => {
    return request<ApiResponse<{ id: string; name: string; price: number; duration: string }[]>>({
      method: 'GET',
      url: `/masters/${masterId}/services`,
    })
  },

  getAvailability: async (masterId: string, date: string) => {
    return request<ApiResponse<{ timeSlots: { id: string; time: string; available: boolean }[] }>>({
      method: 'GET',
      url: `/masters/${masterId}/availability`,
      params: { date },
    })
  },

  search: async (query: string) => {
    return request<ApiResponse<Master[]>>({
      method: 'GET',
      url: '/masters/search',
      params: { query },
    })
  },

  getNearby: async (lat: number, lng: number, radius: number = 10) => {
    return request<ApiResponse<Master[]>>({
      method: 'GET',
      url: '/masters/nearby',
      params: { lat, lng, radius },
    })
  },

  getTopRated: async (categoryId?: string, limit: number = 10) => {
    return request<ApiResponse<Master[]>>({
      method: 'GET',
      url: '/masters/top-rated',
      params: { categoryId, limit },
    })
  },
}

// =============================================
// ORDERS API
// =============================================
export const ordersApi = {
  create: async (data: {
    masterId: string
    categoryId: string
    subcategoryId?: string
    description: string
    images?: string[]
    scheduledDate: string
    timeSlotId: string
    addressId: string
    paymentMethod: string
  }) => {
    return request<ApiResponse<Order>>({
      method: 'POST',
      url: '/orders',
      data,
    })
  },

  getAll: async (status?: string, page: number = 1, limit: number = 10) => {
    return request<ApiResponse<Order[]>>({
      method: 'GET',
      url: '/orders',
      params: { status, page, limit },
    })
  },

  getById: async (id: string) => {
    return request<ApiResponse<Order>>({
      method: 'GET',
      url: `/orders/${id}`,
    })
  },

  cancel: async (id: string, reason?: string) => {
    return request<ApiResponse<Order>>({
      method: 'POST',
      url: `/orders/${id}/cancel`,
      data: { reason },
    })
  },

  rate: async (orderId: string, rating: number, comment: string, photos?: string[]) => {
    return request<ApiResponse<Review>>({
      method: 'POST',
      url: `/orders/${orderId}/review`,
      data: { rating, comment, photos },
    })
  },

  updateStatus: async (id: string, status: string) => {
    return request<ApiResponse<Order>>({
      method: 'PATCH',
      url: `/orders/${id}/status`,
      data: { status },
    })
  },

  getTimeline: async (id: string) => {
    return request<ApiResponse<{ status: string; date: string; note?: string }[]>>({
      method: 'GET',
      url: `/orders/${id}/timeline`,
    })
  },
}

// =============================================
// CATEGORIES API
// =============================================
export const categoriesApi = {
  getAll: async () => {
    return request<ApiResponse<{
      id: string
      name: string
      slug: string
      icon: string
      masterCount: number
      subcategories: { id: string; name: string; slug: string }[]
    }[]>>({
      method: 'GET',
      url: '/categories',
    })
  },

  getById: async (id: string) => {
    return request<ApiResponse<{
      id: string
      name: string
      slug: string
      icon: string
      description: string
      subcategories: { id: string; name: string; slug: string }[]
    }>>({
      method: 'GET',
      url: `/categories/${id}`,
    })
  },

  getMasters: async (categoryId: string, filters?: Partial<SearchFilters>) => {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }

    return request<ApiResponse<Master[]>>({
      method: 'GET',
      url: `/categories/${categoryId}/masters?${params.toString()}`,
    })
  },
}

// =============================================
// REVIEWS API
// =============================================
export const reviewsApi = {
  getByMaster: async (masterId: string, page: number = 1, limit: number = 10) => {
    return request<ApiResponse<Review[]>>({
      method: 'GET',
      url: `/reviews/master/${masterId}`,
      params: { page, limit },
    })
  },

  getByUser: async (page: number = 1, limit: number = 10) => {
    return request<ApiResponse<Review[]>>({
      method: 'GET',
      url: '/reviews/user',
      params: { page, limit },
    })
  },

  markHelpful: async (reviewId: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: `/reviews/${reviewId}/helpful`,
    })
  },

  report: async (reviewId: string, reason: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: `/reviews/${reviewId}/report`,
      data: { reason },
    })
  },
}

// =============================================
// MESSAGES API
// =============================================
export const messagesApi = {
  getConversations: async () => {
    return request<ApiResponse<{
      id: string
      participant: { id: string; name: string; avatar: string }
      lastMessage: { content: string; createdAt: string }
      unreadCount: number
    }[]>>({
      method: 'GET',
      url: '/messages/conversations',
    })
  },

  getMessages: async (conversationId: string, page: number = 1, limit: number = 50) => {
    return request<ApiResponse<{
      id: string
      content: string
      senderId: string
      createdAt: string
      isRead: boolean
    }[]>>({
      method: 'GET',
      url: `/messages/${conversationId}`,
      params: { page, limit },
    })
  },

  send: async (conversationId: string, content: string, attachments?: string[]) => {
    return request<ApiResponse<{
      id: string
      content: string
      createdAt: string
    }>>({
      method: 'POST',
      url: `/messages/${conversationId}`,
      data: { content, attachments },
    })
  },

  markAsRead: async (conversationId: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: `/messages/${conversationId}/read`,
    })
  },

  startConversation: async (masterId: string, message: string) => {
    return request<ApiResponse<{ conversationId: string }>>({
      method: 'POST',
      url: '/messages/start',
      data: { masterId, message },
    })
  },
}

// =============================================
// NOTIFICATIONS API
// =============================================
export const notificationsApi = {
  getAll: async (page: number = 1, limit: number = 20) => {
    return request<ApiResponse<{
      id: string
      type: string
      title: string
      message: string
      isRead: boolean
      createdAt: string
      data?: Record<string, unknown>
    }[]>>({
      method: 'GET',
      url: '/notifications',
      params: { page, limit },
    })
  },

  markAsRead: async (id: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: `/notifications/${id}/read`,
    })
  },

  markAllAsRead: async () => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: '/notifications/read-all',
    })
  },

  getUnreadCount: async () => {
    return request<ApiResponse<{ count: number }>>({
      method: 'GET',
      url: '/notifications/unread-count',
    })
  },

  updateSettings: async (settings: {
    email: boolean
    push: boolean
    sms: boolean
  }) => {
    return request<ApiResponse<void>>({
      method: 'PUT',
      url: '/notifications/settings',
      data: settings,
    })
  },
}

// =============================================
// USER/PROFILE API
// =============================================
export const userApi = {
  getProfile: async () => {
    return request<ApiResponse<User>>({
      method: 'GET',
      url: '/user/profile',
    })
  },

  updateProfile: async (data: Partial<User>) => {
    return request<ApiResponse<User>>({
      method: 'PUT',
      url: '/user/profile',
      data,
    })
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    return request<ApiResponse<{ avatarUrl: string }>>({
      method: 'POST',
      url: '/user/avatar',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getAddresses: async () => {
    return request<ApiResponse<{
      id: string
      label: string
      fullAddress: string
      district: string
      lat: number
      lng: number
      isDefault: boolean
    }[]>>({
      method: 'GET',
      url: '/user/addresses',
    })
  },

  addAddress: async (address: {
    label: string
    fullAddress: string
    district: string
    lat: number
    lng: number
    isDefault?: boolean
  }) => {
    return request<ApiResponse<{ id: string }>>({
      method: 'POST',
      url: '/user/addresses',
      data: address,
    })
  },

  updateAddress: async (id: string, address: Partial<{
    label: string
    fullAddress: string
    district: string
    lat: number
    lng: number
    isDefault: boolean
  }>) => {
    return request<ApiResponse<void>>({
      method: 'PUT',
      url: `/user/addresses/${id}`,
      data: address,
    })
  },

  deleteAddress: async (id: string) => {
    return request<ApiResponse<void>>({
      method: 'DELETE',
      url: `/user/addresses/${id}`,
    })
  },

  getFavorites: async () => {
    return request<ApiResponse<Master[]>>({
      method: 'GET',
      url: '/user/favorites',
    })
  },

  addFavorite: async (masterId: string) => {
    return request<ApiResponse<void>>({
      method: 'POST',
      url: '/user/favorites',
      data: { masterId },
    })
  },

  removeFavorite: async (masterId: string) => {
    return request<ApiResponse<void>>({
      method: 'DELETE',
      url: `/user/favorites/${masterId}`,
    })
  },
}

// =============================================
// MASTER DASHBOARD API
// =============================================
export const masterDashboardApi = {
  getStats: async () => {
    return request<ApiResponse<{
      totalEarnings: number
      thisMonthEarnings: number
      completedOrders: number
      pendingOrders: number
      rating: number
      reviewCount: number
      profileViews: number
      responseRate: number
    }>>({
      method: 'GET',
      url: '/master/stats',
    })
  },

  getOrders: async (status?: string, page: number = 1, limit: number = 10) => {
    return request<ApiResponse<Order[]>>({
      method: 'GET',
      url: '/master/orders',
      params: { status, page, limit },
    })
  },

  acceptOrder: async (orderId: string) => {
    return request<ApiResponse<Order>>({
      method: 'POST',
      url: `/master/orders/${orderId}/accept`,
    })
  },

  rejectOrder: async (orderId: string, reason?: string) => {
    return request<ApiResponse<Order>>({
      method: 'POST',
      url: `/master/orders/${orderId}/reject`,
      data: { reason },
    })
  },

  completeOrder: async (orderId: string, photos?: string[]) => {
    return request<ApiResponse<Order>>({
      method: 'POST',
      url: `/master/orders/${orderId}/complete`,
      data: { photos },
    })
  },

  updateAvailability: async (availability: {
    date: string
    timeSlots: string[]
  }[]) => {
    return request<ApiResponse<void>>({
      method: 'PUT',
      url: '/master/availability',
      data: { availability },
    })
  },

  updateServices: async (services: {
    id?: string
    name: string
    price: number
    duration: string
    description?: string
  }[]) => {
    return request<ApiResponse<void>>({
      method: 'PUT',
      url: '/master/services',
      data: { services },
    })
  },

  updatePortfolio: async (items: {
    id?: string
    type: 'image' | 'video'
    url: string
    title: string
    description?: string
  }[]) => {
    return request<ApiResponse<void>>({
      method: 'PUT',
      url: '/master/portfolio',
      data: { items },
    })
  },

  uploadPortfolioItem: async (file: File, title: string, description?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    if (description) formData.append('description', description)
    
    return request<ApiResponse<{ id: string; url: string }>>({
      method: 'POST',
      url: '/master/portfolio/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getEarnings: async (period: 'week' | 'month' | 'year') => {
    return request<ApiResponse<{
      total: number
      data: { date: string; amount: number }[]
    }>>({
      method: 'GET',
      url: '/master/earnings',
      params: { period },
    })
  },

  getAnalytics: async () => {
    return request<ApiResponse<{
      profileViews: { date: string; count: number }[]
      orderRequests: { date: string; count: number }[]
      conversionRate: number
      topServices: { name: string; count: number }[]
    }>>({
      method: 'GET',
      url: '/master/analytics',
    })
  },
}

// =============================================
// UPLOAD API
// =============================================
export const uploadApi = {
  uploadImage: async (file: File, folder?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) formData.append('folder', folder)
    
    return request<ApiResponse<{ url: string; key: string }>>({
      method: 'POST',
      url: '/upload/image',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  uploadMultiple: async (files: File[], folder?: string) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (folder) formData.append('folder', folder)
    
    return request<ApiResponse<{ urls: string[]; keys: string[] }>>({
      method: 'POST',
      url: '/upload/multiple',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteFile: async (key: string) => {
    return request<ApiResponse<void>>({
      method: 'DELETE',
      url: '/upload',
      data: { key },
    })
  },
}

export { api }
export type { ApiResponse, ApiError }

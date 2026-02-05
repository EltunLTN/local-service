import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  mastersApi,
  ordersApi,
  categoriesApi,
  reviewsApi,
  messagesApi,
  notificationsApi,
  userApi,
  masterDashboardApi,
} from "@/lib/api"
import type {
  Master,
  Order,
  Category,
  Review,
  Message,
  Notification,
  CustomerProfile,
  MasterProfile,
} from "@/types"

// ============================
// QUERY KEYS
// ============================

export const queryKeys = {
  masters: {
    all: ["masters"] as const,
    list: (filters?: any) => ["masters", "list", filters] as const,
    detail: (id: string) => ["masters", "detail", id] as const,
    reviews: (id: string) => ["masters", id, "reviews"] as const,
    portfolio: (id: string) => ["masters", id, "portfolio"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (filters?: any) => ["orders", "list", filters] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    byMaster: (masterId: string) => ["reviews", "master", masterId] as const,
    byOrder: (orderId: string) => ["reviews", "order", orderId] as const,
  },
  messages: {
    all: ["messages"] as const,
    conversations: ["messages", "conversations"] as const,
    conversation: (id: string) => ["messages", "conversation", id] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    unread: ["notifications", "unread"] as const,
  },
  user: {
    profile: ["user", "profile"] as const,
    addresses: ["user", "addresses"] as const,
    favorites: ["user", "favorites"] as const,
  },
  masterDashboard: {
    stats: ["master", "stats"] as const,
    orders: (filters?: any) => ["master", "orders", filters] as const,
    profile: ["master", "profile"] as const,
    services: ["master", "services"] as const,
  },
}

// ============================
// MASTER HOOKS
// ============================

export function useMasters(filters?: {
  category?: string
  district?: string
  rating?: number
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.masters.list(filters),
    queryFn: () => mastersApi.getAll(filters),
  })
}

export function useMaster(id: string) {
  return useQuery({
    queryKey: queryKeys.masters.detail(id),
    queryFn: () => mastersApi.getById(id),
    enabled: !!id,
  })
}

export function useMasterReviews(masterId: string) {
  return useQuery({
    queryKey: queryKeys.masters.reviews(masterId),
    queryFn: () => mastersApi.getReviews(masterId),
    enabled: !!masterId,
  })
}

// ============================
// CATEGORY HOOKS
// ============================

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  })
}

// ============================
// ORDER HOOKS
// ============================

export function useOrders(filters?: {
  status?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersApi.getAll(filters?.status, filters?.page, filters?.limit),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ordersApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
    },
  })
}

// ============================
// REVIEW HOOKS
// ============================

export function useReviews(masterId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.byMaster(masterId),
    queryFn: () => reviewsApi.getByMaster(masterId),
    enabled: !!masterId,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { masterId: string; orderId: string; rating: number; comment: string }) => {
      // Use orders API to create review
      return ordersApi.rate(data.orderId, data.rating, data.comment)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byMaster(variables.masterId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
    },
  })
}

// ============================
// MESSAGE HOOKS
// ============================

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.messages.conversations,
    queryFn: () => messagesApi.getConversations(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.messages.conversation(id),
    queryFn: () => messagesApi.getMessages(id),
    enabled: !!id,
    refetchInterval: 10000, // Refetch every 10 seconds when viewing
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { conversationId: string; content: string; attachments?: string[] }) => {
      return messagesApi.send(data.conversationId, data.content, data.attachments)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.messages.conversation(variables.conversationId) 
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations })
    },
  })
}

// ============================
// NOTIFICATION HOOKS
// ============================

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => notificationsApi.getAll(),
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread })
    },
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread })
    },
  })
}

// ============================
// USER PROFILE HOOKS
// ============================

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: () => userApi.getProfile(),
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile })
    },
  })
}

export function useUserAddresses() {
  return useQuery({
    queryKey: queryKeys.user.addresses,
    queryFn: () => userApi.getAddresses(),
  })
}

export function useAddAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses })
    },
  })
}

export function useUserFavorites() {
  return useQuery({
    queryKey: queryKeys.user.favorites,
    queryFn: () => userApi.getFavorites(),
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ masterId, action }: { masterId: string; action: "add" | "remove" }) =>
      action === "add"
        ? userApi.addFavorite(masterId)
        : userApi.removeFavorite(masterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.favorites })
    },
  })
}

// ============================
// MASTER DASHBOARD HOOKS
// ============================

export function useMasterStats() {
  return useQuery({
    queryKey: queryKeys.masterDashboard.stats,
    queryFn: () => masterDashboardApi.getStats(),
  })
}

export function useMasterOrders(filters?: {
  status?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.masterDashboard.orders(filters),
    queryFn: () => masterDashboardApi.getOrders(filters?.status, filters?.page, filters?.limit),
  })
}

export function useMasterProfile() {
  return useQuery({
    queryKey: queryKeys.masterDashboard.profile,
    queryFn: () => userApi.getProfile(), // Use userApi since masterDashboardApi doesn't have getProfile
  })
}

export function useUpdateMasterProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateProfile, // Use userApi since masterDashboardApi doesn't have updateProfile
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterDashboard.profile })
    },
  })
}

export function useMasterServices() {
  return useQuery({
    queryKey: queryKeys.masterDashboard.services,
    queryFn: async () => {
      // Use a custom endpoint since masterDashboardApi doesn't have getServices
      const response = await fetch('/api/master/services')
      return response.json()
    },
  })
}

export function useUpdateMasterServices() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: masterDashboardApi.updateServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterDashboard.services })
    },
  })
}

export function useAcceptOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: masterDashboardApi.acceptOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterDashboard.orders() })
      queryClient.invalidateQueries({ queryKey: queryKeys.masterDashboard.stats })
    },
  })
}

export function useRejectOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      masterDashboardApi.rejectOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterDashboard.orders() })
    },
  })
}

export function useCompleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string; photos?: string[] }) => {
      return masterDashboardApi.completeOrder(data.id, data.photos)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.masterDashboard.orders() })
      queryClient.invalidateQueries({ queryKey: queryKeys.masterDashboard.stats })
    },
  })
}

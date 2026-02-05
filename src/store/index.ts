import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Master, Order, SearchFilters, Address, Notification } from '@/types'

// =============================================
// AUTH STORE
// =============================================
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// =============================================
// BOOKING/ORDER STORE
// =============================================
interface BookingFormData {
  categoryId: string
  subcategoryId: string
  description: string
  images: string[]
  urgency: 'planned' | 'today' | 'urgent'
  scheduledDate: Date | null
  timeSlotId: string
  address: Address | null
  masterId: string | null
  paymentMethod: 'cash' | 'card' | 'later'
}

interface BookingState {
  currentStep: number
  formData: BookingFormData
  selectedMaster: Master | null
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<BookingFormData>) => void
  setSelectedMaster: (master: Master | null) => void
  resetBooking: () => void
}

const initialFormData: BookingFormData = {
  categoryId: '',
  subcategoryId: '',
  description: '',
  images: [],
  urgency: 'planned',
  scheduledDate: null,
  timeSlotId: '',
  address: null,
  masterId: null,
  paymentMethod: 'cash',
}

export const useBookingStore = create<BookingState>()((set) => ({
  currentStep: 1,
  formData: initialFormData,
  selectedMaster: null,
  
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  setSelectedMaster: (master) => set({ selectedMaster: master }),
  resetBooking: () => set({
    currentStep: 1,
    formData: initialFormData,
    selectedMaster: null,
  }),
}))

// =============================================
// SEARCH/FILTER STORE
// =============================================
interface SearchState {
  filters: SearchFilters
  viewMode: 'grid' | 'list' | 'map'
  isFilterOpen: boolean
  
  // Actions
  setFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
  setViewMode: (mode: 'grid' | 'list' | 'map') => void
  toggleFilter: () => void
}

const initialFilters: SearchFilters = {
  query: '',
  categoryId: '',
  subcategoryId: '',
  priceMin: 0,
  priceMax: 200,
  rating: 0,
  distance: 10,
  isAvailableToday: false,
  isVerified: false,
  isInsured: false,
  sortBy: 'recommended',
  page: 1,
  limit: 10,
}

export const useSearchStore = create<SearchState>()((set) => ({
  filters: initialFilters,
  viewMode: 'grid',
  isFilterOpen: false,
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  resetFilters: () => set({ filters: initialFilters }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
}))

// =============================================
// NOTIFICATION STORE
// =============================================
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  
  // Actions
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0,
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))

// =============================================
// FAVORITES STORE
// =============================================
interface FavoritesState {
  favorites: string[]  // Master IDs
  
  addFavorite: (masterId: string) => void
  removeFavorite: (masterId: string) => void
  isFavorite: (masterId: string) => boolean
  toggleFavorite: (masterId: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (masterId) => set((state) => ({
        favorites: [...state.favorites, masterId]
      })),
      removeFavorite: (masterId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== masterId)
      })),
      isFavorite: (masterId) => get().favorites.includes(masterId),
      toggleFavorite: (masterId) => {
        const { favorites, addFavorite, removeFavorite } = get()
        if (favorites.includes(masterId)) {
          removeFavorite(masterId)
        } else {
          addFavorite(masterId)
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
)

// =============================================
// CHAT/MESSAGES STORE
// =============================================
interface ChatState {
  activeConversationId: string | null
  isTyping: boolean
  
  setActiveConversation: (id: string | null) => void
  setTyping: (typing: boolean) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  activeConversationId: null,
  isTyping: false,
  
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setTyping: (isTyping) => set({ isTyping }),
}))

// =============================================
// UI STORE
// =============================================
interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  theme: 'light' | 'dark'
  
  toggleMobileMenu: () => void
  setMobileMenu: (open: boolean) => void
  toggleSearch: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      isSearchOpen: false,
      theme: 'light',
      
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

// =============================================
// LOCATION STORE
// =============================================
interface LocationState {
  currentLocation: { lat: number; lng: number } | null
  selectedAddress: Address | null
  isLoading: boolean
  error: string | null
  
  setCurrentLocation: (location: { lat: number; lng: number } | null) => void
  setSelectedAddress: (address: Address | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  requestLocation: () => Promise<void>
}

export const useLocationStore = create<LocationState>()((set) => ({
  currentLocation: null,
  selectedAddress: null,
  isLoading: false,
  error: null,
  
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  requestLocation: async () => {
    set({ isLoading: true, error: null })
    
    if (!navigator.geolocation) {
      set({ isLoading: false, error: 'Geolokasiya dəstəklənmir' })
      return
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })
      
      set({
        currentLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: 'Lokasiya alına bilmədi',
      })
    }
  },
}))

// İstifadəçi tipləri
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'master' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Müştəri tipi
export interface Customer extends User {
  role: 'customer';
  savedAddresses: Address[];
  favoritesMasters: string[];
}

// Usta tipi
export interface Master extends User {
  role: 'master';
  bio: string;
  experience: number; // İllə
  rating: number;
  reviewCount: number;
  completedJobs: number;
  hourlyRate: number;
  isOnline: boolean;
  isVerified: boolean;
  isInsured: boolean;
  isLicensed: boolean;
  categories: string[];
  services: MasterService[];
  portfolio: PortfolioItem[];
  workingHours: WorkingHours;
  location: GeoLocation;
  badges: Badge[];
  responseTime: number; // Dəqiqə ilə
  availability: Availability[];
}

// Usta xidməti
export interface MasterService {
  id: string;
  categoryId: string;
  subcategoryId: string;
  name: string;
  description?: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'starting_from';
  duration?: number; // Dəqiqə ilə
}

// Portfolio elementi
export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  beforeImage?: string;
  afterImage?: string;
  images: string[];
  category: string;
  duration: number; // Saat ilə
  price: number;
  createdAt: Date;
}

// İş saatları
export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  start: string; // "09:00"
  end: string; // "18:00"
}

// Mövcudluq
export interface Availability {
  date: Date;
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isAvailable: boolean;
}

// Nişan
export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// Geo lokasiya
export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  district?: string;
  city?: string;
}

// Ünvan
export interface Address {
  id: string;
  label: string; // "Ev", "İş", vs.
  fullAddress: string;
  district: string;
  city: string;
  location: GeoLocation;
  isDefault: boolean;
}

// Xidmət kateqoriyası
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  subcategories: ServiceSubcategory[];
  image?: string;
}

// Alt kateqoriya
export interface ServiceSubcategory {
  id: string;
  name: string;
  price: number;
  description?: string;
}

// Sifariş tipi
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  masterId?: string;
  master?: Master;
  categoryId: string;
  subcategoryId: string;
  serviceName: string;
  description: string;
  images: string[];
  urgency: 'planned' | 'today' | 'urgent';
  scheduledDate: Date;
  timeSlot: TimeSlot;
  address: Address;
  status: OrderStatus;
  price?: number;
  finalPrice?: number;
  paymentMethod: 'cash' | 'card' | 'later';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

// Rəy tipi
export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customer: Pick<Customer, 'id' | 'name' | 'avatar'>;
  masterId: string;
  rating: number;
  comment: string;
  images?: string[];
  likes: number;
  reply?: ReviewReply;
  createdAt: Date;
}

export interface ReviewReply {
  text: string;
  createdAt: Date;
}

// Chat/Mesaj tipi
export interface Conversation {
  id: string;
  participants: string[];
  orderId?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'file';
  fileUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

// Bildiriş tipi
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType =
  | 'order_created'
  | 'order_accepted'
  | 'order_completed'
  | 'order_cancelled'
  | 'new_message'
  | 'new_review'
  | 'payment_received'
  | 'promo';

// Axtarış filtri
export interface SearchFilters {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  distance?: number;
  isAvailableToday?: boolean;
  isVerified?: boolean;
  isInsured?: boolean;
  sortBy?: 'recommended' | 'rating' | 'price_low' | 'price_high' | 'distance' | 'reviews';
  page?: number;
  limit?: number;
}

// API Response tipləri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// Form tipləri
export interface LoginFormData {
  phone: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'customer' | 'master';
}

export interface OrderFormData {
  categoryId: string;
  subcategoryId: string;
  description: string;
  images: File[];
  urgency: 'planned' | 'today' | 'urgent';
  scheduledDate: Date;
  timeSlotId: string;
  address: Address;
  masterId?: string;
  paymentMethod: 'cash' | 'card' | 'later';
}

// Dashboard statistika
export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalEarnings: number;
  weeklyEarnings: number;
  averageRating: number;
  reviewCount: number;
}

// Map marker
export interface MapMarker {
  id: string;
  position: GeoLocation;
  type: 'master' | 'order' | 'user';
  data: Master | Order;
}

// Type aliases for convenience
export type Category = ServiceCategory;
export type CustomerProfile = Customer;
export type MasterProfile = Master;

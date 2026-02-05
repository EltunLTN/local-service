import { z } from 'zod'

// =============================================
// AUTH SCHEMAS
// =============================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-poçt tələb olunur')
    .email('Düzgün e-poçt ünvanı daxil edin'),
  password: z
    .string()
    .min(1, 'Şifrə tələb olunur')
    .min(8, 'Şifrə ən azı 8 simvol olmalıdır'),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad tələb olunur')
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(50, 'Ad 50 simvoldan çox ola bilməz'),
  email: z
    .string()
    .min(1, 'E-poçt tələb olunur')
    .email('Düzgün e-poçt ünvanı daxil edin'),
  phone: z
    .string()
    .min(1, 'Telefon nömrəsi tələb olunur')
    .regex(
      /^(\+994|0)(50|51|55|70|77|99)[0-9]{7}$/,
      'Düzgün Azərbaycan telefon nömrəsi daxil edin'
    ),
  password: z
    .string()
    .min(1, 'Şifrə tələb olunur')
    .min(8, 'Şifrə ən azı 8 simvol olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifrə böyük hərf, kiçik hərf və rəqəm ehtiva etməlidir'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Şifrə təsdiqi tələb olunur'),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, {
      message: 'İstifadə şərtlərini qəbul etməlisiniz',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifrələr uyğun gəlmir',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-poçt tələb olunur')
    .email('Düzgün e-poçt ünvanı daxil edin'),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Şifrə tələb olunur')
    .min(8, 'Şifrə ən azı 8 simvol olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifrə böyük hərf, kiçik hərf və rəqəm ehtiva etməlidir'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Şifrə təsdiqi tələb olunur'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifrələr uyğun gəlmir',
  path: ['confirmPassword'],
})

export const verifyPhoneSchema = z.object({
  code: z
    .string()
    .length(6, 'Təsdiq kodu 6 rəqəm olmalıdır')
    .regex(/^\d+$/, 'Yalnız rəqəmlər daxil edilə bilər'),
})

// =============================================
// PROFILE SCHEMAS
// =============================================
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(50, 'Ad 50 simvoldan çox ola bilməz'),
  phone: z
    .string()
    .regex(
      /^(\+994|0)(50|51|55|70|77|99)[0-9]{7}$/,
      'Düzgün Azərbaycan telefon nömrəsi daxil edin'
    )
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio 500 simvoldan çox ola bilməz')
    .optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Cari şifrə tələb olunur'),
  newPassword: z
    .string()
    .min(8, 'Yeni şifrə ən azı 8 simvol olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifrə böyük hərf, kiçik hərf və rəqəm ehtiva etməlidir'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Şifrə təsdiqi tələb olunur'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifrələr uyğun gəlmir',
  path: ['confirmPassword'],
})

// =============================================
// ADDRESS SCHEMAS
// =============================================
export const addressSchema = z.object({
  label: z
    .string()
    .min(1, 'Ünvan adı tələb olunur')
    .max(50, 'Ünvan adı 50 simvoldan çox ola bilməz'),
  fullAddress: z
    .string()
    .min(1, 'Tam ünvan tələb olunur')
    .max(200, 'Ünvan 200 simvoldan çox ola bilməz'),
  district: z
    .string()
    .min(1, 'Rayon tələb olunur'),
  building: z
    .string()
    .optional(),
  apartment: z
    .string()
    .optional(),
  entrance: z
    .string()
    .optional(),
  floor: z
    .string()
    .optional(),
  notes: z
    .string()
    .max(200, 'Qeyd 200 simvoldan çox ola bilməz')
    .optional(),
  isDefault: z
    .boolean()
    .optional()
    .default(false),
})

// =============================================
// ORDER/BOOKING SCHEMAS
// =============================================
export const orderDescriptionSchema = z.object({
  description: z
    .string()
    .min(10, 'Problemin təsviri ən azı 10 simvol olmalıdır')
    .max(1000, 'Təsvir 1000 simvoldan çox ola bilməz'),
})

export const orderScheduleSchema = z.object({
  urgency: z.enum(['planned', 'today', 'urgent']),
  scheduledDate: z
    .date()
    .optional()
    .nullable(),
  timeSlotId: z
    .string()
    .optional(),
}).refine((data) => {
  if (data.urgency === 'planned') {
    return data.scheduledDate !== null && data.timeSlotId !== undefined
  }
  return true
}, {
  message: 'Planlaşdırılmış sifariş üçün tarix və vaxt seçin',
  path: ['scheduledDate'],
})

export const orderPaymentSchema = z.object({
  paymentMethod: z.enum(['cash', 'card', 'later'], {
    required_error: 'Ödəniş üsulunu seçin',
  }),
})

export const createOrderSchema = z.object({
  categoryId: z
    .string()
    .min(1, 'Kateqoriya tələb olunur'),
  subcategoryId: z
    .string()
    .optional(),
  description: z
    .string()
    .min(10, 'Problemin təsviri ən azı 10 simvol olmalıdır')
    .max(1000, 'Təsvir 1000 simvoldan çox ola bilməz'),
  urgency: z.enum(['planned', 'today', 'urgent']),
  scheduledDate: z
    .string()
    .optional()
    .nullable(),
  timeSlotId: z
    .string()
    .optional(),
  addressId: z
    .string()
    .min(1, 'Ünvan tələb olunur'),
  masterId: z
    .string()
    .optional()
    .nullable(),
  paymentMethod: z.enum(['cash', 'card', 'later']),
})

// =============================================
// REVIEW SCHEMAS
// =============================================
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Ən azı 1 ulduz seçin')
    .max(5, 'Ən çox 5 ulduz seçə bilərsiniz'),
  comment: z
    .string()
    .min(10, 'Rəy ən azı 10 simvol olmalıdır')
    .max(500, 'Rəy 500 simvoldan çox ola bilməz'),
  wouldRecommend: z
    .boolean()
    .optional(),
})

export const reportReviewSchema = z.object({
  reason: z
    .string()
    .min(1, 'Səbəb seçin'),
  details: z
    .string()
    .max(500, 'Əlavə məlumat 500 simvoldan çox ola bilməz')
    .optional(),
})

// =============================================
// MESSAGE SCHEMAS
// =============================================
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Mesaj boş ola bilməz')
    .max(1000, 'Mesaj 1000 simvoldan çox ola bilməz'),
})

export const startConversationSchema = z.object({
  masterId: z
    .string()
    .min(1, 'Usta seçilməlidir'),
  message: z
    .string()
    .min(1, 'Mesaj boş ola bilməz')
    .max(1000, 'Mesaj 1000 simvoldan çox ola bilməz'),
})

// =============================================
// MASTER REGISTRATION SCHEMAS
// =============================================
export const masterBasicInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(50, 'Ad 50 simvoldan çox ola bilməz'),
  phone: z
    .string()
    .regex(
      /^(\+994|0)(50|51|55|70|77|99)[0-9]{7}$/,
      'Düzgün Azərbaycan telefon nömrəsi daxil edin'
    ),
  email: z
    .string()
    .email('Düzgün e-poçt ünvanı daxil edin'),
  bio: z
    .string()
    .min(50, 'Bio ən azı 50 simvol olmalıdır')
    .max(500, 'Bio 500 simvoldan çox ola bilməz'),
  experience: z
    .number()
    .min(0, 'Təcrübə 0-dan kiçik ola bilməz')
    .max(50, 'Təcrübə 50 ildən çox ola bilməz'),
  district: z
    .string()
    .min(1, 'Rayon tələb olunur'),
})

export const masterCategorySchema = z.object({
  categoryId: z
    .string()
    .min(1, 'Kateqoriya tələb olunur'),
  subcategories: z
    .array(z.string())
    .min(1, 'Ən azı bir alt kateqoriya seçin'),
})

export const masterServiceSchema = z.object({
  name: z
    .string()
    .min(2, 'Xidmət adı ən azı 2 simvol olmalıdır')
    .max(100, 'Xidmət adı 100 simvoldan çox ola bilməz'),
  price: z
    .number()
    .min(1, 'Qiymət 0-dan böyük olmalıdır')
    .max(10000, 'Qiymət 10000 AZN-dən çox ola bilməz'),
  duration: z
    .string()
    .min(1, 'Müddət tələb olunur'),
  description: z
    .string()
    .max(200, 'Təsvir 200 simvoldan çox ola bilməz')
    .optional(),
})

export const masterServicesSchema = z.object({
  services: z
    .array(masterServiceSchema)
    .min(1, 'Ən azı bir xidmət əlavə edin'),
})

export const masterDocumentsSchema = z.object({
  idCardFront: z
    .string()
    .min(1, 'Şəxsiyyət vəsiqəsinin ön tərəfi tələb olunur'),
  idCardBack: z
    .string()
    .min(1, 'Şəxsiyyət vəsiqəsinin arxa tərəfi tələb olunur'),
  profilePhoto: z
    .string()
    .min(1, 'Profil şəkli tələb olunur'),
  certificates: z
    .array(z.string())
    .optional(),
})

// =============================================
// CONTACT SCHEMAS
// =============================================
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(50, 'Ad 50 simvoldan çox ola bilməz'),
  email: z
    .string()
    .email('Düzgün e-poçt ünvanı daxil edin'),
  phone: z
    .string()
    .regex(
      /^(\+994|0)(50|51|55|70|77|99)[0-9]{7}$/,
      'Düzgün Azərbaycan telefon nömrəsi daxil edin'
    )
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, 'Mövzu tələb olunur'),
  message: z
    .string()
    .min(20, 'Mesaj ən azı 20 simvol olmalıdır')
    .max(1000, 'Mesaj 1000 simvoldan çox ola bilməz'),
})

// =============================================
// SEARCH/FILTER SCHEMAS
// =============================================
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().max(1000).optional(),
  rating: z.number().min(0).max(5).optional(),
  distance: z.number().min(1).max(50).optional(),
  isAvailableToday: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isInsured: z.boolean().optional(),
  sortBy: z.enum(['recommended', 'rating', 'distance', 'price_low', 'price_high', 'reviews']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
})

// =============================================
// TYPE EXPORTS
// =============================================
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type VerifyPhoneFormData = z.infer<typeof verifyPhoneSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type CreateOrderFormData = z.infer<typeof createOrderSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type MessageFormData = z.infer<typeof messageSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type MasterBasicInfoFormData = z.infer<typeof masterBasicInfoSchema>
export type MasterCategoryFormData = z.infer<typeof masterCategorySchema>
export type MasterServicesFormData = z.infer<typeof masterServicesSchema>
export type MasterDocumentsFormData = z.infer<typeof masterDocumentsSchema>
export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>

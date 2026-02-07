"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Home,
  FileText,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  User,
  DollarSign,
  Bell,
  Shield,
  CreditCard,
  Camera,
  MapPin,
  Phone,
  Mail,
  Clock,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Check,
  ChevronRight,
  Briefcase,
  AlertCircle,
  Smartphone,
  Lock,
  Key,
  History,
  Building,
  Wallet,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { UserAvatar } from "@/components/ui/avatar"
import { Badge, VerifiedBadge } from "@/components/ui/badge"
import toast from "react-hot-toast"

// Sidebar navigation items
const SIDEBAR_ITEMS = [
  { id: "overview", label: "İcmal", icon: Home, href: "/usta-panel" },
  { id: "orders", label: "Sifarişlər", icon: FileText, href: "/usta-panel/sifarisler", badge: 5 },
  { id: "calendar", label: "Təqvim", icon: Calendar, href: "/usta-panel/teqvim" },
  { id: "messages", label: "Mesajlar", icon: MessageSquare, href: "/usta-panel/mesajlar", badge: 8 },
  { id: "earnings", label: "Gəlirlər", icon: DollarSign, href: "/usta-panel/gelirler" },
  { id: "analytics", label: "Analitika", icon: BarChart3, href: "/usta-panel/analitika" },
  { id: "profile", label: "Profil", icon: User, href: "/usta-panel/profil" },
  { id: "settings", label: "Tənzimləmələr", icon: Settings, href: "/usta-panel/tenzimlemeler" },
]

// Settings tabs
const SETTINGS_TABS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "services", label: "Xidmət", icon: Briefcase },
  { id: "notifications", label: "Bildirişlər", icon: Bell },
  { id: "security", label: "Təhlükəsizlik", icon: Shield },
  { id: "payment", label: "Ödəniş", icon: CreditCard },
]

// Working days
const DAYS = [
  { value: "monday", label: "B.e" },
  { value: "tuesday", label: "Ç.a" },
  { value: "wednesday", label: "Ç" },
  { value: "thursday", label: "C.a" },
  { value: "friday", label: "C" },
  { value: "saturday", label: "Ş" },
  { value: "sunday", label: "B" },
]

// Districts
const DISTRICTS = [
  "Nəsimi", "Səbail", "Xətai", "Binəqədi", "Yasamal", "Nizami", "Xəzər",
  "Suraxanı", "Qaradağ", "Sabunçu", "Pirallahı", "Abşeron", "Nərimanov"
]

// Demo login history
const LOGIN_HISTORY: any[] = []

// Sidebar Component
function Sidebar({ userName }: { userName: string }) {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <Card className="sticky top-24 p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <UserAvatar name={userName} size="lg" />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-gray-900">{userName}</h3>
              <VerifiedBadge size="sm" />
            </div>
            <p className="text-sm text-gray-500">Usta</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 pb-4 border-b">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">4.9</p>
            <p className="text-xs text-gray-500">Reytinq</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">150</p>
            <p className="text-xs text-gray-500">İş sayı</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                item.id === "settings"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Upgrade CTA */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-orange-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-semibold text-gray-900">Premium ol</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Daha çox sifariş al, daha çox qazan
          </p>
          <Button size="sm" className="w-full">
            Yüksəlt
          </Button>
        </div>
      </Card>
    </aside>
  )
}

// Mobile Navigation
function MobileNav() {
  return (
    <div className="lg:hidden overflow-x-auto mb-6">
      <div className="flex gap-2 pb-2">
        {SIDEBAR_ITEMS.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors",
              item.id === "settings"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// Toggle Switch Component
function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
          checked ? "bg-primary" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  )
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile Settings State
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    bio: "",
    address: "",
    avatar: null as string | null,
  })

  // Load from session
  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || "").split(" ")
      setProfileData(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: session.user?.email || "",
      }))
    }
  }, [session])

  // Service Settings State
  const [serviceData, setServiceData] = useState({
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    hourlyRate: 25,
    serviceDistricts: ["Yasamal", "Nəsimi", "Səbail", "Nizami"],
  })

  // Notification Settings State
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    newOrderAlerts: true,
    messageAlerts: true,
    reviewAlerts: true,
    promotionalEmails: false,
    weeklyReport: true,
  })

  // Security Settings State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  // Payment Settings State
  const [paymentData, setPaymentData] = useState({
    bankName: "",
    accountHolder: "",
    iban: "",
    swiftCode: "",
    acceptCash: true,
    acceptCard: true,
    acceptTransfer: true,
  })

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris")
    }
  }, [status, router])

  // Validate profile form
  const validateProfile = () => {
    const newErrors: Record<string, string> = {}
    if (!profileData.firstName.trim()) newErrors.firstName = "Ad tələb olunur"
    if (!profileData.lastName.trim()) newErrors.lastName = "Soyad tələb olunur"
    if (!profileData.phone.trim()) newErrors.phone = "Telefon tələb olunur"
    if (!profileData.email.trim()) newErrors.email = "E-mail tələb olunur"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Düzgün e-mail daxil edin"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate security form
  const validateSecurity = () => {
    const newErrors: Record<string, string> = {}
    if (securityData.newPassword || securityData.confirmPassword) {
      if (!securityData.currentPassword) {
        newErrors.currentPassword = "Cari şifrə tələb olunur"
      }
      if (securityData.newPassword.length < 8) {
        newErrors.newPassword = "Şifrə ən azı 8 simvol olmalıdır"
      }
      if (securityData.newPassword !== securityData.confirmPassword) {
        newErrors.confirmPassword = "Şifrələr uyğun gəlmir"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save handlers
  const handleSaveProfile = async () => {
    if (!validateProfile()) return
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Profil məlumatları yadda saxlanıldı")
    } catch (error) {
      toast.error("Xəta baş verdi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveServices = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Xidmət tənzimləmələri yadda saxlanıldı")
    } catch (error) {
      toast.error("Xəta baş verdi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Bildiriş tənzimləmələri yadda saxlanıldı")
    } catch (error) {
      toast.error("Xəta baş verdi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSecurity = async () => {
    if (!validateSecurity()) return
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSecurityData({ ...securityData, currentPassword: "", newPassword: "", confirmPassword: "" })
      toast.success("Təhlükəsizlik tənzimləmələri yadda saxlanıldı")
    } catch (error) {
      toast.error("Xəta baş verdi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePayment = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Ödəniş məlumatları yadda saxlanıldı")
    } catch (error) {
      toast.error("Xəta baş verdi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result as string })
        toast.success("Şəkil yükləndi")
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleWorkingDay = (day: string) => {
    const days = serviceData.workingDays.includes(day)
      ? serviceData.workingDays.filter((d) => d !== day)
      : [...serviceData.workingDays, day]
    setServiceData({ ...serviceData, workingDays: days })
  }

  const toggleDistrict = (district: string) => {
    const districts = serviceData.serviceDistricts.includes(district)
      ? serviceData.serviceDistricts.filter((d) => d !== district)
      : [...serviceData.serviceDistricts, district]
    setServiceData({ ...serviceData, serviceDistricts: districts })
  }

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar userName={session?.user?.name || "Usta"} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <MobileNav />

            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Tənzimləmələr</h1>
              <p className="text-gray-600">Hesab və xidmət parametrlərinizi idarə edin</p>
            </div>

            {/* Settings Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {SETTINGS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profil Məlumatları</h2>

                {/* Avatar Upload */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <User className="h-12 w-12 text-primary" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Profil Şəkli</h3>
                    <p className="text-sm text-gray-500">JPG, PNG və ya GIF. Maksimum 5MB</p>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      error={errors.firstName}
                      leftIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      error={errors.lastName}
                      leftIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      error={errors.phone}
                      leftIcon={<Phone className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      error={errors.email}
                      leftIcon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Haqqında</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all"
                    placeholder="Özünüz haqqında qısa məlumat..."
                  />
                  <p className="text-sm text-gray-500 mt-1">{profileData.bio.length}/500 simvol</p>
                </div>

                {/* Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan</label>
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    leftIcon={<MapPin className="h-4 w-4" />}
                    placeholder="Tam ünvanınız..."
                  />
                </div>

                <Button onClick={handleSaveProfile} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                  Yadda saxla
                </Button>
              </Card>
            )}

            {/* Service Settings */}
            {activeTab === "services" && (
              <div className="space-y-6">
                {/* Working Days */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">İş Günləri</h2>
                  <p className="text-sm text-gray-500 mb-4">Hansı günlər işlədiyinizi seçin</p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => toggleWorkingDay(day.value)}
                        className={cn(
                          "w-12 h-12 rounded-lg font-medium transition-colors",
                          serviceData.workingDays.includes(day.value)
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Working Hours */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">İş Saatları</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Başlama saatı</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          value={serviceData.workingHoursStart}
                          onChange={(e) => setServiceData({ ...serviceData, workingHoursStart: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all appearance-none bg-white"
                        >
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0")
                            return (
                              <option key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bitmə saatı</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          value={serviceData.workingHoursEnd}
                          onChange={(e) => setServiceData({ ...serviceData, workingHoursEnd: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all appearance-none bg-white"
                        >
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0")
                            return (
                              <option key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Hourly Rate */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Saatlıq Qiymət</h2>
                  <div className="max-w-xs">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={serviceData.hourlyRate}
                        onChange={(e) => setServiceData({ ...serviceData, hourlyRate: parseInt(e.target.value) || 0 })}
                        className="w-full pl-10 pr-12 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all"
                        min="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₼/saat</span>
                    </div>
                  </div>
                </Card>

                {/* Service Area */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Xidmət Rayonları</h2>
                  <p className="text-sm text-gray-500 mb-4">Hansı rayonlarda xidmət göstərdiyinizi seçin</p>
                  <div className="flex flex-wrap gap-2">
                    {DISTRICTS.map((district) => (
                      <button
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-colors",
                          serviceData.serviceDistricts.includes(district)
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                </Card>

                <Button onClick={handleSaveServices} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                  Yadda saxla
                </Button>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Bildiriş Tənzimləmələri</h2>

                {/* Notification Channels */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-medium text-gray-900 mb-4">Bildiriş Kanalları</h3>
                  <div className="space-y-2">
                    <Toggle
                      checked={notificationData.emailNotifications}
                      onChange={(checked) => setNotificationData({ ...notificationData, emailNotifications: checked })}
                      label="E-mail bildirişləri"
                      description="Yeni sifarişlər və yeniliklər haqqında e-mail alın"
                    />
                    <Toggle
                      checked={notificationData.smsNotifications}
                      onChange={(checked) => setNotificationData({ ...notificationData, smsNotifications: checked })}
                      label="SMS bildirişləri"
                      description="Telefonunuza SMS bildirişləri alın"
                    />
                    <Toggle
                      checked={notificationData.pushNotifications}
                      onChange={(checked) => setNotificationData({ ...notificationData, pushNotifications: checked })}
                      label="Push bildirişləri"
                      description="Brauzerdən push bildirişləri alın"
                    />
                  </div>
                </div>

                {/* Alert Types */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-medium text-gray-900 mb-4">Xəbərdarlıq Növləri</h3>
                  <div className="space-y-2">
                    <Toggle
                      checked={notificationData.newOrderAlerts}
                      onChange={(checked) => setNotificationData({ ...notificationData, newOrderAlerts: checked })}
                      label="Yeni sifariş xəbərdarlıqları"
                      description="Yeni sifariş gəldikdə xəbərdar olun"
                    />
                    <Toggle
                      checked={notificationData.messageAlerts}
                      onChange={(checked) => setNotificationData({ ...notificationData, messageAlerts: checked })}
                      label="Mesaj xəbərdarlıqları"
                      description="Yeni mesaj gəldikdə xəbərdar olun"
                    />
                    <Toggle
                      checked={notificationData.reviewAlerts}
                      onChange={(checked) => setNotificationData({ ...notificationData, reviewAlerts: checked })}
                      label="Rəy xəbərdarlıqları"
                      description="Yeni rəy yazıldıqda xəbərdar olun"
                    />
                  </div>
                </div>

                {/* Other */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Digər</h3>
                  <div className="space-y-2">
                    <Toggle
                      checked={notificationData.promotionalEmails}
                      onChange={(checked) => setNotificationData({ ...notificationData, promotionalEmails: checked })}
                      label="Promosyon e-mailləri"
                      description="Kampaniya və endirimlər haqqında e-mail alın"
                    />
                    <Toggle
                      checked={notificationData.weeklyReport}
                      onChange={(checked) => setNotificationData({ ...notificationData, weeklyReport: checked })}
                      label="Həftəlik hesabat"
                      description="Həftəlik performans hesabatı alın"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                  Yadda saxla
                </Button>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Change Password */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Şifrəni Dəyişdir</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cari şifrə</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          className={cn(
                            "w-full pl-10 pr-10 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-4 transition-all",
                            errors.currentPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-300 focus:border-primary focus:ring-primary-light"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yeni şifrə</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                          className={cn(
                            "w-full pl-10 pr-10 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-4 transition-all",
                            errors.newPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-300 focus:border-primary focus:ring-primary-light"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yeni şifrəni təsdiqləyin</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                          className={cn(
                            "w-full pl-10 pr-10 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-4 transition-all",
                            errors.confirmPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-300 focus:border-primary focus:ring-primary-light"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Two Factor Auth */}
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">İki Faktorlu Autentifikasiya</h2>
                      <p className="text-sm text-gray-500">
                        Hesabınızın təhlükəsizliyini artırmaq üçün iki faktorlu autentifikasiyanı aktiv edin
                      </p>
                    </div>
                    <Toggle
                      checked={securityData.twoFactorEnabled}
                      onChange={(checked) => setSecurityData({ ...securityData, twoFactorEnabled: checked })}
                      label=""
                    />
                  </div>
                  {securityData.twoFactorEnabled && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-green-700">İki faktorlu autentifikasiya aktivdir</p>
                    </div>
                  )}
                </Card>

                {/* Login History */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Giriş Tarixçəsi</h2>
                    <History className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {LOGIN_HISTORY.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Smartphone className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{entry.device}</p>
                            <p className="text-sm text-gray-500">
                              {entry.ip} · {entry.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{entry.date}</p>
                          {entry.current && (
                            <Badge variant="success" size="sm">
                              Hazırki sessiya
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Button onClick={handleSaveSecurity} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                  Yadda saxla
                </Button>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                {/* Bank Account */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Bank Hesabı</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Qazanclarınızın köçürüləcəyi bank hesabı məlumatları
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank adı</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={paymentData.bankName}
                          onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hesab sahibi</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={paymentData.accountHolder}
                          onChange={(e) => setPaymentData({ ...paymentData, accountHolder: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={paymentData.iban}
                          onChange={(e) => setPaymentData({ ...paymentData, iban: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all font-mono"
                          placeholder="AZ00 BANK 0000 0000 0000 0000 0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT kodu</label>
                      <input
                        type="text"
                        value={paymentData.swiftCode}
                        onChange={(e) => setPaymentData({ ...paymentData, swiftCode: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light transition-all font-mono"
                      />
                    </div>
                  </div>
                </Card>

                {/* Accepted Payment Methods */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Qəbul Edilən Ödəniş Üsulları</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Müştərilərdən hansı ödəniş üsullarını qəbul etdiyinizi seçin
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <Checkbox
                        checked={paymentData.acceptCash}
                        onCheckedChange={(checked) =>
                          setPaymentData({ ...paymentData, acceptCash: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Nağd ödəniş</p>
                        <p className="text-sm text-gray-500">İş yerində nağd ödəniş qəbul edin</p>
                      </div>
                      <Wallet className="h-5 w-5 text-gray-400" />
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <Checkbox
                        checked={paymentData.acceptCard}
                        onCheckedChange={(checked) =>
                          setPaymentData({ ...paymentData, acceptCard: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Kart ödənişi</p>
                        <p className="text-sm text-gray-500">Platforma vasitəsilə onlayn kart ödənişi</p>
                      </div>
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <Checkbox
                        checked={paymentData.acceptTransfer}
                        onCheckedChange={(checked) =>
                          setPaymentData({ ...paymentData, acceptTransfer: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Bank köçürməsi</p>
                        <p className="text-sm text-gray-500">Birbaşa bank köçürməsi ilə ödəniş</p>
                      </div>
                      <Building className="h-5 w-5 text-gray-400" />
                    </label>
                  </div>
                </Card>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Qeyd</p>
                    <p className="text-sm text-blue-700">
                      Qazanclarınız hər həftənin bazar ertəsi günü avtomatik olaraq bank hesabınıza köçürülür.
                      Minimum köçürmə məbləği 50₼-dir.
                    </p>
                  </div>
                </div>

                <Button onClick={handleSavePayment} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                  Yadda saxla
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

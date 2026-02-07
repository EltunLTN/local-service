'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Wrench,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Shield,
  Globe,
  Mail,
  Percent,
  ChevronRight,
  Save,
  Menu,
  X,
  Flag,
  AlertTriangle,
  Loader2,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

// Sidebar navigation
const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Panel', href: '/admin' },
  { id: 'users', icon: Users, label: 'İstifadəçilər', href: '/admin/istifadecilar' },
  { id: 'masters', icon: Wrench, label: 'Ustalar', href: '/admin/ustalar' },
  { id: 'orders', icon: ShoppingCart, label: 'Sifarişlər', href: '/admin/sifarisler' },
  { id: 'payments', icon: CreditCard, label: 'Ödənişlər', href: '/admin/odenisler' },
  { id: 'messages', icon: MessageSquare, label: 'Mesajlar', href: '/admin/mesajlar' },
  { id: 'reports', icon: Flag, label: 'Şikayətlər', href: '/admin/sikayetler' },
  { id: 'analytics', icon: BarChart3, label: 'Analitika', href: '/admin/analitika' },
  { id: 'settings', icon: Settings, label: 'Tənzimləmələr', href: '/admin/tenzimlemeler' },
]

// Settings sections
const SETTINGS_SECTIONS = [
  {
    id: 'general',
    icon: Globe,
    title: 'Ümumi Tənzimləmələr',
    description: 'Saytın əsas parametrləri',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Bildirişlər',
    description: 'E-mail və push bildiriş tənzimləmələri',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Təhlükəsizlik',
    description: 'Təhlükəsizlik və giriş parametrləri',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'E-mail Tənzimləmələri',
    description: 'SMTP və e-mail şablonları',
  },
  {
    id: 'commission',
    icon: Percent,
    title: 'Komissiya',
    description: 'Platforma komissiyası və ödəniş parametrləri',
  },
]

// Settings interface
interface SettingsData {
  // General
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  maintenance_mode: boolean
  registration_enabled: boolean

  // Notifications
  email_notifications_enabled: boolean
  sms_notifications_enabled: boolean
  push_notifications_enabled: boolean
  order_email_notifications: boolean
  marketing_emails_enabled: boolean

  // Security
  max_login_attempts: number
  session_timeout_minutes: number
  two_factor_required: boolean
  password_min_length: number
  ip_whitelist_enabled: boolean

  // Email (SMTP)
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_password: string
  email_from_name: string
  email_from_address: string

  // Commission
  platform_commission_percent: number
  minimum_order_amount: number
  master_payout_day: number
}

const DEFAULT_SETTINGS: SettingsData = {
  // General
  site_name: 'UstaBul',
  site_description: 'Azərbaycanın ən böyük usta axtarış platforması',
  contact_email: 'info@ustabul.az',
  contact_phone: '+994 50 000 00 00',
  maintenance_mode: false,
  registration_enabled: true,

  // Notifications
  email_notifications_enabled: true,
  sms_notifications_enabled: false,
  push_notifications_enabled: true,
  order_email_notifications: true,
  marketing_emails_enabled: false,

  // Security
  max_login_attempts: 5,
  session_timeout_minutes: 30,
  two_factor_required: false,
  password_min_length: 8,
  ip_whitelist_enabled: false,

  // Email (SMTP)
  smtp_host: '',
  smtp_port: 587,
  smtp_user: '',
  smtp_password: '',
  email_from_name: 'UstaBul',
  email_from_address: 'noreply@ustabul.az',

  // Commission
  platform_commission_percent: 10,
  minimum_order_amount: 10,
  master_payout_day: 1,
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Settings state
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS)

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...DEFAULT_SETTINGS, ...data })
      } else {
        toast.error('Tənzimləmələr yüklənərkən xəta baş verdi')
      }
    } catch (error) {
      console.error('Settings fetch error:', error)
      toast.error('Tənzimləmələr yüklənərkən xəta baş verdi')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check admin access and fetch settings
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callback=/admin/tenzimlemeler')
    } else if (status === 'authenticated') {
      const isAdmin = session?.user?.role === 'ADMIN'
      if (!isAdmin) {
        router.push('/')
      } else {
        fetchSettings()
      }
    }
  }, [session, status, router, fetchSettings])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success('Tənzimləmələr uğurla yadda saxlanıldı')
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || 'Tənzimləmələr saxlanarkən xəta baş verdi')
      }
    } catch (error) {
      console.error('Settings save error:', error)
      toast.error('Tənzimləmələr saxlanarkən xəta baş verdi')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500">Tənzimləmələr yüklənir...</p>
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sayt Adı
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => updateSetting('site_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sayt Təsviri
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) => updateSetting('site_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Əlaqə E-mail
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Əlaqə Telefonu
                </label>
                <input
                  type="tel"
                  value={settings.contact_phone}
                  onChange={(e) => updateSetting('contact_phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Qeydiyyat</p>
                  <p className="text-sm text-green-600">Yeni istifadəçi qeydiyyatına icazə ver</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registration_enabled}
                  onChange={(e) => updateSetting('registration_enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Texniki İşlər Rejimi</p>
                  <p className="text-sm text-yellow-600">Saytı müvəqqəti olaraq bağlayın</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => updateSetting('maintenance_mode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { key: 'email_notifications_enabled' as const, label: 'E-mail Bildirişləri', desc: 'Vacib hadisələr üçün e-mail göndər' },
              { key: 'push_notifications_enabled' as const, label: 'Push Bildirişləri', desc: 'Brauzer bildirişləri' },
              { key: 'sms_notifications_enabled' as const, label: 'SMS Bildirişləri', desc: 'Telefona SMS göndər' },
              { key: 'order_email_notifications' as const, label: 'Sifariş E-mail Bildirişləri', desc: 'Yeni sifariş gəldikdə e-mail göndər' },
              { key: 'marketing_emails_enabled' as const, label: 'Marketinq E-mailləri', desc: 'Reklam və yeniliklər' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => updateSetting(item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">İki Faktorlu Doğrulama Tələb Et</p>
                <p className="text-sm text-gray-500">Bütün istifadəçilər üçün 2FA tələb olunur</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.two_factor_required}
                  onChange={(e) => updateSetting('two_factor_required', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">IP Ağ Siyahı</p>
                <p className="text-sm text-gray-500">Yalnız müəyyən IP-lərdən girişə icazə ver</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ip_whitelist_enabled}
                  onChange={(e) => updateSetting('ip_whitelist_enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sessiya Müddəti (dəqiqə)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.session_timeout_minutes}
                  onChange={(e) => updateSetting('session_timeout_minutes', parseInt(e.target.value) || 30)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Şifrə Uzunluğu
                </label>
                <input
                  type="number"
                  min="6"
                  value={settings.password_min_length}
                  onChange={(e) => updateSetting('password_min_length', parseInt(e.target.value) || 8)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimum Giriş Cəhdi
              </label>
              <input
                type="number"
                min="1"
                value={settings.max_login_attempts}
                onChange={(e) => updateSetting('max_login_attempts', parseInt(e.target.value) || 5)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">Bu qədər uğursuz cəhddən sonra hesab müvəqqəti bloklanacaq</p>
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.smtp_host}
                  onChange={(e) => updateSetting('smtp_host', e.target.value)}
                  placeholder="smtp.example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settings.smtp_port}
                  onChange={(e) => updateSetting('smtp_port', parseInt(e.target.value) || 587)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP İstifadəçi
                </label>
                <input
                  type="text"
                  value={settings.smtp_user}
                  onChange={(e) => updateSetting('smtp_user', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Şifrə
                </label>
                <input
                  type="password"
                  value={settings.smtp_password}
                  onChange={(e) => updateSetting('smtp_password', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Göndərən Adı
                </label>
                <input
                  type="text"
                  value={settings.email_from_name}
                  onChange={(e) => updateSetting('email_from_name', e.target.value)}
                  placeholder="UstaBul"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Göndərən E-mail
                </label>
                <input
                  type="email"
                  value={settings.email_from_address}
                  onChange={(e) => updateSetting('email_from_address', e.target.value)}
                  placeholder="noreply@ustabul.az"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            <Button variant="outline" type="button">
              Test E-mail Göndər
            </Button>
          </div>
        )

      case 'commission':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <Percent className="h-5 w-5" />
                <p className="font-medium">Komissiya Parametrləri</p>
              </div>
              <p className="text-sm text-blue-600">
                Bu bölmədə platforma komissiyası və ödəniş tənzimləmələrini idarə edə bilərsiniz.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platforma Komissiyası (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.platform_commission_percent}
                onChange={(e) => updateSetting('platform_commission_percent', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">Hər sifarişdən tutulacaq komissiya faizi</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Sifariş Məbləği (₼)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.minimum_order_amount}
                onChange={(e) => updateSetting('minimum_order_amount', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">Qəbul ediləcək minimum sifariş məbləği</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usta Ödəniş Günü
              </label>
              <input
                type="number"
                min="1"
                max="28"
                value={settings.master_payout_day}
                onChange={(e) => updateSetting('master_payout_day', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">Ayın hansı günü ustalar ödəniş alacaq (1-28)</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">UstaBul</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                item.id === 'settings'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Tənzimləmələr</h1>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Yadda Saxla
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-2">
                {SETTINGS_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <section.icon className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{section.title}</p>
                    </div>
                    <ChevronRight className={cn(
                      'h-4 w-4 transition-transform',
                      activeSection === section.id && 'rotate-90'
                    )} />
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.icon && (
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {(() => {
                        const Icon = SETTINGS_SECTIONS.find(s => s.id === activeSection)?.icon
                        return Icon ? <Icon className="h-5 w-5 text-primary" /> : null
                      })()}
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                </div>
                
                {renderSectionContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

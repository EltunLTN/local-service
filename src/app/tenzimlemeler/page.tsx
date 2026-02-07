"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Globe,
  CreditCard,
  Shield,
  Trash2,
  Camera,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  MapPin,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  // Load from session
  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || "").split(" ")
      setProfile(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: session.user?.email || "",
      }))
    }
  }, [session])

  // Password state
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    orderUpdates: true,
    messages: true,
    promotions: false,
    reminders: true,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    shareData: false,
  })

  // Theme
  const [theme, setTheme] = useState("light")

  const handleSave = async (section: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSuccessMessage(`${section} uğurla yeniləndi`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Təhlükəsizlik", icon: Lock },
    { id: "notifications", label: "Bildirişlər", icon: Bell },
    { id: "privacy", label: "Məxfilik", icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tənzimləmələr</h1>
          <p className="text-gray-600 mt-1">Hesab parametrlərinizi idarə edin</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700"
          >
            <Check className="h-5 w-5" />
            {successMessage}
          </motion.div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Çıxış
            </Button>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Profil məlumatları
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <img
                          src="/avatars/user-1.jpg"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </Avatar>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Profil şəkli</p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG. Maksimum 5MB
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ad
                        </label>
                        <Input
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Soyad
                        </label>
                        <Input
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ünvan
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          value={profile.address}
                          onChange={(e) =>
                            setProfile({ ...profile, address: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSave("Profil")}
                      disabled={isLoading}
                      className="mt-4"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Yadda saxla
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Şifrəni dəyiş
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cari şifrə
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPasswords.current ? "text" : "password"}
                          value={password.current}
                          onChange={(e) =>
                            setPassword({ ...password, current: e.target.value })
                          }
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yeni şifrə
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPasswords.new ? "text" : "password"}
                          value={password.new}
                          onChange={(e) =>
                            setPassword({ ...password, new: e.target.value })
                          }
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yeni şifrəni təkrarla
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={password.confirm}
                          onChange={(e) =>
                            setPassword({ ...password, confirm: e.target.value })
                          }
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button onClick={() => handleSave("Şifrə")} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Şifrəni yenilə
                    </Button>
                  </div>
                </Card>

                {/* Connected Accounts */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Bağlı hesablar
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                          <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Google</p>
                          <p className="text-sm text-gray-500">Bağlı deyil</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Bağla
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Delete Account */}
                <Card className="p-6 border-red-200 bg-red-50">
                  <h2 className="text-lg font-semibold text-red-700 mb-2">
                    Hesabı sil
                  </h2>
                  <p className="text-sm text-red-600 mb-4">
                    Bu əməliyyat geri qaytarıla bilməz. Bütün məlumatlarınız silinəcək.
                  </p>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hesabı sil
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Bildiriş tənzimləmələri
                  </h2>

                  <div className="space-y-6">
                    {/* Channels */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">
                        Bildiriş kanalları
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: "email", label: "Email bildirişləri", icon: Mail },
                          { key: "push", label: "Push bildirişlər", icon: Bell },
                          { key: "sms", label: "SMS bildirişlər", icon: Phone },
                        ].map((item) => (
                          <label
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 text-gray-500" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [item.key]: e.target.checked,
                                })
                              }
                              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Types */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">
                        Bildiriş növləri
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: "orderUpdates", label: "Sifariş yenilikləri" },
                          { key: "messages", label: "Mesajlar" },
                          { key: "promotions", label: "Promosyonlar və endirimlər" },
                          { key: "reminders", label: "Xatırlatmalar" },
                        ].map((item) => (
                          <label
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <span className="font-medium">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [item.key]: e.target.checked,
                                })
                              }
                              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSave("Bildiriş tənzimləmələri")}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Yadda saxla
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Məxfilik tənzimləmələri
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        key: "profileVisible",
                        label: "Profili hər kəsə göstər",
                        desc: "Profil məlumatlarınız axtarış nəticələrində görünəcək",
                      },
                      {
                        key: "showOnlineStatus",
                        label: "Onlayn statusu göstər",
                        desc: "Digər istifadəçilər onlayn olduğunuzu görəcək",
                      },
                      {
                        key: "shareData",
                        label: "Məlumat paylaşımı",
                        desc: "Xidməti yaxşılaşdırmaq üçün anonim məlumat paylaş",
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy[item.key as keyof typeof privacy]}
                          onChange={(e) =>
                            setPrivacy({
                              ...privacy,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="w-5 h-5 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </label>
                    ))}

                    <Button
                      onClick={() => handleSave("Məxfilik tənzimləmələri")}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Yadda saxla
                    </Button>
                  </div>
                </Card>

                {/* Theme */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Görünüş
                  </h2>

                  <div className="flex gap-4">
                    {[
                      { id: "light", label: "Açıq", icon: Sun },
                      { id: "dark", label: "Tünd", icon: Moon },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "flex-1 p-4 rounded-xl border-2 transition-all",
                          theme === t.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <t.icon
                          className={cn(
                            "h-6 w-6 mx-auto mb-2",
                            theme === t.id ? "text-primary" : "text-gray-400"
                          )}
                        />
                        <p
                          className={cn(
                            "font-medium",
                            theme === t.id ? "text-primary" : "text-gray-600"
                          )}
                        >
                          {t.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Language */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Dil</h2>
                  <div className="flex items-center gap-4">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <select className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20">
                      <option value="az">Azərbaycan dili</option>
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

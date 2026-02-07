"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  Star,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  Save,
  Edit2,
  Award,
  Shield,
  X,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface MasterProfile {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
  coverImage: string | null
  bio: string
  phone: string
  address: string
  district: string
  experience: number
  hourlyRate: number
  isVerified: boolean
  isInsured: boolean
  isPremium: boolean
  rating: number
  reviewCount: number
  completedJobs: number
  workingDays: string[]
  workingHoursStart: string
  workingHoursEnd: string
  languages: string[]
  categories: { id: string; name: string }[]
  services: { id: string; name: string; price: number; duration: number }[]
  portfolioItems: { id: string; url: string; title: string; type: string }[]
}

const DAYS = [
  { value: "monday", label: "Bazar ertəsi" },
  { value: "tuesday", label: "Çərşənbə axşamı" },
  { value: "wednesday", label: "Çərşənbə" },
  { value: "thursday", label: "Cümə axşamı" },
  { value: "friday", label: "Cümə" },
  { value: "saturday", label: "Şənbə" },
  { value: "sunday", label: "Bazar" },
]

const DISTRICTS = [
  "Nəsimi", "Səbail", "Xətai", "Binəqədi", "Yasamal", "Nizami", "Xəzər",
  "Suraxanı", "Qaradağ", "Sabunçu", "Pirallahı", "Abşeron"
]

export default function MasterProfilePage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<MasterProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    address: "",
    district: "",
    experience: 0,
    hourlyRate: 0,
    workingDays: [] as string[],
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    languages: [] as string[],
  })

  // New service form
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "60",
  })

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  useEffect(() => {
    if (session) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/master/profile")
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setFormData({
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          bio: data.profile.bio || "",
          phone: data.profile.phone,
          address: data.profile.address || "",
          district: data.profile.district || "",
          experience: data.profile.experience,
          hourlyRate: data.profile.hourlyRate,
          workingDays: data.profile.workingDays,
          workingHoursStart: data.profile.workingHoursStart,
          workingHoursEnd: data.profile.workingHoursEnd,
          languages: data.profile.languages,
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast.error("Profil yüklənmədi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const res = await fetch("/api/master/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Profil yeniləndi")
        fetchProfile()
      } else {
        toast.error("Xəta baş verdi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      toast.error("Xidmət adı və qiymət tələb olunur")
      return
    }

    try {
      const res = await fetch("/api/master/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newService.name,
          price: parseFloat(newService.price),
          duration: parseInt(newService.duration),
        }),
      })

      if (res.ok) {
        toast.success("Xidmət əlavə edildi")
        setNewService({ name: "", price: "", duration: "60" })
        fetchProfile()
      } else {
        toast.error("Xəta baş verdi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      const res = await fetch(`/api/master/services/${serviceId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Xidmət silindi")
        fetchProfile()
      } else {
        toast.error("Xəta baş verdi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "avatar")

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        await fetch("/api/master/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: url }),
        })
        toast.success("Şəkil yeniləndi")
        fetchProfile()
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  if (authStatus === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/usta-panel">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Profilim</h1>
            <p className="text-gray-600">Profil məlumatlarınızı idarə edin</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : profile ? (
          <>
            {/* Profile Header Card */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    {profile.isVerified && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Təsdiqlənmiş
                      </Badge>
                    )}
                    {profile.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      {profile.rating.toFixed(1)} ({profile.reviewCount} rəy)
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {profile.completedJobs} iş
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.district || "Bakı"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { value: "info", label: "Əsas məlumatlar" },
                { value: "services", label: "Xidmətlər" },
                { value: "schedule", label: "İş saatları" },
                { value: "portfolio", label: "Portfolio" },
              ].map((tab) => (
                <Button
                  key={tab.value}
                  variant={activeTab === tab.value ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "info" && (
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rayon</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Seçin</option>
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Təcrübə (il)</label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saatlıq qiymət (₼)</label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Haqqımda</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Yadda saxla
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === "services" && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Xidmətlər</h3>
                
                {/* Existing Services */}
                <div className="space-y-3 mb-6">
                  {profile.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.duration} dəqiqə</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{service.price} ₼</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Service */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Yeni xidmət əlavə et</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Xidmət adı"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Qiymət (₼)"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <Button onClick={handleAddService} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Əlavə et
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "schedule" && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">İş saatları</h3>
                
                {/* Working Days */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">İş günləri</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => {
                          const days = formData.workingDays.includes(day.value)
                            ? formData.workingDays.filter((d) => d !== day.value)
                            : [...formData.workingDays, day.value]
                          setFormData({ ...formData, workingDays: days })
                        }}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          formData.workingDays.includes(day.value)
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlama saatı</label>
                    <input
                      type="time"
                      value={formData.workingHoursStart}
                      onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bitmə saatı</label>
                    <input
                      type="time"
                      value={formData.workingHoursEnd}
                      onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Yadda saxla
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === "portfolio" && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Portfolio</h3>
                
                {profile.portfolioItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Portfolio boşdur</p>
                    <p className="text-sm">İşlərinizin şəkillərini əlavə edin</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {profile.portfolioItems.map((item) => (
                      <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 mb-2">Şəkil yükləmək üçün klikləyin</p>
                  <input type="file" accept="image/*" multiple className="hidden" />
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Şəkil əlavə et
                  </Button>
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Profil məlumatları yüklənmədi</p>
          </Card>
        )}
      </div>
    </div>
  )
}

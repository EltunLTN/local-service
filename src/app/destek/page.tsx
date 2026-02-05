"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Send,
  CheckCircle,
  Headphones,
  FileQuestion,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const CONTACT_OPTIONS = [
  {
    icon: Phone,
    title: "Telefon",
    description: "7/24 dəstək xətti",
    value: "+994 50 123 45 67",
    action: "tel:+994501234567",
    color: "bg-green-500",
  },
  {
    icon: Mail,
    title: "Email",
    description: "24 saat ərzində cavab",
    value: "destek@ustabul.az",
    action: "mailto:destek@ustabul.az",
    color: "bg-blue-500",
  },
  {
    icon: MessageCircle,
    title: "Canlı Dəstək",
    description: "09:00 - 22:00",
    value: "İndi yazın",
    action: "#live-chat",
    color: "bg-purple-500",
  },
]

const SUPPORT_TOPICS = [
  { id: "order", label: "Sifariş ilə bağlı", icon: FileQuestion },
  { id: "payment", label: "Ödəniş problemi", icon: AlertCircle },
  { id: "master", label: "Usta şikayəti", icon: Headphones },
  { id: "account", label: "Hesab problemi", icon: MessageCircle },
  { id: "other", label: "Digər", icon: Mail },
]

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    orderId: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Headphones className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Dəstək Mərkəzi
            </h1>
            <p className="text-xl text-white/80">
              Sizə kömək etmək üçün buradayıq. 7/24 dəstək
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CONTACT_OPTIONS.map((option, index) => (
              <motion.a
                key={option.title}
                href={option.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${option.color} flex items-center justify-center`}>
                    <option.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{option.description}</p>
                  <p className="text-primary font-medium">{option.value}</p>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <div className="flex items-center gap-4">
              <FileQuestion className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold text-gray-900">Sualınızın cavabı artıq mövcud ola bilər</h3>
                <p className="text-sm text-gray-600">Tez-tez verilən suallara baxın</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/faq">FAQ-a Bax</Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Bizimlə Əlaqə Saxlayın
            </h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Mesajınız Göndərildi!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Dəstək komandamız ən qısa zamanda sizinlə əlaqə saxlayacaq. 
                    Ortalama cavab müddəti 2-4 saatdır.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Yeni Mesaj Göndər
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Adınızı daxil edin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mövzu *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {SUPPORT_TOPICS.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, topic: topic.id })}
                          className={`p-3 rounded-lg border text-sm text-left flex items-center gap-2 transition-colors ${
                            formData.topic === topic.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <topic.icon className="h-4 w-4" />
                          {topic.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(formData.topic === "order" || formData.topic === "payment") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sifariş ID
                      </label>
                      <Input
                        value={formData.orderId}
                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                        placeholder="ORD-XXXXXX"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Probleminizi ətraflı izah edin..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Göndərilir..."
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Mesaj Göndər
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Working Hours */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              İş Saatları
            </h2>
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Telefon Dəstəyi</p>
                    <p className="text-sm text-gray-600">7/24 aktiv</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Canlı Dəstək</p>
                    <p className="text-sm text-gray-600">09:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

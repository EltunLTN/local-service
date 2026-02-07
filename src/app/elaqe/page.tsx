"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import toast from "react-hot-toast"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Telefon",
    value: "+994 50 123 45 67",
    link: "tel:+994501234567",
    color: "bg-green-500"
  },
  {
    icon: Mail,
    title: "E-poçt",
    value: "destek@ustabul.az",
    link: "mailto:destek@ustabul.az",
    color: "bg-primary"
  },
  {
    icon: MapPin,
    title: "Ünvan",
    value: "Bakı, Azərbaycan",
    link: "https://maps.google.com/?q=Baku,Azerbaijan",
    color: "bg-orange-500"
  },
  {
    icon: Clock,
    title: "İş saatları",
    value: "Həftənin 7 günü, 09:00 - 21:00",
    link: null,
    color: "bg-purple-500"
  }
]

export default function ElaqePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("Mesajınız göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.")
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bizimlə Əlaqə
            </h1>
            <p className="text-lg text-white/90">
              Suallarınız, təklifləriniz və ya probleminiz var? Bizə yazmaqdan çəkinməyin. 
              Komandamız sizə köməklik göstərməyə hazırdır.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_INFO.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                  <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      target={info.link.startsWith("http") ? "_blank" : undefined}
                      rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.value}</p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="p-8 shadow-xl border-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Bizə yazın</h2>
                    <p className="text-gray-500 text-sm">24 saat ərzində cavab veririk</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <Input
                        type="text"
                        placeholder="Adınızı daxil edin"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-poçt *
                      </label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <Input
                        type="tel"
                        placeholder="+994 XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mövzu *
                      </label>
                      <Input
                        type="text"
                        placeholder="Mövzunu qeyd edin"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Mesajınızı buraya yazın..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Göndərilir...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Mesaj Göndər
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-6"
            >
              {/* Map */}
              <Card className="overflow-hidden shadow-xl border-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194473.4296412989!2d49.69215447324715!3d40.39478435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku!5e0!3m2!1sen!2saz!4v1706000000000!5m2!1sen!2saz"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </Card>

              {/* Social Media */}
              <Card className="p-6 shadow-xl border-0">
                <h3 className="font-semibold text-gray-900 mb-4">Sosial şəbəkələrdə izləyin</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </Card>

              {/* FAQ Link */}
              <Card className="p-6 shadow-xl border-0 bg-gradient-to-r from-primary to-purple-600">
                <div className="text-white">
                  <h3 className="font-semibold text-lg mb-2">Tez-tez verilən suallar</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Cavabını axtardığınız sual artıq burada ola bilər.
                  </p>
                  <a 
                    href="/faq"
                    className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    FAQ-a bax
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

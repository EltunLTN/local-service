"use client"

import React from "react"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText, Users, Database } from "lucide-react"
import { Card } from "@/components/ui/card"

const sections = [
  {
    icon: Database,
    title: "Topladığımız Məlumatlar",
    content: `UstaBul platforması aşağıdakı məlumatları toplaya bilər:
    
• Şəxsi məlumatlar: ad, soyad, email, telefon nömrəsi
• Hesab məlumatları: şifrə (şifrələnmiş formada)
• Ünvan məlumatları: xidmət göstəriləcək ünvan
• Ödəniş məlumatları: bank kartı məlumatları (3-cü tərəf ödəniş sistemi vasitəsilə)
• İstifadə məlumatları: platforma ilə qarşılıqlı əlaqə, baxış tarixçəsi
• Cihaz məlumatları: IP ünvanı, brauzer növü, əməliyyat sistemi`
  },
  {
    icon: Eye,
    title: "Məlumatların İstifadəsi",
    content: `Topladığımız məlumatlar aşağıdakı məqsədlərlə istifadə olunur:

• Xidmətlərimizi təqdim etmək və təkmilləşdirmək
• Sifarişləri emal etmək və yerinə yetirmək
• Müştəri dəstəyi göstərmək
• Platforma təhlükəsizliyini təmin etmək
• Fırıldaqçılığın qarşısını almaq
• Qanuni tələblərə riayət etmək
• Şəxsi təkliflər və bildirişlər göndərmək (icazənizlə)`
  },
  {
    icon: Users,
    title: "Məlumatların Paylaşılması",
    content: `Şəxsi məlumatlarınız aşağıdakı hallar istisna olmaqla 3-cü tərəflərlə paylaşılmır:

• Xidmət göstərən ustalar - sifariş yerinə yetirmək üçün zəruri məlumatlar
• Ödəniş xidmətləri - təhlükəsiz ödəniş emal etmək üçün
• Qanuni tələblər - məhkəmə qərarı və ya qanuni sorğu olduqda
• Razılığınız - aydın icazənizlə

Məlumatlarınızı heç vaxt marketinq məqsədləri üçün satmırıq.`
  },
  {
    icon: Lock,
    title: "Məlumat Təhlükəsizliyi",
    content: `Məlumatlarınızı qorumaq üçün aşağıdakı tədbirlər görülür:

• SSL/TLS şifrələmə ilə təhlükəsiz əlaqə
• Şifrələrin hash funksiyaları ilə saxlanması
• Müntəzəm təhlükəsizlik yoxlamaları
• Məhdud əlçatanlıq - yalnız səlahiyyətli işçilər
• Təhlükəsiz ödəniş gateway-ləri (PCI DSS uyğun)
• Müntəzəm ehtiyat nüsxələr`
  },
  {
    icon: FileText,
    title: "Hüquqlarınız",
    content: `Şəxsi məlumatlarınızla bağlı aşağıdakı hüquqlara maliksiniz:

• Əlçatanlıq hüququ - topladığımız məlumatları görə bilərsiniz
• Düzəliş hüququ - yanlış məlumatları düzəldə bilərsiniz
• Silmə hüququ - hesabınızı və məlumatlarınızı silə bilərsiniz
• Etiraz hüququ - marketinq bildirişlərindən imtina edə bilərsiniz
• Daşıma hüququ - məlumatlarınızı yükləyə bilərsiniz

Bu hüquqlardan istifadə etmək üçün hesab tənzimləmələrindən və ya bizimlə əlaqə saxlayaraq sorğu göndərə bilərsiniz.`
  },
  {
    icon: Shield,
    title: "Çərəzlər (Cookies)",
    content: `Platformamızda aşağıdakı çərəzlərdən istifadə edirik:

• Zəruri çərəzlər - platformanın işləməsi üçün lazım olan
• Funksional çərəzlər - tənzimləmələrinizi xatırlamaq üçün
• Analitik çərəzlər - istifadə statistikasını anlamaq üçün
• Marketinq çərəzləri - şəxsi reklam göstərmək üçün (icazənizlə)

Brauzer tənzimləmələrindən çərəzləri idarə edə və ya blok edə bilərsiniz.`
  },
]

export default function PrivacyPage() {
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
            <Shield className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Məxfilik Siyasəti
            </h1>
            <p className="text-xl text-white/80">
              Şəxsi məlumatlarınızın qorunması bizim üçün prioritetdir
            </p>
            <p className="text-sm text-white/60 mt-4">
              Son yenilənmə: 1 Fevral 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-8">
              <p className="text-gray-600 leading-relaxed">
                Bu Məxfilik Siyasəti UstaBul platformasının ("biz", "bizim", "platforma") 
                şəxsi məlumatlarınızı necə topladığını, istifadə etdiyini və qoruduğunu 
                izah edir. Platformamızdan istifadə etməklə bu siyasəti qəbul etmiş olursunuz.
              </p>
            </Card>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          {section.title}
                        </h2>
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact */}
            <Card className="p-8 mt-8 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Əlaqə
              </h2>
              <p className="text-gray-600 mb-4">
                Məxfilik siyasəti ilə bağlı suallarınız varsa, bizimlə əlaqə saxlayın:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>Email: <a href="mailto:privacy@ustabul.az" className="text-primary hover:underline">privacy@ustabul.az</a></li>
                <li>Telefon: <a href="tel:+994501234567" className="text-primary hover:underline">+994 50 123 45 67</a></li>
                <li>Ünvan: Bakı şəhəri, Nərimanov rayonu</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

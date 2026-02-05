"use client"

import React from "react"
import { motion } from "framer-motion"
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from "lucide-react"
import { Card } from "@/components/ui/card"

const sections = [
  {
    title: "1. Xidmətlərin Təsviri",
    content: `UstaBul platforması müştəriləri ev xidmətləri göstərən ustalarla əlaqələndirən onlayn vasitəçi xidmətidir. 
    
Platforma özü birbaşa ev xidmətləri göstərmir, yalnız tərəflər arasında əlaqə yaradır.`
  },
  {
    title: "2. Hesab Yaratma",
    content: `• Platformadan istifadə etmək üçün hesab yaratmalısınız
• 18 yaşdan kiçik şəxslər qeydiyyatdan keçə bilməz
• Təqdim etdiyiniz məlumatların düzgünlüyünə görə məsuliyyət daşıyırsınız
• Hesab məlumatlarınızı gizli saxlamağa borclusunuz
• Hesabınız altında baş verən fəaliyyətlərə görə siz məsuliyyət daşıyırsınız`
  },
  {
    title: "3. Müştəri Öhdəlikləri",
    content: `Müştərilər aşağıdakılara riayət etməlidirlər:

• Ustaya düzgün və tam ünvan məlumatı vermək
• Razılaşdırılmış tarix və saatda hazır olmaq
• Xidmət başa çatdıqdan sonra ödəniş etmək
• Ustaya hörmətlə yanaşmaq
• Qəsdən zərər vurmamaq və ya təhlükəli mühit yaratmamaq`
  },
  {
    title: "4. Usta Öhdəlikləri",
    content: `Ustalar aşağıdakılara riayət etməlidirlər:

• Peşəkar və keyfiyyətli xidmət göstərmək
• Razılaşdırılmış tarixdə vaxtında gəlmək
• Müştəriyə hörmətlə yanaşmaq
• Qiymətləri şəffaf şəkildə bildirmək
• Zərurət olmadan əlavə xidmət təklif etməmək
• Təhlükəsizlik qaydalarına riayət etmək
• Verilən şəxsi məlumatları gizli saxlamaq`
  },
  {
    title: "5. Ödəniş Şərtləri",
    content: `• Ödəniş xidmət tamamlandıqdan sonra edilir
• Qiymət ustanın profilində göstərilən tarifə əsaslanır
• Əlavə işlər üçün əlavə ödəniş ustanın təklifindən asılıdır
• Ustalar komissiya ödəyirlər (10%)
• Geri ödəmə mübahisə hallarında araşdırmadan sonra müəyyən edilir`
  },
  {
    title: "6. Ləğvetmə Siyasəti",
    content: `Müştərilər üçün:
• Xidmətdən 4 saat əvvəl pulsuz ləğv
• 4 saatdan az vaxt qalsa, ləğv haqqı tətbiq oluna bilər

Ustalar üçün:
• Sifarişi qəbul etdikdən sonra ləğv etmək reyting balını aşağı salır
• Təkrarlanan ləğvlər hesabın dayandırılmasına səbəb ola bilər`
  },
  {
    title: "7. Məsuliyyət Məhdudiyyəti",
    content: `• UstaBul vasitəçi platformadır və birbaşa xidmət göstərmir
• Ustanın gördüyü işin keyfiyyətinə görə birbaşa məsuliyyət daşımırıq
• Sığortalanmamış zərərlər üçün məsuliyyət ustaya aiddir
• Platform kəsilmə və ya texniki problemlərdən yaranan itkilərə görə məsul deyil
• Maksimum məsuliyyət ödənilmiş xidmət haqqı ilə məhdudlaşır`
  },
  {
    title: "8. Qadağan Edilmiş Davranışlar",
    content: `Aşağıdakılar qəti qadağandır:

• Yalan məlumat vermək
• Digər istifadəçilərə qarşı hörmətsizlik
• Platformadan kənarda ödəniş həyata keçirmək
• Saxta rəylər yazmaq
• Spam və ya fırıldaqçılıq
• Viruslar və ya zərərli proqramlar yaymaq
• Hər hansı qanunsuz fəaliyyət`
  },
  {
    title: "9. Hesabın Dayandırılması",
    content: `Aşağıdakı hallarda hesab dayandırıla və ya silinə bilər:

• Bu şərtlərin pozulması
• Fırıldaqçılıq və ya əxlaqsız davranış
• Təkrarlanan şikayətlər
• Qanun pozuntuları
• Uzunmüddətli fəalsızlıq (1 il)`
  },
  {
    title: "10. Dəyişikliklər",
    content: `• Bu şərtlər vaxtaşırı yenilənə bilər
• Əsas dəyişikliklər haqqında email vasitəsilə məlumat veriləcək
• Dəyişiklikdən sonra platformadan istifadə yeni şərtləri qəbul etmək sayılır
• Ən son versiya həmişə saytda mövcuddur`
  },
]

export default function TermsPage() {
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
            <Scale className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              İstifadə Şərtləri
            </h1>
            <p className="text-xl text-white/80">
              UstaBul platformasından istifadə qaydaları
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
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                <p className="text-gray-600 leading-relaxed">
                  Bu İstifadə Şərtləri sizinlə UstaBul platforması arasında 
                  hüquqi müqavilədir. Platformadan istifadə etməklə bu şərtləri 
                  oxuduğunuzu, başa düşdüyünüzü və qəbul etdiyinizi təsdiq edirsiniz.
                </p>
              </div>
            </Card>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Acceptance */}
            <Card className="p-8 mt-8 bg-green-50 border-green-200">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Şərtləri Qəbul Etmə
                  </h2>
                  <p className="text-gray-600">
                    Platformada qeydiyyatdan keçməklə və ya xidmətlərimizdən istifadə 
                    etməklə yuxarıda göstərilən bütün şərtləri qəbul etdiyinizi təsdiq edirsiniz.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-8 mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Əlaqə Məlumatları
              </h2>
              <p className="text-gray-600 mb-4">
                İstifadə şərtləri ilə bağlı suallarınız varsa:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>Email: <a href="mailto:legal@ustabul.az" className="text-primary hover:underline">legal@ustabul.az</a></li>
                <li>Telefon: <a href="tel:+994501234567" className="text-primary hover:underline">+994 50 123 45 67</a></li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

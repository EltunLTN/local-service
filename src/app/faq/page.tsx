"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, MessageCircle, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const FAQ_CATEGORIES = [
  {
    id: "general",
    title: "Ümumi Suallar",
    questions: [
      {
        q: "UstaBul nədir?",
        a: "UstaBul Azərbaycanda ev xidmətləri üçün online platformadır. Bu platforma vasitəsilə elektrik, santexnik, təmizlik, kondisioner və digər xidmətlər üzrə peşəkar ustaları tapa bilərsiniz."
      },
      {
        q: "UstaBul necə işləyir?",
        a: "1) Ehtiyacınız olan xidməti seçin. 2) Sizə yaxın ustaları görün. 3) Ustanın profilinə baxın, rəyləri oxuyun. 4) Sifariş yaradın və usta ilə əlaqə saxlayın. 5) Xidmət başa çatdıqdan sonra ödəmə edin."
      },
      {
        q: "UstaBul pulsuzdur?",
        a: "Platformadan istifadə müştərilər üçün tamamilə pulsuzdur. Siz yalnız aldığınız xidmət üçün ödəniş edirsiniz. Ustalar isə hər tamamlanmış sifariş üçün kiçik komissiya ödəyirlər."
      },
    ]
  },
  {
    id: "ordering",
    title: "Sifariş Vermə",
    questions: [
      {
        q: "Sifariş necə yaradılır?",
        a: "Xidmət kateqoriyasını seçin, ustanı tapın və 'Sifariş Ver' düyməsinə basın. Sifarişin təfərrüatlarını (tarix, saatı, ünvan, xüsusi qeydlər) daxil edin və göndərin."
      },
      {
        q: "Sifarişi ləğv edə bilərəm?",
        a: "Bəli, sifarişi xidmət başlamazdan əvvəl ləğv edə bilərsiniz. Hesabınıza daxil olun, 'Sifarişlərim' bölməsinə keçin və ləğv etmək istədiy sifarişi seçin."
      },
      {
        q: "Təcili sifariş vermək mümkündür?",
        a: "Bəli, bəzi ustalar təcili sifariş qəbul edirlər. Axtarış zamanı 'Bu gün mövcud' filterini istifadə edərək hal-hazırda mövcud ustaları tapa bilərsiniz."
      },
    ]
  },
  {
    id: "payment",
    title: "Ödənişlər",
    questions: [
      {
        q: "Hansı ödəniş üsulları qəbul edilir?",
        a: "Nağd ödəniş, bank kartları (Visa, Mastercard), Apple Pay və Google Pay ilə ödəniş edə bilərsiniz."
      },
      {
        q: "Ödəniş nə zaman edilir?",
        a: "Ödəniş xidmət tamamlandıqdan sonra edilir. Əvvəlcədən ödəniş tələb olunmur."
      },
      {
        q: "Qiymət necə müəyyən edilir?",
        a: "Hər usta öz qiymətlərini təyin edir. Sifariş yaratmazdan əvvəl qiyməti ustanın profilində görə bilərsiniz. Xüsusi işlər üçün usta əlavə qiymət təklif edə bilər."
      },
    ]
  },
  {
    id: "masters",
    title: "Ustalar Üçün",
    questions: [
      {
        q: "Usta olaraq necə qeydiyyatdan keçə bilərəm?",
        a: "'Usta Ol' səhifəsinə keçin və qeydiyyat formasını doldurun. Şəxsiyyət vəsiqəsi, peşəkar sertifikatlar və portfel şəkilləri tələb olunur. Yoxlamadan sonra hesabınız aktivləşdiriləcək."
      },
      {
        q: "Komissiya nə qədərdir?",
        a: "Hər tamamlanmış sifariş üçün 10% komissiya tutulur. Bu, platformanın saxlanılması və marketinq xərclərini ödəyir."
      },
      {
        q: "Pulu nə zaman alıram?",
        a: "Xidmət tamamlandıqdan və müştəri təsdiqlədikdən sonra 24 saat ərzində bank hesabınıza pul köçürülür."
      },
    ]
  },
  {
    id: "safety",
    title: "Təhlükəsizlik",
    questions: [
      {
        q: "Ustalar yoxlamadan keçirlər?",
        a: "Bəli, bütün ustalar qeydiyyat zamanı identifikasiya yoxlamasından keçirlər. Şəxsiyyət vəsiqəsi, peşəkar sertifikatlar və əvvəlki iş təcrübəsi yoxlanılır."
      },
      {
        q: "Xidmət sığortalıdır?",
        a: "Sığortalı ustalar profillərində xüsusi işarə ilə göstərilir. Sığortalı ustanı seçsəniz, iş zamanı baş verən hər hansı zərər sığorta tərəfindən ödənilir."
      },
      {
        q: "Problem yaranarsa nə etməli?",
        a: "Dərhal dəstək komandamızla əlaqə saxlayın. 7/24 dəstək xidməti mövcuddur. Tez bir zamanda probleminizi həll etməyə çalışacağıq."
      },
    ]
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("general")

  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tez-tez Verilən Suallar
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Sualınıza cavab tapın və ya dəstək komandamızla əlaqə saxlayın
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Sual axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-white border-0"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="p-4 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Kateqoriyalar</h3>
                <nav className="space-y-1">
                  {FAQ_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === category.id
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </nav>
              </Card>
            </aside>

            {/* Questions */}
            <main className="flex-1">
              {searchQuery ? (
                // Search Results
                filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <Card key={category.id} className="p-6 mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {category.title}
                      </h2>
                      {category.questions.map((faq, index) => (
                        <FAQItem key={index} question={faq.q} answer={faq.a} />
                      ))}
                    </Card>
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-gray-500">
                      "{searchQuery}" üçün heç bir nəticə tapılmadı
                    </p>
                  </Card>
                )
              ) : (
                // Category View
                FAQ_CATEGORIES.filter(c => c.id === activeCategory).map((category) => (
                  <Card key={category.id} className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {category.title}
                    </h2>
                    {category.questions.map((faq, index) => (
                      <FAQItem key={index} question={faq.q} answer={faq.a} />
                    ))}
                  </Card>
                ))
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sualınızı tapa bilmədiniz?
            </h2>
            <p className="text-gray-600 mb-8">
              Dəstək komandamız sizə kömək etməyə hazırdır
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="tel:+994501234567">
                  <Phone className="mr-2 h-5 w-5" />
                  Zəng Et
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:destek@ustabul.az">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Göndər
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/elaqe">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Canlı Dəstək
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

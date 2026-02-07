// @ts-nocheck
"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  UserCheck,
  Calendar,
  Star,
  ArrowRight,
  Shield,
  Clock,
  MessageSquare,
  CreditCard,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const CUSTOMER_STEPS = [
  {
    icon: Search,
    title: "Xidmət axtarın",
    description: "Ehtiyacınız olan xidməti axtarın və ya kateqoriyalardan seçin. Santexnika, elektrik, təmizlik və daha çox xidmət mövcuddur.",
    color: "bg-blue-500",
  },
  {
    icon: UserCheck,
    title: "Usta seçin",
    description: "Reytinqlər, rəylər və qiymətlərə baxaraq sizə ən uyğun ustanı seçin. Bütün ustalar yoxlanılıb və təsdiqlənib.",
    color: "bg-green-500",
  },
  {
    icon: Calendar,
    title: "Vaxt təyin edin",
    description: "Sizə uyğun vaxtı seçin və sifariş yaradın. Usta ilə əlaqə saxlayın və detalları razılaşdırın.",
    color: "bg-purple-500",
  },
  {
    icon: Star,
    title: "Rəy bildirin",
    description: "İş başa çatdıqdan sonra ustaya reytinq və rəy verin. Bu digər müştərilərə yardımçı olacaq.",
    color: "bg-orange-500",
  },
]

const MASTER_STEPS = [
  {
    icon: UserCheck,
    title: "Qeydiyyatdan keçin",
    description: "Platformada usta olaraq qeydiyyatdan keçin. Peşənizi, təcrübənizi və xidmət rayonlarınızı bildin.",
    color: "bg-blue-500",
  },
  {
    icon: MessageSquare,
    title: "Sifarişlər alın",
    description: "Müştərilərdən gələn sifarişləri izləyin və uyğun olanlara müraciət edin.",
    color: "bg-green-500",
  },
  {
    icon: CheckCircle,
    title: "İşi yerinə yetirin",
    description: "Müştəri ilə razılaşdığınız vaxtda işi keyfiyyətlə yerinə yetirin.",
    color: "bg-purple-500",
  },
  {
    icon: CreditCard,
    title: "Ödəniş alın",
    description: "İş başa çatdıqdan sonra ödənişinizi alın. Şəffaf və etibarlı ödəniş sistemi.",
    color: "bg-orange-500",
  },
]

const BENEFITS = [
  {
    icon: Shield,
    title: "Təhlükəsiz və etibarlı",
    description: "Bütün ustalar yoxlanılır. Hər tranzaksiya qorunur.",
  },
  {
    icon: Clock,
    title: "Vaxtınıza hörmət",
    description: "Sürətli cavab vermə və işin vaxtında yetirilməsi.",
  },
  {
    icon: Star,
    title: "Keyfiyyət zəmanəti",
    description: "Müştəri rəyləri ilə keyfiyyət nəzarəti.",
  },
  {
    icon: CreditCard,
    title: "Şəffaf qiymətlər",
    description: "Gizli ödənişlər yoxdur. Əvvəlcədən razılaşdırılmış qiymətlər.",
  },
]

export default function NeceIsleyirPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Necə İşləyir?
            </h1>
            <p className="text-xl text-white/80">
              UstaBul platformasında xidmət almaq və ya usta olaraq qoşulmaq çox sadədir.
              Bir neçə sadə addımla başlayın.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Customer Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Müştərilər üçün
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ev xidmətlərinə ehtiyacınız var? 4 sadə addımla usta tapın.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {CUSTOMER_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${step.color} flex items-center justify-center`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </Card>
                {index < CUSTOMER_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" asChild>
              <Link href="/sifaris/yarat">
                Sifariş Yarat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Master Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ustalar üçün
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Peşəkar bacarıqlarınızla pul qazanmaq istəyirsiniz? UstaBul-a qoşulun.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {MASTER_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${step.color} flex items-center justify-center`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link href="/usta-ol">
                Usta Ol
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Niyə UstaBul?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Hazırsınız?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              İndi başlayın — ya xidmət sifariş verin, ya da usta olaraq qoşulun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link href="/sifaris/yarat">
                  Sifariş Yarat
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/usta-ol">
                  Usta Ol
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

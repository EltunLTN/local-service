"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Droplets,
  Zap,
  Hammer,
  AirVent,
  Sofa,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Check,
  Users,
  Clock,
  AlertCircle,
  Search,
  ArrowRight,
  Loader2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Types
interface Service {
  id: string
  name: string
  price: number
  unit: string
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
  services: Service[]
}

interface CalculatorResult {
  minPrice: number
  maxPrice: number
  breakdown: {
    basePrice: number
    quantity: number
    subtotal: number
    complexityFactor: number
    complexityAmount: number
    urgencyFactor: number
    urgencyAmount: number
    serviceName: string
    unit: string
  }
  masterCount: number
}

// Icon mapping
const iconComponents: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  Hammer: <Hammer className="h-8 w-8" />,
  AirVent: <AirVent className="h-8 w-8" />,
  Sofa: <Sofa className="h-8 w-8" />,
  Sparkles: <Sparkles className="h-8 w-8" />,
}

// Animation variants
const pageTransition = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
}

// Complexity options
const complexityOptions = [
  {
    id: "sade",
    name: "Sadə",
    description: "Standart iş, əlavə çətinlik yoxdur",
    multiplier: "1x",
    icon: "🟢",
  },
  {
    id: "orta",
    name: "Orta",
    description: "Bəzi çətinliklər ola bilər",
    multiplier: "1.3x",
    icon: "🟡",
  },
  {
    id: "murekkeb",
    name: "Mürəkkəb",
    description: "Çətin şərait, əlavə iş tələb edir",
    multiplier: "1.6x",
    icon: "🔴",
  },
]

// Urgency options
const urgencyOptions = [
  {
    id: "planlasdirilmis",
    name: "Planlaşdırılmış",
    description: "1-3 gün ərzində",
    multiplier: "1x",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    id: "bugun",
    name: "Bu gün",
    description: "4-8 saat ərzində",
    multiplier: "1.3x",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    id: "tecili",
    name: "Təcili",
    description: "1-2 saat ərzində",
    multiplier: "1.5x",
    icon: <Zap className="h-5 w-5" />,
  },
]

// Progress indicator component
function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { num: 1, label: "Kateqoriya" },
    { num: 2, label: "Xidmət" },
    { num: 3, label: "Detallar" },
    { num: 4, label: "Nəticə" },
  ]

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 rounded-full" />
        
        {/* Progress line fill */}
        <motion.div
          className="absolute left-0 top-5 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => (
          <div key={step.num} className="relative z-10 flex flex-col items-center">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                currentStep >= step.num
                  ? "bg-gradient-to-r from-primary to-purple-500 text-white border-primary"
                  : "bg-white text-gray-400 border-gray-200"
              )}
              animate={{
                scale: currentStep === step.num ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {currentStep > step.num ? (
                <Check className="h-5 w-5" />
              ) : (
                step.num
              )}
            </motion.div>
            <span
              className={cn(
                "mt-2 text-xs font-medium hidden sm:block",
                currentStep >= step.num ? "text-primary" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Animated price display
function AnimatedPrice({ min, max }: { min: number; max: number }) {
  const [displayMin, setDisplayMin] = useState(0)
  const [displayMax, setDisplayMax] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const stepDuration = duration / steps
    const minIncrement = min / steps
    const maxIncrement = max / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      setDisplayMin(Math.round(minIncrement * currentStep))
      setDisplayMax(Math.round(maxIncrement * currentStep))

      if (currentStep >= steps) {
        setDisplayMin(min)
        setDisplayMax(max)
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [min, max])

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="inline-flex items-baseline gap-1"
      >
        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          {displayMin}₼
        </span>
        <span className="text-2xl md:text-3xl font-medium text-gray-400 mx-2">-</span>
        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          {displayMax}₼
        </span>
      </motion.div>
      <p className="text-gray-500 mt-2">Təxmini qiymət aralığı</p>
    </div>
  )
}

export default function PriceCalculatorPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [result, setResult] = useState<CalculatorResult | null>(null)

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [complexity, setComplexity] = useState("sade")
  const [urgency, setUrgency] = useState("planlasdirilmis")

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/calculator")
        const data = await response.json()
        if (data.success) {
          setCategories(data.data.categories)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Calculate price
  async function calculatePrice() {
    if (!selectedCategory || !selectedService) return

    setCalculating(true)
    try {
      const response = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          serviceType: selectedService.id,
          quantity,
          complexity,
          urgency,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setResult(data.data)
        setCurrentStep(4)
      }
    } catch (error) {
      console.error("Failed to calculate price:", error)
    } finally {
      setCalculating(false)
    }
  }

  // Navigation handlers
  function handleNext() {
    if (currentStep === 3) {
      calculatePrice()
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  function handleBack() {
    if (currentStep === 4) {
      setResult(null)
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  function resetCalculator() {
    setCurrentStep(1)
    setSelectedCategory(null)
    setSelectedService(null)
    setQuantity(1)
    setComplexity("sade")
    setUrgency("planlasdirilmis")
    setResult(null)
  }

  // Check if can proceed
  function canProceed() {
    switch (currentStep) {
      case 1:
        return selectedCategory !== null
      case 2:
        return selectedService !== null
      case 3:
        return quantity > 0
      default:
        return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white mb-4">
            <Calculator className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Qiymət Kalkulyatoru
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Xidmət qiymətini öyrənin və uyğun usta tapın
          </p>
        </motion.div>

        {/* Progress indicator */}
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />

        {/* Main card */}
        <Card className="p-6 md:p-8 shadow-xl border-0">
          <AnimatePresence mode="wait">
            {/* Step 1: Category Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Xidmət kateqoriyasını seçin
                </h2>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCategory(category)
                        setSelectedService(null) // Reset service when category changes
                      }}
                      className={cn(
                        "relative p-4 md:p-6 rounded-xl cursor-pointer transition-all duration-300 border-2",
                        selectedCategory?.id === category.id
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-gray-200 hover:border-primary/50 hover:shadow-md bg-white"
                      )}
                    >
                      {selectedCategory?.id === category.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center"
                        >
                          <Check className="h-4 w-4" />
                        </motion.div>
                      )}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <div style={{ color: category.color }}>
                          {iconComponents[category.icon]}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.services.length} xidmət
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Service Selection */}
            {currentStep === 2 && selectedCategory && (
              <motion.div
                key="step2"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedCategory.color}20` }}
                  >
                    <div style={{ color: selectedCategory.color }}>
                      {iconComponents[selectedCategory.icon]}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedCategory.name} xidmətləri
                    </h2>
                    <p className="text-sm text-gray-500">
                      Lazım olan xidməti seçin
                    </p>
                  </div>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-3"
                >
                  {selectedCategory.services.map((service) => (
                    <motion.div
                      key={service.id}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedService(service)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2",
                        selectedService?.id === service.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedService?.id === service.id
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          )}
                        >
                          {selectedService?.id === service.id && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-primary">
                          {service.price}₼
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          / {service.unit}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && selectedService && (
              <motion.div
                key="step3"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  İş detallarını daxil edin
                </h2>

                {/* Quantity */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Miqdar ({selectedService.unit})
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl font-semibold hover:border-primary hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl font-semibold hover:border-primary hover:text-primary transition-colors"
                    >
                      +
                    </button>
                    <span className="text-gray-500">{selectedService.unit}</span>
                  </div>
                </div>

                {/* Complexity */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    İşin mürəkkəbliyi
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {complexityOptions.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setComplexity(option.id)}
                        className={cn(
                          "p-4 rounded-xl cursor-pointer transition-all duration-300 border-2",
                          complexity === option.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{option.icon}</span>
                          <span className="text-sm font-medium text-primary">
                            {option.multiplier}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{option.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Təcililik
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {urgencyOptions.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setUrgency(option.id)}
                        className={cn(
                          "p-4 rounded-xl cursor-pointer transition-all duration-300 border-2",
                          urgency === option.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-primary">{option.icon}</div>
                          <span className="text-sm font-medium text-primary">
                            {option.multiplier}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{option.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Result */}
            {currentStep === 4 && result && (
              <motion.div
                key="step4"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                {/* Price display */}
                <div className="text-center mb-8">
                  <AnimatedPrice min={result.minPrice} max={result.maxPrice} />
                </div>

                {/* Breakdown */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Qiymət təfərrüatı
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Xidmət:</span>
                      <span className="font-medium">{result.breakdown.serviceName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Baza qiymət:</span>
                      <span className="font-medium">{result.breakdown.basePrice}₼ / {result.breakdown.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Miqdar:</span>
                      <span className="font-medium">{result.breakdown.quantity} {result.breakdown.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ara cəm:</span>
                      <span className="font-medium">{result.breakdown.subtotal}₼</span>
                    </div>
                    {result.breakdown.complexityAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Mürəkkəblik ({result.breakdown.complexityFactor}x):
                        </span>
                        <span className="font-medium text-orange-500">
                          +{result.breakdown.complexityAmount}₼
                        </span>
                      </div>
                    )}
                    {result.breakdown.urgencyAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Təcililik ({result.breakdown.urgencyFactor}x):
                        </span>
                        <span className="font-medium text-red-500">
                          +{result.breakdown.urgencyAmount}₼
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900">Cəmi:</span>
                      <span className="font-bold text-primary">
                        {result.minPrice}₼ - {result.maxPrice}₼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Master count */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl mb-6"
                >
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    Bu kateqoriyada {result.masterCount} usta mövcuddur
                  </span>
                </motion.div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sifaris/yarat" className="flex-1">
                    <Button size="lg" className="w-full">
                      <span>Sifariş yarat</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/xidmetler/${selectedCategory?.id}`} className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      <Search className="mr-2 h-5 w-5" />
                      <span>Ustaları axtar</span>
                    </Button>
                  </Link>
                </div>

                {/* Reset */}
                <button
                  onClick={resetCalculator}
                  className="w-full mt-4 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  Yenidən hesabla
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {currentStep < 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between mt-8 pt-6 border-t"
            >
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={cn(currentStep === 1 && "invisible")}
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Geri
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || calculating}
                className="min-w-[140px]"
              >
                {calculating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Hesablanır
                  </>
                ) : currentStep === 3 ? (
                  <>
                    Hesabla
                    <Calculator className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Növbəti
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </Card>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>
            💡 Qiymətlər təxminidir. Dəqiq qiymət usta ilə razılaşmadan sonra müəyyənləşir.
          </p>
        </motion.div>
      </div>
    </main>
  )
}

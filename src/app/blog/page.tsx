"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, User, ArrowRight, Clock, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const BLOG_POSTS = [
  {
    id: 1,
    title: "Ev Təmirində İlk 10 Səhv və Onlardan Necə Qaçınmaq",
    excerpt: "Ev təmiri edərkən bir çox insan eyni səhvləri təkrarlayır. Bu məqalədə ən çox rast gəlinən 10 səhvi və onlardan necə qaçınacağınızı öyrənəcəksiniz.",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600",
    author: "Rəşad Əliyev",
    date: "2024-02-01",
    category: "Təmir",
    readTime: "5 dəq",
  },
  {
    id: 2,
    title: "Kondisioner Seçərkən Diqqət Ediləcək 7 Məqam",
    excerpt: "Yay mövsümündə kondisioner seçimi çox vacibdir. Düzgün kondisioner seçmək üçün bu 7 mühüm məqamı bilməlisiniz.",
    image: "https://images.unsplash.com/photo-1631545806609-12cc4f3c5c79?w=600",
    author: "Tural Qasımov",
    date: "2024-01-28",
    category: "Kondisioner",
    readTime: "4 dəq",
  },
  {
    id: 3,
    title: "Ev Təmizliyində Peşəkar Məsləhətlər",
    excerpt: "Evinizi daha tez və effektiv təmizləmək üçün peşəkar təmizlik ustalarının istifadə etdiyi üsullar.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
    author: "Aysel Hüseynova",
    date: "2024-01-25",
    category: "Təmizlik",
    readTime: "6 dəq",
  },
  {
    id: 4,
    title: "Elektrik Təhlükəsizliyi: Evdə Nələrə Diqqət Etməli?",
    excerpt: "Elektrik qəzaları çox tehlikeli ola bilər. Evinizdə elektrik təhlükəsizliyini təmin etmək üçün bu qaydaları izləyin.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    author: "Əli Məmmədov",
    date: "2024-01-20",
    category: "Elektrik",
    readTime: "7 dəq",
  },
  {
    id: 5,
    title: "Mətbəx Yenilənməsi: Büdcəyə Uyğun İdeyalar",
    excerpt: "Mətbəxinizi tamamilə dəyişdirmədən yeniləmək istəyirsiniz? Bu büdcəyə uyğun ideyalar sizin üçün.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    author: "Zaur Babayev",
    date: "2024-01-15",
    category: "Mebel",
    readTime: "5 dəq",
  },
  {
    id: 6,
    title: "Su Sızıntısını Necə Aşkar Etmək və Aradan Qaldırmaq",
    excerpt: "Evinizdə su sızıntısı böyük problemlərə səbəb ola bilər. Erkən aşkarlama və həll yolları haqqında məlumat.",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600",
    author: "Vüqar Həsənov",
    date: "2024-01-10",
    category: "Santexnik",
    readTime: "4 dəq",
  },
]

const CATEGORIES = ["Hamısı", "Təmir", "Elektrik", "Santexnik", "Kondisioner", "Təmizlik", "Mebel"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("Hamısı")

  const filteredPosts = selectedCategory === "Hamısı" 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === selectedCategory)

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-white/80">
              Ev təmiri, ustalar və xidmətlər haqqında faydalı məqalələr
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow group">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString('az-AZ')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Daha Çox Yüklə
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

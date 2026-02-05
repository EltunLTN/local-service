import { PrismaClient, UserRole, OrderStatus, Urgency, PaymentMethod, PaymentStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean database
  console.log("🧹 Cleaning existing data...")
  await prisma.notification.deleteMany()
  await prisma.conversationMessage.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.message.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.review.deleteMany()
  await prisma.order.deleteMany()
  await prisma.masterService.deleteMany()
  await prisma.portfolioItem.deleteMany()
  await prisma.masterAvailability.deleteMany()
  await prisma.masterCategory.deleteMany()
  await prisma.master.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create Categories
  console.log("📁 Creating categories...")
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Santexnik",
        slug: "santexnika",
        description: "Kran təmiri, boru dəyişimi, kanalizasiya təmizliyi",
        icon: "🔧",
        image: "/categories/plumbing.jpg",
        isActive: true,
        order: 1,
        subcategories: {
          create: [
            { name: "Kran təmiri", slug: "kran-temiri" },
            { name: "Unitaz quraşdırma", slug: "unitaz-qurashdirma" },
            { name: "Boru təmiri", slug: "boru-temiri" },
            { name: "Kanalizasiya təmizliyi", slug: "kanalizasiya-temizliyi" },
            { name: "Su sayğacı quraşdırma", slug: "su-saygaci" },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: "Elektrik",
        slug: "elektrik",
        description: "Elektrik xətləri, rozetka quraşdırma, işıqlandırma",
        icon: "⚡",
        image: "/categories/electrical.jpg",
        isActive: true,
        order: 2,
        subcategories: {
          create: [
            { name: "Rozetka quraşdırma", slug: "rozetka-qurashdirma" },
            { name: "Elektrik təmiri", slug: "elektrik-temiri" },
            { name: "LED işıqlandırma", slug: "led-ishiqlandirma" },
            { name: "Elektrik pano quraşdırma", slug: "elektrik-pano" },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: "Ev təmiri",
        slug: "temir",
        description: "Kompleks ev təmiri və dekorasiya işləri",
        icon: "🏠",
        image: "/categories/renovation.jpg",
        isActive: true,
        order: 3,
        subcategories: {
          create: [
            { name: "Mətbəx təmiri", slug: "metbex-temiri" },
            { name: "Vanna təmiri", slug: "vanna-temiri" },
            { name: "Otaq təmiri", slug: "otaq-temiri" },
            { name: "Balkon təmiri", slug: "balkon-temiri" },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: "Kondisioner",
        slug: "kondisioner",
        description: "Kondisioner quraşdırma, təmizlik və təmir",
        icon: "❄️",
        image: "/categories/ac.jpg",
        isActive: true,
        order: 4,
        subcategories: {
          create: [
            { name: "Kondisioner quraşdırma", slug: "kond-qurashdirma" },
            { name: "Kondisioner təmizliyi", slug: "kond-temizlik" },
            { name: "Kondisioner təmiri", slug: "kond-temiri" },
            { name: "Freon doldurma", slug: "freon-doldurma" },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: "Rəngsazlıq",
        slug: "rengsazliq",
        description: "Divar boyama, dekorativ rəngləmə",
        icon: "🎨",
        image: "/categories/painting.jpg",
        isActive: true,
        order: 5,
        subcategories: {
          create: [
            { name: "Divar boyama", slug: "divar-boyama" },
            { name: "Dekorativ rəngləmə", slug: "dekorativ-rengleme" },
            { name: "Tavan boyama", slug: "tavan-boyama" },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: "Təmizlik",
        slug: "temizlik",
        description: "Ev, ofis və mənzil təmizliyi",
        icon: "🧹",
        image: "/categories/cleaning.jpg",
        isActive: true,
        order: 6,
        subcategories: {
          create: [
            { name: "Ev təmizliyi", slug: "ev-temizliyi" },
            { name: "Ofis təmizliyi", slug: "ofis-temizliyi" },
            { name: "Pəncərə yuma", slug: "pencere-yuma" },
            { name: "Tikintidən sonra təmizlik", slug: "tikinti-temizliyi" },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create password hash
  const passwordHash = await bcrypt.hash("Password123!", 10)

  // Create Customer Users
  console.log("👤 Creating customers...")
  const customer1 = await prisma.user.create({
    data: {
      email: "customer1@test.com",
      phone: "+994501234567",
      password: passwordHash,
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
      customer: {
        create: {
          firstName: "Anar",
          lastName: "Məmmədov",
          district: "Yasamal",
          address: "Bakı, Yasamal rayonu",
        },
      },
    },
    include: { customer: true },
  })

  const customer2 = await prisma.user.create({
    data: {
      email: "customer2@test.com",
      phone: "+994502345678",
      password: passwordHash,
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
      customer: {
        create: {
          firstName: "Leyla",
          lastName: "Əliyeva",
          district: "Nəsimi",
          address: "Bakı, Nəsimi rayonu",
        },
      },
    },
    include: { customer: true },
  })

  console.log("✅ Created 2 customers")

  // Create Master Users
  console.log("🔧 Creating masters...")
  const master1 = await prisma.user.create({
    data: {
      email: "master1@test.com",
      phone: "+994553456789",
      password: passwordHash,
      role: UserRole.MASTER,
      emailVerified: new Date(),
      master: {
        create: {
          firstName: "Əli",
          lastName: "Həsənov",
          phone: "+994553456789",
          bio: "10 illik təcrübəli santexnik ustası. Hər növ santexnika işləri yerinə yetirilir.",
          experience: 10,
          hourlyRate: 30,
          rating: 4.8,
          reviewCount: 127,
          completedJobs: 245,
          isVerified: true,
          isInsured: true,
          isPremium: true,
          isActive: true,
          district: "Yasamal",
          address: "Bakı şəhəri",
          responseRate: 98,
          responseTime: 15,
          workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
          workingHoursStart: "08:00",
          workingHoursEnd: "20:00",
          languages: ["az", "ru", "en"],
          categories: {
            create: [
              { categoryId: categories[0].id },
            ],
          },
          services: {
            create: [
              {
                name: "Kran təmiri",
                description: "Hər növ kran təmiri və dəyişimi",
                price: 20,
                duration: 60,
              },
              {
                name: "Boru təmiri",
                description: "Boru sızması aradan qaldırılması",
                price: 40,
                duration: 90,
              },
              {
                name: "Kanalizasiya təmizliyi",
                description: "Tıxanmış boruların təmizlənməsi",
                price: 50,
                duration: 60,
              },
            ],
          },
        },
      },
    },
    include: { master: true },
  })

  const master2 = await prisma.user.create({
    data: {
      email: "master2@test.com",
      phone: "+994554567890",
      password: passwordHash,
      role: UserRole.MASTER,
      emailVerified: new Date(),
      master: {
        create: {
          firstName: "Vüsal",
          lastName: "Əliyev",
          phone: "+994554567890",
          bio: "Peşəkar elektrik ustası. Sertifikatlı mütəxəssis.",
          experience: 8,
          hourlyRate: 35,
          rating: 4.9,
          reviewCount: 89,
          completedJobs: 178,
          isVerified: true,
          isInsured: true,
          isPremium: false,
          isActive: true,
          district: "Nəsimi",
          address: "Bakı şəhəri",
          responseRate: 95,
          responseTime: 20,
          workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          workingHoursStart: "09:00",
          workingHoursEnd: "18:00",
          languages: ["az", "ru"],
          categories: {
            create: [
              { categoryId: categories[1].id },
            ],
          },
          services: {
            create: [
              {
                name: "Rozetka quraşdırma",
                description: "Yeni rozetka quraşdırılması",
                price: 15,
                duration: 30,
              },
              {
                name: "Elektrik xətti çəkilməsi",
                description: "Yeni elektrik xətlərinin çəkilməsi",
                price: 80,
                duration: 180,
              },
            ],
          },
        },
      },
    },
    include: { master: true },
  })

  const master3 = await prisma.user.create({
    data: {
      email: "master3@test.com",
      phone: "+994555678901",
      password: passwordHash,
      role: UserRole.MASTER,
      emailVerified: new Date(),
      master: {
        create: {
          firstName: "Rəşad",
          lastName: "Quliyev",
          phone: "+994555678901",
          bio: "Ev təmiri və kondisioner ustası. Keyfiyyətli xidmət.",
          experience: 5,
          hourlyRate: 25,
          rating: 4.6,
          reviewCount: 45,
          completedJobs: 92,
          isVerified: true,
          isInsured: false,
          isPremium: false,
          isActive: true,
          district: "Binəqədi",
          address: "Bakı şəhəri",
          responseRate: 90,
          responseTime: 30,
          workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
          workingHoursStart: "08:00",
          workingHoursEnd: "21:00",
          languages: ["az"],
          categories: {
            create: [
              { categoryId: categories[2].id },
              { categoryId: categories[3].id },
            ],
          },
          services: {
            create: [
              {
                name: "Kondisioner quraşdırma",
                description: "Split sistem kondisioner quraşdırılması",
                price: 100,
                duration: 120,
              },
              {
                name: "Kondisioner təmizliyi",
                description: "Kondisionerin peşəkar təmizlənməsi",
                price: 40,
                duration: 60,
              },
            ],
          },
        },
      },
    },
    include: { master: true },
  })

  console.log("✅ Created 3 masters")

  // Create Orders
  console.log("📋 Creating orders...")
  if (customer1.customer && master1.master) {
    await prisma.order.create({
      data: {
        customerId: customer1.customer.id,
        masterId: master1.master.id,
        categoryId: categories[0].id,
        title: "Kran təmiri",
        description: "Mətbəxdə kran sızır, təcili təmir lazımdır",
        status: OrderStatus.COMPLETED,
        address: "Yasamal, N.Nərimanov 45",
        district: "Yasamal",
        scheduledDate: new Date("2024-01-15"),
        scheduledTime: "10:00 - 12:00",
        urgency: Urgency.PLANNED,
        estimatedPrice: 25,
        totalPrice: 25,
        finalPrice: 25,
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.PAID,
        completedAt: new Date("2024-01-15"),
      },
    })
  }

  if (customer2.customer && master2.master) {
    await prisma.order.create({
      data: {
        customerId: customer2.customer.id,
        masterId: master2.master.id,
        categoryId: categories[1].id,
        title: "Rozetka quraşdırma",
        description: "Yaşayış otağında 3 ədəd rozetka quraşdırılması",
        status: OrderStatus.IN_PROGRESS,
        address: "Nəsimi, Nizami küç. 12",
        district: "Nəsimi",
        scheduledDate: new Date(),
        scheduledTime: "14:00 - 16:00",
        urgency: Urgency.TODAY,
        estimatedPrice: 45,
        totalPrice: 45,
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.PENDING,
      },
    })
  }

  if (customer1.customer && master3.master) {
    await prisma.order.create({
      data: {
        customerId: customer1.customer.id,
        masterId: master3.master.id,
        categoryId: categories[3].id,
        title: "Kondisioner təmizliyi",
        description: "Qonaq otağındakı kondisionerin təmizlənməsi",
        status: OrderStatus.PENDING,
        address: "Yasamal, Şərifzadə 78",
        district: "Yasamal",
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        scheduledTime: "09:00 - 11:00",
        urgency: Urgency.PLANNED,
        estimatedPrice: 40,
        totalPrice: 40,
        paymentMethod: PaymentMethod.CARD,
        paymentStatus: PaymentStatus.PENDING,
      },
    })
  }

  console.log("✅ Created 3 orders")

  // Create Reviews
  console.log("⭐ Creating reviews...")
  const completedOrder = await prisma.order.findFirst({
    where: { status: OrderStatus.COMPLETED },
  })

  if (completedOrder && customer1.customer && master1.master) {
    await prisma.review.create({
      data: {
        orderId: completedOrder.id,
        customerId: customer1.customer.id,
        masterId: master1.master.id,
        rating: 5,
        comment: "Əla xidmət! Usta çox peşəkar idi, işi tez və keyfiyyətli gördü. Tövsiyə edirəm!",
        isApproved: true,
      },
    })
  }

  console.log("✅ Created review")

  // Create Notifications
  console.log("🔔 Creating notifications...")
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        type: "ORDER_COMPLETED",
        title: "Sifariş tamamlandı",
        message: "Kran təmiri sifarişiniz uğurla tamamlandı",
        isRead: true,
      },
      {
        userId: master1.id,
        type: "ORDER_NEW",
        title: "Yeni sifariş",
        message: "Yeni kran təmiri sifarişi qəbul etdiniz",
        isRead: true,
      },
      {
        userId: customer2.id,
        type: "ORDER_ACCEPTED",
        title: "Sifariş qəbul edildi",
        message: "Rozetka quraşdırma sifarişiniz usta tərəfindən qəbul edildi",
        isRead: false,
      },
    ],
  })

  console.log("✅ Created notifications")

  console.log("🎉 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

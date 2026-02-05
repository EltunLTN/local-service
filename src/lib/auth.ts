import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Demo istifadəçilər - database olmadan test üçün
const DEMO_USERS = [
  {
    id: "demo-customer-1",
    email: "musteri@demo.az",
    password: "$2a$10$rKLVxUCkwP8iH/z6K7h8LuLZc9gZNn0Q6oYZpV2x1vF5CNn3QWGXG", // demo123
    name: "Demo Müştəri",
    role: "CUSTOMER",
    image: null,
  },
  {
    id: "demo-master-1",
    email: "usta@demo.az",
    password: "$2a$10$rKLVxUCkwP8iH/z6K7h8LuLZc9gZNn0Q6oYZpV2x1vF5CNn3QWGXG", // demo123
    name: "Demo Usta",
    role: "MASTER",
    image: null,
  },
  {
    id: "demo-admin-1",
    email: "admin@demo.az",
    password: "$2a$10$rKLVxUCkwP8iH/z6K7h8LuLZc9gZNn0Q6oYZpV2x1vF5CNn3QWGXG", // demo123
    name: "Admin",
    role: "ADMIN",
    image: null,
  },
]

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifrə", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email və şifrə tələb olunur")
        }

        // Demo rejimində işləyir
        const demoUser = DEMO_USERS.find(u => u.email === credentials.email)
        
        if (demoUser) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            demoUser.password
          )

          if (!isPasswordValid) {
            throw new Error("Yanlış şifrə")
          }

          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
            image: demoUser.image,
          }
        }

        // Real database ilə cəhd et
        try {
          const prisma = (await import("@/lib/prisma")).default
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              customer: true,
              master: true,
            },
          })

          if (!user || !user.password) {
            throw new Error("İstifadəçi tapılmadı")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Yanlış şifrə")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.customer
              ? `${user.customer.firstName} ${user.customer.lastName}`
              : user.master
              ? `${user.master.firstName} ${user.master.lastName}`
              : user.email,
            role: user.role,
            image: user.customer?.avatar || user.master?.avatar || null,
          }
        } catch (dbError) {
          console.log("Database bağlantısı yoxdur, demo rejimi istifadə olunur")
          throw new Error("İstifadəçi tapılmadı")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as any).role
      }

      if (trigger === "update" && session) {
        token.name = session.name
        token.picture = session.image
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

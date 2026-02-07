import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "./prisma"

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

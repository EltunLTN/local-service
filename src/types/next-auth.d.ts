import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      role: UserRole
      phone?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string | null
    role: UserRole
    phone?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    role: UserRole
    phone?: string | null
    picture?: string | null
  }
}

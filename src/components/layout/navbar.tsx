"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  MessageSquare,
  ChevronDown,
  Briefcase,
  Home,
  Search,
  PlusCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NAV_ITEMS } from "@/lib/constants"

// Logo komponenti
const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group">
    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
      UstaBul
    </span>
  </Link>
)

// Desktop Nav Link
interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
}

const NavLink = ({ href, children, isActive }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
      isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
    )}
  >
    {children}
    {isActive && (
      <motion.div
        layoutId="navbar-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        initial={false}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </Link>
)

// Notification Badge
const NotificationBadge = ({ count }: { count: number }) => {
  if (count === 0) return null
  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
      {count > 9 ? "9+" : count}
    </span>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Simulated auth state - real app-da NextAuth istifadə ediləcək
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({
    name: "Nigar Həsənova",
    email: "nigar@example.com",
    avatar: "",
    role: "customer" as const,
  })
  const [notificationCount, setNotificationCount] = useState(3)

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mobile menu close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* Desktop Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        )}
      >
        <nav className="container-custom">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={pathname === item.href}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Messages */}
                  <Button variant="ghost" size="icon" className="relative" asChild>
                    <Link href="/mesajlar">
                      <MessageSquare className="h-5 w-5" />
                      <NotificationBadge count={2} />
                    </Link>
                  </Button>

                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <NotificationBadge count={notificationCount} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Bildirişlər</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-[300px] overflow-y-auto">
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                          <span className="font-medium">Sifariş qəbul edildi</span>
                          <span className="text-xs text-gray-500">Əli sifarişinizi qəbul etdi</span>
                          <span className="text-xs text-gray-400">5 dəqiqə əvvəl</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                          <span className="font-medium">Yeni rəy</span>
                          <span className="text-xs text-gray-500">Vüqar sizə 5 ulduz verdi!</span>
                          <span className="text-xs text-gray-400">1 saat əvvəl</span>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-center text-primary">
                        <Link href="/bildirisler">Hamısını gör</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Create Order Button */}
                  <Button size="sm" asChild>
                    <Link href="/sifaris/yarat">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Sifariş yarat
                    </Link>
                  </Button>

                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2 pl-2 pr-3">
                        <UserAvatar
                          src={user.avatar}
                          name={user.name}
                          size="sm"
                        />
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs font-normal text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profil">
                          <User className="mr-2 h-4 w-4" />
                          Profilim
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/sifarislerim">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Sifarişlərim
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/ayarlar">
                          <Settings className="mr-2 h-4 w-4" />
                          Ayarlar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setIsAuthenticated(false)}
                        className="text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Çıxış
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/giris">Giriş</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/qeydiyyat">Qeydiyyat</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Menunu bağla" : "Menunu aç"}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-white border-b shadow-lg">
              <nav className="container-custom py-4">
                <div className="space-y-1">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary-light text-primary"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 pt-4 border-t flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/giris">Giriş</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href="/qeydiyyat">Qeydiyyat</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around h-16">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
              pathname === "/" ? "text-primary" : "text-gray-500"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Ana səhifə</span>
          </Link>
          <Link
            href="/xidmetler"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
              pathname.startsWith("/xidmetler") ? "text-primary" : "text-gray-500"
            )}
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px] font-medium">Axtarış</span>
          </Link>
          <Link
            href="/sifaris/yarat"
            className="flex items-center justify-center"
          >
            <div className="w-14 h-14 -mt-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
              <PlusCircle className="h-7 w-7 text-white" />
            </div>
          </Link>
          <Link
            href="/mesajlar"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors relative",
              pathname === "/mesajlar" ? "text-primary" : "text-gray-500"
            )}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px] font-medium">Mesajlar</span>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Link>
          <Link
            href={isAuthenticated ? "/profil" : "/giris"}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
              pathname === "/profil" ? "text-primary" : "text-gray-500"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">
              {isAuthenticated ? "Profil" : "Giriş"}
            </span>
          </Link>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}

export default Navbar

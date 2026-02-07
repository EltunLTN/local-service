'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Wrench,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  Flag,
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

// Sidebar navigation
const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Panel', href: '/admin' },
  { id: 'users', icon: Users, label: 'İstifadəçilər', href: '/admin/istifadecilar' },
  { id: 'masters', icon: Wrench, label: 'Ustalar', href: '/admin/ustalar' },
  { id: 'orders', icon: ShoppingCart, label: 'Sifarişlər', href: '/admin/sifarisler' },
  { id: 'payments', icon: CreditCard, label: 'Ödənişlər', href: '/admin/odenisler' },
  { id: 'messages', icon: MessageSquare, label: 'Mesajlar', href: '/admin/mesajlar' },
  { id: 'reports', icon: Flag, label: 'Şikayətlər', href: '/admin/sikayetler' },
  { id: 'analytics', icon: BarChart3, label: 'Analitika', href: '/admin/analitika' },
  { id: 'settings', icon: Settings, label: 'Tənzimləmələr', href: '/admin/tenzimlemeler' },
]

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callback=/admin/mesajlar')
    } else if (status === 'authenticated') {
      const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.email === 'admin@demo.az'
      if (!isAdmin) {
        router.push('/')
      }
    }
  }, [session, status, router])

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/messages')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setConversations(json.data)
        }
      } catch (error) {
        console.error('Mesajlar yüklənmədi:', error)
      }
    }
    if (status === 'authenticated') {
      fetchConversations()
    }
  }, [status])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages])

  // Filter conversations
  const filteredConversations = conversations.filter(conv => 
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || conv.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const updatedConversation = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        {
          id: selectedConversation.messages.length + 1,
          senderId: 'admin',
          text: newMessage,
          time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
          read: true,
        },
      ],
      lastMessage: newMessage,
      lastMessageTime: 'İndicə',
    }

    setConversations(prev => prev.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    ))
    setSelectedConversation(updatedConversation)
    setNewMessage('')
    toast.success('Mesaj göndərildi')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">UstaBul</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                item.id === 'messages'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Mesajlar</h1>
            </div>
          </div>
        </header>

        {/* Messages Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Söhbət axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv)
                    // Mark as read
                    setConversations(prev => prev.map(c => 
                      c.id === conv.id ? { ...c, unread: 0 } : c
                    ))
                  }}
                  className={cn(
                    'w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100',
                    selectedConversation?.id === conv.id && 'bg-primary/5'
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {conv.participants[0].name[0]}
                    </div>
                    {conv.participants[0].isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {conv.participants.map(p => p.name).join(' & ')}
                      </p>
                      <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-primary mt-1">{conv.orderId}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col bg-gray-50">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                        {selectedConversation.participants[0].name[0]}
                      </div>
                      {selectedConversation.participants[0].isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedConversation.participants.map(p => p.name).join(' & ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.orderId} • {selectedConversation.participants[0].isOnline ? 'Onlayn' : 'Oflayn'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Video className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => {
                    const sender = selectedConversation.participants.find(p => p.id === message.senderId)
                    const isAdmin = message.senderId === 'admin'
                    
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          isAdmin ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div className={cn(
                          'max-w-[70%] rounded-2xl px-4 py-2',
                          isAdmin 
                            ? 'bg-primary text-white rounded-br-sm' 
                            : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                        )}>
                          {!isAdmin && (
                            <p className="text-xs font-medium text-primary mb-1">
                              {sender?.name} ({sender?.role === 'customer' ? 'Müştəri' : 'Usta'})
                            </p>
                          )}
                          <p className="text-sm">{message.text}</p>
                          <div className={cn(
                            'flex items-center justify-end gap-1 mt-1',
                            isAdmin ? 'text-white/70' : 'text-gray-400'
                          )}>
                            <span className="text-xs">{message.time}</span>
                            {isAdmin && (
                              message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </button>
                    <input
                      type="text"
                      placeholder="Mesaj yazın..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Smile className="h-5 w-5 text-gray-500" />
                    </button>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Söhbət Seçin</p>
                  <p className="text-sm">Soldan bir söhbət seçərək mesajları görün</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

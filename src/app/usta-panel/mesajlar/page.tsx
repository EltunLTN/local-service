"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Check,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Conversation {
  id: string
  customer: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
    user: {
      phone: string | null
    }
  }
  lastMessageAt: string
  messages: Message[]
  unreadCount?: number
}

interface Message {
  id: string
  content: string
  type: string
  senderId: string
  isRead: boolean
  createdAt: string
}

export default function MasterMessagesPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/giris")
    }
  }, [authStatus, router])

  useEffect(() => {
    if (session) {
      fetchConversations()
    }
  }, [session])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/messages/conversations")
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
        // Mark as read
        await fetch(`/api/messages/read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId }),
        })
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation.id)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setIsSending(true)
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          receiverId: selectedConversation.customer.id,
          content: newMessage,
        }),
      })

      if (res.ok) {
        setNewMessage("")
        fetchMessages(selectedConversation.id)
      } else {
        toast.error("Mesaj göndərilmədi")
      }
    } catch (error) {
      toast.error("Xəta baş verdi")
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return "Bu gün"
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Dünən"
    } else {
      return d.toLocaleDateString("az-AZ")
    }
  }

  const filteredConversations = conversations.filter((c) =>
    `${c.customer.firstName} ${c.customer.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  if (authStatus === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom max-w-6xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/usta-panel">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Mesajlar</h1>
            <p className="text-gray-600">Müştərilərlə ünsiyyət</p>
          </div>
        </div>

        <Card className="grid md:grid-cols-3 h-[calc(100vh-200px)] overflow-hidden">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Mesaj yoxdur</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedConversation?.id === conversation.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {conversation.customer.avatar ? (
                        <img
                          src={conversation.customer.avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-600">
                          {conversation.customer.firstName[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">
                          {conversation.customer.firstName} {conversation.customer.lastName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.messages[0]?.content || "Mesaj yoxdur"}
                      </p>
                    </div>
                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                      <Badge className="bg-primary text-white text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedConversation.customer.avatar ? (
                        <img
                          src={selectedConversation.customer.avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-medium text-gray-600">
                          {selectedConversation.customer.firstName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {selectedConversation.customer.firstName}{" "}
                        {selectedConversation.customer.lastName}
                      </h3>
                      <p className="text-xs text-green-600">Onlayn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedConversation.customer.user?.phone && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`tel:${selectedConversation.customer.user.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const isOwn = message.senderId === session?.user?.id
                    const showDate =
                      index === 0 ||
                      new Date(message.createdAt).toDateString() !==
                        new Date(messages[index - 1].createdAt).toDateString()

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              isOwn
                                ? "bg-primary text-white rounded-tr-none"
                                : "bg-gray-100 text-gray-900 rounded-tl-none"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 ${
                                isOwn ? "text-white/70" : "text-gray-500"
                              }`}
                            >
                              <span className="text-xs">{formatTime(message.createdAt)}</span>
                              {isOwn && (
                                message.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Mesaj yazın..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary/20"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Söhbət seçin</p>
                  <p className="text-sm">Mesajlaşmağa başlamaq üçün söhbət seçin</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

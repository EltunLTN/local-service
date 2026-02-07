"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  Video,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  Smile,
  Mic,
  Loader2,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

// Types
interface Participant {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
}

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
  isRead: boolean
  readAt: string | null
}

interface LastMessage {
  id: string
  content: string
  createdAt: string
  senderId: string
}

interface Conversation {
  id: string
  participant: Participant
  lastMessage: LastMessage | null
  lastMessageAt: string
}

interface ConversationDetail {
  id: string
  customer: Participant
  master: Participant
  messages: Message[]
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [conversationDetail, setConversationDetail] = useState<ConversationDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris")
    }
  }, [status, router])

  // Fetch conversations on mount
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      
      if (data.success) {
        // API returns data.data with otherUser; map to page's Conversation format
        const list = (data.data || data.conversations || []).map((c: any) => {
          // otherUser has { id, name, avatar } — split name into firstName/lastName
          const other = c.participant || c.otherUser || {}
          const nameParts = (other.name || "").split(" ")
          const firstName = other.firstName || nameParts[0] || "Naməlum"
          const lastName = other.lastName || nameParts.slice(1).join(" ") || ""
          return {
            id: c.id,
            participant: { id: other.id || "", firstName, lastName, avatar: other.avatar || null },
            lastMessage: c.lastMessage && typeof c.lastMessage === "string"
              ? { id: "", content: c.lastMessage, createdAt: c.lastMessageAt, senderId: "" }
              : c.lastMessage || null,
            lastMessageAt: c.lastMessageAt || "",
          }
        })
        setConversations(list)
      } else {
        toast.error(data.message || data.error || "Söhbətlər yüklənə bilmədi")
      }
    } catch {
      toast.error("Server xətası baş verdi")
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      fetchConversations()
    }
  }, [status, fetchConversations])

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true)
    try {
      const res = await fetch(`/api/messages/${conversationId}`)
      const data = await res.json()
      
      if (data.success) {
        // API returns {data: {conversation, messages}} or {conversation, messages}
        const payload = data.data || data
        const conv = payload.conversation
        const msgs = payload.messages || conv?.messages || []
        if (conv) {
          setConversationDetail(conv)
        }
        setMessages(msgs)
      } else {
        toast.error(data.message || data.error || "Mesajlar yüklənə bilmədi")
      }
    } catch {
      toast.error("Server xətası baş verdi")
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversation(id)
    setShowMobileChat(true)
    fetchMessages(id)
  }, [fetchMessages])

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (selectedConversation) {
      pollingRef.current = setInterval(() => {
        fetchMessages(selectedConversation)
        fetchConversations()
      }, 5000)
    }
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [selectedConversation, fetchMessages, fetchConversations])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return

    const content = newMessage.trim()
    setNewMessage("")
    setIsSending(true)

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: (session?.user as any)?.id || "",
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
      readAt: null,
    }
    setMessages((prev) => [...prev, optimisticMessage])

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content,
        }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Replace optimistic message with real one
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === optimisticMessage.id ? data.message : msg
          )
        )
        // Refresh conversations to update last message
        fetchConversations()
      } else {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id))
        setNewMessage(content)
        toast.error(data.message || "Mesaj göndərilə bilmədi")
      }
    } catch {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id))
      setNewMessage(content)
      toast.error("Server xətası baş verdi")
    } finally {
      setIsSending(false)
    }
  }

  // Get status icon
  const getStatusIcon = (isRead: boolean, isMine: boolean) => {
    if (!isMine) return null
    if (isRead) {
      return <CheckCheck className="h-3 w-3 text-primary" />
    }
    return <CheckCheck className="h-3 w-3 text-gray-400" />
  }

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format conversation time
  const formatConversationTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return formatTime(dateStr)
    } else if (diffDays === 1) {
      return "Dünən"
    } else if (diffDays < 7) {
      return date.toLocaleDateString("az-AZ", { weekday: "long" })
    } else {
      return date.toLocaleDateString("az-AZ", { day: "numeric", month: "short" })
    }
  }

  // Get participant name
  const getParticipantName = (participant: Participant) => {
    return `${participant.firstName} ${participant.lastName}`
  }

  // Get current chat participant
  const getCurrentParticipant = (): Participant | null => {
    if (!conversationDetail || !session?.user) return null
    const userId = (session.user as any).id
    // Determine if current user is customer or master
    // and return the other participant
    return conversationDetail.customer.id === userId 
      ? conversationDetail.master 
      : conversationDetail.customer
  }

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true
    const name = getParticipantName(conv.participant).toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return null
  }

  const currentParticipant = getCurrentParticipant()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        <div className="bg-white rounded-none md:rounded-2xl shadow-sm overflow-hidden">
          <div className="flex h-[100vh] md:h-[calc(100vh-120px)]">
            {/* Conversations List */}
            <div
              className={cn(
                "w-full md:w-80 lg:w-96 border-r flex flex-col",
                showMobileChat ? "hidden md:flex" : "flex"
              )}
            >
              {/* Header */}
              <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Mesajlar</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Axtarış..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingConversations ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">Heç bir söhbət tapılmadı</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={cn(
                        "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left border-b",
                        selectedConversation === conv.id && "bg-primary/5"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          {conv.participant.avatar ? (
                            <img
                              src={conv.participant.avatar}
                              alt={getParticipantName(conv.participant)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {conv.participant.firstName.charAt(0)}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 truncate">
                            {getParticipantName(conv.participant)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {conv.lastMessageAt && formatConversationTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessage?.content || "Söhbətə başlayın..."}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={cn(
                "flex-1 flex flex-col",
                !showMobileChat ? "hidden md:flex" : "flex"
              )}
            >
              {selectedConversation && currentParticipant ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowMobileChat(false)}
                        className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          {currentParticipant.avatar ? (
                            <img
                              src={currentParticipant.avatar}
                              alt={getParticipantName(currentParticipant)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {currentParticipant.firstName.charAt(0)}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div>
                        <Link
                          href={`/usta/${currentParticipant.id}`}
                          className="font-medium text-gray-900 hover:text-primary"
                        >
                          {getParticipantName(currentParticipant)}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {isLoadingMessages ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">Hələ mesaj yoxdur</p>
                        <p className="text-sm text-gray-400">Söhbətə başlamaq üçün mesaj göndərin</p>
                      </div>
                    ) : (
                      <>
                        {/* Date Separator */}
                        <div className="flex items-center justify-center">
                          <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                            Bu gün
                          </span>
                        </div>

                        {messages.map((message) => {
                          const isMine = message.senderId === (session?.user as any)?.id
                          return (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn(
                                "flex",
                                isMine ? "justify-end" : "justify-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[75%] rounded-2xl px-4 py-2",
                                  isMine
                                    ? "bg-primary text-white rounded-br-md"
                                    : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                                )}
                              >
                                <p className="text-sm">{message.content}</p>
                                <div
                                  className={cn(
                                    "flex items-center justify-end gap-1 mt-1",
                                    isMine
                                      ? "text-white/70"
                                      : "text-gray-400"
                                  )}
                                >
                                  <span className="text-xs">{formatTime(message.createdAt)}</span>
                                  {getStatusIcon(message.isRead, isMine)}
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-end gap-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          placeholder="Mesaj yazın..."
                          className="w-full px-4 py-3 pr-10 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none max-h-32"
                          rows={1}
                          disabled={isSending}
                        />
                        <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                          <Smile className="h-5 w-5" />
                        </button>
                      </div>
                      {newMessage.trim() ? (
                        <Button 
                          onClick={handleSendMessage} 
                          className="rounded-full h-12 w-12"
                          disabled={isSending}
                        >
                          {isSending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </Button>
                      ) : (
                        <Button variant="ghost" className="rounded-full h-12 w-12 text-gray-500">
                          <Mic className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Send className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Söhbət seçin
                    </h3>
                    <p className="text-sm text-gray-500">
                      Sol tərəfdən bir söhbət seçərək mesajlaşmağa başlayın
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

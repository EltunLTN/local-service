"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
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
  MapPin,
  Calendar,
  Star,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Demo conversations
const conversations = [
  {
    id: "1",
    master: {
      id: "m1",
      name: "Əli Həsənov",
      avatar: "/avatars/master-1.jpg",
      profession: "Santexnik",
      isOnline: true,
      lastSeen: null,
    },
    lastMessage: "Salam, sabah 10:00-a gələ bilərəm. Uyğundur?",
    lastMessageTime: "10:30",
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: "2",
    master: {
      id: "m2",
      name: "Vüsal Məmmədov",
      avatar: "/avatars/master-2.jpg",
      profession: "Elektrik",
      isOnline: false,
      lastSeen: "2 saat əvvəl",
    },
    lastMessage: "İş tamamlandı, təşəkkür edirəm!",
    lastMessageTime: "Dünən",
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: "3",
    master: {
      id: "m3",
      name: "Rəşad Quliyev",
      avatar: "/avatars/master-3.jpg",
      profession: "Kondisioner ustası",
      isOnline: true,
      lastSeen: null,
    },
    lastMessage: "Qiymət təxminən 80-100 AZN arasında olacaq",
    lastMessageTime: "Bazar ertəsi",
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: "4",
    master: {
      id: "m4",
      name: "Tural İsmayılov",
      avatar: "/avatars/master-4.jpg",
      profession: "Mebel ustası",
      isOnline: false,
      lastSeen: "1 gün əvvəl",
    },
    lastMessage: "Foto göndərə bilərsiniz?",
    lastMessageTime: "20 Yanvar",
    unreadCount: 0,
    isPinned: false,
  },
]

// Demo messages for first conversation
const demoMessages = [
  {
    id: "1",
    senderId: "customer",
    content: "Salam, kranım axır, baxmaq mümkündürmü?",
    timestamp: "10:00",
    status: "read",
  },
  {
    id: "2",
    senderId: "m1",
    content: "Salam! Bəli, təbii ki. Hansı ünvanda yerləşirsiniz?",
    timestamp: "10:05",
    status: "read",
  },
  {
    id: "3",
    senderId: "customer",
    content: "Nərimanov rayonu, Təbriz küçəsi 45. Sizə uyğun vaxt nə olardı?",
    timestamp: "10:08",
    status: "read",
  },
  {
    id: "4",
    senderId: "m1",
    content: "Sabah 10:00-a gələ bilərəm. Uyğundur?",
    timestamp: "10:30",
    status: "delivered",
  },
]

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [messages, setMessages] = useState(demoMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedChat = conversations.find((c) => c.id === selectedConversation)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      senderId: "customer",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString("az-AZ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          senderId: "m1",
          content: "Yaxşı, qeyd etdim. Sabah görüşərik!",
          timestamp: new Date().toLocaleTimeString("az-AZ", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "delivered",
        },
      ])
    }, 2000)
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
    setShowMobileChat(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />
      default:
        return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

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
                {conversations.map((conv) => (
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
                        <img
                          src={conv.master.avatar}
                          alt={conv.master.name}
                          className="w-full h-full object-cover"
                        />
                      </Avatar>
                      {conv.master.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {conv.master.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {conv.master.profession}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-primary text-white">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={cn(
                "flex-1 flex flex-col",
                !showMobileChat ? "hidden md:flex" : "flex"
              )}
            >
              {selectedChat ? (
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
                          <img
                            src={selectedChat.master.avatar}
                            alt={selectedChat.master.name}
                            className="w-full h-full object-cover"
                          />
                        </Avatar>
                        {selectedChat.master.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/usta/${selectedChat.master.id}`}
                          className="font-medium text-gray-900 hover:text-primary"
                        >
                          {selectedChat.master.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {selectedChat.master.isOnline
                            ? "Onlayn"
                            : selectedChat.master.lastSeen}
                        </p>
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

                  {/* Order Info Banner */}
                  <div className="px-4 py-3 bg-primary/5 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Sifariş #12345
                          </p>
                          <p className="text-xs text-gray-500">
                            Santexnik xidməti • Sabah, 10:00
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Detallar
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {/* Date Separator */}
                    <div className="flex items-center justify-center">
                      <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                        Bu gün
                      </span>
                    </div>

                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex",
                          message.senderId === "customer" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2",
                            message.senderId === "customer"
                              ? "bg-primary text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={cn(
                              "flex items-center justify-end gap-1 mt-1",
                              message.senderId === "customer"
                                ? "text-white/70"
                                : "text-gray-400"
                            )}
                          >
                            <span className="text-xs">{message.timestamp}</span>
                            {message.senderId === "customer" && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-8 w-8">
                            <img
                              src={selectedChat.master.avatar}
                              alt={selectedChat.master.name}
                              className="w-full h-full object-cover"
                            />
                          </Avatar>
                          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                        />
                        <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                          <Smile className="h-5 w-5" />
                        </button>
                      </div>
                      {newMessage.trim() ? (
                        <Button onClick={handleSendMessage} className="rounded-full h-12 w-12">
                          <Send className="h-5 w-5" />
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

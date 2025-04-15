"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, ArrowLeft, MessageSquare, Search, Plus, Trash2, MoreHorizontal, Star } from "lucide-react"
import { SparklesCore } from "@/components/sparkles"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AllChatsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock chat history
  const chatHistory = [
    {
      id: "1",
      title: "Research on quantum computing",
      date: "Today",
      time: "10:23 AM",
      preview: "I need to understand the basics of quantum computing for my research project...",
      pinned: true,
    },
    {
      id: "2",
      title: "Help with JavaScript code",
      date: "Today",
      time: "9:15 AM",
      preview: "Can you help me debug this React component? It's not rendering correctly...",
      pinned: false,
    },
    {
      id: "3",
      title: "Summarize research paper",
      date: "Yesterday",
      time: "4:30 PM",
      preview: "I need a summary of this paper on machine learning applications in healthcare...",
      pinned: false,
    },
    {
      id: "4",
      title: "Design feedback for website",
      date: "Yesterday",
      time: "2:45 PM",
      preview: "What do you think of this website design? I'm trying to improve the user experience...",
      pinned: false,
    },
    {
      id: "5",
      title: "Help with math problem",
      date: "2 days ago",
      time: "11:20 AM",
      preview: "I'm stuck on this calculus problem involving integration by parts...",
      pinned: false,
    },
    {
      id: "6",
      title: "Travel recommendations",
      date: "3 days ago",
      time: "3:10 PM",
      preview: "I'm planning a trip to Japan next month. Can you recommend some must-visit places?",
      pinned: false,
    },
  ]

  // Filter chats based on search query
  const filteredChats = chatHistory.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Separate pinned and unpinned chats
  const pinnedChats = filteredChats.filter((chat) => chat.pinned)
  const unpinnedChats = filteredChats.filter((chat) => !chat.pinned)

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-x-hidden">
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={30}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <header className="border-b border-gray-800 glass fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/chat" className="text-gray-400 hover:text-white mr-4 flex items-center">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:inline-block md:ml-2">Back to Assistant</span>
            </Link>
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-purple-500 mr-2" />
              <h1 className="text-white font-medium text-lg">All Chats</h1>
            </div>
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <span className="text-white font-bold">NbAIl</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-16 relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button className="ml-4 bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Pinned Chats */}
          {pinnedChats.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white font-medium mb-4 flex items-center">
                <Star className="h-4 w-4 text-purple-500 mr-2" />
                Pinned Chats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedChats.map((chat) => (
                  <ChatCard key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Chats */}
          <div>
            <h2 className="text-white font-medium mb-4">Recent Chats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unpinnedChats.length > 0 ? (
                unpinnedChats.map((chat) => <ChatCard key={chat.id} chat={chat} />)
              ) : (
                <p className="text-gray-400 col-span-2">No chats found. Try a different search term.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ChatCard({ chat }: { chat: any }) {
  return (
    <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <Link href={`/chat/${chat.id}`} className="flex-1">
          <CardTitle className="text-white text-lg">{chat.title}</CardTitle>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-400">
              {chat.date} • {chat.time}
            </span>
            {chat.pinned && (
              <span className="ml-2 bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">Pinned</span>
            )}
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem className="cursor-pointer">
              <Star className="mr-2 h-4 w-4" />
              <span>{chat.pinned ? "Unpin" : "Pin"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-400">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-gray-300 text-sm line-clamp-2">{chat.preview}</p>
      </CardContent>
    </Card>
  )
}

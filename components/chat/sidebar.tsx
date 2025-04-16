"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Brain,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  MoreHorizontal,
  Edit,
  Star,
  Clock,
  Search,
  CreditCard,
  User,
  MessageSquare,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { chatService } from "@/lib/chat-service"
import type { Chat } from "@/types/chat"

// Helper function to get clip-path styles
const getClipPath = (collapsed: boolean, isMobile: boolean) => {
  if (!isMobile) return undefined // No clip-path on desktop
  return collapsed ? "circle(30px at 30px 30px)" : "circle(150% at 0 0)"
  // Adjusted closed circle slightly for visibility of the toggle button area
}

export default function ChatSidebar() {
  const [collapsed, setCollapsed] = useState(true) // Start collapsed on mobile
  const [searchQuery, setSearchQuery] = useState("")
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [isRenaming, setIsRenaming] = useState<string | null>(null)
  const [newChatName, setNewChatName] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  // Load chats from Supabase on initial render
  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true)
      try {
        const chats = await chatService.getChats()
        setChatHistory(chats)
      } catch (error) {
        console.error("Failed to load chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChats()
  }, [])

  // Check if we're on mobile and set initial collapsed state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Only set collapsed state initially or if resizing TO mobile
      if (mobile && !isMobile) {
        setCollapsed(true)
      } else if (!mobile && isMobile) {
        // Optional: Automatically uncollapse when resizing to desktop?
        // setCollapsed(false);
      }
    }

    checkMobile() // Initial check
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile]) // Re-run if isMobile changes

  // Filter chats based on search query
  const filteredChats = chatHistory.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Separate pinned and unpinned chats
  const pinnedChats = filteredChats.filter((chat) => chat.pinned)
  const unpinnedChats = filteredChats.filter((chat) => !chat.pinned)

  // Handle chat deletion
  const handleDeleteChat = (chatId: string) => {
    setChatToDelete(chatId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteChat = async () => {
    if (chatToDelete) {
      const success = await chatService.deleteChat(chatToDelete)
      if (success) {
        setChatHistory((prevChats) => prevChats.filter((chat) => chat.id !== chatToDelete))
      }
      setIsDeleteDialogOpen(false)
      setChatToDelete(null)
    }
  }

  // Handle chat renaming
  const handleRenameChat = (chatId: string, currentName: string) => {
    setIsRenaming(chatId)
    setNewChatName(currentName)
  }

  const confirmRenameChat = async (chatId: string) => {
    if (newChatName.trim()) {
      const success = await chatService.updateChat(chatId, { title: newChatName })
      if (success) {
        setChatHistory((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? { ...chat, title: newChatName } : chat)),
        )
      }
    }
    setIsRenaming(null)
    setNewChatName("")
  }

  // Handle chat pinning/unpinning
  const togglePinChat = async (chatId: string, currentPinned: boolean) => {
    const success = await chatService.togglePinChat(chatId, !currentPinned)
    if (success) {
      setChatHistory((prevChats) =>
        prevChats.map((chat) => (chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat)),
      )
    }
  }

  // Create a new chat
  const createNewChat = async () => {
    const newChat = await chatService.createChat()
    if (newChat) {
      setChatHistory((prev) => [newChat, ...prev])
      router.push(`/chat/${newChat.id}`)
      if (isMobile) {
        setCollapsed(true) // Collapse after creating chat on mobile
      }
    }
  }

  // Update the sidebar links to ensure they navigate to the correct pages
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Billing",
      href: "/billing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Backdrop for mobile sidebar dismissal */}
      <AnimatePresence>
        {!collapsed && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setCollapsed(true)}
            aria-hidden="true" // Hide from accessibility tree
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      {/* On mobile, we hide it completely via clip-path when collapsed, */}
      {/* so we don't need the !(isMobile && collapsed) check here anymore */}
      <motion.div
        className={`bg-gray-900 border-r border-gray-800 h-screen flex flex-col fixed md:relative z-30 ${
          isMobile ? "w-64" : "" // Use fixed width on mobile for clip-path
        }`}
        initial={false}
        animate={{
          // Animate width on desktop, clipPath on mobile
          width: isMobile ? 256 : collapsed ? 80 : 256,
          clipPath: getClipPath(collapsed, isMobile),
        }}
        transition={{
          duration: 0.4, // Slightly longer duration for smoother feel
          ease: "easeInOut", // Smoother easing
        }}
      >
        {/* Ensure content doesn't break layout during animation */}
        <div className="overflow-hidden flex flex-col h-full">
          <div
            className={`p-4 flex items-center ${
              collapsed && !isMobile ? "justify-center" : "justify-between" // Center icon when collapsed on desktop
            } border-b border-gray-800 flex-shrink-0`}
          >
            {/* Conditionally render link only when expanded or on mobile (where it's part of the visible circle area) */}
            {(!collapsed || isMobile) && (
              <Link href="/" className={`flex items-center ${collapsed && !isMobile ? "hidden" : ""}`}>
                <Brain className="h-8 w-8 text-purple-500 flex-shrink-0" />
                {/* Hide text when collapsed on mobile as well */}
                {!(collapsed && isMobile) && <span className="text-white font-bold text-xl ml-2 truncate">NbAIl</span>}
              </Link>
            )}

            {/* Toggle Button - Position absolute on mobile when collapsed for circle effect */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={`text-gray-400 hover:text-white transition-transform duration-300 ${
                isMobile && collapsed ? "absolute top-2 left-2" : "" // Position inside the initial circle area
              }`}
              aria-label={collapsed ? "Open sidebar" : "Close sidebar"} // Accessibility
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              ) : (
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              )}
            </Button>
          </div>

          {/* Rest of the sidebar content */}
          {/* Wrap content in a motion.div to fade it slightly during animation */}
          <motion.div
             className="flex flex-col flex-1 min-h-0" // Ensure it takes up remaining space and allows scrolling
             initial={{ opacity: 1 }}
             animate={{ opacity: collapsed && isMobile ? 0 : 1 }} // Fade out content when collapsing on mobile
             transition={{ duration: 0.1, delay: collapsed ? 0 : 0.2 }} // Quick fade, delayed on open
           >
            {/* New Chat Button */}
            <div className="p-4 flex-shrink-0">
              <Button
                className={`bg-purple-600 hover:bg-purple-700 text-white w-full ${
                  collapsed ? "justify-center px-0" : ""
                } transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20`}
                onClick={createNewChat}
                aria-label="Start a new chat" // Accessibility
              >
                <Plus className={`h-5 w-5 flex-shrink-0 ${collapsed ? "" : "mr-2"}`} /> {/* Adjust margin when collapsed */}
                {!collapsed && <span className="truncate">New Chat</span>}
              </Button>
            </div>

            {/* Search */}
            {!collapsed && (
              <div className="px-4 mb-2 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-800 border-gray-700 text-white h-9"
                  />
                </div>
              </div>
            )}

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto py-2 min-h-0"> {/* Allow shrinking */}
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <>
                  {/* Pinned Chats */}
                  {(!collapsed || !isMobile) && pinnedChats.length > 0 && ( // Hide section header on mobile collapsed
                    <div className="px-2 mb-2">
                      <p className="text-xs font-medium text-gray-400 px-3 uppercase flex items-center">
                        <Star className="h-3 w-3 mr-1" /> Pinned
                      </p>
                      {/* Only show items if not collapsed on mobile */}
                      {!collapsed && (
                         <div className="mt-1 space-y-1">
                          {pinnedChats.map((chat) => (
                            <ChatItem
                              key={chat.id}
                              chat={chat}
                              isActive={pathname === `/chat/${chat.id}`}
                              isRenaming={isRenaming === chat.id}
                              newChatName={newChatName}
                              setNewChatName={setNewChatName}
                              onRename={() => confirmRenameChat(chat.id)}
                              onDelete={() => handleDeleteChat(chat.id)}
                              onRenameClick={() => handleRenameChat(chat.id, chat.title)}
                              onTogglePin={() => togglePinChat(chat.id, chat.pinned)}
                              collapsed={collapsed} // Pass collapsed state
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recent Chats */}
                  {(!collapsed || !isMobile) && ( // Hide section header on mobile collapsed
                    <div className="px-2 mb-2">
                      <p className="text-xs font-medium text-gray-400 px-3 uppercase flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Recent
                      </p>
                       {/* Only show items if not collapsed on mobile */}
                       {!collapsed && (
                         <div className="mt-1 space-y-1">
                          {unpinnedChats.map((chat) => (
                            <ChatItem
                              key={chat.id}
                              chat={chat}
                              isActive={pathname === `/chat/${chat.id}`}
                              isRenaming={isRenaming === chat.id}
                              newChatName={newChatName}
                              setNewChatName={setNewChatName}
                              onRename={() => confirmRenameChat(chat.id)}
                              onDelete={() => handleDeleteChat(chat.id)}
                              onRenameClick={() => handleRenameChat(chat.id, chat.title)}
                              onTogglePin={() => togglePinChat(chat.id, chat.pinned)}
                              collapsed={collapsed} // Pass collapsed state
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Navigation Links */}
            <div className="mt-auto border-t border-gray-800 p-2 flex-shrink-0">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.name : undefined} // Tooltip when collapsed
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Profile/Logout Section */}
            <div className="border-t border-gray-800 p-2 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white ${
                      collapsed ? "justify-center px-0" : "justify-start px-3"
                    } py-2`}
                  >
                    {/* Replace with actual user avatar/icon */}
                    <User className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="ml-3 truncate font-medium">User Name</span> // Replace with actual user name
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-48 bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-red-600/50 text-red-400 focus:bg-red-600/50 focus:text-red-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div> {/* End content fade wrapper */}
        </div> {/* End overflow-hidden wrapper */}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">
            Are you sure you want to delete this chat? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteChat}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Update ChatItem props to include collapsed state
interface ChatItemProps {
  chat: Chat
  isActive: boolean
  isRenaming: boolean
  newChatName: string
  setNewChatName: (name: string) => void
  onRename: () => void
  onDelete: () => void
  onRenameClick: () => void
  onTogglePin: () => void
  collapsed: boolean // Add collapsed prop
}

function ChatItem({
  chat,
  isActive,
  isRenaming,
  newChatName,
  setNewChatName,
  onRename,
  onDelete,
  onRenameClick,
  onTogglePin,
  collapsed, // Destructure collapsed prop
}: ChatItemProps) {
  return (
    <Link
      href={`/chat/${chat.id}`}
      className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
      }`}
    >
      {isRenaming ? (
        <div className="flex items-center px-3 py-2">
          <Input
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white h-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRename()
              }
            }}
            autoFocus
          />
          <Button size="sm" className="ml-2 h-8 bg-purple-600 hover:bg-purple-700" onClick={onRename}>
            Save
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center overflow-hidden">
            {chat.pinned && <Star className="h-3 w-3 text-yellow-400 mr-1.5 flex-shrink-0" />}
            {!collapsed && <span className="truncate">{chat.title}</span>} {/* Hide title when collapsed */}
          </div>
          {!collapsed && ( // Hide dropdown when collapsed
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" sideOffset={5} className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem onClick={onRenameClick} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onTogglePin} className="cursor-pointer">
                  <Star className="mr-2 h-4 w-4" />
                  <span>{chat.pinned ? "Unpin" : "Pin"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={onDelete} className="text-red-400 focus:text-red-400 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}
    </Link>
  )
}

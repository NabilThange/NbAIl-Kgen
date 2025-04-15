"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Glasses, Mic, Paperclip, X, ArrowUp, Plus, Monitor } from "lucide-react"
import Link from "next/link"
import { SparklesCore } from "@/components/sparkles"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { chatService } from "@/lib/chat-service"
import type { Chat, Message, Attachment } from "@/types/chat"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string

  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [chat, setChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock files for the picker
  const mockFiles = [
    { name: "research_paper.pdf", size: "2.4 MB" },
    { name: "presentation.pptx", size: "5.1 MB" },
    { name: "data_analysis.xlsx", size: "1.8 MB" },
  ]

  // Load chat data from Supabase
  useEffect(() => {
    const loadChat = async () => {
      setIsLoading(true)
      try {
        const chatData = await chatService.getChatById(chatId)
        if (chatData) {
          setChat(chatData)
          const messagesData = await chatService.getMessages(chatId)
          setMessages(messagesData)
        } else {
          // If chat doesn't exist, redirect to main chat page
          router.push("/chat")
        }
      } catch (error) {
        console.error("Failed to load chat:", error)
        router.push("/chat")
      } finally {
        setIsLoading(false)
      }
    }

    if (chatId) {
      loadChat()
    }
  }, [chatId, router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !selectedFile) return

    // Prepare attachment if any
    let attachment: Attachment | undefined
    if (selectedFile) {
      attachment = {
        type: "file",
        name: selectedFile,
      }
    }

    // Add user message to UI immediately for better UX
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      role: "user",
      content: input || (selectedFile ? `I'm sending you this file: ${selectedFile}` : ""),
      created_at: new Date().toISOString(),
      attachment_type: attachment?.type,
      attachment_name: attachment?.name,
      attachment_url: attachment?.url,
    }

    setMessages((prev) => [...prev, tempUserMessage])
    setInput("")
    setSelectedFile(null)

    // Save user message to database
    const savedUserMessage = await chatService.addMessage(
      chatId,
      "user",
      input || (selectedFile ? `I'm sending you this file: ${selectedFile}` : ""),
      attachment,
    )

    // Simulate assistant typing
    setIsTyping(true)

    // Simulate assistant response after a delay
    setTimeout(async () => {
      const assistantResponse = getAssistantResponse(input, attachment)

      // Save assistant message to database
      const savedAssistantMessage = await chatService.addMessage(chatId, "assistant", assistantResponse, undefined)

      if (savedAssistantMessage) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMessage.id), // Remove temp message
          savedUserMessage || tempUserMessage, // Use saved message or fallback to temp
          savedAssistantMessage,
        ])
      }

      setIsTyping(false)
    }, 1500)
  }

  // Generate assistant response
  const getAssistantResponse = (userInput: string, attachment?: Attachment): string => {
    if (attachment) {
      if (attachment.type === "file") {
        return `I've received your file "${attachment.name}". I'll analyze its contents and provide insights shortly. Is there anything specific you'd like to know about this file?`
      } else if (attachment.type === "image") {
        return "I can see the image you've shared. It appears to be a diagram or chart. Would you like me to analyze its contents or explain what I'm seeing?"
      }
    }

    const input = userInput.toLowerCase()

    if (input.includes("hello") || input.includes("hi")) {
      return "Hello there! How can I assist you today?"
    } else if (input.includes("help")) {
      return "I'm here to help! I can answer questions, analyze documents, understand your screen, and much more. What would you like to know?"
    } else if (input.includes("ar mode") || input.includes("augmented reality")) {
      return "AR Mode allows me to overlay helpful information in your field of view. You can enable it by clicking the AR Mode button in the chat interface."
    } else if (input.includes("screen") || input.includes("screenaware")) {
      return "ScreenAware lets me see and understand what's on your screen to provide contextual assistance. Enable it by clicking the ScreenAware button."
    } else if (input.includes("feature") || input.includes("can you")) {
      return "I have several capabilities including voice interaction, screen awareness, document understanding, AR mode, and chat memory. What would you like to try?"
    } else {
      return "I understand your message. As a multimodal AI assistant, I can help with various tasks. Would you like to try using my screen awareness or AR features?"
    }
  }

  // Handle microphone activation
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isMicActive) {
      timer = setTimeout(async () => {
        setIsMicActive(false)
        // Simulate receiving a voice message
        const userMessage = await chatService.addMessage(
          chatId,
          "user",
          "Can you explain how AR Mode works?",
          undefined,
        )

        if (userMessage) {
          setMessages((prev) => [...prev, userMessage])
        }

        // Simulate assistant typing
        setIsTyping(true)
        setTimeout(async () => {
          const assistantMessage = await chatService.addMessage(
            chatId,
            "assistant",
            "AR Mode allows me to overlay helpful information in your field of view. You can enable it by clicking the AR Mode button in the chat interface. It uses your device's camera to understand your environment and provide contextual assistance.",
            undefined,
          )

          if (assistantMessage) {
            setMessages((prev) => [...prev, assistantMessage])
          }

          setIsTyping(false)
        }, 2000)
      }, 3000)
    }

    return () => clearTimeout(timer)
  }, [isMicActive, chatId])

  // If still loading or no chat is found, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black/[0.96]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-screen bg-black/[0.96]">
        <div className="text-white">Chat not found. Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-x-hidden">
      {/* Black overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50} // Reduced density for better performance
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <div className="text-center text-gray-400">
                <h3 className="text-xl font-medium text-white mb-2">Start a new conversation</h3>
                <p>Type a message to begin chatting with NbAIl</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} chat-bubble-in`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800/90 backdrop-blur-sm border border-gray-700 text-white"
                  }`}
                >
                  {message.content}

                  {/* Render attachment if present */}
                  {message.attachment_type && (
                    <div className="mt-2">
                      {message.attachment_type === "file" && (
                        <div className="flex items-center p-2 bg-gray-700/50 rounded-md">
                          <Paperclip className="h-4 w-4 mr-2 text-gray-300" />
                          <span className="text-sm text-gray-300">{message.attachment_name}</span>
                        </div>
                      )}
                      {message.attachment_type === "image" && message.attachment_url && (
                        <div className="mt-2 rounded-md overflow-hidden">
                          <img
                            src={message.attachment_url || "/placeholder.svg"}
                            alt="Attached image"
                            className="w-full h-auto max-h-60 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-white">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* File Picker Modal */}
      {isFilePickerOpen && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-80 sm:w-96 animate-in slide-in-from-bottom duration-300">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium">Select a file</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white"
                onClick={() => setIsFilePickerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {mockFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center p-2 bg-gray-700/50 rounded-md cursor-pointer hover:bg-gray-700 transition-colors hover:scale-105 active:scale-95"
                  onClick={() => {
                    setSelectedFile(file.name)
                    setIsFilePickerOpen(false)
                  }}
                >
                  <Paperclip className="h-4 w-4 mr-2 text-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.size}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-300 border-gray-600 hover:scale-105 active:scale-95"
                onClick={() => setIsFilePickerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95"
                onClick={() => setIsFilePickerOpen(false)}
              >
                Upload New File
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-800 p-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            {/* Main input container - ChatGPT style rounded pill */}
            <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-800 hover:border-purple-500/50 transition-all duration-200">
              {/* Left side buttons */}
              <div className="flex items-center pl-2 space-x-1 sm:space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsFilePickerOpen(!isFilePickerOpen)}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Add File</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/ar-mode"
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
                      >
                        <Glasses className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>AR Mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/screen-aware"
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
                      >
                        <Monitor className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>ScreenAware Mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Input field */}
              <div className="flex-1 px-2">
                <Input
                  type="text"
                  placeholder="Ask anything to NbAIl..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-gray-400"
                />
              </div>

              {/* Right side buttons */}
              <div className="flex items-center pr-2 space-x-1 sm:space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMicActive(!isMicActive)}
                      >
                        <Mic className={`h-5 w-5 ${isMicActive ? "text-purple-500" : ""}`} />
                        {isMicActive && (
                          <span className="absolute -inset-1 rounded-full animate-ping bg-purple-500/20"></span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Speak</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="submit"
                        disabled={!input.trim() && !selectedFile}
                        className={`p-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                          input.trim() || selectedFile
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        {input.trim() || selectedFile ? (
                          <ArrowUp className="h-5 w-5" />
                        ) : (
                          <div className="flex items-center justify-center h-5 w-5">
                            <span
                              className="block w-0.5 h-2 bg-white rounded-full mx-0.5 animate-waveform"
                              style={{ animationDelay: "0ms" }}
                            ></span>
                            <span
                              className="block w-0.5 h-3 bg-white rounded-full mx-0.5 animate-waveform"
                              style={{ animationDelay: "100ms" }}
                            ></span>
                            <span
                              className="block w-0.5 h-4 bg-white rounded-full mx-0.5 animate-waveform"
                              style={{ animationDelay: "200ms" }}
                            ></span>
                            <span
                              className="block w-0.5 h-3 bg-white rounded-full mx-0.5 animate-waveform"
                              style={{ animationDelay: "300ms" }}
                            ></span>
                            <span
                              className="block w-0.5 h-2 bg-white rounded-full mx-0.5 animate-waveform"
                              style={{ animationDelay: "400ms" }}
                            ></span>
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Send Message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

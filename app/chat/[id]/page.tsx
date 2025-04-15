"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Glasses, Mic, Paperclip, X, ArrowUp, Plus, Monitor, AudioWaveform, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { SparklesCore } from "@/components/sparkles"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { chatService } from "@/lib/chat-service"
import type { Chat, Message, Attachment } from "@/types/chat"
import { getGroqChatCompletion, getGroqTranscription, getGroqVisionCompletion } from "@/lib/groq-service"

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
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [chat, setChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (!input.trim() && !selectedFile && !selectedImageFile) return

    // Determine user content (text or image prompt)
    const userTextContent = input || (selectedFile ? `I'm sending you this file: ${selectedFile}` : 
                           selectedImageFile ? `I've uploaded an image. ${input || 'What do you see?'}` : "")

    // Prepare attachment if any (for non-image files)
    let attachment: Attachment | undefined
    if (selectedFile) {
      attachment = {
        type: "file",
        name: selectedFile,
      }
    } else if (selectedImageFile && imageBase64) {
      // Create a temporary attachment representation for the UI
      attachment = {
        type: "image",
        name: selectedImageFile.name,
        url: imageBase64, // Use base64 for preview in UI
      }
    }

    // Add user message to UI immediately for better UX
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      role: "user",
      content: userTextContent,
      created_at: new Date().toISOString(),
      attachment_type: attachment?.type,
      attachment_name: attachment?.name,
      attachment_url: attachment?.url, // Will show base64 preview for image
    }

    setMessages((prev) => [...prev, tempUserMessage])
    const currentInput = input
    const currentImageBase64 = imageBase64
    const currentImageFile = selectedImageFile
    setInput("")
    setSelectedFile(null)
    setImageBase64(null) // Clear image state
    setSelectedImageFile(null) // Clear image state

    // Save user message to database (handle potential image attachment)
    // Note: chatService.addMessage might need adjustment if you want to persist image data/urls differently
    const savedUserMessage = await chatService.addMessage(
      chatId,
      "user",
      userTextContent,
      attachment, // Passing the UI attachment representation
    )

    // Indicate assistant is thinking
    setIsTyping(true)

    try {
      let assistantResponse = ""
      // --- Check if it's an image submission ---
      if (currentImageFile && currentImageBase64) {
        assistantResponse = await getGroqVisionCompletion(
          currentInput || "Describe this image.", // Use input or default prompt
          currentImageBase64,
          currentImageFile.type
        )
      } else {
      // --- Otherwise, use standard chat completion ---
        assistantResponse = await getGroqChatCompletion(currentInput || (selectedFile ? `Analyzing file: ${selectedFile}` : ""))
      }
      // ------------------------------------------

      // Save assistant message to database
      const savedAssistantMessage = await chatService.addMessage(chatId, "assistant", assistantResponse, undefined)

      if (savedAssistantMessage) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMessage.id), // Remove temp message
          savedUserMessage || tempUserMessage, // Use saved message or fallback to temp
          savedAssistantMessage,
        ])
      } else {
        // Handle error if assistant message couldn't be saved
        console.error("Failed to save assistant message.")
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id))
      }
    } catch (error) {
      console.error("Error getting or saving assistant response:", error)
      // Show error message to the user
      const errorAssistantMessage: Message = {
        id: `temp-error-${Date.now()}`,
        chat_id: chatId,
        role: "assistant",
        content: "Sorry, I encountered an error trying to respond.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id),
        savedUserMessage || tempUserMessage,
        errorAssistantMessage,
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // --- Add Audio Recording Logic --- 
  const handleMicMouseDown = async () => {
    if (isRecording || typeof navigator === 'undefined' || !navigator.mediaDevices) {
      console.warn("Media devices not available or already recording.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = [] // Reset chunks

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" })

        setIsRecording(false)
        setIsMicActive(false)
        setIsTranscribing(true)

        try {
          const transcribedText = await getGroqTranscription(audioFile)
          if (transcribedText && !transcribedText.startsWith("Sorry")) {
            setInput(transcribedText)
          } else {
            setInput("Transcription failed. Please try again.")
          }
        } catch (error) {
          console.error("Transcription API call failed:", error)
          setInput("Transcription failed. Please try again.")
        } finally {
          setIsTranscribing(false)
        }

        // Clean up the stream tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsMicActive(true) // Update visual state
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Could not access microphone. Please check permissions.")
      setIsMicActive(false)
      setIsRecording(false)
    }
  }

  const handleMicMouseUp = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      // onstop event handles the rest
    }
  }
  // ----------------------------------

  // --- Add File Handling Logic ---
  const handleFileButtonClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Basic validation (type and size)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    const maxSize = 4 * 1024 * 1024 // 4MB limit (adjust as needed based on API)

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please select a PNG, JPG, or JPEG image.")
      return
    }

    if (file.size > maxSize) {
      alert(`File is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`)
      return
    }

    // Read file as Base64
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageBase64(reader.result as string)
      setSelectedImageFile(file)
    }
    reader.onerror = (error) => {
      console.error("Error reading file:", error)
      alert("Failed to read file.")
      setImageBase64(null)
      setSelectedImageFile(null)
    }
    reader.readAsDataURL(file)

    // Reset file input value to allow selecting the same file again
    event.target.value = ""
  }

  const handleRemoveImage = () => {
    setImageBase64(null)
    setSelectedImageFile(null)
  }
  // -----------------------------

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
                      ? "bg-gray-700/80 text-white"
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

          {/* Typing indicator -> Replaced with Thinking Animation */} 
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="thinking-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start pl-4"
              >
                {/* --- Thinking Animation Structure --- */}
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                  <div className="thinking-wrapper">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                  </div>
                </div>
                {/* --- End Thinking Animation --- */}
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

      {/* Input area & Image Preview */} 
      <div className="border-t border-gray-800 p-4 relative z-10">
        {/* Image Preview Section */} 
        {imageBase64 && (
          <div className="max-w-3xl mx-auto mb-2">
            <div className="relative inline-block bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg p-1">
              <img 
                src={imageBase64} 
                alt="Selected preview" 
                className="h-16 w-auto max-w-xs rounded object-contain"
              />
              <button 
                onClick={handleRemoveImage} 
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 h-5 w-5 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
        {/* End Image Preview Section */} 

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
                        onClick={handleFileButtonClick}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Add Image</p>
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
                  placeholder={
                    isRecording ? "🎤 NbAIl is listening to you..." :
                    isTranscribing ? "🧠 Transcribing your thoughts..." :
                    "Ask anything to NbAIl..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-gray-400"
                  disabled={isTranscribing || isRecording}
                />
              </div>

              {/* Right side buttons */}
              <div className="flex items-center pr-2 space-x-1 sm:space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={`p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${isRecording ? 'bg-red-500/30' : ''} ${isTranscribing ? 'cursor-not-allowed' : ''}`}
                        onMouseDown={handleMicMouseDown}
                        onMouseUp={handleMicMouseUp}
                        onTouchStart={handleMicMouseDown}
                        onTouchEnd={handleMicMouseUp}
                        disabled={isTranscribing}
                      >
                        {isTranscribing ? (
                          <div className="loader"></div>
                        ) : (
                          <>
                            <Mic className={`h-5 w-5 ${isMicActive ? "text-purple-500 animate-pulse" : ""} ${isRecording ? "text-red-500" : ""}`} />
                            {isMicActive && !isRecording && (
                              <span className="absolute -inset-1 rounded-full animate-ping bg-purple-500/20"></span>
                            )}
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{isRecording ? "Stop Recording" : isTranscribing ? "Transcribing..." : "Hold to Speak"}</p>
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
                            <AudioWaveform className="h-5 w-5" />
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

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              style={{ display: "none" }}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

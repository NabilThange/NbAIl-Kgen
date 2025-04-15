"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { SparklesCore } from "@/components/sparkles"

export default function ChatContent() {
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock files for the picker
  const mockFiles = [
    { name: "research_paper.pdf", size: "2.4 MB" },
    { name: "presentation.pptx", size: "5.1 MB" },
    { name: "data_analysis.xlsx", size: "1.8 MB" },
  ]

  // This is a placeholder component that will be redirected from
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
          <div className="flex items-center justify-center h-full min-h-[50vh]">
            <div className="text-center text-gray-400">
              <h3 className="text-xl font-medium text-white mb-2">Redirecting to chat...</h3>
              <p>Please wait while we set up your conversation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 p-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Main input container - ChatGPT style rounded pill */}
            <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-800 hover:border-purple-500/50 transition-all duration-200">
              {/* Input field */}
              <div className="flex-1 px-4">
                <Input
                  type="text"
                  placeholder="Redirecting..."
                  disabled
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

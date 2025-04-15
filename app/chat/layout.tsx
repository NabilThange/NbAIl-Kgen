import type React from "react"
import type { Metadata } from "next"
import ChatSidebar from "@/components/chat/sidebar"

export const metadata: Metadata = {
  title: "Chat | NbAIl – Your Multimodal AI Assistant",
  description: "Chat with NbAIl, your multimodal AI assistant.",
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <ChatSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

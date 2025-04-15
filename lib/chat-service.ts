import { getSupabaseBrowserClient } from "./supabase"
import type { Chat, Message, Attachment } from "@/types/chat"

export const chatService = {
  // Create a new chat
  async createChat(title = "New Chat"): Promise<Chat | null> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("chats").insert([{ title }]).select().single()

    if (error) {
      console.error("Error creating chat:", error)
      return null
    }

    return data
  },

  // Get all chats
  async getChats(): Promise<Chat[]> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("chats").select("*").order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching chats:", error)
      return []
    }

    return data || []
  },

  // Get a single chat by ID
  async getChatById(chatId: string): Promise<Chat | null> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("chats").select("*").eq("id", chatId).single()

    if (error) {
      console.error("Error fetching chat:", error)
      return null
    }

    return data
  },

  // Update chat details
  async updateChat(chatId: string, updates: Partial<Chat>): Promise<boolean> {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase
      .from("chats")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", chatId)

    if (error) {
      console.error("Error updating chat:", error)
      return false
    }

    return true
  },

  // Delete a chat
  async deleteChat(chatId: string): Promise<boolean> {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.from("chats").delete().eq("id", chatId)

    if (error) {
      console.error("Error deleting chat:", error)
      return false
    }

    return true
  },

  // Toggle pin status
  async togglePinChat(chatId: string, isPinned: boolean): Promise<boolean> {
    return this.updateChat(chatId, { pinned: isPinned })
  },

  // Get messages for a chat
  async getMessages(chatId: string): Promise<Message[]> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return []
    }

    return data || []
  },

  // Add a message to a chat
  async addMessage(
    chatId: string,
    role: "user" | "assistant",
    content: string,
    attachment?: Attachment,
  ): Promise<Message | null> {
    const supabase = getSupabaseBrowserClient()

    const message = {
      chat_id: chatId,
      role,
      content,
      attachment_type: attachment?.type,
      attachment_name: attachment?.name,
      attachment_url: attachment?.url,
    }

    const { data, error } = await supabase.from("messages").insert([message]).select().single()

    if (error) {
      console.error("Error adding message:", error)
      return null
    }

    // Update the chat's updated_at timestamp
    await this.updateChat(chatId, {})

    return data
  },
}

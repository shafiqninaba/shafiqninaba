"use client"

import { useState, useCallback, useEffect } from "react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const API_ENDPOINT = "https://shafiqninaba-backend-production.up.railway.app/chat/stream"
const STORAGE_KEY = "chatbot-messages"

// Helper to safely parse stored messages
function loadMessagesFromStorage(): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    // Convert timestamp strings back to Date objects
    return parsed.map((msg: ChatMessage) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }))
  } catch {
    return []
  }
}

// Helper to save messages to storage
function saveMessagesToStorage(messages: ChatMessage[]) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // Ignore storage errors (e.g., quota exceeded)
  }
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load messages from sessionStorage on mount
  useEffect(() => {
    const storedMessages = loadMessagesFromStorage()
    if (storedMessages.length > 0) {
      setMessages(storedMessages)
    }
    setIsHydrated(true)
  }, [])

  // Save messages to sessionStorage whenever they change (after hydration)
  useEffect(() => {
    if (isHydrated && messages.length > 0) {
      saveMessagesToStorage(messages)
    }
  }, [messages, isHydrated])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    // Capture current messages before updating state for the API call
    const currentMessages = [...messages, userMessage]

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    const assistantMessageId = `assistant-${Date.now()}`

    // Add empty assistant message that will be streamed
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ])

    // Format conversation history for the backend
    // Only include messages with content (filter out empty assistant messages)
    const conversationHistory = currentMessages
      .filter((msg) => msg.content.trim() !== "")
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.trim(),
          history: conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const decoder = new TextDecoder()
      let accumulatedContent = ""
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete lines from buffer
        const lines = buffer.split("\n")
        // Keep the last potentially incomplete line in buffer
        buffer = lines.pop() || ""

        for (const line of lines) {
          const trimmedLine = line.trim()

          // Skip empty lines and event lines
          if (!trimmedLine || trimmedLine.startsWith("event:")) {
            continue
          }

          // Process data lines
          if (trimmedLine.startsWith("data:")) {
            // SSE format is "data: content" - skip "data:" (5 chars) and the separator space
            // But preserve leading spaces that are part of the actual token content
            let data = trimmedLine.slice(5)
            // Remove exactly one leading space (the SSE separator) if present
            if (data.startsWith(" ")) {
              data = data.slice(1)
            }

            // Skip the [DONE] marker
            if (data === "[DONE]") {
              continue
            }

            // Decode escaped newlines (backend may send \n as \\n in SSE)
            data = data.replace(/\\n/g, "\n")

            // Handle newline tokens: if original line was "data: " or "data:" with trailing space
            // (indicating "data: \n" was split), treat empty data as a newline
            if (data === "" && (line === "data: " || line === "data:" || line.match(/^data:\s*$/))) {
              data = "\n"
            }

            // Append the text content (plain text, not JSON)
            accumulatedContent += data
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: accumulatedContent }
                  : m
              )
            )
          }
        }
      }

      // Process any remaining buffer content
      if (buffer.trim()) {
        const trimmedLine = buffer.trim()
        if (trimmedLine.startsWith("data:")) {
          let data = trimmedLine.slice(5)
          if (data.startsWith(" ")) {
            data = data.slice(1)
          }
          if (data !== "[DONE]") {
            // Decode escaped newlines
            data = data.replace(/\\n/g, "\n")
            accumulatedContent += data
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: accumulatedContent }
                  : m
              )
            )
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    // Clear from sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}

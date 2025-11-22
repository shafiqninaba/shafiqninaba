"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Send, Trash2, Bot, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  Message,
  MessageContent,
  Loader,
  PromptSuggestion,
} from "@/components/prompt-kit"
import { useChatbot, ChatMessage } from "./useChatbot"

interface ChatbotPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <Message
      className={cn(
        "px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-[var(--brand-background-strong)]"
            : "bg-[var(--accent-background-strong)]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-[var(--brand-on-background-strong)]" />
        ) : (
          <Bot className="h-4 w-4 text-[var(--accent-on-background-strong)]" />
        )}
      </div>
      <MessageContent
        markdown={!isUser}
        className={cn(
          "max-w-[80%] text-sm",
          isUser
            ? "bg-[var(--brand-background-medium)] text-[var(--brand-on-background-strong)]"
            : "bg-[var(--neutral-background-medium)] text-[var(--neutral-on-background-strong)]"
        )}
      >
        {message.content}
      </MessageContent>
    </Message>
  )
}

const PROMPT_SUGGESTIONS = [
  "What are Shafiq's main skills?",
  "Tell me about his projects",
  "What's his work experience?",
  "How can I contact him?",
]

export function ChatbotPanel({ isOpen, onClose, className }: ChatbotPanelProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChatbot()
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      sendMessage(suggestion)
    }
  }

  // Reset input when panel closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue("")
    }
  }, [isOpen])

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 z-40",
        "flex flex-col",
        "h-[500px] w-[380px] max-h-[70vh]",
        "rounded-2xl border border-[var(--neutral-border-medium)]",
        "bg-[var(--surface-background)] backdrop-blur-xl",
        "shadow-xl",
        "transition-all duration-300 ease-out",
        "overflow-hidden",
        isOpen
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--neutral-border-weak)] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-background-strong)]">
            <Bot className="h-4 w-4 text-[var(--accent-on-background-strong)]" />
          </div>
          <div className="py-1">
            <h3 className="text-sm font-semibold text-[var(--neutral-on-background-strong)]">
              Chat with Shafiq's AI
            </h3>
            <p className="text-xs text-[var(--neutral-on-background-weak)]">
              Ask me anything about Shafiq
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              className="h-8 w-8 text-[var(--neutral-on-background-weak)] hover:text-[var(--neutral-on-background-strong)]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-[var(--neutral-on-background-weak)] hover:text-[var(--neutral-on-background-strong)]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="gap-1 py-2">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-background-weak)]">
                <Bot className="h-6 w-6 text-[var(--accent-on-background-strong)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--neutral-on-background-strong)]">
                  Welcome!
                </p>
                <p className="text-xs text-[var(--neutral-on-background-weak)]">
                  Ask me about Shafiq's experience, projects, or skills.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {PROMPT_SUGGESTIONS.map((suggestion) => (
                  <PromptSuggestion
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="h-auto whitespace-normal px-3 py-2 text-xs"
                  >
                    {suggestion}
                  </PromptSuggestion>
                ))}
              </div>
            </div>
          ) : (
            messages
              .filter((message) => message.content !== "")
              .map((message) => (
                <ChatMessageItem key={message.id} message={message} />
              ))
          )}

          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-background-strong)]">
                <Bot className="h-4 w-4 text-[var(--accent-on-background-strong)]" />
              </div>
              <div className="rounded-lg bg-[var(--neutral-background-medium)] px-5 py-4">
                <Loader variant="dots" size="sm" className="text-[var(--neutral-on-background-weak)]" />
              </div>
            </div>
          )}

          {error && (
            <div className="mx-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      {/* Input */}
      <div className="border-t border-[var(--neutral-border-weak)] p-4">
        <PromptInput
          value={inputValue}
          onValueChange={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          className="border-[var(--neutral-border-medium)] bg-[var(--neutral-background-weak)]"
        >
          <PromptInputTextarea
            placeholder="Type your message..."
            className="pt-3 text-sm text-[var(--neutral-on-background-strong)] placeholder:text-[var(--neutral-on-background-weak)]"
          />
          <PromptInputActions className="justify-end pr-2 pb-2">
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "h-8 w-8 rounded-full",
                "bg-[var(--brand-solid-strong)] text-[var(--static-white)]",
                "hover:bg-[var(--brand-solid-medium)]",
                "disabled:opacity-50"
              )}
            >
              <Send className="h-4 w-4 text-white dark:text-gray-800" />
            </Button>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  )
}

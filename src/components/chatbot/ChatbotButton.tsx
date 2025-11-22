"use client"

import { cn } from "@/lib/utils"
import { MessageCircle } from "lucide-react"

interface ChatbotButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function ChatbotButton({ isOpen, onClick, className }: ChatbotButtonProps) {
  // Hide the button when chat is open
  if (isOpen) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex h-14 w-14 items-center justify-center",
        "rounded-full shadow-lg",
        "bg-[var(--brand-solid-strong)] text-[var(--static-white)]",
        "hover:bg-[var(--brand-solid-medium)]",
        "transition-all duration-300 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-[var(--brand-solid-strong)] focus:ring-offset-2",
        className
      )}
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6 text-white dark:text-gray-800" />
    </button>
  )
}

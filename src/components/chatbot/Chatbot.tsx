"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChatbotButton } from "./ChatbotButton"
import { ChatbotPanel } from "./ChatbotPanel"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render portal on client side after mounting
  if (!mounted) return null

  return createPortal(
    <>
      <ChatbotPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ChatbotButton isOpen={isOpen} onClick={() => setIsOpen(true)} />
    </>,
    document.body
  )
}

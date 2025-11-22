"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChatbotButton } from "./ChatbotButton"
import { ChatbotPanel } from "./ChatbotPanel"

const API_BASE_URL = "https://shafiqninaba-backend-production.up.railway.app"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Wake up the chatbot backend on page visit
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`).catch(() => {
      // Silently ignore health check errors
    })
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

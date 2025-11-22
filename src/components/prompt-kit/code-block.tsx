"use client"

import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

export type CodeBlockProps = {
  children?: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export type CodeBlockCodeProps = {
  code: string
  language?: string
  className?: string
}

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "relative my-4 overflow-hidden rounded-lg border bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CodeBlockCode({ code, language = "plaintext", className }: CodeBlockCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <span className="text-xs text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-sm font-mono">{code}</code>
      </pre>
    </div>
  )
}

export { CodeBlock, CodeBlockCode }

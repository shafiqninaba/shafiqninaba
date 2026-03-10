"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import {
  AssistantModalPrimitive,
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { MessageCircle, Send, X } from "lucide-react";

const MarkdownText = () => (
  <MarkdownTextPrimitive remarkPlugins={[remarkGfm]} className="aui-md" />
);

const SUGGESTIONS = [
  "What are Shafiq's main skills?",
  "Tell me about his projects",
  "What's his work experience?",
  "How can I contact him?",
];

function AssistantThread() {
  return (
    <ThreadPrimitive.Root className="aui-thread">
      <ThreadPrimitive.Viewport className="aui-thread-viewport">
        <ThreadPrimitive.Empty>
          <div className="aui-welcome">
            <p className="aui-welcome-title">Chat with Shafiq&apos;s AI</p>
            <p className="aui-welcome-subtitle">
              Ask me about Shafiq&apos;s experience, projects, or skills.
            </p>
            <div className="aui-suggestions">
              {SUGGESTIONS.map((s) => (
                <ThreadPrimitive.Suggestion
                  key={s}
                  prompt={s}
                  send
                  className="aui-suggestion"
                >
                  {s}
                </ThreadPrimitive.Suggestion>
              ))}
            </div>
          </div>
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{
            UserMessage: () => (
              <MessagePrimitive.Root className="aui-message aui-message-user">
                <MessagePrimitive.Content />
              </MessagePrimitive.Root>
            ),
            AssistantMessage: () => (
              <MessagePrimitive.Root className="aui-message aui-message-assistant">
                <MessagePrimitive.Content
                  components={{ Text: MarkdownText }}
                />
              </MessagePrimitive.Root>
            ),
          }}
        />
      </ThreadPrimitive.Viewport>

      <div className="aui-viewport-footer">
        <AssistantComposer />
      </div>
    </ThreadPrimitive.Root>
  );
}

function AssistantComposer() {
  return (
    <ComposerPrimitive.Root className="aui-composer">
      <ComposerPrimitive.Input
        placeholder="Type your message..."
        className="aui-composer-input"
      />
      <ComposerPrimitive.Send className="aui-composer-send">
        <Send className="aui-send-icon" />
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}

export function Assistant() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantModalPrimitive.Root>
        <AssistantModalPrimitive.Trigger className="aui-modal-trigger">
          <MessageCircle className="aui-trigger-icon" />
          <span className="sr-only">Open chat</span>
        </AssistantModalPrimitive.Trigger>

        <AssistantModalPrimitive.Content
          side="top"
          align="end"
          sideOffset={16}
          className="aui-modal-content"
        >
          <div className="aui-modal-header">
            <p className="aui-modal-header-title">Chat with Shafiq&apos;s AI</p>
            <AssistantModalPrimitive.Trigger className="aui-modal-close">
              <X className="h-4 w-4" />
            </AssistantModalPrimitive.Trigger>
          </div>
          <AssistantThread />
        </AssistantModalPrimitive.Content>
      </AssistantModalPrimitive.Root>
    </AssistantRuntimeProvider>
  );
}

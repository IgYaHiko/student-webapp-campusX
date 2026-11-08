"use client";
import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import type { ChatMessageData } from "./types";

type Props = { messages: ChatMessageData[]; isTyping: boolean };
export function ChatMessages({ messages, isTyping }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, isTyping]);
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-4 px-4 py-4">
        {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
        {isTyping && (
          <div className="flex items-end gap-2">
            <Avatar size="sm"><AvatarFallback><Bot className="size-3.5" /></AvatarFallback></Avatar>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3 py-3" aria-label="SaySay is typing">
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}

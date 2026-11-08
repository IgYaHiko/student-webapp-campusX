"use client";
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatSuggestions } from "./ChatSuggestions";
import type { ChatMessageData } from "./types";

type Props = {
  isOpen: boolean; messages: ChatMessageData[]; input: string; isTyping: boolean;
  onClose: () => void; onReset: () => void; onInputChange: (value: string) => void; onSend: (value: string) => void;
};
export function ChatPanel({ isOpen, messages, input, isTyping, onClose, onReset, onInputChange, onSend }: Props) {
  return (
    <Card aria-label="SaySay chat assistant" aria-hidden={!isOpen}
      className={`fixed bottom-5 right-5 z-[60] flex h-[min(620px,calc(100dvh-40px))] w-[min(380px,calc(100vw-40px))] flex-col gap-0 overflow-hidden p-0 shadow-xl transition-all duration-200 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-2 opacity-0"}`}>
      <ChatHeader onReset={onReset} onClose={onClose} />
      <ChatMessages messages={messages} isTyping={isTyping} />
      {messages.length === 1 && !isTyping && <ChatSuggestions onSelect={onSend} />}
      <ChatInput value={input} isTyping={isTyping} onChange={onInputChange} onSend={onSend} />
    </Card>
  );
}

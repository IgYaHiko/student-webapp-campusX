import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessageData } from "./types";

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar size="sm" className="mb-4"><AvatarFallback><Bot className="size-3.5" /></AvatarFallback></Avatar>}
      <div className={`flex max-w-[82%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={isUser
          ? "rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
          : "rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground"}>
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        </div>
        <span className="mt-1 px-1 text-[10px] text-muted-foreground">{message.time}</span>
      </div>
      {isUser && <Avatar size="sm" className="mb-4"><AvatarFallback>You</AvatarFallback></Avatar>}
    </div>
  );
}

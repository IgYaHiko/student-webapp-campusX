"use client";
import type { FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type Props = { value: string; isTyping: boolean; onChange: (value: string) => void; onSend: (value: string) => void };
export function ChatInput({ value, isTyping, onChange, onSend }: Props) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSend(value); };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim() && !isTyping) onSend(value);
    }
  };
  return (
    <div className="shrink-0">
      <Separator />
      <form onSubmit={submit} className="flex items-end gap-2 p-3">
        <Textarea value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown}
          placeholder="Message SaySay..." aria-label="Message SaySay" rows={1} maxLength={5000}
          className="max-h-28 min-h-10 flex-1 resize-none border-0 bg-muted/60 shadow-none focus-visible:ring-1" disabled={isTyping} />
        <Button type="submit" size="icon" disabled={!value.trim() || isTyping} aria-label="Send message"><Send /></Button>
      </form>
      <p className="px-3 pb-2 text-center text-[10px] text-muted-foreground">SaySay can make mistakes. Verify important information.</p>
    </div>
  );
}

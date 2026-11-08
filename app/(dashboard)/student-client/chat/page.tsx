"use client";

import { useState, useEffect, useRef } from "react";
import { getToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ query: userMsg }),
      });
      
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.message);

      setMessages((prev) => [...prev, { role: "assistant", content: json.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Sorry, I am having trouble connecting to the server right now." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Campus AI Assistant</h1>
        <p className="text-slate-500">Ask me anything about campus rules, facilities, or how to report issues.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-20">
              <Bot className="size-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">How can I help you today?</p>
              <p className="text-sm mt-2">Try asking: "How do I report a water leak?"</p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-primary text-white" : "bg-slate-200 text-slate-700"}`}>
                {m.role === "user" ? <User className="size-5" /> : <Bot className="size-5" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[75%] text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-slate-100 text-slate-800 rounded-tl-sm"}`}>
                {m.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4">
              <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <Bot className="size-5 text-slate-700" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 rounded-tl-sm flex items-center gap-1">
                <span className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a question..." 
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()} className="gap-2">
              <Send className="size-4" /> Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
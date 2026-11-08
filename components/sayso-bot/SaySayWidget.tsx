
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

import { getChatHistory, sendChatMessage } from "@/lib/api";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

const suggestions = [
  "Track my complaint",
  "How do I report a problem?",
  "Show my recent complaints",
];

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey there! 👋 I'm SaySay, your CampusX assistant. I can help you navigate campus services, understand the complaint process, and find the information you need. What can I help you with today?",
  time: "Just now",
};

function formatMessageTime(timestamp?: string) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="min-w-0 break-words text-sm leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-5 text-xl font-semibold text-foreground first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 text-lg font-semibold text-foreground first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ml-5 list-disc space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-5 list-decimal space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-primary/50 pl-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-3 w-full overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[420px] border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-muted px-3 py-2 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border px-3 py-2 align-top">
              {children}
            </td>
          ),
          pre: ({ children }) => (
            <pre className="my-3 max-w-full overflow-x-auto rounded-lg border border-border bg-muted p-3 text-xs leading-5">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className);

            return isBlock ? (
              <code className="font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function SaySayWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    initialMessage,
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load previous conversations when Sayso is opened for the first time.
  useEffect(() => {
    if (!isOpen || historyLoaded) return;

    let cancelled = false;

    const loadHistory = async () => {
      setIsLoadingHistory(true);

      try {
        const history = await getChatHistory();

        if (cancelled) return;

        const formattedMessages: Message[] = history
          .reverse()
          .filter(
            (message) =>
              (message.role === "user" ||
                message.role === "assistant") &&
              typeof message.content === "string"
          )
          .map((message, index) => ({
            id: String(message.id ?? `history-${index}`),
            role: message.role,
            content: message.content,
            time: formatMessageTime(
              //@ts-ignore
              message.createdAt ?? message.created_at
            ),
          }));

        setMessages(
          formattedMessages.length > 0
            ? formattedMessages
            : [initialMessage]
        );

        setHistoryLoaded(true);
      } catch (error) {
        console.error("Failed to load Sayso chat history:", error);
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [isOpen, historyLoaded]);

  // Automatically scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping, isLoadingHistory]);

  // Focus the composer when the widget opens.
  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(
      () => inputRef.current?.focus(),
      300
    );

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const sendMessage = async (value: string) => {
    const content = value.trim();

    if (!content || isTyping || isLoadingHistory) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      time: "Just now",
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const answer = await sendChatMessage(content);

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
          time: "Just now",
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `**I couldn't send that message.**\n\n${errorMessage}`,
          time: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([initialMessage]);
    setInput("");
    setIsTyping(false);
  };

  return (
    <>
      {/* Small floating launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open SaySo assistant"
          className="fixed bottom-6 right-6 z-[60] flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <MessageCircle className="size-5" />
          <span className="absolute right-0 top-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
        </button>
      )}

      {/* Floating modal backdrop */}
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 ${
          isOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Background overlay */}
        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          aria-label="Close chat"
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-background/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Floating chat window */}
        <section
          aria-label="SaySay chat assistant"
          className={`relative flex h-[82dvh] max-h-[900px] w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300 ease-out sm:w-[82vw] ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-5 scale-[0.98] opacity-0"
          }`}
        >
          {/* Gradient texture */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-40 size-[420px] rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute -bottom-40 -left-32 size-[380px] rounded-full bg-chart-2/10 blur-[100px]" />
          </div>

          {/* Header */}
          <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                <Bot className="size-5 text-primary" />
              </div>

              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  SaySo
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                aria-label="Reset conversation"
                title="New conversation"
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close SaySay"
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
              {/* History loading indicator */}
              {isLoadingHistory && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Loading your previous conversations...
                </div>
              )}

              {/* Chat messages */}
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                        <Bot className="size-4 text-primary" />
                      </div>
                    )}

                    <div
                      className={`flex min-w-0 max-w-[92%] flex-col ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`min-w-0 max-w-full overflow-hidden rounded-2xl px-4 py-3 shadow-sm ${
                          isUser
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md border border-border bg-card/90 text-card-foreground backdrop-blur-sm"
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {message.content}
                          </p>
                        ) : (
                          <MarkdownContent content={message.content} />
                        )}
                      </div>

                      {message.time && (
                        <span className="mt-1.5 px-1 text-[10px] text-muted-foreground">
                          {message.time}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-background">
                    <Bot className="size-4 text-primary" />
                  </div>

                  <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions */}
          {!isLoadingHistory &&
            messages.length === 1 &&
            messages[0].id === "welcome" && (
              <div className="relative z-10 shrink-0 border-t border-border bg-background/80 px-5 py-3 backdrop-blur-xl">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Try asking
                </p>

                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void sendMessage(suggestion)}
                      disabled={isTyping || isLoadingHistory}
                      className="rounded-full border border-border bg-background px-3 py-2 text-xs transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 shrink-0 border-t border-border bg-background/90 px-4 py-4 backdrop-blur-xl sm:px-6"
          >
            <div className="mx-auto flex w-full max-w-4xl items-end gap-2 rounded-xl border border-input bg-background p-2 shadow-sm transition focus-within:ring-2 focus-within:ring-ring/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message SaySay..."
                rows={1}
                maxLength={5000}
                aria-label="Message SaySay"
                disabled={isLoadingHistory}
                className="max-h-36 min-h-10 flex-1 resize-y bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={
                  !input.trim() || isTyping || isLoadingHistory
                }
                aria-label="Send message"
                className="mb-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Responses support Markdown formatting. SaySay can make mistakes.
            </p>
          </form>
        </section>
      </div>
    </>
  );
}

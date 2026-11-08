"use client";
import { RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = { onReset: () => void; onClose: () => void };
export function ChatHeader({ onReset, onClose }: Props) {
  return (
    <>
      <header className="flex shrink-0 items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">SaySay</h2>
          <p className="text-xs text-muted-foreground">CampusX assistant</p>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onReset} aria-label="Start a new conversation" title="New conversation"><RotateCcw /></Button>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close SaySay" title="Close"><X /></Button>
        </div>
      </header>
      <Separator />
    </>
  );
}

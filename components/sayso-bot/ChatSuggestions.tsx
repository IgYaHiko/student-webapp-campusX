"use client";
import { Button } from "@/components/ui/button";

const suggestions = ["Track my complaint", "How do I report a problem?", "Show my recent complaints"];
export function ChatSuggestions({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="shrink-0 space-y-2 px-4 pb-3">
      <p className="text-xs font-medium text-muted-foreground">Try asking</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button key={suggestion} type="button" variant="outline" size="sm" className="h-auto whitespace-normal py-1.5 text-left" onClick={() => onSelect(suggestion)}>
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

"use client";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatLauncher({ onClick }: { onClick: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={
          <Button type="button" size="icon-lg" className="fixed bottom-5 right-5 z-[60] size-12 rounded-full shadow-md" onClick={onClick} aria-label="Open SaySay assistant">
            <MessageCircle className="size-5" />
          </Button>
        } />
        <TooltipContent>Chat with SaySay</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

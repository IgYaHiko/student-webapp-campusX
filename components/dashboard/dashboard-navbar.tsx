
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Check,
  Laptop,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardNavbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-20 bg-background flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
      <SidebarTrigger />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full"
            aria-label="Open profile menu"
          >
            <Avatar className="size-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {/* User details */}
          <div className="flex items-center gap-3 p-3">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name || "Student"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email || "No email available"}
              </p>
              <p className="mt-1 text-xs capitalize text-muted-foreground">
                {user?.role || "Student"}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Theme options */}
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
            Appearance
          </div>

          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 size-4" />
            Light theme
            {mounted && theme === "light" && (
              <Check className="ml-auto size-4" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 size-4" />
            Dark theme
            {mounted && theme === "dark" && (
              <Check className="ml-auto size-4" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Laptop className="mr-2 size-4" />
            System theme
            {mounted && theme === "system" && (
              <Check className="ml-auto size-4" />
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => logout()}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

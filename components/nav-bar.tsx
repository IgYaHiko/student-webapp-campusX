"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  Laptop,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useAuth } from "@/src/context/AuthContext";
import { PRODUCT_IMAGES } from "@/public/image/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export function SimpleNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const displayName =
    (user as any)?.fullName ||
    (user as any)?.name ||
    (user as any)?.email ||
    "My Account";

  const email = (user as any)?.email || "";
  const role = (user as any)?.role || "Student";
  const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0].toUpperCase())
    .join("");

  const appearanceOptions = [
    { label: "Light theme", value: "light", Icon: Sun },
    { label: "Dark theme", value: "dark", Icon: Moon },
    { label: "System theme", value: "system", Icon: Laptop },
  ] as const;

  return (
    <header className="w-full px-4 pt-2 sm:px-6">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-border bg-background px-4 shadow-sm sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          aria-label="CampusFix home"
        >
          <Image
            src={PRODUCT_IMAGES.LOGO}
            alt="CampusFix"
            width={34}
            height={34}
            priority
            className="size-8 shrink-0 object-contain"
          />

          <span className="truncate text-lg font-semibold tracking-tight">
            CampusFix
          </span>
        </Link>

        <DropdownMenu>
       <DropdownMenuTrigger
  className="flex size-9 items-center justify-center rounded-full outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
  aria-label="Open profile menu"
>
  <Avatar className="size-9">
    <AvatarFallback className="bg-muted text-sm text-muted-foreground">
      {initials || "U"}
    </AvatarFallback>
  </Avatar>
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
      </nav>
    </header>
  );
}
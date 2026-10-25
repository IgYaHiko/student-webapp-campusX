"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we are done loading and there is no user, kick them to login
    if (!isLoading && !user) {
      router.replace("/login"); // Use replace so they can't click "Back" to return
    }
  }, [user, isLoading, router, pathname]);

  // 🛑 CRITICAL FIX:
  // If we are still checking the token, OR if there is no user,
  // DO NOT render the children. This prevents the "flash" of protected UI.
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Only if the user is fully authenticated do we render the dashboard
  return <>{children}</>;
}
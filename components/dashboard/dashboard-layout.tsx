
"use client";

import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";

export function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset className="min-w-0 flex-1">
        <DashboardNavbar />

        <main className="min-w-0 w-full flex-1">
          <div className="mx-auto w-full max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

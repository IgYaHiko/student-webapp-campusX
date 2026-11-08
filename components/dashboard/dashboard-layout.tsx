
"use client";

import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";
import { SaySayWidget } from "@/components/sayso-bot/SaySayWidget";

export function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider
      className="h-svh min-h-0 w-full overflow-hidden"
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-icon": "260px",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar />

      <SidebarInset className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <DashboardNavbar />
        </div>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </SidebarInset>

      {/* CampusX AI Assistant */}
      <SaySayWidget />
    </SidebarProvider>
  );
}

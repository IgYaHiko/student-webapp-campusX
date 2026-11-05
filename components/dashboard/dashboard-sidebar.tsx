"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Bell,
  UserRound,
  LogOut,
  LucideSpeaker,
  PersonStanding,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PRODUCT_IMAGES } from "@/public/image/image";
import { useState } from "react";
import { NotificationModal } from "../notification/notification";

const navigation = [
  {
    title: "Dashboard",
    url: "/student-client/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "New Complaint",
    url: "/student-client/complaints/new",
    icon: Plus,
  },
  {
    title: "All Complaint",
    url: "/student-client/complaints",
    icon: PersonStanding,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
    <Sidebar  collapsible="none"
  className="h-svh min-h-svh">
      <SidebarHeader className="border-none p-2 group-data-[collapsible=icon]:items-center">
        <Link
          href="https://sayso-web-client.subhrokolay2-0df.workers.dev"
          className="flex items-center gap-3 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <Image
              src={PRODUCT_IMAGES.LOGO}
              alt="CampusFix"
              className="size-10 object-contain"
              width={100}
              height={100}
              priority
            />
          </div>

          <span className="truncate text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            SaySo
          </span>
        </Link>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.url === "/student-client/dashboard"
                  ? pathname === "/student-client/dashboard"
                  : pathname === "/student-client/complaints/new";

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    
                    isActive={isActive}
                    tooltip={item.title}
                    className="w-full"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-2.5"
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                
                isActive={pathname === "/student-client/profile"}
                tooltip="Profile"
              >
                <Link href="/student-client/profile" className="flex items-center gap-2.5">
                  <UserRound className="size-4 shrink-0" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                 onClick={() => setNotificationsOpen(true)}
                isActive={pathname === "/student-client/notifications"}
                tooltip="Notifications"
              >
                <Link
                  href="/student-client/notifications"
                  className="flex items-center gap-2.5"
                >
                  <Bell className="size-4 shrink-0" />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              tooltip="Logout"
              className="w-full"
            >
              <LogOut className="size-4 shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>

    <NotificationModal
      open={notificationsOpen}
      onOpenChange={setNotificationsOpen}
/>
    </>
  );
}
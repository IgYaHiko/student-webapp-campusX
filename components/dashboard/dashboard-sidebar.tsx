"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Bell,
  UserRound,
  LogOut,
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
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "New Complaint",
    url: "/complaints/new",
    icon: Plus,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-none p-2 group-data-[collapsible=icon]:items-center">
        <Link
          href="/dashboard"
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
                item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === "/complaints/new";

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
                
                isActive={pathname === "/profile"}
                tooltip="Profile"
              >
                <Link href="/profile" className="flex items-center gap-2.5">
                  <UserRound className="size-4 shrink-0" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                 onClick={() => setNotificationsOpen(true)}
                isActive={pathname === "/notifications"}
                tooltip="Notifications"
              >
                <Link
                  href="/notifications"
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
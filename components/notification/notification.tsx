"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  FileText,
  XCircle,
  CircleCheck,
  UserRound,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ComplaintStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "closed";

type Notification = {
  id: number;
  complaintId: string;
  title: string;
  message: string;
  status: ComplaintStatus;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    complaintId: "CMP-1024",
    title: "Complaint received",
    message: "Your complaint has been submitted successfully.",
    status: "open",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    complaintId: "CMP-1021",
    title: "Complaint assigned",
    message: "Your complaint has been assigned to the maintenance team.",
    status: "assigned",
    time: "25 minutes ago",
    read: false,
  },
  {
    id: 3,
    complaintId: "CMP-1018",
    title: "Work in progress",
    message: "The team has started working on your complaint.",
    status: "in_progress",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    complaintId: "CMP-1012",
    title: "Complaint resolved",
    message: "Your reported issue has been resolved.",
    status: "resolved",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    complaintId: "CMP-1009",
    title: "Complaint rejected",
    message: "Your complaint was rejected. Please review its details.",
    status: "rejected",
    time: "Yesterday",
    read: true,
  },
  {
    id: 6,
    complaintId: "CMP-1003",
    title: "Complaint closed",
    message: "Your complaint has been closed.",
    status: "closed",
    time: "2 days ago",
    read: true,
  },
];

const statusConfig: Record<
  ComplaintStatus,
  {
    label: string;
    Icon: typeof Bell;
    className: string;
  }
> = {
  open: {
    label: "Open",
    Icon: FileText,
    className: "bg-blue-500/10 text-blue-600",
  },
  assigned: {
    label: "Assigned",
    Icon: UserRound,
    className: "bg-violet-500/10 text-violet-600",
  },
  in_progress: {
    label: "In progress",
    Icon: LoaderCircle,
    className: "bg-amber-500/10 text-amber-600",
  },
  resolved: {
    label: "Resolved",
    Icon: CircleCheck,
    className: "bg-emerald-500/10 text-emerald-600",
  },
  rejected: {
    label: "Rejected",
    Icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
  closed: {
    label: "Closed",
    Icon: Check,
    className: "bg-muted text-muted-foreground",
  },
};

export function NotificationModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="p-5 pb-4">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Bell className="size-5 text-primary" />
              </div>

              <div>
                <DialogTitle className="text-lg">
                  Notifications
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Updates on your complaints
                </DialogDescription>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-sm font-medium text-muted-foreground">
            Recent activity
          </p>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 gap-1.5 px-2 text-xs"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                <Bell className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">You're all caught up</p>
              <p className="mt-1 text-xs text-muted-foreground">
                New complaint updates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const config = statusConfig[notification.status];
              const Icon = config.Icon;

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className={`flex w-full gap-3 border-t px-5 py-4 text-left transition-colors hover:bg-muted/50 ${
                    !notification.read ? "bg-primary/[0.04]" : ""
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {notification.message}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs font-medium">
                        {notification.complaintId}
                      </span>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      {notification.time}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3 p-3">
          <p className="text-xs text-muted-foreground">
            Demo notifications
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 gap-1.5"
          >
            <XCircle className="size-3.5" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
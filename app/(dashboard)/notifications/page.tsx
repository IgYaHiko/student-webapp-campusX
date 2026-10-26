"use client";

import { NotificationModal } from "@/components/notification/notification";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <NotificationModal
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.push("/dashboard");
        }
      }}
    />
  );
}
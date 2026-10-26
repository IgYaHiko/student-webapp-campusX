"use client";

import { useRouter } from "next/navigation";
import { NotificationModal } from "@/components/notification/notification";

export default function NewNotificationModalPage() {
  const router = useRouter();

  return (
    <NotificationModal
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    />
  );
}
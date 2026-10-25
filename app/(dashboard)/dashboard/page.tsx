
"use client";

import { useAuth } from "@/src/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentComplaints } from "@/components/dashboard/recent-complaints";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <DashboardWelcome name={user?.name} />

      <DashboardStats />

      <section className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
  <div className="min-w-0">
    <RecentComplaints />
  </div>

  <div className="min-w-0">
    <DashboardQuickActions />
  </div>
</section>
    </DashboardLayout>
  );
}

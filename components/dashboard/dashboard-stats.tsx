"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock3,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getMyComplaintsApi } from "@/lib/api";

type Complaint = {
  status: string;
};

type ComplaintStats = {
  total: number;
  inProgress: number;
  resolved: number;
  pending: number;
};

const initialStats: ComplaintStats = {
  total: 0,
  inProgress: 0,
  resolved: 0,
  pending: 0,
};

const statCards = [
  {
    key: "total",
    label: "Total complaints",
    note: "All submissions",
    icon: FileText,
  },
  {
    key: "inProgress",
    label: "In progress",
    note: "Being worked on",
    icon: Clock3,
  },
  {
    key: "resolved",
    label: "Resolved",
    note: "Successfully completed",
    icon: CheckCircle2,
  },
  {
    key: "pending",
    label: "Pending",
    note: "Awaiting a response",
    icon: CircleAlert,
  },
] as const;

function calculateStats(complaints: Complaint[]): ComplaintStats {
  return complaints.reduce<ComplaintStats>(
    (stats, complaint) => {
      stats.total++;

      const status = complaint.status.toLowerCase().replace(/[\s-]+/g, "_");

      if (status === "resolved" || status === "closed") {
        stats.resolved++;
      } else if (
        status === "in_progress" ||
        status === "inprogress"
      ) {
        stats.inProgress++;
      } else if (status === "pending" || status === "open") {
        stats.pending++;
      }

      return stats;
    },
    { ...initialStats }
  );
}

export function DashboardStats() {
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const response = await getMyComplaintsApi();

        // Supports either an array response or { data: [...] }.
        const complaints: Complaint[] = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];

        if (!cancelled) {
          setStats(calculateStats(complaints));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load complaint statistics."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">
          A snapshot of your campus reports.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, note, icon: Icon }) => (
          <Card key={key} className="rounded-2xl shadow-none">
            <CardContent className="flex items-start justify-between p-5">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-semibold tracking-tight">
                  {isLoading ? "..." : stats[key]}
                </p>
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
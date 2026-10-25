
import {
  FileText,
  Clock3,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const stats = [
  { label: "Total complaints", value: "0", note: "All submissions", icon: FileText },
  { label: "In progress", value: "0", note: "Being worked on", icon: Clock3 },
  { label: "Resolved", value: "0", note: "Successfully completed", icon: CheckCircle2 },
  { label: "Pending", value: "0", note: "Awaiting a response", icon: CircleAlert },
];

export function DashboardStats() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">
          A snapshot of your campus reports.
        </p>
      </div>

     <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <Card key={label} className="rounded-2xl shadow-none">
            <CardContent className="flex items-start justify-between p-5">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-semibold tracking-tight">{value}</p>
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

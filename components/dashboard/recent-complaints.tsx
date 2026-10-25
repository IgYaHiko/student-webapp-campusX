
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentComplaints() {
  return (
    <Card className="h-full rounded-2xl shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-lg">Recent complaints</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of your latest reports.
          </p>
        </div>
        <Button variant="ghost" size="sm" >
          <Link href="/complaints">
            View all <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
          <div className="rounded-xl border border-border p-3">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-medium">No complaints to show yet</h3>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Your recent submissions and their statuses will appear here.
          </p>
          <Button variant="outline"  className="mt-4">
            <Link href="/complaints">Open my complaints</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

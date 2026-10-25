
import Link from "next/link";
import { ArrowUpRight, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardQuickActions() {
  return (
    <div className="space-y-4">
      <Card className="rounded-2xl shadow-none">
        <CardContent className="p-6">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border">
            <Plus className="size-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Something needs fixing?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Report maintenance issues and let the campus team know what needs attention.
          </p>
          <Button  className="mt-5 w-full gap-2 font-bold py-5">
            <Link href="/complaints">
              Submit a complaint 
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-none">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="rounded-lg border border-border p-2">
            <Bell className="size-4" />
          </div>
          <CardTitle className="text-base">Updates & announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Check your complaints page for status changes and responses from campus staff.
          </p>
          <Button variant="link"  className="mt-2 h-auto px-0">
            <Link href="/complaints">Check updates</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

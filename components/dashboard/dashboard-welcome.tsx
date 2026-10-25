
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardWelcomeProps = {
  name?: string | null;
};

export function DashboardWelcome({ name }: DashboardWelcomeProps) {
  const firstName = name?.trim().split(/\s+/)[0] || "Student";

  return (
    <Card className="relative overflow-hidden  rounded-2xl shadow-none">
      <CardContent className="relative flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-primary">
            STUDENT WORKSPACE
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Good to see you, {firstName}!
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Track your reports, follow updates, and help make your campus better.
          </p>
          <Button  className="mt-5 gap-2 font-bold py-4">
            <Link href="/complaints">
              
              Report an issue
             
            </Link>
          </Button>
        </div>

        <div className="hidden size-28 shrink-0 items-center justify-center rounded-3xl border border-border bg-muted/40 sm:flex">
          <span className="text-4xl font-semibold text-primary">C</span>
        </div>
      </CardContent>
    </Card>
  );
}

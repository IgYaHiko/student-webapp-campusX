
"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardWelcomeProps = {
  name?: string | null;
};

const bubbles = [
  {
    size: "size-44",
    position: "-left-16 -top-24",
    color: "bg-primary/20",
    duration: "14s",
    delay: "-2s",
  },
  {
    size: "size-64",
    position: "-right-12 -top-32",
    color: "bg-primary/15",
    duration: "18s",
    delay: "-5s",
  },
  {
    size: "size-48",
    position: "right-[28%] -bottom-32",
    color: "bg-primary/15",
    duration: "16s",
    delay: "-8s",
  },
  {
    size: "size-32",
    position: "right-[44%] top-[8%]",
    color: "bg-accent/60",
    duration: "12s",
    delay: "-3s",
  },
  {
    size: "size-24",
    position: "right-[34%] bottom-[12%]",
    color: "bg-primary/20",
    duration: "11s",
    delay: "-6s",
  },
  {
    size: "size-40",
    position: "right-[8%] bottom-[-5rem]",
    color: "bg-accent/50",
    duration: "15s",
    delay: "-4s",
  },
  {
    size: "size-16",
    position: "left-[42%] top-[18%]",
    color: "bg-primary/20",
    duration: "10s",
    delay: "-1s",
  },
  {
    size: "size-12",
    position: "right-[18%] bottom-[20%]",
    color: "bg-primary/25",
    duration: "9s",
    delay: "-7s",
  },
];

const rings = [
  "right-[18%] top-[12%] size-32",
  "right-[36%] bottom-[-2rem] size-28",
  "left-[28%] top-[14%] size-14",
  "right-[12%] bottom-[24%] size-8",
];

export function DashboardWelcome({ name }: DashboardWelcomeProps) {
  const firstName = name?.trim().split(/\s+/)[0] || "Student";

  return (
    <Card className="relative isolate overflow-hidden rounded-2xl shadow-none">
      {/* Themed gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/30" />

        {/* Large soft glow fields */}
        <div className="welcome-glow absolute -left-24 -top-28 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="welcome-glow welcome-glow-delay absolute -right-20 -top-24 size-80 rounded-full bg-accent/60 blur-3xl" />
        <div className="welcome-glow welcome-glow-slow absolute -bottom-40 right-1/4 size-96 rounded-full bg-primary/15 blur-3xl" />

        {/* Floating bubbles */}
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className={`welcome-bubble absolute ${bubble.position} ${bubble.size} rounded-full ${bubble.color} blur-xl`}
            style={{
              animationDuration: bubble.duration,
              animationDelay: bubble.delay,
            }}
          />
        ))}

        {/* Floating outlined rings */}
        {rings.map((position, index) => (
          <div
            key={position}
            className={`welcome-ring absolute ${position} rounded-full border border-primary/30`}
            style={{
              animationDuration: `${9 + index * 2}s`,
              animationDelay: `${-index * 2}s`,
            }}
          />
        ))}

        {/* Small glass-like floating dots */}
        <div className="welcome-dot absolute left-[58%] top-[52%] size-3 rounded-full bg-primary/40 blur-[2px]" />
        <div className="welcome-dot welcome-dot-delay absolute right-[30%] top-[25%] size-5 rounded-full bg-accent/70 blur-[3px]" />
        <div className="welcome-dot welcome-dot-slow absolute right-[42%] bottom-[14%] size-3 rounded-full bg-primary/50 blur-[2px]" />
      </div>

      <CardContent className="relative flex min-h-64 flex-col justify-between gap-8 p-6 sm:min-h-72 sm:flex-row sm:items-center sm:p-8 lg:p-10">
        <div className="relative z-10 max-w-2xl min-w-0">
          <p className="text-sm font-semibold tracking-widest text-primary">
            STUDENT WORKSPACE
          </p>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Good to see you, {firstName}!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Track your reports, follow updates, and help make your campus better.
          </p>

          <Button  className="mt-6 gap-2 font-semibold font-bold">
            <Link href="/complaints">
             
              Report an issue
             
            </Link>
          </Button>
        </div>

        {/* Brand tile */}
        <div className="relative z-10 hidden size-28 shrink-0 items-center justify-center rounded-3xl border border-border/70 bg-background/40 shadow-sm backdrop-blur-xl sm:flex lg:size-32">
          <div className="absolute inset-2 rounded-2xl border border-primary/15" />
          <span className="relative text-5xl font-semibold text-primary">C</span>
        </div>
      </CardContent>
    </Card>
  );
}

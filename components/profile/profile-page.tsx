"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  course: string;
  semester: string;
  year: string;
  address: string;
};

const initialProfile: ProfileData = {
  fullName: "Alex Morgan",
  email: "alex.morgan@college.edu",
  phone: "",
  studentId: "",
  department: "",
  course: "Bachelor of Computer Applications",
  semester: "",
  year: "",
  address: "",
};

const sections = [
  { id: "personal", label: "Personal information", icon: UserRound },
  { id: "academic", label: "Academic details", icon: GraduationCap },
  { id: "contact", label: "Contact information", icon: Mail },
];

export function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof ProfileData, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
    setSaved(false);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const saveChanges = () => {
    setProfile(draft);
    setIsEditing(false);
    setSaved(true);
  };

  const displayed = isEditing ? draft : profile;
  const initials =
    profile.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";

  const field = (
    key: keyof ProfileData,
    label: string,
    placeholder: string,
    options?: { type?: string; readOnly?: boolean }
  ) => (
    <div className="space-y-2" key={key}>
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={options?.type ?? "text"}
        value={displayed[key]}
        placeholder={placeholder}
        readOnly={!isEditing || options?.readOnly}
        onChange={(event) => updateField(key, event.target.value)}
        className="h-11 rounded-lg read-only:bg-muted/40 read-only:text-muted-foreground"
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                My profile
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your personal and academic information.
              </p>
            </div>
          </div>

          {!isEditing ? (
            <Button onClick={startEditing} className="shrink-0 gap-2">
              <Pencil className="size-4" />
              <span className="hidden sm:inline">Edit profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          ) : (
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="icon" onClick={cancelEditing} aria-label="Cancel editing">
                <X className="size-4" />
              </Button>
              <Button onClick={saveChanges} className="gap-2">
                <Check className="size-4" />
                Save
              </Button>
            </div>
          )}
        </div>

        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-border bg-primary/10 px-4 py-3 text-sm">
            <Check className="size-4 text-primary" />
            Profile changes saved locally for this preview.
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl shadow-none">
              <div className="h-24 bg-primary/20">
                <div className="h-full w-full bg-gradient-to-br from-primary/30 to-transparent" />
              </div>
              <CardContent className="-mt-12 relative px-6 pb-6">
                <div className="group relative flex size-24 items-center justify-center rounded-2xl border-4 border-card bg-primary text-3xl font-semibold text-primary-foreground shadow-sm">
                  {initials}
                  <button
                    type="button"
                    disabled={!isEditing}
                    aria-label="Change profile photo"
                    title={isEditing ? "Photo upload coming later" : "Edit profile to enable photo options"}
                    className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm disabled:opacity-50"
                  >
                    <Camera className="size-4" />
                  </button>
                </div>

                <h2 className="mt-4 break-words text-xl font-semibold">
                  {profile.fullName || "Your name"}
                </h2>
                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {profile.email || "Your email"}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium">
                  <GraduationCap className="size-3.5 text-primary" />
                  Student account
                </div>

                <Separator className="my-5" />

                <nav className="space-y-1">
                  {sections.map(({ id, label, icon: Icon }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="size-4" />
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-none">
              <CardContent className="flex gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="size-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account security</p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Your account details and access are managed securely.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="min-w-0 space-y-6">
            <Card id="personal" className="scroll-mt-6 rounded-2xl shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <UserRound className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Personal information</CardTitle>
                    <CardDescription className="mt-1">
                      Your basic identity details.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("fullName", "Full name", "Enter your full name")}
                {field("studentId", "Student ID", "Enter your student ID", { readOnly: true })}
              </CardContent>
            </Card>

            <Card id="academic" className="scroll-mt-6 rounded-2xl shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <GraduationCap className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Academic details</CardTitle>
                    <CardDescription className="mt-1">
                      Your course and current academic placement.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("department", "Department", "Enter your department")}
                {field("course", "Course / programme", "Enter your course")}
                {field("semester", "Current semester", "e.g. Semester 5")}
                {field("year", "Academic year", "e.g. 2026–2027")}
              </CardContent>
            </Card>

            <Card id="contact" className="scroll-mt-6 rounded-2xl shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Contact information</CardTitle>
                    <CardDescription className="mt-1">
                      Details used to contact you about your account.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("email", "Email address", "you@college.edu", { type: "email" })}
                {field("phone", "Phone number", "Enter your phone number", { type: "tel" })}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">
                    <MapPin className="mr-1 inline size-3.5 text-muted-foreground" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={displayed.address}
                    placeholder="Enter your address (optional)"
                    readOnly={!isEditing}
                    onChange={(event) => updateField("address", event.target.value)}
                    className="h-11 rounded-lg read-only:bg-muted/40 read-only:text-muted-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={saveChanges} className="gap-2">
                  <Check className="size-4" />
                  Save changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
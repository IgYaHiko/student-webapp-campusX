"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/src/context/AuthContext";
import { getMyProfileApi, updateMyProfileApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
};

const emptyProfile: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  branch: "",
  year: "",
};

const sections = [
  { id: "personal", label: "Personal information", icon: UserRound },
  { id: "academic", label: "Academic details", icon: GraduationCap },
  { id: "contact", label: "Contact information", icon: Mail },
];

export function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [draft, setDraft] = useState<ProfileData>(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapProfile = (data: any): ProfileData => ({
    fullName: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    branch: data.branch || "",
    year: data.year != null ? String(data.year) : "",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getMyProfileApi();
        const mappedProfile = mapProfile(res.data);

        if (!cancelled) {
          setProfile(mappedProfile);
          setDraft(mappedProfile);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to load your profile.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field: keyof ProfileData, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError(null);
  };

  const startEditing = () => {
    if (!profile) return;

    setDraft({ ...profile });
    setIsEditing(true);
    setSaved(false);
    setError(null);
  };

  const cancelEditing = () => {
    if (profile) {
      setDraft({ ...profile });
    }

    setIsEditing(false);
    setError(null);
  };

  const saveChanges = async () => {
    if (!draft) return;

    try {
      setIsSaving(true);
      setError(null);
      setSaved(false);

      await updateMyProfileApi({
        name: draft.fullName.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        branch: draft.branch.trim(),
        year: draft.year ? Number.parseInt(draft.year, 10) : undefined,
      });

      const res = await getMyProfileApi();
      const updatedProfile = mapProfile(res.data);

      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setIsEditing(false);
      setSaved(true);
    } catch (err: any) {
      setError(err?.message || "Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayed = isEditing ? draft : profile ?? emptyProfile;

  const initials =
    (profile?.fullName || user?.name || "")
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
    options?: { type?: string }
  ) => (
    <div className="space-y-2" key={key}>
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={options?.type ?? "text"}
        value={displayed[key]}
        placeholder={placeholder}
        readOnly={!isEditing}
        onChange={(event) => updateField(key, event.target.value)}
        className="h-11 rounded-lg read-only:bg-muted/40 read-only:text-muted-foreground"
      />
    </div>
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="p-10 text-center text-sm text-muted-foreground">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-destructive">
            {error || "Unable to load your profile."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </main>
    );
  }

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
              <Button
                variant="outline"
                size="icon"
                onClick={cancelEditing}
                disabled={isSaving}
                aria-label="Cancel editing"
              >
                <X className="size-4" />
              </Button>

              <Button
                onClick={saveChanges}
                disabled={isSaving}
                className="gap-2"
              >
                <Check className="size-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-border bg-primary/10 px-4 py-3 text-sm">
            <Check className="size-4 text-primary" />
            Profile changes saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl shadow-none">
              <div className="h-24 bg-primary/20">
                <div className="h-full w-full bg-gradient-to-br from-primary/30 to-transparent" />
              </div>

              <CardContent className="relative -mt-12 px-6 pb-6">
                <div className="group relative flex size-24 items-center justify-center rounded-2xl border-4 border-card bg-primary text-3xl font-semibold text-primary-foreground shadow-sm">
                  {initials}

                  <button
                    type="button"
                    disabled={!isEditing}
                    aria-label="Change profile photo"
                    title="Photo upload coming later"
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
            <Card
              id="personal"
              className="scroll-mt-6 rounded-2xl shadow-none"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <UserRound className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      Personal information
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Your basic identity details.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("fullName", "Full name", "Enter your full name")}
                {field("email", "Email address", "you@college.edu", {
                  type: "email",
                })}
              </CardContent>
            </Card>

            <Card
              id="academic"
              className="scroll-mt-6 rounded-2xl shadow-none"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <GraduationCap className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      Academic details
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Your branch and current academic year.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("branch", "Branch", "Enter your branch")}
                {field("year", "Year", "Enter your academic year", {
                  type: "number",
                })}
              </CardContent>
            </Card>

            <Card
              id="contact"
              className="scroll-mt-6 rounded-2xl shadow-none"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      Contact information
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Contact details associated with your account.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("phone", "Phone number", "Enter your phone number", {
                  type: "tel",
                })}
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Check className="size-4" />
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validators/auth";
import { registerApi, setToken } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthLayout from "@/components/layouts/Authlayout";

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
  import("zod").z.input<typeof registerSchema>,
  unknown,
  RegisterInput
>({
  resolver: zodResolver(registerSchema),
});
  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await registerApi(data);
      setToken(res.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setError("Google sign-up is not configured yet.");
  };

  const inputClass =
    "w-full px-4 py-3 h-auto border-none";

  const labelClass = "text-sm font-medium";

  const errorClass = "text-xs text-destructive";

  return (
    <AuthLayout
      title="Create Your Account"
      description="Join SaySo and make your campus better."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Google Sign Up */}
        <Button
          type="button"
          variant={"ghost"}
          onClick={handleGoogleRegister}
          className="w-full flex items-center border-none  justify-center gap-3 px-4 py-3 h-auto "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.62 5.91c4.45-4.11 7.15-10.16 7.15-17.56Z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.8 23.8 0 0 0 0 24c0 3.86.92 7.52 2.56 10.78l7.97-6.19Z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.84 2.27-8.28 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="whitespace-nowrap text-[10px] text-muted-foreground">
            OR REGISTER WITH EMAIL
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className={labelClass}>
            Full name
          </Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Enter your full name"
            {...register("name")}
            aria-invalid={!!errors.name}
            className={inputClass}
          />
          {errors.name && (
            <p className={errorClass}>{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className={labelClass}>
            College email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@college.edu"
            {...register("email")}
            aria-invalid={!!errors.email}
            className={inputClass}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className={labelClass}>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            {...register("password")}
            aria-invalid={!!errors.password}
            className={inputClass}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        {/* Roll Number and Academic Year */}
        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="rollNumber" className={labelClass}>
              Roll number
            </Label>
            <Input
              id="rollNumber"
              placeholder="CS22B001"
              {...register("rollNumber")}
              aria-invalid={!!errors.rollNumber}
              className={inputClass}
            />
            {errors.rollNumber && (
              <p className={errorClass}>
                {errors.rollNumber.message}
              </p>
            )}
          </div>

          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="year" className={labelClass}>
              Academic year
            </Label>
            <Input
              id="year"
              type="number"
              placeholder="1"
              {...register("year", { valueAsNumber: true })}
              aria-invalid={!!errors.year}
              className={inputClass}
            />
            {errors.year && (
              <p className={errorClass}>{errors.year.message}</p>
            )}
          </div>
        </div>

        {/* Branch */}
        <div className="space-y-1.5">
          <Label htmlFor="branch" className={labelClass}>
            Department / branch
          </Label>
          <Input
            id="branch"
            placeholder="e.g. Computer Science"
            {...register("branch")}
            aria-invalid={!!errors.branch}
            className={inputClass}
          />
          {errors.branch && (
            <p className={errorClass}>{errors.branch.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-xl font-semibold"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
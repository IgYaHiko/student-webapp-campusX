"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createComplaintSchema,
  type CreateComplaintInput,
} from "@/lib/validators/complaint.validator";
import { getCategoriesApi, createComplaintApi } from "@/lib/api";
import { z } from "zod";
import {
  AlertCircle,
  ArrowUpRight,
  MapPin,
  MessageSquareText,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { PRODUCT_IMAGES } from "@/public/image/image";

export function NewComplaintDialog() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { slug: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<
    z.input<typeof createComplaintSchema>,
    unknown,
    CreateComplaintInput
  >({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: CreateComplaintInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await createComplaintApi(data);
      router.replace("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to submit complaint."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    if (!isLoading) router.back();
  };

  const inputClassName = "h-auto py-3 border-none px-3.5 rounded-lg";
  const labelClassName = "text-sm font-medium";

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto scrollbar-hide p-0 sm:max-w-2xl">
        <div className="border-b border-border px-6 py-5 sm:px-8">
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-center gap-3">
             <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
               <Image
                 src={PRODUCT_IMAGES.LOGO}
                 alt="CampusFix"     
                 className="size-10 object-contain"
                 width={100}
                 height={100}
                 priority
               />
             </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  SaySo / Reports
                </p>
                <DialogTitle className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                  New complaint
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="max-w-lg text-sm leading-6">
              Tell us what needs attention on campus. Include the location so
              the right team can find and resolve the issue.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-7 px-6 py-6 sm:px-8">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  01
                </span>
                <h3 className="text-sm font-semibold">Issue details</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className={labelClassName}>
                  Complaint title
                </Label>
                <Input
                  id="title"
                  className={inputClassName}
                  placeholder="e.g. Wi-Fi not working in Lab 204"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={labelClassName}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="min-h-32 resize-y rounded-lg px-3.5 py-3"
                  placeholder="What happened? Where did you notice it? Add any details that might help."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className={labelClassName}>
                  Category
                </Label>
                <Select
                  value={watch("categorySlug") || ""}
                  onValueChange={(value) => {
                    if (!value) return;
                    setValue("categorySlug", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                >
                  <SelectTrigger id="category" className="h-auto w-full rounded-lg py-5">
                    <SelectValue placeholder="Choose the type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categorySlug && (
                  <p className="text-sm text-destructive">
                    {errors.categorySlug.message}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  02
                </span>
                <h3 className="text-sm font-semibold">Location and urgency</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location" className={labelClassName}>
                    <MapPin className="mr-1 inline size-3.5 text-muted-foreground" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    className={inputClassName}
                    placeholder="e.g. Room 204"
                    {...register("location")}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="building" className={labelClassName}>
                    Building
                    <span className="ml-1 font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="building"
                    className={inputClassName}
                    placeholder="e.g. Academic Block A"
                    {...register("building")}
                  />
                </div>
              </div>

              <div className="space-y-2 ">
                <Label htmlFor="priority" className={labelClassName}>
                  Priority
                </Label>
                <Select
                  value={watch("priority") || "medium"}
                  onValueChange={(value) => {
                    if (!value) return;
                    setValue(
                      "priority",
                      value as CreateComplaintInput["priority"],
                      { shouldValidate: true, shouldDirty: true }
                    );
                  }}
                >
                  <SelectTrigger id="priority" className="h-auto w-full rounded-lg py-5">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-xs leading-5 text-muted-foreground">
              Please provide accurate details to help resolve your issue.
            </p>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2 py-4 font-bold"
                disabled={isLoading}
                onClick={closeDialog}
              >
                <X className="size-4" />
                Cancel
              </Button>
              <Button type="submit" className="gap-2 py-4 font-bold" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit complaint"}
                {!isLoading && <ArrowUpRight className="size-4" />}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
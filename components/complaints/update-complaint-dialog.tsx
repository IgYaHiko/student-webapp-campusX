
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getCategoriesApi,
  updateComplaintApi,
} from "@/lib/api";

import type { EditableComplaint } from "@/types/complaints/types";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type ComplaintForUpdate = EditableComplaint & {
  category?: {
    id?: number;
    name?: string;
    slug?: string;
  };
};

type UpdateComplaintDialogProps = {
  complaint: ComplaintForUpdate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void | Promise<void>;
};

type FormValues = {
  title: string;
  description: string;
  location: string;
  building: string;
  priority: "low" | "medium" | "high" | "urgent";
  categorySlug: string;
};

const initialValues: FormValues = {
  title: "",
  description: "",
  location: "",
  building: "",
  priority: "medium",
  categorySlug: "",
};

export function UpdateComplaintDialog({
  complaint,
  open,
  onOpenChange,
  onUpdated,
}: UpdateComplaintDialogProps) {
  const [form, setForm] = useState<FormValues>(initialValues);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and populate the existing complaint
  useEffect(() => {
    if (!complaint || !open) return;

    let active = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await getCategoriesApi();

        const categoryData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.data)
              ? response.data.data
              : [];

        if (!active) return;

        const availableCategories: Category[] = categoryData.filter(
          (category: Category) =>
            category &&
            typeof category.id === "number" &&
            typeof category.name === "string" &&
            typeof category.slug === "string"
        );

        setCategories(availableCategories);

        // Match the existing category using ID, slug, or name
        const existingCategory = availableCategories.find(
          (category) =>
            (complaint.category?.id !== undefined &&
              category.id === complaint.category.id) ||
            (complaint.category?.slug &&
              category.slug === complaint.category.slug) ||
            (complaint.category?.name &&
              category.name.toLowerCase() ===
                complaint.category.name.toLowerCase())
        );

        setForm({
          title: complaint.title ?? "",
          description: complaint.description ?? "",
          location: complaint.location ?? "",
          building: complaint.building ?? "",
          priority: complaint.priority ?? "medium",
          categorySlug:
            existingCategory?.slug ??
            complaint.category?.slug ??
            "",
        });
      } catch (error) {
        console.error("Failed to fetch categories:", error);

        if (active) {
          toast.error("Failed to load categories.");
          setCategories([]);
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, [complaint, open]);

  // Update form fields
  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Submit updated complaint
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!complaint) return;

    if (form.title.trim().length < 5) {
      toast.error("Title must contain at least 5 characters.");
      return;
    }

    if (form.description.trim().length < 10) {
      toast.error("Description must contain at least 10 characters.");
      return;
    }

    if (form.location.trim().length < 2) {
      toast.error("Location must contain at least 2 characters.");
      return;
    }

    if (!form.categorySlug.trim()) {
      toast.error("Please select a complaint category.");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.slug === form.categorySlug
    );

    if (!selectedCategory) {
      toast.error("Please select a valid category.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      ...(form.building.trim()
        ? { building: form.building.trim() }
        : {}),
      priority: form.priority,
      categorySlug: selectedCategory.slug,
    };

    try {
      setIsSubmitting(true);

      await updateComplaintApi(complaint.id, payload);

      toast.success("Complaint updated successfully.");

      onOpenChange(false);

      await onUpdated();
    } catch (error) {
      console.error("Failed to update complaint:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update complaint."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Update complaint</DialogTitle>

          <DialogDescription>
            Edit the details of complaint #{complaint?.id}.
            Your changes will be submitted for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Complaint title */}
          <div className="space-y-2">
            <label
              htmlFor="complaint-title"
              className="text-sm font-medium"
            >
              Complaint title
            </label>

            <input
              id="complaint-title"
              value={form.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
              minLength={5}
              maxLength={200}
              required
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              placeholder="Enter complaint title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="complaint-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="complaint-description"
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              minLength={10}
              maxLength={2000}
              required
              disabled={isSubmitting}
              rows={5}
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              placeholder="Describe the issue in detail"
            />
          </div>

          {/* Location and building */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="complaint-location"
                className="text-sm font-medium"
              >
                Location
              </label>

              <input
                id="complaint-location"
                value={form.location}
                onChange={(e) =>
                  updateField("location", e.target.value)
                }
                minLength={2}
                maxLength={200}
                required
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 mt-1"
                placeholder="e.g. Library"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="complaint-building"
                className="text-sm font-medium"
              >
                Building
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              </label>

              <input
                id="complaint-building"
                value={form.building}
                onChange={(e) =>
                  updateField("building", e.target.value)
                }
                maxLength={100}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 mt-1"
                placeholder="Building name"
              />
            </div>
          </div>

          {/* Priority and category */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Priority
              </label>

              <Select
            
                value={form.priority}
                onValueChange={(value) =>
                  updateField(
                    "priority",
                    value as FormValues["priority"]
                  )
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full py-4 mt-1">
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

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <Select
                value={form.categorySlug}
                onValueChange={(value) =>
                    //@ts-ignore
                  updateField("categorySlug", value)
                }
                disabled={
                  isSubmitting ||
                  categoriesLoading ||
                  categories.length === 0
                }
              >
                <SelectTrigger className="w-full mt-1 py-4">
                  <SelectValue
                    placeholder={
                      categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.slug}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!categoriesLoading && categories.length === 0 && (
                <p className="text-xs text-destructive">
                  No categories available.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                categoriesLoading ||
                categories.length === 0
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

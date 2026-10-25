import z from "zod";

export const createComplaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  categorySlug: z.string().min(1, "Please select a category"),
  location: z.string().min(2, "Location is required").max(200),
  building: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
})

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>
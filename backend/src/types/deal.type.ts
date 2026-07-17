import { z } from "zod";

export const DealSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  product: z.string().min(1, "Product is required"),

  image: z.string().min(1, "Image is required"),

  discountPercentage: z
    .number()
    .min(0, "Discount percentage cannot be negative")
    .max(100, "Discount percentage cannot exceed 100"),

  badge: z.string().min(1, "Badge is required"),

  isActive: z.boolean().default(true),
});

export type DealType = z.infer<typeof DealSchema>;

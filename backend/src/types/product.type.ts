import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),

  slug: z.string().min(1, "Slug is required"),

  description: z.string().optional(),

  category: z.string().min(1, "Category is required"),

  price: z.number().positive("Price must be a positive number"),

  image: z.string().min(1, "Image is required"),

  tag: z.string().optional(),

  unit: z.string().optional().default(""),

  stock: z.number().int().min(0).default(100),

  rating: z.number().min(0).max(5).default(4.9),

  reviewsCount: z.number().int().min(0).default(128),

  isFeatured: z.boolean().default(false),

  isActive: z.boolean().default(true),
});

export type ProductType = z.infer<typeof ProductSchema>;

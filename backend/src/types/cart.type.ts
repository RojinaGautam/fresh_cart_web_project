import { z } from "zod";

export const CartItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export const CartSchema = z.object({
  userId: z.string().min(1, "User is required"),
  items: z.array(CartItemSchema).default([]),
});

export type CartItemType = z.infer<typeof CartItemSchema>;
export type CartType = z.infer<typeof CartSchema>;

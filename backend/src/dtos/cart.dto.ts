import { z } from "zod";

export const AddCartItemDTO = z.object({
  productId: z.string().min(1, "Product id is required"),
  quantity: z.number().int().positive("Quantity must be positive").default(1),
});

export type AddCartItemDTO = z.infer<typeof AddCartItemDTO>;

export const UpdateCartItemDTO = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type UpdateCartItemDTO = z.infer<typeof UpdateCartItemDTO>;

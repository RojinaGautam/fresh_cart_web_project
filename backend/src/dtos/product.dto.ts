import { z } from "zod";
import { ProductSchema } from "../types/product.type";

export const CreateProductDTO = ProductSchema;

export type CreateProductDTO = z.infer<typeof CreateProductDTO>;

export const UpdateProductDTO = ProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);

export type UpdateProductDTO = z.infer<typeof UpdateProductDTO>;

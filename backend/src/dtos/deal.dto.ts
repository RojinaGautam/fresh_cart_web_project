import { z } from "zod";
import { DealSchema } from "../types/deal.type";

export const CreateDealDTO = DealSchema;

export type CreateDealDTO = z.infer<typeof CreateDealDTO>;

export const UpdateDealDTO = DealSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);

export type UpdateDealDTO = z.infer<typeof UpdateDealDTO>;

import { z } from "zod";
import { SUPPORT_STATUSES } from "../types/support.type";

export const CreateSupportDTO = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type CreateSupportDTO = z.infer<typeof CreateSupportDTO>;

export const AdminUpdateSupportStatusDTO = z.object({
  status: z.enum(SUPPORT_STATUSES),
});

export type AdminUpdateSupportStatusDTO = z.infer<
  typeof AdminUpdateSupportStatusDTO
>;

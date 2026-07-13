import { z } from "zod";

export const SUPPORT_STATUSES = ["open", "resolved"] as const;

export const SupportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  status: z.enum(SUPPORT_STATUSES).default("open"),
});

export type SupportType = z.infer<typeof SupportSchema>;

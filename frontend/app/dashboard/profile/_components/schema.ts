import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

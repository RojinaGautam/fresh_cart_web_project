import { z } from "zod";

export const adminUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["admin", "user"]),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type AdminUserFormData = z.infer<typeof adminUserSchema>;

import { z } from "zod";
import { UserSchema } from "../types/user.type";

// DTO for user registration
export const CreateUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  password: true,
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

// DTO for user login
export const LoginUserDTO = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// DTO for profile update
export const UpdateProfileDTO = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .optional(),
  profileImage: z.string().nullable().optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileDTO>;

// DTO for password update
export const UpdatePasswordDTO = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTO>;

const AdminUserBaseDTO = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]).default("user"),
});

export const AdminCreateUserDTO = AdminUserBaseDTO;

export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

export const AdminUpdateUserDTO = AdminUserBaseDTO.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);

export type AdminUpdateUserDTO = z.infer<typeof AdminUpdateUserDTO>;

// DTO for email verification (via OTP)
export const VerifyEmailDTO = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyEmailDTO = z.infer<typeof VerifyEmailDTO>;

// DTO for resending the verification OTP
export const ResendVerificationDTO = z.object({
  email: z.string().email("Invalid email address"),
});

export type ResendVerificationDTO = z.infer<typeof ResendVerificationDTO>;

// DTO for requesting a password reset OTP
export const ForgotPasswordDTO = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordDTO>;

// DTO for completing a password reset (via OTP)
export const ResetPasswordDTO = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordDTO>;

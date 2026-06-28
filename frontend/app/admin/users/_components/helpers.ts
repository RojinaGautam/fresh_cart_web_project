import { AdminUserFormPayload } from "../../../../lib/api/admin-users";

export const emptyUserForm: AdminUserFormPayload = {
  fullName: "",
  email: "",
  phoneNumber: "",
  role: "user",
  password: "",
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

export const validateUserForm = (
  form: AdminUserFormPayload,
  mode: "create" | "edit",
) => {
  if (!form.fullName.trim()) return "Full name is required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
  if (form.phoneNumber.trim().length < 10) {
    return "Phone number must be at least 10 digits";
  }
  if (!["admin", "user"].includes(form.role)) return "Role is required";
  if (mode === "create" && !form.password?.trim()) return "Password is required";
  if (form.password && form.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
};

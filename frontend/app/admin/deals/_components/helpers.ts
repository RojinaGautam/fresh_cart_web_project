import { AdminDealFormPayload } from "../../../../lib/api/admin/deal";

export const emptyDealForm: AdminDealFormPayload = {
  title: "",
  description: "",
  product: "",
  discountPercentage: "",
  badge: "",
  isActive: true,
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

export const validateDealForm = (form: AdminDealFormPayload) => {
  if (!form.title.trim()) return "Title is required";
  if (!form.description.trim()) return "Description is required";
  if (!form.product) return "Product is required";
  if (
    !form.discountPercentage.trim() ||
    Number.isNaN(Number(form.discountPercentage)) ||
    Number(form.discountPercentage) < 0 ||
    Number(form.discountPercentage) > 100
  ) {
    return "Discount percentage must be a number between 0 and 100";
  }
  if (!form.badge.trim()) return "Badge is required";

  return "";
};

import { AdminCategoryFormPayload } from "../../../../lib/api/admin/category";

export const emptyCategoryForm: AdminCategoryFormPayload = {
  title: "",
  slug: "",
  image: "",
  description: "",
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

export const validateCategoryForm = (form: AdminCategoryFormPayload) => {
  if (!form.title.trim()) return "Title is required";
  if (!form.slug.trim()) return "Slug is required";
  if (!form.image.trim()) return "Please upload a category image";
  if (!form.description.trim()) return "Description is required";

  return "";
};

import { AdminProductFormPayload } from "../../../../lib/api/admin/product";

export const emptyProductForm: AdminProductFormPayload = {
  name: "",
  slug: "",
  description: "",
  category: "",
  price: "",
  image: "",
  tag: "",
  unit: "",
  stock: "",
  isFeatured: false,
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

export const validateProductForm = (form: AdminProductFormPayload) => {
  if (!form.name.trim()) return "Product name is required";
  if (!form.slug.trim()) return "Slug is required";
  if (!form.category) return "Category is required";
  if (!form.price.trim() || Number.isNaN(Number(form.price))) {
    return "A valid price is required";
  }
  if (!form.image.trim()) return "Please upload a product image";

  return "";
};

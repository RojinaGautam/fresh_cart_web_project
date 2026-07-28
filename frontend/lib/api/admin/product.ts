import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { Product } from "../products";
import { fromNPR } from "../../currency";

export type AdminProductFormPayload = {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  image: string;
  tag: string;
  unit: string;
  stock: string;
  isFeatured: boolean;
  isActive: boolean;
};

export type AdminMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const buildProductPayload = (form: AdminProductFormPayload) => {
  const payload: Record<string, unknown> = {
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() || undefined,
    category: form.category,
    // Admins enter NPR; prices are stored and charged in USD.
    price: fromNPR(Number(form.price)),
    image: form.image.trim(),
    tag: form.tag.trim() || undefined,
    unit: form.unit.trim(),
    stock: form.stock ? Number(form.stock) : undefined,
    isFeatured: form.isFeatured,
    isActive: form.isActive,
  };

  return payload;
};

export const getAdminProductsApi = async (params: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PRODUCTS, {
    params,
  });
  return response.data;
};

export const getAdminProductApi = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`,
  );
  return response.data;
};

export const createAdminProductApi = async (form: AdminProductFormPayload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.ADMIN_PRODUCTS,
    buildProductPayload(form),
  );
  return response.data;
};

export const updateAdminProductApi = async (
  id: string,
  form: AdminProductFormPayload,
) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`,
    buildProductPayload(form),
  );
  return response.data;
};

export const deleteAdminProductApi = async (id: string) => {
  const response = await axiosInstance.delete(
    `${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`,
  );
  return response.data;
};

export type { Product };

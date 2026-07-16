import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type ProductCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: ProductCategory | null;
  price: number;
  image: string;
  tag?: string;
  unit: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isActive: boolean;
};

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
};

export const getProductsApi = async (params: ProductListParams = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
    params,
  });
  return response.data;
};

export const getProductApi = async (slug: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.PRODUCTS}/${slug}`,
  );
  return response.data;
};

import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";
import { ProductCategory } from "./products";

export type DealProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number;
  unit: string;
  category: ProductCategory | null;
};

export type Deal = {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  badge: string;
  isActive: boolean;
  product: DealProduct | null;
};

export const getDealsApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.DEALS);
  return response.data;
};

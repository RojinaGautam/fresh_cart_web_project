import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type Category = {
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  isActive: boolean;
};

export const getCategoriesApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES);
  return response.data;
};

export const getCategoryApi = async (slug: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.CATEGORIES}/${slug}`,
  );
  return response.data;
};

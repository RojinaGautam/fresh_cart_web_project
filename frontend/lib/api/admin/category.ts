import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { AdminMeta } from "./product";

export type AdminCategoryFormPayload = {
  title: string;
  slug: string;
  image: string;
  description: string;
  isActive: boolean;
};

export const getAdminCategoriesApi = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_CATEGORIES, {
    params,
  });
  return response.data;
};

export const getAdminCategoryApi = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.ADMIN_CATEGORIES}/${id}`,
  );
  return response.data;
};

export const createAdminCategoryApi = async (form: AdminCategoryFormPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_CATEGORIES, form);
  return response.data;
};

export const updateAdminCategoryApi = async (
  id: string,
  form: AdminCategoryFormPayload,
) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.ADMIN_CATEGORIES}/${id}`,
    form,
  );
  return response.data;
};

export const deleteAdminCategoryApi = async (id: string) => {
  const response = await axiosInstance.delete(
    `${API_ENDPOINTS.ADMIN_CATEGORIES}/${id}`,
  );
  return response.data;
};

export type { AdminMeta };

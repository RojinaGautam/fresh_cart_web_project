import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { AdminMeta } from "./product";

export type AdminDealFormPayload = {
  title: string;
  description: string;
  product: string;
  discountPercentage: string;
  badge: string;
  isActive: boolean;
};

export const buildDealPayload = (form: AdminDealFormPayload) => ({
  title: form.title.trim(),
  description: form.description.trim(),
  product: form.product,
  discountPercentage: Number(form.discountPercentage),
  badge: form.badge.trim(),
  isActive: form.isActive,
});

export const getAdminDealsApi = async (params: { page: number; limit: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_DEALS, {
    params,
  });
  return response.data;
};

export const getAdminDealApi = async (id: string) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN_DEALS}/${id}`);
  return response.data;
};

export const createAdminDealApi = async (form: AdminDealFormPayload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.ADMIN_DEALS,
    buildDealPayload(form),
  );
  return response.data;
};

export const updateAdminDealApi = async (id: string, form: AdminDealFormPayload) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.ADMIN_DEALS}/${id}`,
    buildDealPayload(form),
  );
  return response.data;
};

export const deleteAdminDealApi = async (id: string) => {
  const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN_DEALS}/${id}`);
  return response.data;
};

export type { AdminMeta };

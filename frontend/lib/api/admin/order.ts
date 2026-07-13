import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { AdminMeta } from "./product";

export const getAdminOrdersApi = async (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_ORDERS, {
    params,
  });
  return response.data;
};

export const getAdminOrderApi = async (id: string) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN_ORDERS}/${id}`);
  return response.data;
};

export const updateAdminOrderStatusApi = async (id: string, status: string) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.ADMIN_ORDERS}/${id}/status`,
    { status },
  );
  return response.data;
};

export type { AdminMeta };

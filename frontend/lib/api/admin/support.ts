import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { AdminMeta } from "./product";

export const getAdminSupportTicketsApi = async (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT, {
    params,
  });
  return response.data;
};

export const getAdminSupportTicketApi = async (id: string) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN_SUPPORT}/${id}`);
  return response.data;
};

export const updateAdminSupportStatusApi = async (id: string, status: string) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.ADMIN_SUPPORT}/${id}/status`,
    { status },
  );
  return response.data;
};

export type { AdminMeta };

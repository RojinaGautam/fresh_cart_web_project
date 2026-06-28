import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";
import { FreshCartUser } from "./auth";

export type AdminUserFormPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "user";
  password?: string;
};

export type AdminUsersMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminUsersResponse = {
  success: boolean;
  message: string;
  data: FreshCartUser[];
  meta: AdminUsersMeta;
};

export const getAdminUsersApi = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const response = await axiosInstance.get<AdminUsersResponse>(
    API_ENDPOINTS.ADMIN_USERS,
    {
      params: { page, limit, search },
    },
  );

  return response.data;
};

export const getAdminUserApi = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.ADMIN_USERS}/${id}`,
  );
  return response.data;
};

export const createAdminUserApi = async (payload: AdminUserFormPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_USERS, payload);
  return response.data;
};

export const updateAdminUserApi = async (
  id: string,
  payload: Partial<AdminUserFormPayload>,
) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.ADMIN_USERS}/${id}`,
    payload,
  );
  return response.data;
};

export const deleteAdminUserApi = async (id: string) => {
  const response = await axiosInstance.delete(
    `${API_ENDPOINTS.ADMIN_USERS}/${id}`,
  );
  return response.data;
};

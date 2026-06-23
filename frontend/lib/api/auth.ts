import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type RegisterPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type FreshCartUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const registerApi = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, payload);
  return response.data;
};

export const whoAmIApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.WHOAMI);
  return response.data;
};

export const updateProfileApi = async (payload: FormData) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.UPDATE_PROFILE,
    payload,
  );
  return response.data;
};

export const updatePasswordApi = async (payload: UpdatePasswordPayload) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.UPDATE_PASSWORD,
    payload,
  );
  return response.data;
};

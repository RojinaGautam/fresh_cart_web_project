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

export const registerApi = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, payload);
  return response.data;
};
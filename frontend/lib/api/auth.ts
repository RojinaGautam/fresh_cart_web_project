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

export type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
};

export type FreshCartUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
  role: string;
  isVerified: boolean;
  addresses?: Address[];
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

export const verifyEmailApi = async (email: string, otp: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, {
    email,
    otp,
  });
  return response.data;
};

export const resendVerificationApi = async (email: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.RESEND_VERIFICATION, {
    email,
  });
  return response.data;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
    email,
  });
  return response.data;
};

export const resetPasswordApi = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, {
    email,
    otp,
    newPassword,
  });
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

export const updateAddressesApi = async (
  addresses: Array<Omit<Address, "id"> & { id?: string }>,
) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.UPDATE_PROFILE, {
    addresses,
  });
  return response.data;
};

export const updatePasswordApi = async (payload: UpdatePasswordPayload) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.UPDATE_PASSWORD,
    payload,
  );
  return response.data;
};

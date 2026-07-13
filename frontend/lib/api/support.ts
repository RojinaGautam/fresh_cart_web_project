import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type SupportTicket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt?: string;
};

export type CreateSupportPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const createSupportTicketApi = async (payload: CreateSupportPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.SUPPORT, payload);
  return response.data;
};

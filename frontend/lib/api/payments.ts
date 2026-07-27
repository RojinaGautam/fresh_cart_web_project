import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type PaymentIntentResult = {
  clientSecret: string;
  amount: number;
  total: number;
};

export const createPaymentIntentApi = async () => {
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_PAYMENT_INTENT);
  return response.data;
};

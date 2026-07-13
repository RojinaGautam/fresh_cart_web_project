import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type OrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  status: string;
  createdAt?: string;
};

export type CreateOrderPayload = {
  shippingAddress: string;
  paymentMethod: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
};

export const createOrderApi = async (payload: CreateOrderPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ORDERS, payload);
  return response.data;
};

export const getOrdersApi = async (params: { page?: number; limit?: number } = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ORDERS, { params });
  return response.data;
};

export const getOrderApi = async (id: string) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS}/${id}`);
  return response.data;
};

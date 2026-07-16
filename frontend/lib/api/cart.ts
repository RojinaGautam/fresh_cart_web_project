import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type CartLineProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  unit: string;
};

export type CartLineItem = {
  product: CartLineProduct;
  quantity: number;
  lineTotal: number;
};

export type Cart = {
  id: string;
  items: CartLineItem[];
  subtotal: number;
};

export const getCartApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.CART);
  return response.data;
};

export const addCartItemApi = async (productId: string, quantity = 1) => {
  const response = await axiosInstance.post(`${API_ENDPOINTS.CART}/items`, {
    productId,
    quantity,
  });
  return response.data;
};

export const updateCartItemApi = async (
  productId: string,
  quantity: number,
) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.CART}/items/${productId}`,
    { quantity },
  );
  return response.data;
};

export const removeCartItemApi = async (productId: string) => {
  const response = await axiosInstance.delete(
    `${API_ENDPOINTS.CART}/items/${productId}`,
  );
  return response.data;
};

export const clearCartApi = async () => {
  const response = await axiosInstance.delete(API_ENDPOINTS.CART);
  return response.data;
};

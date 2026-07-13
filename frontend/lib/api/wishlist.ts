import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";
import { CartLineProduct } from "./cart";

export type WishlistItem = {
  product: CartLineProduct;
  addedAt: string;
};

export type Wishlist = {
  id: string;
  items: WishlistItem[];
};

export const getWishlistApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.WISHLIST);
  return response.data;
};

export const addWishlistItemApi = async (productId: string) => {
  const response = await axiosInstance.post(
    `${API_ENDPOINTS.WISHLIST}/${productId}`,
  );
  return response.data;
};

export const removeWishlistItemApi = async (productId: string) => {
  const response = await axiosInstance.delete(
    `${API_ENDPOINTS.WISHLIST}/${productId}`,
  );
  return response.data;
};

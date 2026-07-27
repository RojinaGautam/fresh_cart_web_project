import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type ReviewAuthor = {
  id: string;
  fullName: string;
  profileImage: string | null;
};

export type Review = {
  id: string;
  product: string;
  rating: number;
  comment: string;
  author: ReviewAuthor | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
};

export type ReviewPayload = {
  rating: number;
  comment: string;
};

export const getProductReviewsApi = async (
  productId: string,
  params: { page?: number; limit?: number } = {},
) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.PRODUCT_REVIEWS(productId),
    { params },
  );
  return response.data;
};

export const createProductReviewApi = async (
  productId: string,
  payload: ReviewPayload,
) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PRODUCT_REVIEWS(productId),
    payload,
  );
  return response.data;
};

export const updateReviewApi = async (
  reviewId: string,
  payload: ReviewPayload,
) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.REVIEWS}/${reviewId}`,
    payload,
  );
  return response.data;
};

export const deleteReviewApi = async (reviewId: string) => {
  const response = await axiosInstance.delete(
    `${API_ENDPOINTS.REVIEWS}/${reviewId}`,
  );
  return response.data;
};

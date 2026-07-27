import {
  createProductReviewApi,
  deleteReviewApi,
  getProductReviewsApi,
  ReviewPayload,
  updateReviewApi,
} from "../api/reviews";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getProductReviewsAction = async (
  productId: string,
  params: { page?: number; limit?: number } = {},
) => {
  try {
    const response = await getProductReviewsApi(productId, params);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch reviews",
    };
  }
};

export const createProductReviewAction = async (
  productId: string,
  payload: ReviewPayload,
) => {
  try {
    const response = await createProductReviewApi(productId, payload);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to post review",
    };
  }
};

export const updateReviewAction = async (
  reviewId: string,
  payload: ReviewPayload,
) => {
  try {
    const response = await updateReviewApi(reviewId, payload);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update review",
    };
  }
};

export const deleteReviewAction = async (reviewId: string) => {
  try {
    const response = await deleteReviewApi(reviewId);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to delete review",
    };
  }
};

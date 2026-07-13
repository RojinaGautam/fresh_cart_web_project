import {
  addWishlistItemApi,
  getWishlistApi,
  removeWishlistItemApi,
} from "../api/wishlist";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getWishlistAction = async () => {
  try {
    const response = await getWishlistApi();
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch wishlist",
    };
  }
};

export const addWishlistItemAction = async (productId: string) => {
  try {
    const response = await addWishlistItemApi(productId);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to add item to wishlist",
    };
  }
};

export const removeWishlistItemAction = async (productId: string) => {
  try {
    const response = await removeWishlistItemApi(productId);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to remove wishlist item",
    };
  }
};

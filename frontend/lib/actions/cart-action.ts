import {
  addCartItemApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../api/cart";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getCartAction = async () => {
  try {
    const response = await getCartApi();
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch cart",
    };
  }
};

export const addCartItemAction = async (productId: string, quantity = 1) => {
  try {
    const response = await addCartItemApi(productId, quantity);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to add item to cart",
    };
  }
};

export const updateCartItemAction = async (
  productId: string,
  quantity: number,
) => {
  try {
    const response = await updateCartItemApi(productId, quantity);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update cart item",
    };
  }
};

export const removeCartItemAction = async (productId: string) => {
  try {
    const response = await removeCartItemApi(productId);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to remove cart item",
    };
  }
};

export const clearCartAction = async () => {
  try {
    const response = await clearCartApi();
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to clear cart",
    };
  }
};

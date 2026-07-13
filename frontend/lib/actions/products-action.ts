import {
  getProductApi,
  getProductsApi,
  ProductListParams,
} from "../api/products";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getProductsAction = async (params: ProductListParams = {}) => {
  try {
    const response = await getProductsApi(params);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch products",
    };
  }
};

export const getProductAction = async (slug: string) => {
  try {
    const response = await getProductApi(slug);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch product",
    };
  }
};

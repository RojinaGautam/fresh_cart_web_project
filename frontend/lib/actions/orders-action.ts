import {
  createOrderApi,
  CreateOrderPayload,
  getOrderApi,
  getOrdersApi,
} from "../api/orders";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const createOrderAction = async (payload: CreateOrderPayload) => {
  try {
    const response = await createOrderApi(payload);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to place order",
    };
  }
};

export const getOrdersAction = async (params: { page?: number; limit?: number } = {}) => {
  try {
    const response = await getOrdersApi(params);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch orders",
    };
  }
};

export const getOrderAction = async (id: string) => {
  try {
    const response = await getOrderApi(id);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch order",
    };
  }
};

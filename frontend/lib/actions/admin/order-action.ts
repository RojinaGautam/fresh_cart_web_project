import {
  getAdminOrderApi,
  getAdminOrdersApi,
  updateAdminOrderStatusApi,
} from "../../api/admin/order";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getAdminOrdersAction = async (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  try {
    return await getAdminOrdersApi(params);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch orders",
      data: [],
      meta: { page: params.page, limit: params.limit, total: 0, totalPages: 0 },
    };
  }
};

export const getAdminOrderAction = async (id: string) => {
  try {
    return await getAdminOrderApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch order",
      data: null,
    };
  }
};

export const updateAdminOrderStatusAction = async (id: string, status: string) => {
  try {
    return await updateAdminOrderStatusApi(id, status);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update order status",
      data: null,
    };
  }
};

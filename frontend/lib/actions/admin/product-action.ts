import {
  AdminProductFormPayload,
  createAdminProductApi,
  deleteAdminProductApi,
  getAdminProductApi,
  getAdminProductsApi,
  updateAdminProductApi,
} from "../../api/admin/product";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getAdminProductsAction = async (params: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) => {
  try {
    return await getAdminProductsApi(params);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch products",
      data: [],
      meta: { page: params.page, limit: params.limit, total: 0, totalPages: 0 },
    };
  }
};

export const getAdminProductAction = async (id: string) => {
  try {
    return await getAdminProductApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch product",
      data: null,
    };
  }
};

export const createAdminProductAction = async (
  form: AdminProductFormPayload,
) => {
  try {
    return await createAdminProductApi(form);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to create product",
      data: null,
    };
  }
};

export const updateAdminProductAction = async (
  id: string,
  form: AdminProductFormPayload,
) => {
  try {
    return await updateAdminProductApi(id, form);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update product",
      data: null,
    };
  }
};

export const deleteAdminProductAction = async (id: string) => {
  try {
    return await deleteAdminProductApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to delete product",
      data: null,
    };
  }
};

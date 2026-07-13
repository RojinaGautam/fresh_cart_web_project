import {
  AdminCategoryFormPayload,
  createAdminCategoryApi,
  deleteAdminCategoryApi,
  getAdminCategoriesApi,
  getAdminCategoryApi,
  updateAdminCategoryApi,
} from "../../api/admin/category";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getAdminCategoriesAction = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  try {
    return await getAdminCategoriesApi(params);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch categories",
      data: [],
      meta: { page: params.page, limit: params.limit, total: 0, totalPages: 0 },
    };
  }
};

export const getAdminCategoryAction = async (id: string) => {
  try {
    return await getAdminCategoryApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch category",
      data: null,
    };
  }
};

export const createAdminCategoryAction = async (
  form: AdminCategoryFormPayload,
) => {
  try {
    return await createAdminCategoryApi(form);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to create category",
      data: null,
    };
  }
};

export const updateAdminCategoryAction = async (
  id: string,
  form: AdminCategoryFormPayload,
) => {
  try {
    return await updateAdminCategoryApi(id, form);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update category",
      data: null,
    };
  }
};

export const deleteAdminCategoryAction = async (id: string) => {
  try {
    return await deleteAdminCategoryApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to delete category",
      data: null,
    };
  }
};

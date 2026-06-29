import {
  AdminUserFormPayload,
  createAdminUserApi,
  deleteAdminUserApi,
  getAdminUserApi,
  getAdminUsersApi,
  updateAdminUserApi,
} from "../../api/admin/user";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getAdminUsersAction = async (params: {
  page: number;
  limit: number;
  search: string;
}) => {
  try {
    return await getAdminUsersApi(params);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch users",
      data: [],
      meta: { page: params.page, limit: params.limit, total: 0, totalPages: 0 },
    };
  }
};

export const getAdminUserAction = async (id: string) => {
  try {
    return await getAdminUserApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch user",
      data: null,
    };
  }
};

export const createAdminUserAction = async (
  payload: AdminUserFormPayload,
) => {
  try {
    return await createAdminUserApi(payload);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to create user",
      data: null,
    };
  }
};

export const updateAdminUserAction = async (
  id: string,
  payload: Partial<AdminUserFormPayload>,
) => {
  try {
    return await updateAdminUserApi(id, payload);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update user",
      data: null,
    };
  }
};

export const deleteAdminUserAction = async (id: string) => {
  try {
    return await deleteAdminUserApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to delete user",
      data: null,
    };
  }
};

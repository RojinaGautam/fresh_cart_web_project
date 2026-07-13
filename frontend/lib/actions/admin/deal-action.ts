import {
  AdminDealFormPayload,
  createAdminDealApi,
  deleteAdminDealApi,
  getAdminDealApi,
  getAdminDealsApi,
  updateAdminDealApi,
} from "../../api/admin/deal";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getAdminDealsAction = async (params: { page: number; limit: number }) => {
  try {
    return await getAdminDealsApi(params);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch deals",
      data: [],
      meta: { page: params.page, limit: params.limit, total: 0, totalPages: 0 },
    };
  }
};

export const getAdminDealAction = async (id: string) => {
  try {
    return await getAdminDealApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch deal",
      data: null,
    };
  }
};

export const createAdminDealAction = async (form: AdminDealFormPayload) => {
  try {
    return await createAdminDealApi(form);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to create deal",
      data: null,
    };
  }
};

export const updateAdminDealAction = async (id: string, form: AdminDealFormPayload) => {
  try {
    return await updateAdminDealApi(id, form);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update deal",
      data: null,
    };
  }
};

export const deleteAdminDealAction = async (id: string) => {
  try {
    return await deleteAdminDealApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to delete deal",
      data: null,
    };
  }
};

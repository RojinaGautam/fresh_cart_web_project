import {
  getAdminSupportTicketApi,
  getAdminSupportTicketsApi,
  updateAdminSupportStatusApi,
} from "../../api/admin/support";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getAdminSupportTicketsAction = async (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  try {
    return await getAdminSupportTicketsApi(params);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch support tickets",
      data: [],
      meta: { page: params.page, limit: params.limit, total: 0, totalPages: 0 },
    };
  }
};

export const getAdminSupportTicketAction = async (id: string) => {
  try {
    return await getAdminSupportTicketApi(id);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch support ticket",
      data: null,
    };
  }
};

export const updateAdminSupportStatusAction = async (id: string, status: string) => {
  try {
    return await updateAdminSupportStatusApi(id, status);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update ticket status",
      data: null,
    };
  }
};

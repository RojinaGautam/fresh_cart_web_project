import { adminSearchApi } from "../../api/admin/search";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const adminSearchAction = async (query: string) => {
  try {
    const response = await adminSearchApi(query);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Search failed",
    };
  }
};

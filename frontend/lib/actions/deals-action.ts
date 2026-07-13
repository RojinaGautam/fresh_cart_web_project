import { getDealsApi } from "../api/deals";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getDealsAction = async () => {
  try {
    const response = await getDealsApi();
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch deals",
    };
  }
};

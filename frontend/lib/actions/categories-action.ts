import { getCategoriesApi, getCategoryApi } from "../api/categories";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const getCategoriesAction = async () => {
  try {
    const response = await getCategoriesApi();
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch categories",
    };
  }
};

export const getCategoryAction = async (slug: string) => {
  try {
    const response = await getCategoryApi(slug);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to fetch category",
    };
  }
};

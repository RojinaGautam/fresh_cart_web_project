import {
  uploadAdminCategoryImageApi,
  uploadAdminDealImageApi,
  uploadAdminProductImageApi,
} from "../../api/admin/upload";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const uploadAdminCategoryImageAction = async (file: File) => {
  try {
    return await uploadAdminCategoryImageApi(file);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to upload image",
      data: null,
    };
  }
};

export const uploadAdminProductImageAction = async (file: File) => {
  try {
    return await uploadAdminProductImageApi(file);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to upload image",
      data: null,
    };
  }
};

export const uploadAdminDealImageAction = async (file: File) => {
  try {
    return await uploadAdminDealImageApi(file);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to upload image",
      data: null,
    };
  }
};

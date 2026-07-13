import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";

export type UploadImageResult = {
  path: string;
};

export const uploadAdminCategoryImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post(
    API_ENDPOINTS.ADMIN_UPLOAD_CATEGORY_IMAGE,
    formData,
  );
  return response.data;
};

export const uploadAdminProductImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post(
    API_ENDPOINTS.ADMIN_UPLOAD_PRODUCT_IMAGE,
    formData,
  );
  return response.data;
};

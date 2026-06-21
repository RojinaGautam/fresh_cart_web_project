import { loginApi, LoginPayload, registerApi, RegisterPayload, updateProfileApi, updatePasswordApi, UpdatePasswordPayload } from "../api/auth";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const registerAction = async (payload: RegisterPayload) => {
  try {
    const response = await registerApi(payload);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Registration failed",
    };
  }
};

export const loginAction = async (payload: LoginPayload) => {
  try {
    const response = await loginApi(payload);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Login failed",
    };
  }
};

export const updateProfileAction = async (formData: FormData) => {
  try {
    const response = await updateProfileApi(formData);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Profile update failed",
    };
  }
};

export const updatePasswordAction = async (payload: UpdatePasswordPayload) => {
  try {
    const response = await updatePasswordApi(payload);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Password update failed",
    };
  }
};

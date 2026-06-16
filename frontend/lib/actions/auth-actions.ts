import { loginApi, LoginPayload, registerApi, RegisterPayload } from "../api/auth";

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

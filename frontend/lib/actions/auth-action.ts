import {
  Address,
  loginApi,
  LoginPayload,
  registerApi,
  RegisterPayload,
  updateAddressesApi,
  updateProfileApi,
  updatePasswordApi,
  UpdatePasswordPayload,
  verifyEmailApi,
  resendVerificationApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../api/auth";

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

export const verifyEmailAction = async (email: string, otp: string) => {
  try {
    const response = await verifyEmailApi(email, otp);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Email verification failed",
    };
  }
};

export const resendVerificationAction = async (email: string) => {
  try {
    const response = await resendVerificationApi(email);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to resend verification email",
    };
  }
};

export const forgotPasswordAction = async (email: string) => {
  try {
    const response = await forgotPasswordApi(email);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to send password reset email",
    };
  }
};

export const resetPasswordAction = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  try {
    const response = await resetPasswordApi(email, otp, newPassword);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to reset password",
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

export const updateAddressesAction = async (
  addresses: Array<Omit<Address, "id"> & { id?: string }>,
) => {
  try {
    const response = await updateAddressesApi(addresses);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to update addresses",
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

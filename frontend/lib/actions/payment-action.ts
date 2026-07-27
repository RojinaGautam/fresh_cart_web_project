import { createPaymentIntentApi } from "../api/payments";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const createPaymentIntentAction = async () => {
  try {
    const response = await createPaymentIntentApi();
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to start card payment",
    };
  }
};

import { createSupportTicketApi, CreateSupportPayload } from "../api/support";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const createSupportTicketAction = async (
  payload: CreateSupportPayload,
) => {
  try {
    const response = await createSupportTicketApi(payload);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "Failed to submit your request",
    };
  }
};

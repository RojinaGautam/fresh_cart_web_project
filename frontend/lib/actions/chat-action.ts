import { ChatTurn, sendChatMessageApi } from "../api/chat";

type ApiError = {
  response?: {
    data?: {
      success: boolean;
      message: string;
    };
  };
};

export const sendChatMessageAction = async (message: string, history: ChatTurn[]) => {
  try {
    return await sendChatMessageApi(message, history);
  } catch (error) {
    const apiError = error as ApiError;
    return apiError.response?.data || {
      success: false,
      message: "The assistant is unavailable right now. Please try again.",
    };
  }
};

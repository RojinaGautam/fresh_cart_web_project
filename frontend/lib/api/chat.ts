import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";

export type ChatRole = "user" | "model";

export type ChatTurn = {
  role: ChatRole;
  text: string;
};

export const sendChatMessageApi = async (message: string, history: ChatTurn[]) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CHAT, {
    message,
    history,
  });
  return response.data;
};

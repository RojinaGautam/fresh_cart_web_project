import { z } from "zod";

export const ChatMessageDTO = z.object({
  role: z.enum(["user", "model"]),
  text: z.string().min(1).max(2000),
});

export type ChatMessageDTO = z.infer<typeof ChatMessageDTO>;

export const SendChatMessageDTO = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
  history: z.array(ChatMessageDTO).max(20, "Conversation is too long").optional().default([]),
});

export type SendChatMessageDTO = z.infer<typeof SendChatMessageDTO>;

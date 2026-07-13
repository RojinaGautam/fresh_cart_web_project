import { Request, Response } from "express";
import { z } from "zod";
import { SendChatMessageDTO } from "../dtos/chat.dto";
import { ChatService } from "../services/chat.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const chatService = new ChatService();

export class ChatController {
  async sendMessage(req: Request, res: Response) {
    try {
      const parsedMessage = SendChatMessageDTO.safeParse(req.body);

      if (!parsedMessage.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedMessage.error),
          400,
        );
      }

      const result = await chatService.sendMessage(parsedMessage.data);

      return ApiResponseHelper.success(res, result, "Reply generated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}

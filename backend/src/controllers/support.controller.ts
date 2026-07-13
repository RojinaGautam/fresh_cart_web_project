import { Request, Response } from "express";
import { z } from "zod";
import { CreateSupportDTO } from "../dtos/support.dto";
import { SupportService } from "../services/support.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const supportService = new SupportService();

export class SupportController {
  async createTicket(req: Request, res: Response) {
    try {
      const parsedTicket = CreateSupportDTO.safeParse(req.body);

      if (!parsedTicket.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedTicket.error),
          400,
        );
      }

      const ticket = await supportService.createTicket(parsedTicket.data);

      return ApiResponseHelper.success(
        res,
        ticket,
        "Support request submitted successfully",
        201,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}

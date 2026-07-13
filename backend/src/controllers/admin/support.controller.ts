import { Request, Response } from "express";
import { z } from "zod";
import { AdminUpdateSupportStatusDTO } from "../../dtos/support.dto";
import { AdminSupportService } from "../../services/admin-support.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminSupportService = new AdminSupportService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class AdminSupportController {
  async listTickets(req: Request, res: Response) {
    try {
      const { tickets, meta } = await adminSupportService.listTickets({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
      });

      return ApiResponseHelper.success(
        res,
        tickets,
        "Support tickets fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getTicket(req: Request, res: Response) {
    try {
      const ticket = await adminSupportService.getTicket(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        ticket,
        "Support ticket fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const parsedStatus = AdminUpdateSupportStatusDTO.safeParse(req.body);

      if (!parsedStatus.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedStatus.error),
          400,
        );
      }

      const ticket = await adminSupportService.updateStatus(
        getParamValue(req.params.id),
        parsedStatus.data,
      );

      return ApiResponseHelper.success(
        res,
        ticket,
        "Support ticket updated successfully",
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

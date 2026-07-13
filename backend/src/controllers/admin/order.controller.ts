import { Request, Response } from "express";
import { z } from "zod";
import { AdminUpdateOrderStatusDTO } from "../../dtos/order.dto";
import { AdminOrderService } from "../../services/admin-order.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminOrderService = new AdminOrderService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class AdminOrderController {
  async listOrders(req: Request, res: Response) {
    try {
      const { orders, meta } = await adminOrderService.listOrders({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
      });

      return ApiResponseHelper.success(
        res,
        orders,
        "Orders fetched successfully",
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

  async getOrder(req: Request, res: Response) {
    try {
      const order = await adminOrderService.getOrder(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        order,
        "Order fetched successfully",
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
      const parsedStatus = AdminUpdateOrderStatusDTO.safeParse(req.body);

      if (!parsedStatus.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedStatus.error),
          400,
        );
      }

      const order = await adminOrderService.updateStatus(
        getParamValue(req.params.id),
        parsedStatus.data,
      );

      return ApiResponseHelper.success(
        res,
        order,
        "Order status updated successfully",
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

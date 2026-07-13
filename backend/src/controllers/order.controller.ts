import { Response } from "express";
import { z } from "zod";
import { CreateOrderDTO } from "../dtos/order.dto";
import { AuthRequest } from "../middleware/auth.middleware";
import { OrderService } from "../services/order.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const orderService = new OrderService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class OrderController {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const parsedOrder = CreateOrderDTO.safeParse(req.body);

      if (!parsedOrder.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedOrder.error),
          400,
        );
      }

      const order = await orderService.createOrder(
        req.user!.id,
        parsedOrder.data,
      );

      return ApiResponseHelper.success(
        res,
        order,
        "Order placed successfully",
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

  async listOrders(req: AuthRequest, res: Response) {
    try {
      const { orders, meta } = await orderService.getOrdersForUser(
        req.user!.id,
        {
          page: req.query.page as string | undefined,
          limit: req.query.limit as string | undefined,
        },
      );

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

  async getOrder(req: AuthRequest, res: Response) {
    try {
      const order = await orderService.getOrderForUser(
        req.user!.id,
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
}

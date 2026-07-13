import mongoose from "mongoose";
import { AdminUpdateOrderStatusDTO } from "../dtos/order.dto";
import { HttpException } from "../exceptions/http-exception";
import { OrderMongoRepository } from "../repositories/order.repository";
import { UserMongoRepository } from "../repositories/user.repository";
import { sendOrderStatusEmail } from "../uttils/mailer.util";
import { OrderService, PublicOrder, PublicOrderListResult } from "./order.service";

const orderRepository = new OrderMongoRepository();
const userRepository = new UserMongoRepository();
const orderService = new OrderService();

const NOTIFIABLE_STATUSES = ["out_for_delivery", "delivered"] as const;

export type AdminOrderListParams = {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
};

export class AdminOrderService {
  private assertValidId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException(400, "Invalid order id");
    }
  }

  async listOrders(
    params: AdminOrderListParams,
  ): Promise<PublicOrderListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);

    const result = await orderRepository.getPaginated({
      page,
      limit,
      status: params.status,
      search: params.search,
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      orders: result.orders.map((order) => orderService.toPublicOrder(order)),
      meta: { page, limit, total: result.total, totalPages },
    };
  }

  async getOrder(id: string): Promise<PublicOrder> {
    this.assertValidId(id);

    const order = await orderRepository.getOrderById(id);

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    return orderService.toPublicOrder(order);
  }

  async updateStatus(
    id: string,
    data: AdminUpdateOrderStatusDTO,
  ): Promise<PublicOrder> {
    this.assertValidId(id);

    const updatedOrder = await orderRepository.update(id, {
      status: data.status,
    });

    if (!updatedOrder) {
      throw new HttpException(404, "Order not found");
    }

    if ((NOTIFIABLE_STATUSES as readonly string[]).includes(data.status)) {
      const user = await userRepository.getUserById(updatedOrder.userId.toString());

      if (user) {
        await sendOrderStatusEmail(
          user.email,
          user.fullName,
          updatedOrder.orderNumber,
          data.status as "out_for_delivery" | "delivered",
        );
      }
    }

    return orderService.toPublicOrder(updatedOrder);
  }
}

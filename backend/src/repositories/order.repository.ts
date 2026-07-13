import { IOrder, OrderModel } from "../models/order.model";

export type OrderListQuery = {
  page: number;
  limit: number;
  userId?: string;
  status?: string;
  search?: string;
};

export type PaginatedOrders = {
  orders: IOrder[];
  total: number;
};

export interface IOrderRepository {
  createOrder(order: Partial<IOrder>): Promise<IOrder>;
  getOrderById(id: string): Promise<IOrder | null>;
  getPaginated(query: OrderListQuery): Promise<PaginatedOrders>;
  update(id: string, order: Partial<IOrder>): Promise<IOrder | null>;
}

export class OrderMongoRepository implements IOrderRepository {
  async createOrder(order: Partial<IOrder>): Promise<IOrder> {
    const created = await OrderModel.create(order);
    return created;
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    const found = await OrderModel.findOne({ _id: id });
    return found;
  }

  async getPaginated(query: OrderListQuery): Promise<PaginatedOrders> {
    const skip = (query.page - 1) * query.limit;
    const search = query.search?.trim();

    const filter: Record<string, unknown> = {};

    if (query.userId) {
      filter.userId = query.userId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (search) {
      filter.orderNumber = { $regex: search, $options: "i" };
    }

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      OrderModel.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async update(id: string, order: Partial<IOrder>): Promise<IOrder | null> {
    const updated = await OrderModel.findByIdAndUpdate(id, order, {
      new: true,
    });
    return updated;
  }
}

import mongoose from "mongoose";
import { CreateOrderDTO } from "../dtos/order.dto";
import { HttpException } from "../exceptions/http-exception";
import { IOrder } from "../models/order.model";
import { IProduct } from "../models/product.model";
import { CartMongoRepository } from "../repositories/cart.repository";
import { OrderMongoRepository } from "../repositories/order.repository";
import { UserMongoRepository } from "../repositories/user.repository";
import { sendOrderConfirmationEmail } from "../uttils/mailer.util";
import { stripeClient } from "../uttils/stripe.util";

const orderRepository = new OrderMongoRepository();
const cartRepository = new CartMongoRepository();
const userRepository = new UserMongoRepository();

const DELIVERY_FEE = 3.5;
const FRESH_SAVINGS_DISCOUNT = 2;

export const calculateCartTotals = async (userId: string) => {
  const cart = await cartRepository.getByUserId(userId);

  if (!cart || cart.items.length === 0) {
    throw new HttpException(400, "Cart is empty");
  }

  const items = cart.items
    .filter((item) => item.product && typeof item.product === "object")
    .map((item) => {
      const product = item.product as unknown as IProduct;

      return {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      };
    });

  if (items.length === 0) {
    throw new HttpException(400, "Cart is empty");
  }

  const subtotal = Number(
    items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2),
  );
  const deliveryFee = DELIVERY_FEE;
  const discount = FRESH_SAVINGS_DISCOUNT;
  const total = Number(
    Math.max(subtotal + deliveryFee - discount, 0).toFixed(2),
  );

  return { items, subtotal, deliveryFee, discount, total };
};

export type PublicOrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type PublicOrder = {
  id: string;
  orderNumber: string;
  items: PublicOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PublicOrderListResult = {
  orders: PublicOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FC-${year}-${random}`;
};

export class OrderService {
  toPublicOrder(order: IOrder): PublicOrder {
    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      items: order.items.map((item) => ({
        product: item.product.toString(),
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discount: order.discount,
      total: order.total,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      deliveryDate: order.deliveryDate,
      deliveryTimeSlot: order.deliveryTimeSlot,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async createOrder(
    userId: string,
    data: CreateOrderDTO,
  ): Promise<PublicOrder> {
    const { items, subtotal, deliveryFee, discount, total } =
      await calculateCartTotals(userId);

    if (data.paymentMethod === "Card") {
      const paymentIntent = await stripeClient.paymentIntents
        .retrieve(data.paymentIntentId!)
        .catch(() => null);

      if (!paymentIntent) {
        throw new HttpException(400, "Invalid or unknown payment");
      }

      if (paymentIntent.status !== "succeeded") {
        throw new HttpException(400, "Payment has not been completed");
      }

      if (paymentIntent.amount !== Math.round(total * 100)) {
        throw new HttpException(400, "Payment amount does not match order total");
      }
    }

    const order = await orderRepository.createOrder({
      userId: new mongoose.Types.ObjectId(userId),
      orderNumber: generateOrderNumber(),
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentIntentId: data.paymentIntentId,
      deliveryDate: data.deliveryDate,
      deliveryTimeSlot: data.deliveryTimeSlot,
      status: "pending",
    } as Partial<IOrder>);

    await cartRepository.clear(userId);

    const user = await userRepository.getUserById(userId);

    if (user) {
      await sendOrderConfirmationEmail(user.email, user.fullName, order.orderNumber, total);
    }

    return this.toPublicOrder(order);
  }

  async getOrdersForUser(
    userId: string,
    params: { page?: string; limit?: string },
  ): Promise<PublicOrderListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);

    const result = await orderRepository.getPaginated({
      page,
      limit,
      userId,
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      orders: result.orders.map((order) => this.toPublicOrder(order)),
      meta: { page, limit, total: result.total, totalPages },
    };
  }

  async getOrderForUser(userId: string, orderId: string): Promise<PublicOrder> {
    if (!mongoose.isValidObjectId(orderId)) {
      throw new HttpException(400, "Invalid order id");
    }

    const order = await orderRepository.getOrderById(orderId);

    if (!order || order.userId.toString() !== userId) {
      throw new HttpException(404, "Order not found");
    }

    return this.toPublicOrder(order);
  }
}

import { z } from "zod";
import {
  DELIVERY_TIME_SLOTS,
  ORDER_STATUSES,
  PAYMENT_METHODS,
} from "../types/order.type";

export const CreateOrderDTO = z.object({
  shippingAddress: z.string().min(1, "Shipping address is required"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTimeSlot: z.enum(DELIVERY_TIME_SLOTS),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderDTO>;

export const AdminUpdateOrderStatusDTO = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type AdminUpdateOrderStatusDTO = z.infer<
  typeof AdminUpdateOrderStatusDTO
>;

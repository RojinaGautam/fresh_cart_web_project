import { z } from "zod";
import {
  DELIVERY_TIME_SLOTS,
  ORDER_STATUSES,
  PAYMENT_METHODS,
} from "../types/order.type";

const dateStringRegex = /^\d{4}-\d{2}-\d{2}$/;

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const CreateOrderDTO = z.object({
  shippingAddress: z.string().min(1, "Shipping address is required"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  deliveryDate: z
    .string()
    .regex(dateStringRegex, "Delivery date must be in YYYY-MM-DD format")
    .refine((value) => value >= getTodayDateString(), {
      message: "Delivery date must be today or a future date",
    }),
  deliveryTimeSlot: z.enum(DELIVERY_TIME_SLOTS),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderDTO>;

export const AdminUpdateOrderStatusDTO = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type AdminUpdateOrderStatusDTO = z.infer<
  typeof AdminUpdateOrderStatusDTO
>;

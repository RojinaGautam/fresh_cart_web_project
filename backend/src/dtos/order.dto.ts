import { z } from "zod";
import {
  DELIVERY_TIME_SLOTS,
  ORDER_STATUSES,
  PAYMENT_METHODS,
} from "../types/order.type";

const dateStringRegex = /^\d{4}-\d{2}-\d{2}$/;

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

export const CreateOrderDTO = z
  .object({
    shippingAddress: z.string().min(1, "Shipping address is required"),
    paymentMethod: z.enum(PAYMENT_METHODS),
    paymentIntentId: z.string().optional(),
    deliveryDate: z
      .string()
      .regex(dateStringRegex, "Delivery date must be in YYYY-MM-DD format")
      .refine((value) => value >= getTodayDateString(), {
        message: "Delivery date must be today or a future date",
      }),
    deliveryTimeSlot: z.enum(DELIVERY_TIME_SLOTS),
  })
  .refine(
    (data) => data.paymentMethod !== "Card" || Boolean(data.paymentIntentId),
    {
      message: "paymentIntentId is required for card payments",
      path: ["paymentIntentId"],
    },
  );

export type CreateOrderDTO = z.infer<typeof CreateOrderDTO>;

export const AdminUpdateOrderStatusDTO = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type AdminUpdateOrderStatusDTO = z.infer<
  typeof AdminUpdateOrderStatusDTO
>;

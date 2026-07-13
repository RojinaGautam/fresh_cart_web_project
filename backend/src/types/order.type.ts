import { z } from "zod";

export const OrderItemSchema = z.object({
  product: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const PAYMENT_METHODS = [
  "Card ending in 4242",
  "Cash on delivery",
  "FreshCart wallet",
] as const;

export const DELIVERY_TIME_SLOTS = [
  "09:00-11:00",
  "12:00-14:00",
  "16:00-18:00",
] as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const OrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  orderNumber: z.string().min(1, "Order number is required"),
  items: z.array(OrderItemSchema).min(1, "Order must have at least one item"),
  subtotal: z.number().min(0),
  deliveryFee: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(0),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTimeSlot: z.enum(DELIVERY_TIME_SLOTS),
  status: z.enum(ORDER_STATUSES).default("pending"),
});

export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type OrderType = z.infer<typeof OrderSchema>;

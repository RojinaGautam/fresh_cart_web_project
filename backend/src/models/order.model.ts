import mongoose, { Schema, Document } from "mongoose";
import {
  DELIVERY_TIME_SLOTS,
  ORDER_STATUSES,
  PAYMENT_METHODS,
} from "../types/order.type";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: (typeof PAYMENT_METHODS)[number];
  deliveryDate: string;
  deliveryTimeSlot: (typeof DELIVERY_TIME_SLOTS)[number];
  status: (typeof ORDER_STATUSES)[number];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemMongoSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

const OrderMongoSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [OrderItemMongoSchema],
      required: true,
    },

    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    shippingAddress: { type: String, required: true, trim: true },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },

    deliveryDate: { type: String, required: true },

    deliveryTimeSlot: {
      type: String,
      enum: DELIVERY_TIME_SLOTS,
      required: true,
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderMongoSchema);

import mongoose, { Schema, Document } from "mongoose";
import { DealType } from "../types/deal.type";

export interface IDeal extends Omit<DealType, "product">, Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DealMongoSchema: Schema<IDeal> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
    },

    badge: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const DealModel = mongoose.model<IDeal>("Deal", DealMongoSchema);

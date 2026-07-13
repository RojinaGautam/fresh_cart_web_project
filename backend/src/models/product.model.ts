import mongoose, { Schema, Document } from "mongoose";
import { ProductType } from "../types/product.type";

export interface IProduct
  extends Omit<ProductType, "category">,
    Document {
  _id: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductMongoSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
    },

    image: {
      type: String,
      required: true,
    },

    tag: {
      type: String,
      trim: true,
    },

    unit: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 100,
    },

    rating: {
      type: Number,
      default: 4.9,
    },

    reviewsCount: {
      type: Number,
      default: 128,
    },

    isFeatured: {
      type: Boolean,
      default: false,
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

ProductMongoSchema.index({ name: "text", description: "text" });

export const ProductModel = mongoose.model<IProduct>(
  "Product",
  ProductMongoSchema,
);

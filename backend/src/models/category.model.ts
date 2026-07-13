import mongoose, { Schema, Document } from "mongoose";
import { CategoryType } from "../types/category.type";

export interface ICategory extends CategoryType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryMongoSchema: Schema<ICategory> = new Schema(
  {
    title: {
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

    image: {
      type: String,
      required: true,
    },

    description: {
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

export const CategoryModel = mongoose.model<ICategory>(
  "Category",
  CategoryMongoSchema,
);

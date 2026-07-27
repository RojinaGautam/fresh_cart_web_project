import mongoose, { Schema, Document } from "mongoose";
import { MAX_RATING, MIN_RATING, ReviewType } from "../types/review.type";

export interface IReview
  extends Omit<ReviewType, "product" | "user">,
    Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewMongoSchema: Schema<IReview> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: MIN_RATING,
      max: MAX_RATING,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// A customer may only leave one review per product — editing an existing
// review is done through PATCH rather than by posting a second one.
ReviewMongoSchema.index({ product: 1, user: 1 }, { unique: true });

export const ReviewModel = mongoose.model<IReview>("Review", ReviewMongoSchema);

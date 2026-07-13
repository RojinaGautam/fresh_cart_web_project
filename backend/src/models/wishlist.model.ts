import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemMongoSchema = new Schema<IWishlistItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const WishlistMongoSchema: Schema<IWishlist> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [WishlistItemMongoSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const WishlistModel = mongoose.model<IWishlist>(
  "Wishlist",
  WishlistMongoSchema,
);

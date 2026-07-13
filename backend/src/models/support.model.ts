import mongoose, { Schema, Document } from "mongoose";
import { SUPPORT_STATUSES, SupportType } from "../types/support.type";

export interface ISupport extends SupportType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SupportMongoSchema: Schema<ISupport> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: SUPPORT_STATUSES,
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

export const SupportModel = mongoose.model<ISupport>(
  "Support",
  SupportMongoSchema,
);

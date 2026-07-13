import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "../types/user.type";

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  isVerified: boolean;
  emailVerificationOtp?: string | null;
  emailVerificationOtpExpires?: Date | null;
  passwordResetOtp?: string | null;
  passwordResetOtpExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserMongoSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOtp: {
      type: String,
      default: null,
    },

    emailVerificationOtpExpires: {
      type: Date,
      default: null,
    },

    passwordResetOtp: {
      type: String,
      default: null,
    },

    passwordResetOtpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUser>("User", UserMongoSchema);

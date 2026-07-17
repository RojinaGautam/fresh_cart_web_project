import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "../types/user.type";

export interface IAddress {
  _id: mongoose.Types.ObjectId;
  label: string;
  street: string;
  city: string;
}

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  isVerified: boolean;
  addresses: IAddress[];
  emailVerificationOtp?: string | null;
  emailVerificationOtpExpires?: Date | null;
  passwordResetOtp?: string | null;
  passwordResetOtpExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AddressMongoSchema = new Schema<IAddress>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    street: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true },
);

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

    addresses: {
      type: [AddressMongoSchema],
      default: [],
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

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { SECRET_KEY } from "../configs/constant";
import {
  CreateUserDTO,
  ForgotPasswordDTO,
  LoginUserDTO,
  ResendVerificationDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
  UpdateProfileDTO,
  VerifyEmailDTO,
} from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import { IAddress, IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../uttils/mailer.util";

const userRepository = new UserMongoRepository();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: number }).code === 11000;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export type PublicAddress = {
  id: string;
  label: string;
  street: string;
  city: string;
};

export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
  role: string;
  isVerified: boolean;
  addresses: PublicAddress[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserService {
  private toPublicUser(user: IUser): PublicUser {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage || null,
      role: user.role,
      isVerified: user.isVerified,
      addresses: (user.addresses || []).map((address) => ({
        id: address._id.toString(),
        label: address.label,
        street: address.street,
        city: address.city,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(userData: CreateUserDTO): Promise<PublicUser> {
    // Check existing email
    const existingEmail = await userRepository.getUserByEmail(userData.email);

    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const otp = generateOtp();

    let user: IUser;

    try {
      user = await userRepository.createUser({
        ...userData,
        password: hashedPassword,
        isVerified: false,
        emailVerificationOtp: otp,
        emailVerificationOtpExpires: new Date(Date.now() + OTP_EXPIRY_MS),
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new HttpException(400, "Email already exists");
      }

      throw error;
    }

    await sendVerificationEmail(user.email, user.fullName, otp);

    return this.toPublicUser(user);
  }

  async loginUser(loginData: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(loginData.email);

    if (!user) {
      throw new HttpException(400, "Invalid email");
    }

    const isPasswordValid = await bcryptjs.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid password");
    }

    if (!user.isVerified) {
      throw new HttpException(
        403,
        "Please verify your email before logging in",
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: "30d",
      },
    );

    return {
      user: this.toPublicUser(user),
      token,
    };
  }

  async verifyEmail(data: VerifyEmailDTO): Promise<PublicUser> {
    const user = await userRepository.getUserByEmail(data.email);

    if (!user) {
      throw new HttpException(404, "No account found with this email");
    }

    if (user.isVerified) {
      return this.toPublicUser(user);
    }

    if (
      !user.emailVerificationOtp ||
      user.emailVerificationOtp !== data.otp ||
      !user.emailVerificationOtpExpires ||
      user.emailVerificationOtpExpires.getTime() < Date.now()
    ) {
      throw new HttpException(400, "Invalid or expired verification code");
    }

    const updatedUser = await userRepository.update(user._id.toString(), {
      isVerified: true,
      emailVerificationOtp: null,
      emailVerificationOtpExpires: null,
    });

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    await sendWelcomeEmail(updatedUser.email, updatedUser.fullName);

    return this.toPublicUser(updatedUser);
  }

  async resendVerification(data: ResendVerificationDTO): Promise<{ message: string }> {
    const user = await userRepository.getUserByEmail(data.email);

    if (!user) {
      throw new HttpException(404, "No account found with this email");
    }

    if (user.isVerified) {
      return { message: "This account is already verified" };
    }

    const otp = generateOtp();

    await userRepository.update(user._id.toString(), {
      emailVerificationOtp: otp,
      emailVerificationOtpExpires: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    await sendVerificationEmail(user.email, user.fullName, otp);

    return { message: "Verification code sent" };
  }

  async forgotPassword(data: ForgotPasswordDTO): Promise<{ message: string }> {
    const user = await userRepository.getUserByEmail(data.email);

    if (!user) {
      throw new HttpException(404, "No account found with this email");
    }

    const otp = generateOtp();

    await userRepository.update(user._id.toString(), {
      passwordResetOtp: otp,
      passwordResetOtpExpires: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    await sendPasswordResetEmail(user.email, user.fullName, otp);

    return { message: "Password reset code sent" };
  }

  async resetPassword(data: ResetPasswordDTO): Promise<{ message: string }> {
    const user = await userRepository.getUserByEmail(data.email);

    if (!user) {
      throw new HttpException(404, "No account found with this email");
    }

    if (
      !user.passwordResetOtp ||
      user.passwordResetOtp !== data.otp ||
      !user.passwordResetOtpExpires ||
      user.passwordResetOtpExpires.getTime() < Date.now()
    ) {
      throw new HttpException(400, "Invalid or expired reset code");
    }

    const hashedPassword = await bcryptjs.hash(data.newPassword, 10);

    await userRepository.update(user._id.toString(), {
      password: hashedPassword,
      passwordResetOtp: null,
      passwordResetOtpExpires: null,
    });

    return { message: "Password reset successfully" };
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return this.toPublicUser(user);
  }

  async updateProfile(
    userId: string,
    profileData: UpdateProfileDTO,
  ): Promise<PublicUser> {
    const { addresses, ...rest } = profileData;
    const updatePayload: Partial<IUser> = { ...rest };

    if (addresses) {
      updatePayload.addresses = addresses.map(
        (address): IAddress => ({
          _id:
            address.id && mongoose.isValidObjectId(address.id)
              ? new mongoose.Types.ObjectId(address.id)
              : new mongoose.Types.ObjectId(),
          label: address.label,
          street: address.street,
          city: address.city,
        }),
      );
    }

    const updatedUser = await userRepository.update(userId, updatePayload);

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return this.toPublicUser(updatedUser);
  }

  async updatePassword(userId: string, passwordData: UpdatePasswordDTO) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isPasswordValid = await bcryptjs.compare(
      passwordData.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(400, "Current password is incorrect");
    }

    const hashedPassword = await bcryptjs.hash(passwordData.newPassword, 10);
    const updatedUser = await userRepository.update(userId, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return this.toPublicUser(updatedUser);
  }
}

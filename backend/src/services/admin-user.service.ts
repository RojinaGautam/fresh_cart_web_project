import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import {
  AdminCreateUserDTO,
  AdminUpdateUserDTO,
} from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import { PublicUser } from "./user.service";

const userRepository = new UserMongoRepository();

export type AdminUserListParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export type AdminUserListResult = {
  users: PublicUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class AdminUserService {
  private toPublicUser(user: IUser): PublicUser {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage || null,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private assertValidId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException(400, "Invalid user id");
    }
  }

  async listUsers(params: AdminUserListParams): Promise<AdminUserListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const search = params.search?.trim();
    const result = await userRepository.getPaginated({ page, limit, search });
    const totalPages = Math.ceil(result.total / limit);

    return {
      users: result.users.map((user) => this.toPublicUser(user)),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  async getUser(id: string): Promise<PublicUser> {
    this.assertValidId(id);

    const user = await userRepository.getUserById(id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return this.toPublicUser(user);
  }

  async createUser(userData: AdminCreateUserDTO): Promise<PublicUser> {
    const existingEmail = await userRepository.getUserByEmail(userData.email);

    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const createdUser = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
      // Users created by an admin are trusted and skip email verification.
      isVerified: true,
    });

    return this.toPublicUser(createdUser);
  }

  async updateUser(
    id: string,
    userData: AdminUpdateUserDTO,
  ): Promise<PublicUser> {
    this.assertValidId(id);

    const currentUser = await userRepository.getUserById(id);

    if (!currentUser) {
      throw new HttpException(404, "User not found");
    }

    if (userData.email) {
      const existingEmail = await userRepository.getUserByEmail(userData.email);

      if (existingEmail && existingEmail._id.toString() !== id) {
        throw new HttpException(400, "Email already exists");
      }
    }

    const updatePayload: Partial<IUser> = { ...userData };

    if (userData.password) {
      updatePayload.password = await bcryptjs.hash(userData.password, 10);
    } else {
      delete updatePayload.password;
    }

    const updatedUser = await userRepository.update(id, updatePayload);

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return this.toPublicUser(updatedUser);
  }

  async deleteUser(id: string): Promise<{ id: string }> {
    this.assertValidId(id);

    const deleted = await userRepository.delete(id);

    if (!deleted) {
      throw new HttpException(404, "User not found");
    }

    return { id };
  }
}

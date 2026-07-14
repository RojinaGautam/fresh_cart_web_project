import mongoose from "mongoose";
import { UserModel, IUser } from "../models/user.model";

export type UserListQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type PaginatedUsers = {
  users: IUser[];
  total: number;
};

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;

  // 5 common mandatory methods for a repository
  createUser(user: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  getPaginated(query: UserListQuery): Promise<PaginatedUsers>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export class UserMongoRepository implements IUserRepository {
  async getUserById(id: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ _id: id });
    return found;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const found = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });
    return found;
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const created = await UserModel.create(user);
    return created;
  }

  async getAll(): Promise<IUser[]> {
    const found = await UserModel.find();
    return found;
  }

  async getPaginated(query: UserListQuery): Promise<PaginatedUsers> {
    const skip = (query.page - 1) * query.limit;
    const search = query.search?.trim();
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            ...(mongoose.isValidObjectId(search)
              ? [{ _id: new mongoose.Types.ObjectId(search) }]
              : []),
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$_id" },
                  regex: search,
                  options: "i",
                },
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      UserModel.countDocuments(filter),
    ]);

    return { users, total };
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updated = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await UserModel.findByIdAndDelete(id);
    return !!deleted;
  }
}

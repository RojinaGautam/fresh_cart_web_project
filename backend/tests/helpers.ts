import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../src/configs/constant";
import { UserModel } from "../src/models/user.model";

type CreateTestUserOptions = {
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: "user" | "admin";
  isVerified?: boolean;
};

let userCounter = 0;

export const createTestUser = async (options: CreateTestUserOptions = {}) => {
  userCounter += 1;

  const password = options.password || "Test1234";
  const email = options.email || `test-user-${userCounter}@freshcart.test`;
  const hashed = await bcryptjs.hash(password, 10);

  const user = await UserModel.create({
    fullName: options.fullName || "Test User",
    email,
    phoneNumber: options.phoneNumber || "9800000000",
    password: hashed,
    role: options.role || "user",
    isVerified: options.isVerified ?? true,
  });

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "30d" },
  );

  return { user, token, password };
};

export const authHeader = (token: string) => `Bearer ${token}`;

import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";
import { UserModel } from "../models/user.model";

const dropStaleUserIndexes = async () => {
  try {
    const indexes = await UserModel.collection.indexes();
    const hasStaleUsernameIndex = indexes.some(
      (index) => index.name === "username_1",
    );

    if (hasStaleUsernameIndex) {
      await UserModel.collection.dropIndex("username_1");
      console.log("Dropped stale users.username index");
    }
  } catch (error) {
    console.warn("Unable to check stale user indexes:", error);
  }
};

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URL);
    await dropStaleUserIndexes();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

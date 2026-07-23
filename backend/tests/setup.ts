import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const baseUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/Fresh-Cart-db";

// Never let tests touch the real dev database — always suffix a dedicated
// test database name derived from the configured Mongo URL.
export const TEST_MONGODB_URL = baseUrl.replace(/\/([^/]+)$/, "/$1-test");

beforeAll(async () => {
  await mongoose.connect(TEST_MONGODB_URL);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

import dotenv from "dotenv";

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 4000;

export const MONGODB_URL: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/Fresh-Cart-db";

export const SECRET_KEY: string =
  process.env.SECRET_KEY || "merosecretkey";

export const FRONTEND_URL: string =
  process.env.FRONTEND_URL || "http://localhost:3000";

export const GOOGLE_SMTP_EMAIL: string = process.env.GOOGLE_SMTP_EMAIL || "";

export const GOOGLE_SMTP_PASSWORD: string =
  process.env.GOOGLE_SMTP_PASSWORD || "";

export const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "";
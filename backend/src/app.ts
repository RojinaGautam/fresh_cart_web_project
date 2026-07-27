import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import adminUserRoutes from "./routes/admin/user.route";
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.route";
import adminProductRoutes from "./routes/admin/product.route";
import categoryRoutes from "./routes/category.route";
import adminCategoryRoutes from "./routes/admin/category.route";
import dealRoutes from "./routes/deal.route";
import adminDealRoutes from "./routes/admin/deal.route";
import cartRoutes from "./routes/cart.route";
import wishlistRoutes from "./routes/wishlist.route";
import orderRoutes from "./routes/order.route";
import adminOrderRoutes from "./routes/admin/order.route";
import supportRoutes from "./routes/support.route";
import adminSupportRoutes from "./routes/admin/support.route";
import adminUploadRoutes from "./routes/admin/upload.route";
import adminSearchRoutes from "./routes/admin/search.route";
import chatRoutes from "./routes/chat.route";
import paymentRoutes from "./routes/payment.route";
import { productReviewRouter, reviewRouter } from "./routes/review.route";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "FreshCart API is running",
  });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/products/:productId/reviews", productReviewRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin/products", adminProductRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/admin/categories", adminCategoryRoutes);
app.use("/api/v1/deals", dealRoutes);
app.use("/api/v1/admin/deals", adminDealRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin/orders", adminOrderRoutes);
app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/admin/support", adminSupportRoutes);
app.use("/api/v1/admin/uploads", adminUploadRoutes);
app.use("/api/v1/admin/search", adminSearchRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;

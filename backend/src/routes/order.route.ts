import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.use(authenticateUser);

orderRouter.post("/", orderController.createOrder);
orderRouter.get("/", orderController.listOrders);
orderRouter.get("/:id", orderController.getOrder);

export default orderRouter;

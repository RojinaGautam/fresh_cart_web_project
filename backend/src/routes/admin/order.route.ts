import { Router } from "express";
import { AdminOrderController } from "../../controllers/admin/order.controller";
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware";

const adminOrderRouter = Router();
const adminOrderController = new AdminOrderController();

adminOrderRouter.use(authenticateUser, requireAdmin);

adminOrderRouter.get("/", adminOrderController.listOrders);
adminOrderRouter.get("/:id", adminOrderController.getOrder);
adminOrderRouter.patch("/:id/status", adminOrderController.updateStatus);

export default adminOrderRouter;

import { Router } from "express";
import { AdminSupportController } from "../../controllers/admin/support.controller";
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware";

const adminSupportRouter = Router();
const adminSupportController = new AdminSupportController();

adminSupportRouter.use(authenticateUser, requireAdmin);

adminSupportRouter.get("/", adminSupportController.listTickets);
adminSupportRouter.get("/:id", adminSupportController.getTicket);
adminSupportRouter.patch("/:id/status", adminSupportController.updateStatus);

export default adminSupportRouter;

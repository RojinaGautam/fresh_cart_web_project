import { Router } from "express";
import { AdminSearchController } from "../../controllers/admin/search.controller";
import {
  authenticateUser,
  requireAdmin,
} from "../../middleware/auth.middleware";

const adminSearchRouter = Router();
const adminSearchController = new AdminSearchController();

adminSearchRouter.use(authenticateUser, requireAdmin);

adminSearchRouter.get("/", adminSearchController.search);

export default adminSearchRouter;

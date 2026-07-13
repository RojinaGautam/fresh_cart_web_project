import { Router } from "express";
import { AdminDealController } from "../../controllers/admin/deal.controller";
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware";

const adminDealRouter = Router();
const adminDealController = new AdminDealController();

adminDealRouter.use(authenticateUser, requireAdmin);

adminDealRouter.get("/", adminDealController.listDeals);
adminDealRouter.get("/:id", adminDealController.getDeal);
adminDealRouter.post("/", adminDealController.createDeal);
adminDealRouter.patch("/:id", adminDealController.updateDeal);
adminDealRouter.put("/:id", adminDealController.updateDeal);
adminDealRouter.delete("/:id", adminDealController.deleteDeal);

export default adminDealRouter;

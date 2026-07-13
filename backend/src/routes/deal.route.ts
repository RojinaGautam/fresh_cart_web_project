import { Router } from "express";
import { DealController } from "../controllers/deal.controller";

const dealRouter = Router();
const dealController = new DealController();

dealRouter.get("/", dealController.listDeals);
dealRouter.get("/:id", dealController.getDealById);

export default dealRouter;

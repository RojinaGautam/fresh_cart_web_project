import { Router } from "express";
import { SupportController } from "../controllers/support.controller";

const supportRouter = Router();
const supportController = new SupportController();

supportRouter.post("/", supportController.createTicket);

export default supportRouter;

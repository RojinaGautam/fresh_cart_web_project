import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const paymentRouter = Router();
const paymentController = new PaymentController();

paymentRouter.use(authenticateUser);

paymentRouter.post("/create-intent", paymentController.createIntent);

export default paymentRouter;

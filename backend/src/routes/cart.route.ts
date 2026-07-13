import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.use(authenticateUser);

cartRouter.get("/", cartController.getCart);
cartRouter.post("/items", cartController.addItem);
cartRouter.patch("/items/:productId", cartController.updateItem);
cartRouter.delete("/items/:productId", cartController.removeItem);
cartRouter.delete("/", cartController.clearCart);

export default cartRouter;

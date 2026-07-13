import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const wishlistRouter = Router();
const wishlistController = new WishlistController();

wishlistRouter.use(authenticateUser);

wishlistRouter.get("/", wishlistController.getWishlist);
wishlistRouter.post("/:productId", wishlistController.addItem);
wishlistRouter.delete("/:productId", wishlistController.removeItem);

export default wishlistRouter;

import { Router } from "express";
import { AdminProductController } from "../../controllers/admin/product.controller";
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware";

const adminProductRouter = Router();
const adminProductController = new AdminProductController();

adminProductRouter.use(authenticateUser, requireAdmin);

adminProductRouter.get("/", adminProductController.listProducts);
adminProductRouter.get("/:id", adminProductController.getProduct);
adminProductRouter.post("/", adminProductController.createProduct);
adminProductRouter.patch("/:id", adminProductController.updateProduct);
adminProductRouter.put("/:id", adminProductController.updateProduct);
adminProductRouter.delete("/:id", adminProductController.deleteProduct);

export default adminProductRouter;

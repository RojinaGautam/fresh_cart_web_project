import { Router } from "express";
import { AdminCategoryController } from "../../controllers/admin/category.controller";
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware";

const adminCategoryRouter = Router();
const adminCategoryController = new AdminCategoryController();

adminCategoryRouter.use(authenticateUser, requireAdmin);

adminCategoryRouter.get("/", adminCategoryController.listCategories);
adminCategoryRouter.get("/:id", adminCategoryController.getCategory);
adminCategoryRouter.post("/", adminCategoryController.createCategory);
adminCategoryRouter.patch("/:id", adminCategoryController.updateCategory);
adminCategoryRouter.put("/:id", adminCategoryController.updateCategory);
adminCategoryRouter.delete("/:id", adminCategoryController.deleteCategory);

export default adminCategoryRouter;

import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get("/", categoryController.listCategories);
categoryRouter.get("/:slug", categoryController.getCategoryBySlug);

export default categoryRouter;

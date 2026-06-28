import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware";

const adminUserRouter = Router();
const adminUserController = new AdminUserController();

adminUserRouter.use(authenticateUser, requireAdmin);

adminUserRouter.get("/", adminUserController.listUsers);
adminUserRouter.get("/:id", adminUserController.getUser);
adminUserRouter.post("/", adminUserController.createUser);
adminUserRouter.patch("/:id", adminUserController.updateUser);
adminUserRouter.put("/:id", adminUserController.updateUser);
adminUserRouter.delete("/:id", adminUserController.deleteUser);

export default adminUserRouter;

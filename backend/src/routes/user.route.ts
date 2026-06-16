import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { uploadProfileImage } from "../middleware/upload.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/whoami", authenticateUser, userController.whoAmI);
userRouter.patch(
  "/update",
  authenticateUser,
  uploadProfileImage.single("profileImage"),
  userController.updateProfile,
);
userRouter.patch(
  "/update-password",
  authenticateUser,
  userController.updatePassword,
);

export default userRouter;

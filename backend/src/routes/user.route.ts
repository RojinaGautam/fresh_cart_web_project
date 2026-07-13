import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { uploadProfileImage } from "../middleware/upload.middleware";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const userRouter = Router();
const userController = new UserController();

const handleProfileUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadProfileImage.single("profileImage")(req, res, (error) => {
    if (error) {
      return ApiResponseHelper.error(res, error.message, 400);
    }

    next();
  });
};

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/verify-email", userController.verifyEmail);
userRouter.post("/resend-verification", userController.resendVerification);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.post("/reset-password", userController.resetPassword);
userRouter.get("/whoami", authenticateUser, userController.whoAmI);
userRouter.patch(
  "/update",
  authenticateUser,
  handleProfileUpload,
  userController.updateProfile,
);
userRouter.patch(
  "/update-password",
  authenticateUser,
  userController.updatePassword,
);

export default userRouter;

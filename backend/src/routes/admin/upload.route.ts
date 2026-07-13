import { NextFunction, Request, Response, Router } from "express";
import { AdminUploadController } from "../../controllers/admin/upload.controller";
import { authenticateUser, requireAdmin } from "../../middleware/auth.middleware";
import { uploadCategoryImage, uploadProductImage } from "../../middleware/upload.middleware";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminUploadRouter = Router();
const adminUploadController = new AdminUploadController();

adminUploadRouter.use(authenticateUser, requireAdmin);

const handleUpload = (uploader: ReturnType<typeof uploadCategoryImage.single>) =>
  (req: Request, res: Response, next: NextFunction) => {
    uploader(req, res, (error) => {
      if (error) {
        return ApiResponseHelper.error(res, error.message, 400);
      }

      next();
    });
  };

adminUploadRouter.post(
  "/category-image",
  handleUpload(uploadCategoryImage.single("image")),
  adminUploadController.uploadCategoryImage,
);

adminUploadRouter.post(
  "/product-image",
  handleUpload(uploadProductImage.single("image")),
  adminUploadController.uploadProductImage,
);

export default adminUploadRouter;

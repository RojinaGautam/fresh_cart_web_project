import { Request, Response } from "express";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

export class AdminUploadController {
  async uploadCategoryImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return ApiResponseHelper.error(res, "Image is required", 400);
      }

      const path = `/uploads/categories/${req.file.filename}`;

      return ApiResponseHelper.success(res, { path }, "Image uploaded successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async uploadProductImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return ApiResponseHelper.error(res, "Image is required", 400);
      }

      const path = `/uploads/products/${req.file.filename}`;

      return ApiResponseHelper.success(res, { path }, "Image uploaded successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async uploadDealImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return ApiResponseHelper.error(res, "Image is required", 400);
      }

      const path = `/uploads/deals/${req.file.filename}`;

      return ApiResponseHelper.success(res, { path }, "Image uploaded successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}

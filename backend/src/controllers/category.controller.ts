import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class CategoryController {
  async listCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.listCategories();

      return ApiResponseHelper.success(
        res,
        categories,
        "Categories fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getCategoryBySlug(req: Request, res: Response) {
    try {
      const category = await categoryService.getCategoryBySlug(
        getParamValue(req.params.slug),
      );

      return ApiResponseHelper.success(
        res,
        category,
        "Category fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}

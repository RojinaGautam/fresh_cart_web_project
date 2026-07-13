import { Request, Response } from "express";
import { z } from "zod";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../../dtos/category.dto";
import { AdminCategoryService } from "../../services/admin-category.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminCategoryService = new AdminCategoryService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class AdminCategoryController {
  async listCategories(req: Request, res: Response) {
    try {
      const { categories, meta } = await adminCategoryService.listCategories({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
        search: req.query.search as string | undefined,
      });

      return ApiResponseHelper.success(
        res,
        categories,
        "Categories fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getCategory(req: Request, res: Response) {
    try {
      const category = await adminCategoryService.getCategory(
        getParamValue(req.params.id),
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

  async createCategory(req: Request, res: Response) {
    try {
      const parsedCategory = CreateCategoryDTO.safeParse(req.body);

      if (!parsedCategory.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedCategory.error),
          400,
        );
      }

      const category = await adminCategoryService.createCategory(
        parsedCategory.data,
      );

      return ApiResponseHelper.success(
        res,
        category,
        "Category created successfully",
        201,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const parsedCategory = UpdateCategoryDTO.safeParse(req.body);

      if (!parsedCategory.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedCategory.error),
          400,
        );
      }

      const category = await adminCategoryService.updateCategory(
        getParamValue(req.params.id),
        parsedCategory.data,
      );

      return ApiResponseHelper.success(
        res,
        category,
        "Category updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const result = await adminCategoryService.deleteCategory(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Category deleted successfully",
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

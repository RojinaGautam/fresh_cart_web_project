import { Request, Response } from "express";
import { z } from "zod";
import { CreateProductDTO, UpdateProductDTO } from "../../dtos/product.dto";
import { AdminProductService } from "../../services/admin-product.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminProductService = new AdminProductService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class AdminProductController {
  async listProducts(req: Request, res: Response) {
    try {
      const { products, meta } = await adminProductService.listProducts({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        featured: req.query.featured as string | undefined,
      });

      return ApiResponseHelper.success(
        res,
        products,
        "Products fetched successfully",
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

  async getProduct(req: Request, res: Response) {
    try {
      const product = await adminProductService.getProduct(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        product,
        "Product fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const parsedProduct = CreateProductDTO.safeParse(req.body);

      if (!parsedProduct.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedProduct.error),
          400,
        );
      }

      const product = await adminProductService.createProduct(
        parsedProduct.data,
      );

      return ApiResponseHelper.success(
        res,
        product,
        "Product created successfully",
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

  async updateProduct(req: Request, res: Response) {
    try {
      const parsedProduct = UpdateProductDTO.safeParse(req.body);

      if (!parsedProduct.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedProduct.error),
          400,
        );
      }

      const product = await adminProductService.updateProduct(
        getParamValue(req.params.id),
        parsedProduct.data,
      );

      return ApiResponseHelper.success(
        res,
        product,
        "Product updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const result = await adminProductService.deleteProduct(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Product deleted successfully",
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

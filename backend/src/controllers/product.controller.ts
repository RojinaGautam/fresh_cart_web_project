import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class ProductController {
  async listProducts(req: Request, res: Response) {
    try {
      const { products, meta } = await productService.listProducts({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        sort: req.query.sort as string | undefined,
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

  async getProductBySlug(req: Request, res: Response) {
    try {
      const product = await productService.getProductBySlug(
        getParamValue(req.params.slug),
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
}

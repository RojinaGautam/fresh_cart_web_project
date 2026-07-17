import mongoose from "mongoose";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";
import { HttpException } from "../exceptions/http-exception";
import { IProduct } from "../models/product.model";
import { ProductMongoRepository } from "../repositories/product.repository";
import { CategoryMongoRepository } from "../repositories/category.repository";
import { ProductService, PublicProduct } from "./product.service";

const productRepository = new ProductMongoRepository();
const categoryRepository = new CategoryMongoRepository();
const productService = new ProductService();

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: number }).code === 11000;

export type AdminProductListParams = {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  featured?: string;
};

export type AdminProductListResult = {
  products: PublicProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class AdminProductService {
  private assertValidId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException(400, "Invalid product id");
    }
  }

  private async assertCategoryExists(categoryId: string) {
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new HttpException(400, "Invalid category id");
    }

    const category = await categoryRepository.getCategoryById(categoryId);

    if (!category) {
      throw new HttpException(400, "Category not found");
    }
  }

  async listProducts(
    params: AdminProductListParams,
  ): Promise<AdminProductListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);

    const result = await productRepository.getPaginated({
      page,
      limit,
      search: params.search,
      categoryId: params.category,
      featured: params.featured === "true",
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      products: result.products.map((product) =>
        productService.toPublicProduct(product),
      ),
      meta: { page, limit, total: result.total, totalPages },
    };
  }

  async getProduct(id: string): Promise<PublicProduct> {
    this.assertValidId(id);

    const product = await productRepository.getProductById(id);

    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    return productService.toPublicProduct(product);
  }

  async createProduct(
    productData: CreateProductDTO,
  ): Promise<PublicProduct> {
    await this.assertCategoryExists(productData.category);

    let product: IProduct;

    try {
      product = await productRepository.createProduct(
        productData as unknown as Partial<IProduct>,
      );
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new HttpException(400, "Slug already exists");
      }

      throw error;
    }

    const populated = await productRepository.getProductById(
      product._id.toString(),
    );

    return productService.toPublicProduct(populated as IProduct);
  }

  async updateProduct(
    id: string,
    productData: UpdateProductDTO,
  ): Promise<PublicProduct> {
    this.assertValidId(id);

    const currentProduct = await productRepository.getProductById(id);

    if (!currentProduct) {
      throw new HttpException(404, "Product not found");
    }

    if (productData.category) {
      await this.assertCategoryExists(productData.category);
    }

    let updatedProduct: IProduct | null;

    try {
      updatedProduct = await productRepository.update(
        id,
        productData as unknown as Partial<IProduct>,
      );
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new HttpException(400, "Slug already exists");
      }

      throw error;
    }

    if (!updatedProduct) {
      throw new HttpException(404, "Product not found");
    }

    return productService.toPublicProduct(updatedProduct);
  }

  async deleteProduct(id: string): Promise<{ id: string }> {
    this.assertValidId(id);

    const deleted = await productRepository.delete(id);

    if (!deleted) {
      throw new HttpException(404, "Product not found");
    }

    return { id };
  }
}

import mongoose from "mongoose";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { HttpException } from "../exceptions/http-exception";
import { ICategory } from "../models/category.model";
import { CategoryMongoRepository } from "../repositories/category.repository";
import { CategoryService, PublicCategory } from "./category.service";

const categoryRepository = new CategoryMongoRepository();
const categoryService = new CategoryService();

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: number }).code === 11000;

export type AdminCategoryListParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export type AdminCategoryListResult = {
  categories: PublicCategory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class AdminCategoryService {
  private assertValidId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException(400, "Invalid category id");
    }
  }

  async listCategories(
    params: AdminCategoryListParams,
  ): Promise<AdminCategoryListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const search = params.search?.trim();
    const result = await categoryRepository.getPaginated({
      page,
      limit,
      search,
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      categories: result.categories.map((category) =>
        categoryService.toPublicCategory(category),
      ),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  async getCategory(id: string): Promise<PublicCategory> {
    this.assertValidId(id);

    const category = await categoryRepository.getCategoryById(id);

    if (!category) {
      throw new HttpException(404, "Category not found");
    }

    return categoryService.toPublicCategory(category);
  }

  async createCategory(
    categoryData: CreateCategoryDTO,
  ): Promise<PublicCategory> {
    const existingSlug = await categoryRepository.getCategoryBySlug(
      categoryData.slug,
    );

    if (existingSlug) {
      throw new HttpException(400, "Slug already exists");
    }

    let category: ICategory;

    try {
      category = await categoryRepository.createCategory(categoryData);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new HttpException(400, "Slug already exists");
      }

      throw error;
    }

    return categoryService.toPublicCategory(category);
  }

  async updateCategory(
    id: string,
    categoryData: UpdateCategoryDTO,
  ): Promise<PublicCategory> {
    this.assertValidId(id);

    const currentCategory = await categoryRepository.getCategoryById(id);

    if (!currentCategory) {
      throw new HttpException(404, "Category not found");
    }

    if (categoryData.slug) {
      const existingSlug = await categoryRepository.getCategoryBySlug(
        categoryData.slug,
      );

      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new HttpException(400, "Slug already exists");
      }
    }

    const updatedCategory = await categoryRepository.update(id, categoryData);

    if (!updatedCategory) {
      throw new HttpException(404, "Category not found");
    }

    return categoryService.toPublicCategory(updatedCategory);
  }

  async deleteCategory(id: string): Promise<{ id: string }> {
    this.assertValidId(id);

    const deleted = await categoryRepository.delete(id);

    if (!deleted) {
      throw new HttpException(404, "Category not found");
    }

    return { id };
  }
}

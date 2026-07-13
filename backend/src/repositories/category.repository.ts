import mongoose from "mongoose";
import { CategoryModel, ICategory } from "../models/category.model";

export type CategoryListQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type PaginatedCategories = {
  categories: ICategory[];
  total: number;
};

export interface ICategoryRepository {
  getCategoryBySlug(slug: string): Promise<ICategory | null>;

  // 5 common mandatory methods for a repository
  createCategory(category: Partial<ICategory>): Promise<ICategory>;
  getCategoryById(id: string): Promise<ICategory | null>;
  getAll(): Promise<ICategory[]>;
  getPaginated(query: CategoryListQuery): Promise<PaginatedCategories>;
  update(id: string, category: Partial<ICategory>): Promise<ICategory | null>;
  delete(id: string): Promise<boolean>;
}

export class CategoryMongoRepository implements ICategoryRepository {
  async getCategoryById(id: string): Promise<ICategory | null> {
    const found = await CategoryModel.findOne({ _id: id });
    return found;
  }

  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    const found = await CategoryModel.findOne({ slug });
    return found;
  }

  async createCategory(category: Partial<ICategory>): Promise<ICategory> {
    const created = await CategoryModel.create(category);
    return created;
  }

  async getAll(): Promise<ICategory[]> {
    const found = await CategoryModel.find({ isActive: true }).sort({
      title: 1,
    });
    return found;
  }

  async getPaginated(query: CategoryListQuery): Promise<PaginatedCategories> {
    const skip = (query.page - 1) * query.limit;
    const search = query.search?.trim();
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [categories, total] = await Promise.all([
      CategoryModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      CategoryModel.countDocuments(filter),
    ]);

    return { categories, total };
  }

  async update(
    id: string,
    category: Partial<ICategory>,
  ): Promise<ICategory | null> {
    const updated = await CategoryModel.findByIdAndUpdate(id, category, {
      new: true,
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await CategoryModel.findByIdAndDelete(id);
    return !!deleted;
  }
}

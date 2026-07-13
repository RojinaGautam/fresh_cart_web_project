import { HttpException } from "../exceptions/http-exception";
import { ICategory } from "../models/category.model";
import { CategoryMongoRepository } from "../repositories/category.repository";

const categoryRepository = new CategoryMongoRepository();

export type PublicCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CategoryService {
  toPublicCategory(category: ICategory): PublicCategory {
    return {
      id: category._id.toString(),
      title: category.title,
      slug: category.slug,
      image: category.image,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async listCategories(): Promise<PublicCategory[]> {
    const categories = await categoryRepository.getAll();
    return categories.map((category) => this.toPublicCategory(category));
  }

  async getCategoryBySlug(slug: string): Promise<PublicCategory> {
    const category = await categoryRepository.getCategoryBySlug(slug);

    if (!category || !category.isActive) {
      throw new HttpException(404, "Category not found");
    }

    return this.toPublicCategory(category);
  }
}

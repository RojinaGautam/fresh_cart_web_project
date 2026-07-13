import mongoose from "mongoose";
import { IProduct, ProductModel } from "../models/product.model";

export type ProductListQuery = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  sort?: string;
  featured?: boolean;
  activeOnly?: boolean;
};

export type PaginatedProducts = {
  products: IProduct[];
  total: number;
};

const buildSort = (sort?: string): Record<string, 1 | -1> => {
  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "popular":
      return { reviewsCount: -1 };
    case "newest":
      return { createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
};

export interface IProductRepository {
  getProductBySlug(slug: string): Promise<IProduct | null>;

  // 5 common mandatory methods for a repository
  createProduct(product: Partial<IProduct>): Promise<IProduct>;
  getProductById(id: string): Promise<IProduct | null>;
  getAll(): Promise<IProduct[]>;
  getPaginated(query: ProductListQuery): Promise<PaginatedProducts>;
  update(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<boolean>;
}

export class ProductMongoRepository implements IProductRepository {
  async getProductById(id: string): Promise<IProduct | null> {
    const found = await ProductModel.findOne({ _id: id }).populate(
      "category",
      "title slug image",
    );
    return found;
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    const found = await ProductModel.findOne({ slug }).populate(
      "category",
      "title slug image",
    );
    return found;
  }

  async createProduct(product: Partial<IProduct>): Promise<IProduct> {
    const created = await ProductModel.create(product);
    return created;
  }

  async getAll(): Promise<IProduct[]> {
    const found = await ProductModel.find().populate(
      "category",
      "title slug image",
    );
    return found;
  }

  async getPaginated(query: ProductListQuery): Promise<PaginatedProducts> {
    const skip = (query.page - 1) * query.limit;
    const search = query.search?.trim();

    const filter: Record<string, unknown> = {};

    if (query.activeOnly) {
      filter.isActive = true;
    }

    if (query.categoryId) {
      filter.category = new mongoose.Types.ObjectId(query.categoryId);
    }

    if (query.featured) {
      filter.isFeatured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tag: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .populate("category", "title slug image")
        .sort(buildSort(query.sort))
        .skip(skip)
        .limit(query.limit),
      ProductModel.countDocuments(filter),
    ]);

    return { products, total };
  }

  async update(
    id: string,
    product: Partial<IProduct>,
  ): Promise<IProduct | null> {
    const updated = await ProductModel.findByIdAndUpdate(id, product, {
      new: true,
    }).populate("category", "title slug image");
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ProductModel.findByIdAndDelete(id);
    return !!deleted;
  }
}

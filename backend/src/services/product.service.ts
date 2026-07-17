import { HttpException } from "../exceptions/http-exception";
import { IProduct } from "../models/product.model";
import { ICategory } from "../models/category.model";
import {
  ProductListQuery,
  ProductMongoRepository,
} from "../repositories/product.repository";
import { CategoryMongoRepository } from "../repositories/category.repository";

const productRepository = new ProductMongoRepository();
const categoryRepository = new CategoryMongoRepository();

export type PublicProductCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: PublicProductCategory | null;
  price: number;
  image: string;
  tag?: string;
  unit: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PublicProductListResult = {
  products: PublicProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductListParams = {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  sort?: string;
  featured?: string;
};

export class ProductService {
  toPublicProduct(product: IProduct): PublicProduct {
    const category = product.category as unknown as ICategory | null;
    const isPopulatedCategory =
      category && typeof category === "object" && "title" in category;

    return {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: isPopulatedCategory
        ? {
            id: category._id.toString(),
            title: category.title,
            slug: category.slug,
            image: category.image,
          }
        : null,
      price: product.price,
      image: product.image,
      tag: product.tag,
      unit: product.unit || "",
      stock: product.stock,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async listProducts(
    params: ProductListParams,
  ): Promise<PublicProductListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);

    let categoryId: string | undefined;

    if (params.category) {
      const category = await categoryRepository.getCategoryBySlug(
        params.category,
      );

      if (!category) {
        return {
          products: [],
          meta: { page, limit, total: 0, totalPages: 0 },
        };
      }

      categoryId = category._id.toString();
    }

    const query: ProductListQuery = {
      page,
      limit,
      search: params.search,
      categoryId,
      sort: params.sort,
      featured: params.featured === "true",
      activeOnly: true,
    };

    const result = await productRepository.getPaginated(query);
    const totalPages = Math.ceil(result.total / limit);

    return {
      products: result.products.map((product) =>
        this.toPublicProduct(product),
      ),
      meta: { page, limit, total: result.total, totalPages },
    };
  }

  async getProductBySlug(slug: string): Promise<PublicProduct> {
    const product = await productRepository.getProductBySlug(slug);

    if (!product || !product.isActive) {
      throw new HttpException(404, "Product not found");
    }

    return this.toPublicProduct(product);
  }
}

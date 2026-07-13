import { HttpException } from "../exceptions/http-exception";
import { IDeal } from "../models/deal.model";
import { IProduct } from "../models/product.model";
import { ICategory } from "../models/category.model";
import { DealMongoRepository } from "../repositories/deal.repository";

const dealRepository = new DealMongoRepository();

export type PublicDealProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number;
  unit: string;
  category: { id: string; title: string; slug: string } | null;
};

export type PublicDeal = {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  badge: string;
  isActive: boolean;
  product: PublicDealProduct | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class DealService {
  toPublicDeal(deal: IDeal): PublicDeal {
    const product = deal.product as unknown as IProduct | null;
    const isPopulatedProduct =
      product && typeof product === "object" && "name" in product;

    let publicProduct: PublicDealProduct | null = null;

    if (isPopulatedProduct) {
      const category = product.category as unknown as ICategory | null;
      const isPopulatedCategory =
        category && typeof category === "object" && "title" in category;

      publicProduct = {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        oldPrice: product.oldPrice,
        unit: product.unit || "",
        category: isPopulatedCategory
          ? {
              id: category._id.toString(),
              title: category.title,
              slug: category.slug,
            }
          : null,
      };
    }

    return {
      id: deal._id.toString(),
      title: deal.title,
      description: deal.description,
      discountPercentage: deal.discountPercentage,
      badge: deal.badge,
      isActive: deal.isActive,
      product: publicProduct,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
    };
  }

  async listDeals(): Promise<PublicDeal[]> {
    const deals = await dealRepository.getAll();
    return deals.map((deal) => this.toPublicDeal(deal));
  }

  async getDealById(id: string): Promise<PublicDeal> {
    const deal = await dealRepository.getDealById(id);

    if (!deal || !deal.isActive) {
      throw new HttpException(404, "Deal not found");
    }

    return this.toPublicDeal(deal);
  }
}

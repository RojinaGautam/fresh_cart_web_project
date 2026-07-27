import mongoose from "mongoose";
import { CreateDealDTO, UpdateDealDTO } from "../dtos/deal.dto";
import { HttpException } from "../exceptions/http-exception";
import { IDeal } from "../models/deal.model";
import { DealMongoRepository } from "../repositories/deal.repository";
import { ProductMongoRepository } from "../repositories/product.repository";
import { DealService, PublicDeal } from "./deal.service";

const dealRepository = new DealMongoRepository();
const productRepository = new ProductMongoRepository();
const dealService = new DealService();

export type AdminDealListParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export type AdminDealListResult = {
  deals: PublicDeal[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class AdminDealService {
  private assertValidId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException(400, "Invalid deal id");
    }
  }

  private async assertProductExists(productId: string) {
    if (!mongoose.isValidObjectId(productId)) {
      throw new HttpException(400, "Invalid product id");
    }

    const product = await productRepository.getProductById(productId);

    if (!product) {
      throw new HttpException(400, "Product not found");
    }
  }

  async listDeals(params: AdminDealListParams): Promise<AdminDealListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);

    const result = await dealRepository.getPaginated({
      page,
      limit,
      search: params.search,
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      deals: result.deals.map((deal) => dealService.toPublicDeal(deal)),
      meta: { page, limit, total: result.total, totalPages },
    };
  }

  async getDeal(id: string): Promise<PublicDeal> {
    this.assertValidId(id);

    const deal = await dealRepository.getDealById(id);

    if (!deal) {
      throw new HttpException(404, "Deal not found");
    }

    return dealService.toPublicDeal(deal);
  }

  async createDeal(dealData: CreateDealDTO): Promise<PublicDeal> {
    await this.assertProductExists(dealData.product);

    const deal = await dealRepository.createDeal(
      dealData as unknown as Partial<IDeal>,
    );
    const populated = await dealRepository.getDealById(deal._id.toString());

    return dealService.toPublicDeal(populated as IDeal);
  }

  async updateDeal(id: string, dealData: UpdateDealDTO): Promise<PublicDeal> {
    this.assertValidId(id);

    const currentDeal = await dealRepository.getDealById(id);

    if (!currentDeal) {
      throw new HttpException(404, "Deal not found");
    }

    if (dealData.product) {
      await this.assertProductExists(dealData.product);
    }

    const updatedDeal = await dealRepository.update(
      id,
      dealData as unknown as Partial<IDeal>,
    );

    if (!updatedDeal) {
      throw new HttpException(404, "Deal not found");
    }

    return dealService.toPublicDeal(updatedDeal);
  }

  async deleteDeal(id: string): Promise<{ id: string }> {
    this.assertValidId(id);

    const deleted = await dealRepository.delete(id);

    if (!deleted) {
      throw new HttpException(404, "Deal not found");
    }

    return { id };
  }
}

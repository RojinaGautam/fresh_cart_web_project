import { DealModel, IDeal } from "../models/deal.model";

export type DealListQuery = {
  page: number;
  limit: number;
  activeOnly?: boolean;
};

export type PaginatedDeals = {
  deals: IDeal[];
  total: number;
};

const populateOptions = {
  path: "product",
  select: "name slug image price oldPrice unit category",
  populate: { path: "category", select: "title slug" },
};

export interface IDealRepository {
  // 5 common mandatory methods for a repository
  createDeal(deal: Partial<IDeal>): Promise<IDeal>;
  getDealById(id: string): Promise<IDeal | null>;
  getAll(): Promise<IDeal[]>;
  getPaginated(query: DealListQuery): Promise<PaginatedDeals>;
  update(id: string, deal: Partial<IDeal>): Promise<IDeal | null>;
  delete(id: string): Promise<boolean>;
}

export class DealMongoRepository implements IDealRepository {
  async getDealById(id: string): Promise<IDeal | null> {
    const found = await DealModel.findOne({ _id: id }).populate(
      populateOptions,
    );
    return found;
  }

  async createDeal(deal: Partial<IDeal>): Promise<IDeal> {
    const created = await DealModel.create(deal);
    return created;
  }

  async getAll(): Promise<IDeal[]> {
    const found = await DealModel.find({ isActive: true }).populate(
      populateOptions,
    );
    return found;
  }

  async getPaginated(query: DealListQuery): Promise<PaginatedDeals> {
    const skip = (query.page - 1) * query.limit;
    const filter = query.activeOnly ? { isActive: true } : {};

    const [deals, total] = await Promise.all([
      DealModel.find(filter)
        .populate(populateOptions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      DealModel.countDocuments(filter),
    ]);

    return { deals, total };
  }

  async update(id: string, deal: Partial<IDeal>): Promise<IDeal | null> {
    const updated = await DealModel.findByIdAndUpdate(id, deal, {
      new: true,
    }).populate(populateOptions);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await DealModel.findByIdAndDelete(id);
    return !!deleted;
  }
}

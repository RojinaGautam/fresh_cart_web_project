import { ISupport, SupportModel } from "../models/support.model";

export type SupportListQuery = {
  page: number;
  limit: number;
  status?: string;
  search?: string;
};

export type PaginatedSupport = {
  tickets: ISupport[];
  total: number;
};

export interface ISupportRepository {
  create(ticket: Partial<ISupport>): Promise<ISupport>;
  getById(id: string): Promise<ISupport | null>;
  getPaginated(query: SupportListQuery): Promise<PaginatedSupport>;
  update(id: string, ticket: Partial<ISupport>): Promise<ISupport | null>;
}

export class SupportMongoRepository implements ISupportRepository {
  async create(ticket: Partial<ISupport>): Promise<ISupport> {
    const created = await SupportModel.create(ticket);
    return created;
  }

  async getById(id: string): Promise<ISupport | null> {
    const found = await SupportModel.findOne({ _id: id });
    return found;
  }

  async getPaginated(query: SupportListQuery): Promise<PaginatedSupport> {
    const skip = (query.page - 1) * query.limit;
    const search = query.search?.trim();

    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const [tickets, total] = await Promise.all([
      SupportModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      SupportModel.countDocuments(filter),
    ]);

    return { tickets, total };
  }

  async update(
    id: string,
    ticket: Partial<ISupport>,
  ): Promise<ISupport | null> {
    const updated = await SupportModel.findByIdAndUpdate(id, ticket, {
      new: true,
    });
    return updated;
  }
}

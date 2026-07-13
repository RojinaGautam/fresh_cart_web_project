import mongoose from "mongoose";
import { AdminUpdateSupportStatusDTO } from "../dtos/support.dto";
import { HttpException } from "../exceptions/http-exception";
import { SupportMongoRepository } from "../repositories/support.repository";
import { PublicSupport, SupportService } from "./support.service";

const supportRepository = new SupportMongoRepository();
const supportService = new SupportService();

export type AdminSupportListParams = {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
};

export type AdminSupportListResult = {
  tickets: PublicSupport[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class AdminSupportService {
  private assertValidId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException(400, "Invalid ticket id");
    }
  }

  async listTickets(
    params: AdminSupportListParams,
  ): Promise<AdminSupportListResult> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);

    const result = await supportRepository.getPaginated({
      page,
      limit,
      status: params.status,
      search: params.search,
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      tickets: result.tickets.map((ticket) =>
        supportService.toPublicSupport(ticket),
      ),
      meta: { page, limit, total: result.total, totalPages },
    };
  }

  async getTicket(id: string): Promise<PublicSupport> {
    this.assertValidId(id);

    const ticket = await supportRepository.getById(id);

    if (!ticket) {
      throw new HttpException(404, "Ticket not found");
    }

    return supportService.toPublicSupport(ticket);
  }

  async updateStatus(
    id: string,
    data: AdminUpdateSupportStatusDTO,
  ): Promise<PublicSupport> {
    this.assertValidId(id);

    const updated = await supportRepository.update(id, {
      status: data.status,
    });

    if (!updated) {
      throw new HttpException(404, "Ticket not found");
    }

    return supportService.toPublicSupport(updated);
  }
}

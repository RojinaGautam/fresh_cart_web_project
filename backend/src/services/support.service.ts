import { CreateSupportDTO } from "../dtos/support.dto";
import { ISupport } from "../models/support.model";
import { SupportMongoRepository } from "../repositories/support.repository";

const supportRepository = new SupportMongoRepository();

export type PublicSupport = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class SupportService {
  toPublicSupport(ticket: ISupport): PublicSupport {
    return {
      id: ticket._id.toString(),
      name: ticket.name,
      email: ticket.email,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async createTicket(data: CreateSupportDTO): Promise<PublicSupport> {
    const ticket = await supportRepository.create({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: "open",
    } as Partial<ISupport>);

    return this.toPublicSupport(ticket);
  }
}

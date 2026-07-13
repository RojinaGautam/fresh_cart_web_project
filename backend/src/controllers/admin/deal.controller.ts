import { Request, Response } from "express";
import { z } from "zod";
import { CreateDealDTO, UpdateDealDTO } from "../../dtos/deal.dto";
import { AdminDealService } from "../../services/admin-deal.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminDealService = new AdminDealService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class AdminDealController {
  async listDeals(req: Request, res: Response) {
    try {
      const { deals, meta } = await adminDealService.listDeals({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
      });

      return ApiResponseHelper.success(
        res,
        deals,
        "Deals fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getDeal(req: Request, res: Response) {
    try {
      const deal = await adminDealService.getDeal(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        deal,
        "Deal fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createDeal(req: Request, res: Response) {
    try {
      const parsedDeal = CreateDealDTO.safeParse(req.body);

      if (!parsedDeal.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedDeal.error),
          400,
        );
      }

      const deal = await adminDealService.createDeal(parsedDeal.data);

      return ApiResponseHelper.success(
        res,
        deal,
        "Deal created successfully",
        201,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateDeal(req: Request, res: Response) {
    try {
      const parsedDeal = UpdateDealDTO.safeParse(req.body);

      if (!parsedDeal.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedDeal.error),
          400,
        );
      }

      const deal = await adminDealService.updateDeal(
        getParamValue(req.params.id),
        parsedDeal.data,
      );

      return ApiResponseHelper.success(
        res,
        deal,
        "Deal updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteDeal(req: Request, res: Response) {
    try {
      const result = await adminDealService.deleteDeal(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Deal deleted successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}

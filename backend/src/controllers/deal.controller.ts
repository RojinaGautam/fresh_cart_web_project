import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { DealService } from "../services/deal.service";

const dealService = new DealService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class DealController {
  async listDeals(req: Request, res: Response) {
    try {
      const deals = await dealService.listDeals();

      return ApiResponseHelper.success(
        res,
        deals,
        "Deals fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getDealById(req: Request, res: Response) {
    try {
      const deal = await dealService.getDealById(getParamValue(req.params.id));

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
}

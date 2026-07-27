import { Request, Response } from "express";
import { AdminSearchService } from "../../services/admin-search.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminSearchService = new AdminSearchService();

export class AdminSearchController {
  async search(req: Request, res: Response) {
    try {
      const result = await adminSearchService.search(
        (req.query.q as string | undefined) || "",
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Search completed successfully",
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

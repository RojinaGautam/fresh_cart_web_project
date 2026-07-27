import { Request, Response } from "express";
import { z } from "zod";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { AuthRequest } from "../middleware/auth.middleware";
import { ReviewService } from "../services/review.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const reviewService = new ReviewService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class ReviewController {
  async listForProduct(req: Request, res: Response) {
    try {
      const { reviews, summary, meta } =
        await reviewService.getReviewsForProduct(
          getParamValue(req.params.productId),
          {
            page: req.query.page as string | undefined,
            limit: req.query.limit as string | undefined,
          },
        );

      return ApiResponseHelper.success(
        res,
        { reviews, summary },
        "Reviews fetched successfully",
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

  async createReview(req: AuthRequest, res: Response) {
    try {
      const parsedReview = CreateReviewDTO.safeParse(req.body);

      if (!parsedReview.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedReview.error),
          400,
        );
      }

      const review = await reviewService.createReview(
        req.user!.id,
        getParamValue(req.params.productId),
        parsedReview.data,
      );

      return ApiResponseHelper.success(
        res,
        review,
        "Review posted successfully",
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

  async updateReview(req: AuthRequest, res: Response) {
    try {
      const parsedReview = UpdateReviewDTO.safeParse(req.body);

      if (!parsedReview.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedReview.error),
          400,
        );
      }

      const review = await reviewService.updateReview(
        req.user!.id,
        getParamValue(req.params.id),
        parsedReview.data,
      );

      return ApiResponseHelper.success(
        res,
        review,
        "Review updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteReview(req: AuthRequest, res: Response) {
    try {
      const result = await reviewService.deleteReview(
        req.user!.id,
        req.user!.role,
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Review deleted successfully",
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

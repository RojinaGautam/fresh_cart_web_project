import mongoose from "mongoose";
import { IReview, ReviewModel } from "../models/review.model";
import { ProductModel } from "../models/product.model";

export type ReviewListQuery = {
  page: number;
  limit: number;
  productId: string;
};

export type PaginatedReviews = {
  reviews: IReview[];
  total: number;
};

export type ProductRatingStats = {
  average: number;
  count: number;
};

export interface IReviewRepository {
  create(review: Partial<IReview>): Promise<IReview>;
  getById(id: string): Promise<IReview | null>;
  getByProduct(query: ReviewListQuery): Promise<PaginatedReviews>;
  getByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<IReview | null>;
  update(id: string, review: Partial<IReview>): Promise<IReview | null>;
  delete(id: string): Promise<IReview | null>;
  getProductStats(productId: string): Promise<ProductRatingStats>;
  syncProductRating(productId: string): Promise<ProductRatingStats>;
}

export class ReviewMongoRepository implements IReviewRepository {
  async create(review: Partial<IReview>): Promise<IReview> {
    const created = await ReviewModel.create(review);
    return created;
  }

  async getById(id: string): Promise<IReview | null> {
    const found = await ReviewModel.findById(id).populate({
      path: "user",
      select: "fullName profileImage",
    });
    return found;
  }

  async getByProduct(query: ReviewListQuery): Promise<PaginatedReviews> {
    const skip = (query.page - 1) * query.limit;
    const filter = { product: new mongoose.Types.ObjectId(query.productId) };

    const [reviews, total] = await Promise.all([
      ReviewModel.find(filter)
        .populate({ path: "user", select: "fullName profileImage" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      ReviewModel.countDocuments(filter),
    ]);

    return { reviews, total };
  }

  async getByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<IReview | null> {
    const found = await ReviewModel.findOne({
      user: userId,
      product: productId,
    }).populate({ path: "user", select: "fullName profileImage" });

    return found;
  }

  async update(
    id: string,
    review: Partial<IReview>,
  ): Promise<IReview | null> {
    const updated = await ReviewModel.findByIdAndUpdate(id, review, {
      new: true,
    }).populate({ path: "user", select: "fullName profileImage" });

    return updated;
  }

  async delete(id: string): Promise<IReview | null> {
    const deleted = await ReviewModel.findByIdAndDelete(id);
    return deleted;
  }

  async getProductStats(productId: string): Promise<ProductRatingStats> {
    const [stats] = await ReviewModel.aggregate<{
      average: number;
      count: number;
    }>([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (!stats) {
      return { average: 0, count: 0 };
    }

    return {
      // Keep one decimal place so the storefront can render "4.5" cleanly.
      average: Math.round(stats.average * 10) / 10,
      count: stats.count,
    };
  }

  // Product documents cache their own rating/reviewsCount so product lists do
  // not need to aggregate reviews on every request. Call this after any write
  // to keep that cache truthful.
  async syncProductRating(productId: string): Promise<ProductRatingStats> {
    const stats = await this.getProductStats(productId);

    await ProductModel.findByIdAndUpdate(productId, {
      rating: stats.average,
      reviewsCount: stats.count,
    });

    return stats;
  }
}

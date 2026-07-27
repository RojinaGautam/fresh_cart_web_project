import mongoose from "mongoose";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { HttpException } from "../exceptions/http-exception";
import { IReview } from "../models/review.model";
import { ProductMongoRepository } from "../repositories/product.repository";
import { ReviewMongoRepository } from "../repositories/review.repository";

const reviewRepository = new ReviewMongoRepository();
const productRepository = new ProductMongoRepository();

type PopulatedReviewUser = {
  _id: mongoose.Types.ObjectId;
  fullName?: string;
  profileImage?: string | null;
};

export type PublicReviewAuthor = {
  id: string;
  fullName: string;
  profileImage: string | null;
};

export type PublicReview = {
  id: string;
  product: string;
  rating: number;
  comment: string;
  author: PublicReviewAuthor | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PublicReviewListResult = {
  reviews: PublicReview[];
  summary: {
    average: number;
    count: number;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const assertValidObjectId = (id: string, label: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpException(400, `Invalid ${label} id`);
  }
};

export class ReviewService {
  toPublicReview(review: IReview): PublicReview {
    const populatedUser =
      review.user && typeof review.user === "object" && "fullName" in review.user
        ? (review.user as unknown as PopulatedReviewUser)
        : null;

    return {
      id: review._id.toString(),
      product: review.product.toString(),
      rating: review.rating,
      comment: review.comment,
      author: populatedUser
        ? {
            id: populatedUser._id.toString(),
            fullName: populatedUser.fullName || "FreshCart customer",
            profileImage: populatedUser.profileImage || null,
          }
        : null,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async getReviewsForProduct(
    productId: string,
    params: { page?: string; limit?: string },
  ): Promise<PublicReviewListResult> {
    assertValidObjectId(productId, "product");

    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);

    const [result, summary] = await Promise.all([
      reviewRepository.getByProduct({ page, limit, productId }),
      reviewRepository.getProductStats(productId),
    ]);

    const totalPages = Math.ceil(result.total / limit);

    return {
      reviews: result.reviews.map((review) => this.toPublicReview(review)),
      summary,
      meta: { page, limit, total: result.total, totalPages },
    };
  }

  async createReview(
    userId: string,
    productId: string,
    data: CreateReviewDTO,
  ): Promise<PublicReview> {
    assertValidObjectId(productId, "product");

    const product = await productRepository.getProductById(productId);

    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    const existing = await reviewRepository.getByUserAndProduct(
      userId,
      productId,
    );

    if (existing) {
      throw new HttpException(
        409,
        "You have already reviewed this product. Edit your existing review instead.",
      );
    }

    const created = await reviewRepository.create({
      product: new mongoose.Types.ObjectId(productId),
      user: new mongoose.Types.ObjectId(userId),
      rating: data.rating,
      comment: data.comment,
    } as Partial<IReview>);

    await reviewRepository.syncProductRating(productId);

    const populated = await reviewRepository.getById(created._id.toString());

    return this.toPublicReview(populated || created);
  }

  async updateReview(
    userId: string,
    reviewId: string,
    data: UpdateReviewDTO,
  ): Promise<PublicReview> {
    assertValidObjectId(reviewId, "review");

    const review = await reviewRepository.getById(reviewId);

    if (!review) {
      throw new HttpException(404, "Review not found");
    }

    if (this.getOwnerId(review) !== userId) {
      throw new HttpException(403, "You can only edit your own review");
    }

    const updated = await reviewRepository.update(reviewId, {
      rating: data.rating,
      comment: data.comment,
    } as Partial<IReview>);

    if (!updated) {
      throw new HttpException(404, "Review not found");
    }

    await reviewRepository.syncProductRating(updated.product.toString());

    return this.toPublicReview(updated);
  }

  async deleteReview(
    userId: string,
    userRole: string,
    reviewId: string,
  ): Promise<{ id: string }> {
    assertValidObjectId(reviewId, "review");

    const review = await reviewRepository.getById(reviewId);

    if (!review) {
      throw new HttpException(404, "Review not found");
    }

    // Customers may remove their own review; admins may remove any review as
    // a moderation action.
    if (userRole !== "admin" && this.getOwnerId(review) !== userId) {
      throw new HttpException(403, "You can only delete your own review");
    }

    const productId = review.product.toString();

    await reviewRepository.delete(reviewId);
    await reviewRepository.syncProductRating(productId);

    return { id: reviewId };
  }

  // `user` arrives populated from the repository, so read the id off the
  // populated document rather than assuming a raw ObjectId.
  private getOwnerId(review: IReview): string {
    const user = review.user as unknown as
      | PopulatedReviewUser
      | mongoose.Types.ObjectId;

    if (user && typeof user === "object" && "_id" in user) {
      return user._id.toString();
    }

    return String(user);
  }
}

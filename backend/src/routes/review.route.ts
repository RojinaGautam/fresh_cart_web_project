import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const reviewController = new ReviewController();

// Mounted at /api/v1/products/:productId/reviews — mergeParams keeps
// :productId readable from this router.
export const productReviewRouter = Router({ mergeParams: true });

productReviewRouter.get("/", reviewController.listForProduct);
productReviewRouter.post("/", authenticateUser, reviewController.createReview);

// Mounted at /api/v1/reviews — a review is edited or removed by its own id.
export const reviewRouter = Router();

reviewRouter.patch("/:id", authenticateUser, reviewController.updateReview);
reviewRouter.delete("/:id", authenticateUser, reviewController.deleteReview);

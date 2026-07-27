"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiStar, FiTrash2 } from "react-icons/fi";
import { Review, ReviewSummary } from "@/lib/api/reviews";
import {
  createProductReviewAction,
  deleteReviewAction,
  getProductReviewsAction,
  updateReviewAction,
} from "@/lib/actions/reviews-action";
import { useAuth } from "@/lib/contexts/AuthContext";

const RATING_VALUES = [1, 2, 3, 4, 5];

type ReviewListData = {
  reviews: Review[];
  summary: ReviewSummary;
};

const formatReviewDate = (value?: string) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function StarRating({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400">
      {RATING_VALUES.map((star) => (
        <FiStar
          key={star}
          size={size}
          fill={star <= Math.round(rating) ? "currentColor" : "none"}
          className={star <= Math.round(rating) ? "" : "text-slate-300"}
        />
      ))}
    </span>
  );
}

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {RATING_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label={`Rate ${star} out of 5`}
        >
          <FiStar
            size={22}
            fill={star <= active ? "currentColor" : "none"}
            className={star <= active ? "text-amber-400" : "text-slate-300"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({
  productId,
  onSummaryChange,
}: {
  productId: string;
  onSummaryChange?: (summary: ReviewSummary) => void;
}) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const myReview = reviews.find((review) => review.author?.id === user?.id);

  const applyResponse = useCallback(
    (response: { success: boolean; data?: ReviewListData }) => {
      if (!response.success || !response.data) return;

      setReviews(response.data.reviews);
      setSummary(response.data.summary);
      onSummaryChange?.(response.data.summary);
    },
    [onSummaryChange],
  );

  // Fetch on mount. The component is keyed by product id upstream, so this
  // runs once per product and `loading` already starts true.
  useEffect(() => {
    let cancelled = false;

    getProductReviewsAction(productId, { limit: 20 }).then((response) => {
      if (cancelled) return;

      applyResponse(response);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [productId, applyResponse]);

  // Used after a write, where the list should refresh without a spinner.
  const refreshReviews = async () => {
    applyResponse(await getProductReviewsAction(productId, { limit: 20 }));
  };

  const resetForm = () => {
    setEditingId("");
    setRating(5);
    setComment("");
    setFormError("");
  };

  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    setFormError("");
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!comment.trim()) {
      setFormError("Please write a short comment before posting.");
      return;
    }

    setSaving(true);
    const payload = { rating, comment: comment.trim() };
    const response = editingId
      ? await updateReviewAction(editingId, payload)
      : await createProductReviewAction(productId, payload);
    setSaving(false);

    if (!response.success) {
      setFormError(response.message || "Unable to save your review.");
      return;
    }

    resetForm();
    await refreshReviews();
  };

  const handleDelete = async (reviewId: string) => {
    const response = await deleteReviewAction(reviewId);

    if (!response.success) {
      setFormError(response.message || "Unable to delete your review.");
      return;
    }

    resetForm();
    await refreshReviews();
  };

  return (
    <section className="mt-7 rounded-3xl border border-[#d8e2d4] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef2ea] pb-4">
        <h3 className="text-lg font-semibold text-[#15251b]">
          Customer Reviews
        </h3>
        {summary.count > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating rating={summary.average} />
            <span className="text-sm font-semibold text-[#15251b]">
              {summary.average.toFixed(1)}
            </span>
            <span className="text-sm text-slate-500">
              ({summary.count} review{summary.count === 1 ? "" : "s"})
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-500">No reviews yet</span>
        )}
      </div>

      {user ? (
        <div className="mt-4 rounded-2xl border border-[#d8e2d4] bg-[#f8fbf5] p-4">
          <p className="text-sm font-semibold text-[#15251b]">
            {editingId
              ? "Edit your review"
              : myReview
                ? "You already reviewed this product"
                : "Write a review"}
          </p>

          {myReview && !editingId ? (
            <p className="mt-2 text-sm text-slate-600">
              Use the edit button on your review below to change it.
            </p>
          ) : (
            <>
              <div className="mt-3">
                <StarInput value={rating} onChange={setRating} />
              </div>

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="How was the quality, freshness, and delivery?"
                className="mt-3 w-full resize-none rounded-2xl border border-[#d8e2d4] bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              {formError && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {formError}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-full bg-[#0d9f43] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#087a35] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Post review"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-[#d8e2d4] px-5 py-2.5 text-sm font-semibold text-[#123821] transition hover:bg-[#eef2ea]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-[#d8e2d4] bg-[#f8fbf5] px-4 py-4 text-sm text-slate-600">
          Please log in to write a review.
        </p>
      )}

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-500">
            Be the first to review this product.
          </p>
        ) : (
          reviews.map((review) => {
            const isMine = review.author?.id === user?.id;

            return (
              <article
                key={review.id}
                className="rounded-2xl border border-[#eef2ea] bg-[#f8fbf5] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#15251b]">
                      {review.author?.fullName || "FreshCart customer"}
                      {isMine && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          You
                        </span>
                      )}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={review.rating} size={13} />
                      <span className="text-xs text-slate-400">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  {isMine && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => startEditing(review)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8e2d4] bg-white text-slate-500 transition hover:text-[#123821]"
                        aria-label="Edit your review"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(review.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8e2d4] bg-white text-red-500 transition hover:bg-red-50"
                        aria-label="Delete your review"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {review.comment}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

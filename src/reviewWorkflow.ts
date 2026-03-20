import type { ReviewItem } from "./types";

export function isAutoHandledReview(
  review: ReviewItem,
  autoSendPositive: boolean,
) {
  return autoSendPositive && review.status === "pending" && review.stars >= 4;
}

export function getReviewStatusLabel(
  review: ReviewItem,
  autoSendPositive = false,
) {
  if (isAutoHandledReview(review, autoSendPositive)) {
    return "auto-send";
  }

  if (review.status === "flagged") {
    return "owner call";
  }

  if (review.status === "responded") {
    return "sent";
  }

  return "draft ready";
}

export function normalizeReviewWorkflow(review: ReviewItem): ReviewItem {
  if (review.status === "responded" || review.status === "flagged") {
    return review;
  }

  if (review.stars <= 3) {
    return {
      ...review,
      status: "flagged",
    };
  }

  return review;
}

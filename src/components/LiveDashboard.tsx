import { useEffect, useState } from "react";
import type {
  AutomationMetric,
  LocationSummary,
  ReviewItem,
  ReviewStatus,
  ThemeCategory,
} from "../types";

type ReviewFilter = "all" | "actionable" | ReviewStatus;

interface LiveDashboardProps {
  location: LocationSummary;
  reviews: ReviewItem[];
  filteredReviews: ReviewItem[];
  themes: ThemeCategory[];
  metrics: AutomationMetric[];
  reviewFilter: ReviewFilter;
  editingReviewId: string | null;
  draftResponse: string;
  focusedReviewId: string | null;
  autoSendPositive: boolean;
  onReviewFilterChange: (filter: ReviewFilter) => void;
  onApproveReview: (reviewId: string) => void;
  onFlagReview: (reviewId: string) => void;
  onStartEditing: (review: ReviewItem) => void;
  onFocusReview: (reviewId: string) => void;
  onDraftResponseChange: (value: string) => void;
  onSaveDraft: () => void;
  onCancelEditing: () => void;
  onToggleAutoSend: () => void;
}

const filterLabels: { label: string; value: ReviewFilter }[] = [
  { label: "Waiting", value: "actionable" },
  { label: "Flagged", value: "flagged" },
  { label: "Responded", value: "responded" },
  { label: "All", value: "all" },
];

function isAutoHandledReview(review: ReviewItem, autoSendPositive: boolean) {
  return autoSendPositive && review.status === "pending" && review.stars >= 4;
}

function isThemeSpike(theme: ThemeCategory) {
  if (theme.previousValue === 0) {
    return theme.value >= 3;
  }

  return theme.value / theme.previousValue >= 3;
}

function reviewMatchesTheme(review: ReviewItem, theme: ThemeCategory) {
  return review.tags.some((tag) => theme.relatedTags.includes(tag));
}

export function LiveDashboard({
  location,
  reviews,
  filteredReviews,
  themes,
  metrics,
  reviewFilter,
  editingReviewId,
  draftResponse,
  focusedReviewId,
  autoSendPositive,
  onReviewFilterChange,
  onApproveReview,
  onFlagReview,
  onStartEditing,
  onFocusReview,
  onDraftResponseChange,
  onSaveDraft,
  onCancelEditing,
  onToggleAutoSend,
}: LiveDashboardProps) {
  const [highlightedThemeId, setHighlightedThemeId] = useState<string | null>(null);
  const waitingCount = reviews.filter(
    (review) =>
      review.status !== "responded" &&
      !isAutoHandledReview(review, autoSendPositive),
  ).length;
  const flaggedCount = reviews.filter((review) => review.status === "flagged").length;
  const respondedCount = reviews.filter(
    (review) => review.status === "responded",
  ).length;
  const autoSendEligibleCount = reviews.filter(
    (review) => review.status === "pending" && review.stars >= 4,
  ).length;
  const highlightedTheme =
    themes.find((theme) => theme.id === highlightedThemeId) ?? null;
  const isExternalLink = location.linkUrl.startsWith("http");

  useEffect(() => {
    setHighlightedThemeId(null);
  }, [location.id]);

  function handleFocusTheme(theme: ThemeCategory) {
    setHighlightedThemeId(theme.id);
    onReviewFilterChange("all");

    const matchingReview = reviews.find((review) => reviewMatchesTheme(review, theme));

    if (matchingReview) {
      onFocusReview(matchingReview.id);
      window.requestAnimationFrame(() => {
        document.getElementById(matchingReview.id)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-title-row">
        <div>
          <span className="eyebrow-label">Live location</span>
          <h3>{location.name}</h3>
        </div>
        <a
          href={location.linkUrl}
          {...(isExternalLink
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
        >
          {location.linkLabel}
        </a>
      </div>

      <div className="workspace-highlights">
        <article className="workspace-highlight-card">
          <span>Waiting now</span>
          <strong>{waitingCount}</strong>
          <p>Reviews that still need a reply or a personal call.</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Personal calls</span>
          <strong>{flaggedCount}</strong>
          <p>One-star or escalated reviews that should not be handled casually.</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Auto-send ready</span>
          <strong>{autoSendEligibleCount}</strong>
          <p>Positive reviews that can skip manual review when the rule is on.</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Handled</span>
          <strong>{respondedCount}</strong>
          <p>Public replies that are already out the door for this location.</p>
        </article>
      </div>

      <section className="panel queue-settings-card">
        <div className="queue-settings-copy">
          <span className="eyebrow-label">Automation rule</span>
          <h4>4-5 star reviews can skip Jay's queue.</h4>
          <p>
            Keep the owner's time for recoveries. Positive reviews can move
            straight through once the tone is approved.
          </p>
        </div>
        <button
          type="button"
          className={`toggle-chip ${autoSendPositive ? "toggle-chip-active" : ""}`}
          onClick={onToggleAutoSend}
          aria-pressed={autoSendPositive}
        >
          Auto-send {autoSendPositive ? "on" : "off"}
        </button>
      </section>

      <section className="panel queue-panel">
        <div className="panel-header queue-panel-header">
          <div>
            <span className="eyebrow-label">Review queue</span>
            <h4>Clear the work to zero</h4>
          </div>
          <div className="filter-row" role="tablist" aria-label="Review filters">
            {filterLabels.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`filter-chip ${
                  reviewFilter === filter.value ? "filter-chip-active" : ""
                }`}
                onClick={() => onReviewFilterChange(filter.value)}
                aria-pressed={reviewFilter === filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {highlightedTheme ? (
          <div className="theme-focus-banner">
            <strong>Showing reviews tied to "{highlightedTheme.label}"</strong>
            <button
              type="button"
              className="secondary-link-button"
              onClick={() => setHighlightedThemeId(null)}
            >
              Clear
            </button>
          </div>
        ) : null}

        <div className="review-list">
          {filteredReviews.map((review) => {
            const isEditing = editingReviewId === review.id;
            const isFocused = focusedReviewId === review.id;
            const isThemeMatch = highlightedTheme
              ? reviewMatchesTheme(review, highlightedTheme)
              : false;
            const isAutoHandled = isAutoHandledReview(review, autoSendPositive);
            const statusClassName = isAutoHandled ? "auto-send" : review.status;

            return (
              <article
                key={review.id}
                id={review.id}
                className={`review-card review-${review.sentiment} ${
                  isFocused ? "review-card-focused" : ""
                } ${isThemeMatch ? "review-card-theme-match" : ""}`}
                onClick={() => onFocusReview(review.id)}
              >
                <div className="review-card-top">
                  <div className="review-meta">
                    <div>
                      <strong>{review.author}</strong>
                      <p>
                        {review.stars} / 5 on {review.dateLabel}
                      </p>
                    </div>
                    <span className={`status-pill status-${statusClassName}`}>
                      {isAutoHandled
                        ? "auto-send"
                        : review.status === "flagged"
                        ? "personal call"
                        : review.status === "responded"
                          ? "sent"
                          : "waiting"}
                    </span>
                  </div>

                  <div className="tag-row">
                    {review.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="review-snippet">{review.snippet}</p>

                <div className="response-panel">
                  <div className="response-header">
                    <span className="eyebrow-label">AI draft ready</span>
                    {review.stars === 1 ? (
                      <span className="priority-label">Personal call recommended</span>
                    ) : null}
                  </div>

                  {isEditing ? (
                    <textarea
                      value={draftResponse}
                      onChange={(event) =>
                        onDraftResponseChange(event.target.value)
                      }
                      aria-label={`Edit response for ${review.author}`}
                    />
                  ) : (
                    <p>{review.aiResponse}</p>
                  )}

                  <div className="action-row">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="action-button action-primary"
                          onClick={onSaveDraft}
                        >
                          Save draft
                        </button>
                        <button
                          type="button"
                          className="action-button"
                          onClick={onCancelEditing}
                        >
                          Cancel
                        </button>
                      </>
                    ) : review.status === "responded" ? (
                      <span className="response-status-note">
                        Response already posted publicly.
                      </span>
                    ) : isAutoHandled ? (
                      <>
                        <span className="response-status-note">
                          Auto-send is on for 4-5 star reviews, so this one skips the
                          nightly queue unless you want to edit it.
                        </span>
                        <button
                          type="button"
                          className="action-button"
                          onClick={() => onStartEditing(review)}
                        >
                          Edit anyway
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="action-button action-primary"
                          onClick={() => onApproveReview(review.id)}
                        >
                          Approve &amp; send
                        </button>
                        <button
                          type="button"
                          className="action-button"
                          onClick={() => onStartEditing(review)}
                        >
                          Edit
                        </button>
                        {(review.sentiment !== "positive" || review.stars === 1) && (
                          <button
                            type="button"
                            className="action-button"
                            onClick={() => onFlagReview(review.id)}
                          >
                            {review.status === "flagged"
                              ? "Personal call flagged"
                              : "Flag for personal call"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {filteredReviews.length === 0 ? (
            <article className="review-card empty-state">
              <strong>Nothing is sitting in this view.</strong>
              <p>Switch filters or move to another location to keep the queue moving.</p>
            </article>
          ) : null}
        </div>
      </section>

      <div className="workspace-lower-grid">
        <section className="panel theme-alert-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow-label">Operational alerts</span>
              <h4>What guests keep bringing up</h4>
            </div>
          </div>

          <div className="theme-alert-list">
            {themes.map((theme) => {
              const spike = isThemeSpike(theme);
              const directionLabel =
                theme.value >= theme.previousValue
                  ? `up from ${theme.previousValue} last week`
                  : `down from ${theme.previousValue} last week`;

              return (
                <article
                  key={theme.id}
                  className={`theme-alert-card ${
                    spike ? "theme-alert-card-spike" : ""
                  }`}
                >
                  <div className="theme-alert-top">
                    <strong>
                      {theme.value} reviews mentioned "{theme.label}" this week
                    </strong>
                    {spike ? <span className="spike-badge">spike</span> : null}
                  </div>
                  <p>{directionLabel}. Treat this like an ops issue, not a chart.</p>
                  <button
                    type="button"
                    className="secondary-link-button"
                    onClick={() => handleFocusTheme(theme)}
                  >
                    See all {theme.value}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel analytics-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow-label">Analytics</span>
              <h4>Context after the queue</h4>
            </div>
          </div>

          <div className="metric-stack">
            {metrics.map((metric) => (
              <article key={metric.id} className="metric-card">
                <div className="metric-card-top">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
                <p>{metric.sublabel}</p>
                <div className="metric-progress-track">
                  <div
                    className="metric-progress-fill"
                    style={{ width: `${metric.progress * 100}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

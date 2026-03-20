import { useEffect, useState } from "react";
import { MobileComposerSheet } from "./MobileComposerSheet";
import { getReviewStatusLabel, isAutoHandledReview } from "../reviewWorkflow";
import type {
  AutomationMetric,
  LocationSummary,
  ReviewItem,
  ReviewStatus,
  ThemeCategory,
} from "../types";

type ReviewFilter = "all" | "actionable" | ReviewStatus;
type DraftStatus = "idle" | "editing" | "saved";

interface LiveDashboardProps {
  location: LocationSummary;
  reviews: ReviewItem[];
  filteredReviews: ReviewItem[];
  themes: ThemeCategory[];
  metrics: AutomationMetric[];
  reviewFilter: ReviewFilter;
  editingReviewId: string | null;
  draftResponse: string;
  draftStatus: DraftStatus;
  focusedReviewId: string | null;
  autoSendPositive: boolean;
  isCompactViewport: boolean;
  showHeader?: boolean;
  onReviewFilterChange: (filter: ReviewFilter) => void;
  onApproveReview: (reviewId: string, responseOverride?: string) => void;
  onFlagReview: (reviewId: string) => void;
  onStartEditing: (review: ReviewItem) => void;
  onFocusReview: (reviewId: string) => void;
  onDraftResponseChange: (value: string) => void;
  onSaveDraft: (closeEditor?: boolean) => void;
  onCancelEditing: () => void;
  onToggleAutoSend: () => void;
}

const filterLabels: { label: string; value: ReviewFilter }[] = [
  { label: "Open", value: "actionable" },
  { label: "Owner calls", value: "flagged" },
  { label: "Responded", value: "responded" },
  { label: "All", value: "all" },
];

function isThemeSpike(theme: ThemeCategory) {
  if (theme.previousValue === 0) {
    return theme.value >= 3;
  }

  return theme.value / theme.previousValue >= 3;
}

function reviewMatchesTheme(review: ReviewItem, theme: ThemeCategory) {
  return review.tags.some((tag) => theme.relatedTags.includes(tag));
}

function getDraftPreview(copy: string) {
  const sentence = copy.split(". ")[0] ?? copy;
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

function getThemeDeltaLabel(theme: ThemeCategory) {
  const delta = theme.value - theme.previousValue;

  if (delta === 0) {
    return "Flat vs last week";
  }

  return `${delta > 0 ? "+" : ""}${delta} vs last week`;
}

function getNextStep(openCount: number, flaggedCount: number) {
  if (flaggedCount > 0) {
    return {
      title: `${flaggedCount} owner call${flaggedCount === 1 ? "" : "s"} come first`,
      detail:
        "Start with the recovery work, then move through drafted replies once the owner callbacks are covered.",
    };
  }

  if (openCount > 0) {
    return {
      title: `${openCount} drafted repl${openCount === 1 ? "y" : "ies"} can clear the queue`,
      detail: "Approve the drafts, get the inbox to zero, and leave analytics for after service.",
    };
  }

  return {
    title: "Queue clear",
    detail: "Nothing needs action here right now. Use the time for launch readiness or theme checks.",
  };
}

function getWhyThisMatters(review: ReviewItem) {
  if (review.status === "flagged" || review.stars === 1) {
    return "Guest expects manager recovery";
  }

  if (review.sentiment === "mixed") {
    return "Reply quickly while sentiment is still recoverable";
  }

  return null;
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
  draftStatus,
  focusedReviewId,
  autoSendPositive,
  isCompactViewport,
  showHeader = true,
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
  const [expandedReviewIds, setExpandedReviewIds] = useState<Record<string, boolean>>({});
  const [expandedDraftIds, setExpandedDraftIds] = useState<Record<string, boolean>>({});
  const [metricsExpanded, setMetricsExpanded] = useState(!isCompactViewport);
  const openCount = reviews.filter(
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
  const editingReview =
    editingReviewId !== null
      ? reviews.find((review) => review.id === editingReviewId) ?? null
      : null;
  const isExternalLink = location.linkUrl.startsWith("http");
  const nextStep = getNextStep(openCount, flaggedCount);

  useEffect(() => {
    setHighlightedThemeId(null);
    setExpandedReviewIds({});
    setExpandedDraftIds({});
  }, [location.id]);

  useEffect(() => {
    setMetricsExpanded(!isCompactViewport);
  }, [isCompactViewport, location.id]);

  function toggleExpandedReview(reviewId: string) {
    setExpandedReviewIds((current) => ({
      ...current,
      [reviewId]: !current[reviewId],
    }));
  }

  function toggleExpandedDraft(reviewId: string) {
    setExpandedDraftIds((current) => ({
      ...current,
      [reviewId]: !current[reviewId],
    }));
  }

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
      {showHeader ? (
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
      ) : null}

      <div className="workspace-highlights">
        <article className="workspace-highlight-card">
          <span>Open now</span>
          <strong>{openCount}</strong>
          <p>{isCompactViewport ? "Reviews left to clear" : "Reviews still open for a reply or owner follow-up."}</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Owner calls</span>
          <strong>{flaggedCount}</strong>
          <p>{isCompactViewport ? "Recovery items first" : "Escalated reviews that should not be handled casually."}</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Auto-send ready</span>
          <strong>{autoSendEligibleCount}</strong>
          <p>{isCompactViewport ? "Positive reviews eligible now" : "Positive reviews that can skip manual review when the rule is on."}</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Handled</span>
          <strong>{respondedCount}</strong>
          <p>{isCompactViewport ? "Replies already posted" : "Public replies that are already out the door for this location."}</p>
        </article>
      </div>

      {isCompactViewport ? (
        <section className="panel mobile-next-step-card">
          <div className="mobile-next-step-copy">
            <span className="eyebrow-label">Tonight&apos;s next move</span>
            <h4>{nextStep.title}</h4>
            <p>{nextStep.detail}</p>
          </div>
          <div className="mobile-next-step-footer">
            <span>4-5 star auto-send</span>
            <button
              type="button"
              className={`toggle-chip ${autoSendPositive ? "toggle-chip-active" : ""}`}
              onClick={onToggleAutoSend}
              aria-pressed={autoSendPositive}
            >
              {autoSendPositive ? "Auto-send on" : "Auto-send off"}
            </button>
          </div>
        </section>
      ) : (
        <section className="panel queue-settings-card">
          <div className="queue-settings-copy">
            <span className="eyebrow-label">Automation rule</span>
            <h4>4-5 star reviews can skip Jay&apos;s queue.</h4>
            <p>
              Keep the owner&apos;s time for recoveries. Positive reviews can move
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
      )}

      <section className="panel queue-panel">
        <div
          className={`panel-header queue-panel-header ${
            isCompactViewport ? "queue-panel-header-compact" : ""
          }`}
        >
          <div>
            <span className="eyebrow-label">Review queue</span>
            <h4>Clear the work to zero</h4>
          </div>
          <div
            className={`filter-row ${isCompactViewport ? "filter-row-sticky" : ""}`}
            role="tablist"
            aria-label="Review filters"
          >
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
            const snippetExpanded = expandedReviewIds[review.id] ?? false;
            const draftExpanded = expandedDraftIds[review.id] ?? false;
            const whyThisMatters = getWhyThisMatters(review);

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
                  <div className="review-card-status-row">
                    <span className={`status-pill status-${statusClassName}`}>
                      {getReviewStatusLabel(review, autoSendPositive)}
                    </span>
                    <span className="review-stars-label">
                      {review.stars} star{review.stars === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="review-card-author-row">
                    <strong>{review.author}</strong>
                    <p>{review.dateLabel}</p>
                  </div>

                  <div className="tag-row">
                    {review.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {whyThisMatters ? (
                  <div className="review-why-card">
                    <span className="eyebrow-label">Why this matters</span>
                    <p>{whyThisMatters}</p>
                  </div>
                ) : null}

                <p
                  className={`review-snippet ${
                    !snippetExpanded ? "review-snippet-clamped" : ""
                  }`}
                >
                  {review.snippet}
                </p>

                {review.snippet.length > 120 ? (
                  <button
                    type="button"
                    className="secondary-link-button review-inline-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleExpandedReview(review.id);
                    }}
                  >
                    {snippetExpanded ? "Show less" : "Read more"}
                  </button>
                ) : null}

                <div className="response-panel">
                  <div className="response-header">
                    <div>
                      <span className="eyebrow-label">AI draft ready</span>
                      {review.stars === 1 ? (
                        <span className="priority-label">Manager recovery likely</span>
                      ) : null}
                    </div>
                    {!isEditing || !isCompactViewport ? (
                      <button
                        type="button"
                        className="secondary-link-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleExpandedDraft(review.id);
                        }}
                      >
                        {draftExpanded ? "Hide reply" : "Preview reply"}
                      </button>
                    ) : null}
                  </div>

                  {isEditing && !isCompactViewport ? (
                    <textarea
                      value={draftResponse}
                      onChange={(event) =>
                        onDraftResponseChange(event.target.value)
                      }
                      aria-label={`Edit response for ${review.author}`}
                    />
                  ) : (
                    <>
                      <p className="response-preview">
                        {draftExpanded
                          ? review.aiResponse
                          : getDraftPreview(review.aiResponse)}
                      </p>

                      {review.status === "responded" ? (
                        <span className="response-status-note">
                          Response already posted publicly.
                        </span>
                      ) : null}

                      {isAutoHandled ? (
                        <span className="response-status-note">
                          Auto-send is on for this positive review, so it only needs
                          attention if you want to change the reply.
                        </span>
                      ) : null}

                      {isEditing && isCompactViewport ? (
                        <span className="response-status-note">
                          Editing now happens in the reply composer.
                        </span>
                      ) : null}
                    </>
                  )}

                  <div
                    className={`action-row ${
                      isCompactViewport ? "action-row-compact" : ""
                    }`}
                  >
                    {isEditing && !isCompactViewport ? (
                      <>
                        <button
                          type="button"
                          className="action-button action-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            onSaveDraft();
                          }}
                        >
                          Save draft
                        </button>
                        <button
                          type="button"
                          className="action-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onCancelEditing();
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : review.status === "responded" ? null : isAutoHandled ? (
                      <button
                        type="button"
                        className="action-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onStartEditing(review);
                        }}
                      >
                        Edit draft
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="action-button action-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            onApproveReview(review.id);
                          }}
                        >
                          Approve &amp; send
                        </button>
                        <button
                          type="button"
                          className="action-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onStartEditing(review);
                          }}
                        >
                          Edit draft
                        </button>
                        {(review.sentiment !== "positive" || review.stars === 1) && (
                          <button
                            type="button"
                            className="review-warning-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              onFlagReview(review.id);
                            }}
                          >
                            {review.status === "flagged"
                              ? "Owner call flagged"
                              : "Escalate to owner call"}
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
              <span className="eyebrow-label">Issues</span>
              <h4>Issues guests keep repeating</h4>
            </div>
          </div>

          <div className="theme-alert-list">
            {themes.map((theme) => {
              const spike = isThemeSpike(theme);

              return (
                <article
                  key={theme.id}
                  className={`theme-alert-card ${
                    spike ? "theme-alert-card-spike" : ""
                  }`}
                >
                  <div className="theme-alert-top">
                    <strong>{theme.label}</strong>
                    {spike ? <span className="spike-badge">spike</span> : null}
                  </div>
                  <div className="issue-card-copy">
                    <p>{theme.value} reviews this week</p>
                    <span className="issue-delta">{getThemeDeltaLabel(theme)}</span>
                  </div>
                  <button
                    type="button"
                    className="secondary-link-button"
                    onClick={() => handleFocusTheme(theme)}
                  >
                    Open related reviews
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel analytics-panel">
          <div className="panel-header analytics-panel-header">
            <div>
              <span className="eyebrow-label">Analytics</span>
              <h4>More context after the queue</h4>
            </div>
            {isCompactViewport ? (
              <button
                type="button"
                className="secondary-link-button"
                onClick={() => setMetricsExpanded((current) => !current)}
              >
                {metricsExpanded ? "Hide context" : "More context"}
              </button>
            ) : null}
          </div>

          {!isCompactViewport || metricsExpanded ? (
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
          ) : null}
        </section>
      </div>

      {isCompactViewport && editingReview ? (
        <MobileComposerSheet
          review={editingReview}
          draftResponse={draftResponse}
          draftStatus={draftStatus}
          onDraftResponseChange={onDraftResponseChange}
          onSaveDraft={() => onSaveDraft(false)}
          onApproveAndSend={() => onApproveReview(editingReview.id, draftResponse)}
          onClose={onCancelEditing}
        />
      ) : null}
    </div>
  );
}

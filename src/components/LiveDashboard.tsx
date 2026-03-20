import type {
  AutomationMetric,
  LocationSummary,
  ReviewItem,
  ReviewStatus,
  ThemeCategory,
} from "../types";

type ReviewFilter = "all" | ReviewStatus;

interface LiveDashboardProps {
  location: LocationSummary;
  reviews: ReviewItem[];
  filteredReviews: ReviewItem[];
  themes: ThemeCategory[];
  metrics: AutomationMetric[];
  reviewFilter: ReviewFilter;
  editingReviewId: string | null;
  draftResponse: string;
  onReviewFilterChange: (filter: ReviewFilter) => void;
  onApproveReview: (reviewId: string) => void;
  onFlagReview: (reviewId: string) => void;
  onStartEditing: (review: ReviewItem) => void;
  onDraftResponseChange: (value: string) => void;
  onSaveDraft: () => void;
  onCancelEditing: () => void;
}

const filterLabels: { label: string; value: ReviewFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Responded", value: "responded" },
  { label: "Flagged", value: "flagged" },
];

export function LiveDashboard({
  location,
  reviews,
  filteredReviews,
  themes,
  metrics,
  reviewFilter,
  editingReviewId,
  draftResponse,
  onReviewFilterChange,
  onApproveReview,
  onFlagReview,
  onStartEditing,
  onDraftResponseChange,
  onSaveDraft,
  onCancelEditing,
}: LiveDashboardProps) {
  const pendingCount = reviews.filter((review) => review.status === "pending").length;
  const flaggedCount = reviews.filter((review) => review.status === "flagged").length;
  const respondedCount = reviews.filter(
    (review) => review.status === "responded",
  ).length;
  const isExternalLink = location.linkUrl.startsWith("http");
  const maxThemeValue = Math.max(...themes.map((theme) => theme.value), 1);

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
          <span>Drafts waiting</span>
          <strong>{pendingCount}</strong>
          <p>Replies that still need a post or final edit</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Responded</span>
          <strong>{respondedCount}</strong>
          <p>Reviews already answered in the public thread</p>
        </article>
        <article className="workspace-highlight-card">
          <span>Escalated</span>
          <strong>{flaggedCount}</strong>
          <p>Items that need an owner follow-up before posting</p>
        </article>
      </div>

      <div className="workspace-grid live-workspace-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow-label">Review feed</span>
              <h4>Incoming review stream</h4>
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

          <div className="review-list">
            {filteredReviews.map((review) => {
              const isEditing = editingReviewId === review.id;

              return (
                <article
                  key={review.id}
                  className={`review-card review-${review.sentiment}`}
                >
                  <div className="review-meta">
                    <div>
                      <strong>{review.author}</strong>
                      <p>
                        {review.stars} / 5 rating on {review.dateLabel}
                      </p>
                    </div>
                    <span className={`status-pill status-${review.status}`}>
                      {review.status}
                    </span>
                  </div>

                  <p className="review-snippet">{review.snippet}</p>

                  <div className="tag-row">
                    {review.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="response-panel">
                    <div className="response-header">
                      <span className="eyebrow-label">Draft reply</span>
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
                      ) : (
                        <>
                          <button
                            type="button"
                            className="action-button action-primary"
                            onClick={() => onApproveReview(review.id)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="action-button"
                            onClick={() => onStartEditing(review)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-button"
                            onClick={() => onFlagReview(review.id)}
                          >
                            Escalate
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredReviews.length === 0 ? (
              <article className="review-card empty-state">
                <strong>No reviews in this filter</strong>
                <p>Switch filters to inspect the rest of the queue for this location.</p>
              </article>
            ) : null}
          </div>
        </section>

        <aside className="workspace-stack">
          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow-label">Negative themes</span>
                <h4>What keeps showing up in reviews</h4>
              </div>
            </div>
            <div className="theme-list">
              {themes.map((theme) => (
                <div key={theme.id} className="theme-row">
                  <div className="theme-row-top">
                    <span>{theme.label}</span>
                    <span>{theme.value} mentions</span>
                  </div>
                  <div className="theme-bar-track">
                    <div
                      className={`theme-bar-fill theme-${theme.tone}`}
                      style={{ width: `${(theme.value / maxThemeValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow-label">Review capture</span>
                <h4>Post-visit performance</h4>
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
        </aside>
      </div>
    </div>
  );
}

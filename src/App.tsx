import { useEffect, useState } from "react";
import { LaunchPad } from "./components/LaunchPad";
import { LiveDashboard } from "./components/LiveDashboard";
import { LocationCard } from "./components/LocationCard";
import {
  automationMetrics,
  demoCopy,
  launchMilestones as initialLaunchMilestones,
  locations,
  reviews as initialReviews,
  themeCategories,
} from "./data/demoData";
import type { ReviewItem, ReviewStatus } from "./types";

type ReviewFilter = "all" | "actionable" | ReviewStatus;

function isAutoHandledReview(review: ReviewItem, autoSendPositive: boolean) {
  return autoSendPositive && review.status === "pending" && review.stars >= 4;
}

function sortReviewsByUrgency(a: ReviewItem, b: ReviewItem) {
  const statusRank =
    (a.status === "flagged" ? 2 : a.status === "pending" ? 1 : 0) -
    (b.status === "flagged" ? 2 : b.status === "pending" ? 1 : 0);

  if (statusRank !== 0) {
    return statusRank * -1;
  }

  if (a.stars !== b.stars) {
    return a.stars - b.stars;
  }

  return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
}

function getQueueCount(
  reviews: ReviewItem[],
  locationId: string,
  autoSendPositive: boolean,
) {
  return reviews.filter(
    (review) =>
      review.locationId === locationId &&
      review.status !== "responded" &&
      !isAutoHandledReview(review, autoSendPositive),
  ).length;
}

function getWeekComparisonLabel(thisWeek: number, lastWeek: number) {
  if (thisWeek > lastWeek) {
    return `up from ${lastWeek} last week`;
  }

  if (thisWeek < lastWeek) {
    return `down from ${lastWeek} last week`;
  }

  return `flat vs ${lastWeek} last week`;
}

function App() {
  const [activeLocationId, setActiveLocationId] = useState(locations[0].id);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [launchMilestones, setLaunchMilestones] = useState(initialLaunchMilestones);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("actionable");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [focusedReviewId, setFocusedReviewId] = useState<string | null>(null);
  const [autoSendPositive, setAutoSendPositive] = useState(false);

  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ?? locations[0];
  const liveLocations = locations.filter((location) => location.status === "live");
  const launchLocations = locations.filter(
    (location) => location.status === "coming-soon",
  );
  const activeReviews = reviews
    .filter((review) => review.locationId === activeLocation.id)
    .sort(sortReviewsByUrgency);
  const activeThemes = themeCategories.filter(
    (theme) => theme.locationId === activeLocation.id,
  );
  const activeMetrics = automationMetrics.filter(
    (metric) => metric.locationId === activeLocation.id,
  );
  const activeMilestones = launchMilestones.filter(
    (milestone) => milestone.locationId === activeLocation.id,
  );
  const filteredReviews = activeReviews.filter((review) => {
    const autoHandled = isAutoHandledReview(review, autoSendPositive);

    if (reviewFilter === "all") {
      return true;
    }

    if (reviewFilter === "actionable") {
      return review.status !== "responded" && !autoHandled;
    }

    return review.status === reviewFilter;
  });

  const portfolioQueue = reviews
    .filter((review) => {
      const location = locations.find(
        (candidate) => candidate.id === review.locationId,
      );

      return (
        location?.status === "live" &&
        review.status !== "responded" &&
        !isAutoHandledReview(review, autoSendPositive)
      );
    })
    .sort(sortReviewsByUrgency);
  const waitingCount = portfolioQueue.length;
  const flaggedCount = portfolioQueue.filter(
    (review) => review.status === "flagged",
  ).length;
  const pendingCount = portfolioQueue.filter(
    (review) => review.status === "pending",
  ).length;
  const autoSendEligibleCount = reviews.filter(
    (review) => review.status === "pending" && review.stars >= 4,
  ).length;
  const firstQueueReview = portfolioQueue[0] ?? null;
  const selectedReview =
    reviews.find((review) => review.id === focusedReviewId) ?? null;
  const focusedReview =
    selectedReview && !isAutoHandledReview(selectedReview, autoSendPositive)
      ? selectedReview
      : firstQueueReview;
  const activeLocationQueueCount =
    activeLocation.status === "live"
      ? getQueueCount(reviews, activeLocation.id, autoSendPositive)
      : 0;
  const activeLocationReadiness =
    activeMilestones.length === 0
      ? 0
      : Math.round(
          (activeMilestones.filter((milestone) => milestone.complete).length /
            activeMilestones.length) *
            100,
        );

  useEffect(() => {
    if (activeLocation.status !== "live") {
      if (focusedReviewId !== null) {
        setFocusedReviewId(null);
      }
      return;
    }

    const activeQueue = activeReviews.filter(
      (review) =>
        review.status !== "responded" &&
        !isAutoHandledReview(review, autoSendPositive),
    );
    const nextFocusedReview = activeQueue[0] ?? null;
    const hasValidFocusedReview = activeQueue.some(
      (review) => review.id === focusedReviewId,
    );

    if (!hasValidFocusedReview && nextFocusedReview) {
      setFocusedReviewId(nextFocusedReview.id);
    }

    if (!nextFocusedReview && focusedReviewId !== null) {
      setFocusedReviewId(null);
    }
  }, [activeLocation.status, activeReviews, autoSendPositive, focusedReviewId]);

  function scrollToWorkspace() {
    document.getElementById("workspace")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSelectLocation(locationId: string) {
    const location = locations.find((candidate) => candidate.id === locationId);
    setActiveLocationId(locationId);
    setReviewFilter(location?.status === "live" ? "actionable" : "all");
    setEditingReviewId(null);
    setDraftResponse("");
  }

  function openWorkspace(locationId: string, reviewId?: string) {
    handleSelectLocation(locationId);
    setFocusedReviewId(reviewId ?? null);
    scrollToWorkspace();
  }

  function openReview(review: ReviewItem) {
    handleSelectLocation(review.locationId);
    setReviewFilter("all");
    setFocusedReviewId(review.id);
    scrollToWorkspace();
  }

  function handleApproveReview(reviewId: string) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId ? { ...review, status: "responded" } : review,
      ),
    );
    setEditingReviewId(null);
    setDraftResponse("");
  }

  function handleFlagReview(reviewId: string) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId ? { ...review, status: "flagged" } : review,
      ),
    );
    setEditingReviewId(null);
    setDraftResponse("");
  }

  function handleStartEditing(review: ReviewItem) {
    handleSelectLocation(review.locationId);
    setReviewFilter("all");
    setFocusedReviewId(review.id);
    setEditingReviewId(review.id);
    setDraftResponse(review.aiResponse);
    scrollToWorkspace();
  }

  function handleSaveDraft() {
    if (!editingReviewId) {
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === editingReviewId
          ? {
              ...review,
              aiResponse: draftResponse,
              status: review.status === "flagged" ? "flagged" : "pending",
            }
          : review,
      ),
    );
    setEditingReviewId(null);
    setDraftResponse("");
  }

  function handleCancelEditing() {
    setEditingReviewId(null);
    setDraftResponse("");
  }

  function handleToggleMilestone(milestoneId: string) {
    setLaunchMilestones((currentMilestones) =>
      currentMilestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, complete: !milestone.complete }
          : milestone,
      ),
    );
  }

  function handleToggleAutoSend() {
    setAutoSendPositive((currentValue) => !currentValue);
  }

  function handleMobilePrimaryAction() {
    if (!focusedReview) {
      return;
    }

    if (editingReviewId === focusedReview.id) {
      handleSaveDraft();
      return;
    }

    handleApproveReview(focusedReview.id);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a href="#queue" className="brand-lockup">
            <span className="brand-mark">JT</span>
            <span>
              Jay Trikha
              <strong>Reputation Inbox</strong>
            </span>
          </a>

          <nav aria-label="Primary">
            {demoCopy.navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="queue" className="status-section">
          <div className="section-shell">
            <div className="status-hero">
              <div className="status-copy">
                <span className="eyebrow-label">Tonight's reputation inbox</span>
                <h1>
                  {waitingCount > 0
                    ? `${waitingCount} reviews need attention right now.`
                    : "You're all caught up."}
                </h1>
                <p>
                  {waitingCount > 0
                    ? "Start with the personal-call flags, clear the drafted replies, and let the analytics wait until the queue hits zero."
                    : "All live locations are clear. The next useful move is checking launch readiness and keeping the auto-send rule tuned."}
                </p>
              </div>

              <div className="status-summary-strip">
                <article className="status-summary-card">
                  <span>Waiting now</span>
                  <strong>{waitingCount}</strong>
                  <p>Across Savannah Taphouse and Pritchard & Co.</p>
                </article>
                <article className="status-summary-card">
                  <span>Need a call</span>
                  <strong>{flaggedCount}</strong>
                  <p>Escalated items that need owner attention before posting.</p>
                </article>
                <article className="status-summary-card">
                  <span>4-5 star auto-send</span>
                  <strong>{autoSendPositive ? "On" : "Off"}</strong>
                  <p>{autoSendEligibleCount} positive reviews are eligible right now.</p>
                </article>
              </div>
            </div>

            <div className="action-board">
              <aside className="panel queue-summary-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow-label">Queue summary</span>
                    <h3>What to do before bed</h3>
                  </div>
                </div>

                <div className="queue-summary-list">
                  <article className="queue-summary-item">
                    <strong>{flaggedCount}</strong>
                    <p>Personal call follow-ups are sitting above the drafted replies.</p>
                  </article>
                  <article className="queue-summary-item">
                    <strong>{pendingCount}</strong>
                    <p>AI replies are ready to approve and send with one tap.</p>
                  </article>
                  <article className="queue-summary-item">
                    <strong>{liveLocations.length}</strong>
                    <p>Live locations are feeding tonight's inbox. Launch venues stay below this line.</p>
                  </article>
                </div>

                {firstQueueReview ? (
                  <button
                    type="button"
                    className="primary-link-button queue-summary-cta"
                    onClick={() => openReview(firstQueueReview)}
                  >
                    Open first review
                  </button>
                ) : (
                  <div className="queue-summary-cleared">
                    <span className="queue-checkmark" aria-hidden="true">
                      ✓
                    </span>
                    <p>Nothing is waiting in the live queue.</p>
                  </div>
                )}
              </aside>

              <section className="panel queue-list-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow-label">Portfolio queue</span>
                    <h3>Reviews waiting across live locations</h3>
                  </div>
                  <span className="panel-meta-label">
                    {waitingCount > 0 ? `${waitingCount} open items` : "0 open items"}
                  </span>
                </div>

                {portfolioQueue.length > 0 ? (
                  <div className="portfolio-queue-list">
                    {portfolioQueue.map((review) => {
                      const reviewLocation = locations.find(
                        (location) => location.id === review.locationId,
                      );

                      return (
                        <article key={review.id} className="portfolio-review-card">
                          <div className="portfolio-review-top">
                            <div>
                              <span className="eyebrow-label">
                                {reviewLocation?.shortName ?? "Location"}
                              </span>
                              <strong>{review.author}</strong>
                              <p>
                                {review.stars} star{review.stars === 1 ? "" : "s"} ·{" "}
                                {review.dateLabel}
                              </p>
                            </div>
                            <span
                              className={`status-pill status-${review.status}`}
                            >
                              {review.status === "flagged"
                                ? "personal call"
                                : "waiting"}
                            </span>
                          </div>

                          <p className="review-snippet">{review.snippet}</p>

                          <div className="portfolio-draft-preview">
                            <span className="eyebrow-label">AI draft ready</span>
                            <p>{review.aiResponse}</p>
                          </div>

                          <div className="action-row">
                            <button
                              type="button"
                              className="action-button action-primary"
                              onClick={() => handleApproveReview(review.id)}
                            >
                              Approve &amp; send
                            </button>
                            <button
                              type="button"
                              className="action-button"
                              onClick={() => handleStartEditing(review)}
                            >
                              Edit reply
                            </button>
                            {(review.sentiment !== "positive" || review.stars === 1) && (
                              <button
                                type="button"
                                className="action-button"
                                onClick={() => handleFlagReview(review.id)}
                              >
                                Flag for personal call
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <article className="caught-up-state">
                    <span className="queue-checkmark" aria-hidden="true">
                      ✓
                    </span>
                    <strong>You're all caught up.</strong>
                    <p>
                      Every live review has either been answered or flagged for the
                      right owner follow-up.
                    </p>
                  </article>
                )}
              </section>
            </div>
          </div>
        </section>

        <section id="locations" className="section-block">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Locations</span>
              <h2>Use cards for context, not homework.</h2>
              <p>
                Live cards only show what matters this week. Launch cards stay in
                checklist mode until there are reviews to manage.
              </p>
            </div>

            <div className="portfolio-groups">
              <section className="portfolio-group">
                <div className="portfolio-group-header">
                  <div>
                    <span className="eyebrow-label">Live locations</span>
                    <h3>Open queues</h3>
                  </div>
                  <p>{waitingCount} reviews still need action tonight.</p>
                </div>

                <div className="location-grid">
                  {liveLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      milestones={[]}
                      unansweredCount={getQueueCount(
                        reviews,
                        location.id,
                        autoSendPositive,
                      )}
                      active={location.id === activeLocation.id}
                      onSelect={openWorkspace}
                    />
                  ))}
                </div>
              </section>

              <section className="portfolio-group">
                <div className="portfolio-group-header">
                  <div>
                    <span className="eyebrow-label">Launch mode</span>
                    <h3>Upcoming venues</h3>
                  </div>
                  <p>Action-oriented readiness until the first public reviews land.</p>
                </div>

                <div className="location-grid location-grid-launch">
                  {launchLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      milestones={launchMilestones.filter(
                        (milestone) => milestone.locationId === location.id,
                      )}
                      unansweredCount={0}
                      active={location.id === activeLocation.id}
                      onSelect={openWorkspace}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <section id="workspace" className="section-block workspace-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Workspace</span>
              <h2>
                {activeLocation.status === "live"
                  ? `${activeLocation.name} review queue`
                  : `${activeLocation.name} launch mode`}
              </h2>
              <p>{activeLocation.detailNote}</p>
            </div>

            <article className="active-location-banner">
              <div>
                <span className="eyebrow-label">
                  {activeLocation.status === "live" ? "Working now" : "Launch board"}
                </span>
                <h3>{activeLocation.name}</h3>
                <p>{activeLocation.address}</p>
              </div>
              <div className="banner-score">
                {activeLocation.status === "live" ? (
                  <>
                    <strong>{activeLocationQueueCount} waiting</strong>
                    <span>
                      {activeLocation.ratingLabel} · +{activeLocation.reviewsThisWeek} this
                      week, {getWeekComparisonLabel(
                        activeLocation.reviewsThisWeek,
                        activeLocation.reviewsLastWeek,
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <strong>{activeLocationReadiness}% ready</strong>
                    <span>
                      {activeLocation.launchProgress ?? 0} /{" "}
                      {activeLocation.launchGoal ?? 50} toward the first 50 reviews
                    </span>
                  </>
                )}
              </div>
            </article>

            {activeLocation.status === "live" ? (
              <LiveDashboard
                location={activeLocation}
                reviews={activeReviews}
                filteredReviews={filteredReviews}
                themes={activeThemes}
                metrics={activeMetrics}
                reviewFilter={reviewFilter}
                editingReviewId={editingReviewId}
                draftResponse={draftResponse}
                focusedReviewId={focusedReviewId}
                autoSendPositive={autoSendPositive}
                onReviewFilterChange={setReviewFilter}
                onApproveReview={handleApproveReview}
                onFlagReview={handleFlagReview}
                onStartEditing={handleStartEditing}
                onFocusReview={setFocusedReviewId}
                onDraftResponseChange={setDraftResponse}
                onSaveDraft={handleSaveDraft}
                onCancelEditing={handleCancelEditing}
                onToggleAutoSend={handleToggleAutoSend}
              />
            ) : (
              <LaunchPad
                location={activeLocation}
                milestones={activeMilestones}
                onToggleMilestone={handleToggleMilestone}
              />
            )}
          </div>
        </section>
      </main>

      <div className="mobile-action-bar">
        <div className="mobile-action-copy">
          <strong>
            {waitingCount > 0 ? `${waitingCount} reviews waiting` : "Inbox cleared"}
          </strong>
          <span>
            {focusedReview
              ? `${focusedReview.author} · ${focusedReview.stars} star${
                  focusedReview.stars === 1 ? "" : "s"
                } · ${locations.find((location) => location.id === focusedReview.locationId)?.shortName ?? "Location"}`
              : "No review needs action right now."}
          </span>
        </div>

        {focusedReview ? (
          <button
            type="button"
            className="action-button action-primary"
            onClick={handleMobilePrimaryAction}
          >
            {editingReviewId === focusedReview.id ? "Save draft" : "Approve & send"}
          </button>
        ) : (
          <button
            type="button"
            className="action-button mobile-action-passive"
            onClick={() => {
              if (launchLocations[0]) {
                openWorkspace(launchLocations[0].id);
              }
            }}
          >
            You're caught up
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

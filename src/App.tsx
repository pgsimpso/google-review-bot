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
import { useMediaQuery } from "./hooks/useMediaQuery";
import type { LaunchMilestone, ReviewItem, ReviewStatus } from "./types";

type ReviewFilter = "all" | "actionable" | ReviewStatus;
type DraftStatus = "idle" | "editing" | "saved";

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

function getActionSummary(
  flaggedCount: number,
  pendingCount: number,
  waitingCount: number,
) {
  if (flaggedCount > 0) {
    return {
      title: `${flaggedCount} owner call${flaggedCount === 1 ? "" : "s"} need attention first.`,
      shortDescription: `${flaggedCount} owner call${flaggedCount === 1 ? "" : "s"} come first. ${pendingCount} drafted repl${
        pendingCount === 1 ? "y" : "ies"
      } can follow.`,
      detail:
        "Handle personal recoveries before drafted replies, then clear the rest of the queue.",
    };
  }

  if (waitingCount > 0) {
    return {
      title: `${waitingCount} drafted repl${waitingCount === 1 ? "y" : "ies"} can clear the queue.`,
      shortDescription:
        "Approve the drafted replies and get the inbox back to zero before checking analytics.",
      detail:
        "The recovery work is done. Finish the drafted replies, then move on to launch readiness.",
    };
  }

  return {
    title: "The queue is clear.",
    shortDescription:
      "Live reviews are covered. The next useful move is checking launch readiness.",
    detail:
      "All live locations are clear. Use the extra time to tighten launch readiness and automation rules.",
  };
}

function getNextLaunchTask(milestones: LaunchMilestone[]) {
  return milestones.find((milestone) => !milestone.complete) ?? milestones[0] ?? null;
}

function App() {
  const isCompactViewport = useMediaQuery("(max-width: 720px)");
  const [activeLocationId, setActiveLocationId] = useState(locations[0].id);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [launchMilestones, setLaunchMilestones] = useState(initialLaunchMilestones);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("actionable");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [focusedReviewId, setFocusedReviewId] = useState<string | null>(null);
  const [autoSendPositive, setAutoSendPositive] = useState(false);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>("idle");

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
  const activeQueue = activeReviews.filter(
    (review) =>
      review.status !== "responded" &&
      !isAutoHandledReview(review, autoSendPositive),
  );
  const activeFlaggedCount = activeQueue.filter(
    (review) => review.status === "flagged",
  ).length;
  const activePendingCount = activeQueue.filter(
    (review) => review.status === "pending",
  ).length;
  const portfolioActionSummary = getActionSummary(
    flaggedCount,
    pendingCount,
    waitingCount,
  );
  const activeActionSummary = getActionSummary(
    activeFlaggedCount,
    activePendingCount,
    activeQueue.length,
  );
  const activeLaunchTask = getNextLaunchTask(activeMilestones);
  const compactQueuePreview = portfolioQueue.slice(0, 2);
  const compactWorkspaceNote =
    activeLocation.status === "live"
      ? activeActionSummary.shortDescription
      : activeLaunchTask
        ? `Next priority: ${activeLaunchTask.label}.`
        : "Launch checklist is fully covered.";

  useEffect(() => {
    if (activeLocation.status !== "live") {
      if (focusedReviewId !== null) {
        setFocusedReviewId(null);
      }
      return;
    }

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
  }, [activeLocation.status, activeQueue, focusedReviewId]);

  useEffect(() => {
    if (!editingReviewId) {
      setDraftStatus("idle");
    }
  }, [editingReviewId]);

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
    setDraftStatus("idle");
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

  function handleApproveReview(reviewId: string, responseOverride?: string) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              aiResponse: responseOverride ?? review.aiResponse,
              status: "responded",
            }
          : review,
      ),
    );
    setEditingReviewId(null);
    setDraftResponse("");
    setDraftStatus("idle");
  }

  function handleFlagReview(reviewId: string) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId ? { ...review, status: "flagged" } : review,
      ),
    );
    setEditingReviewId(null);
    setDraftResponse("");
    setDraftStatus("idle");
  }

  function handleStartEditing(review: ReviewItem) {
    handleSelectLocation(review.locationId);
    setReviewFilter("all");
    setFocusedReviewId(review.id);
    setEditingReviewId(review.id);
    setDraftResponse(review.aiResponse);
    setDraftStatus("saved");
    scrollToWorkspace();
  }

  function handleDraftResponseChange(value: string) {
    setDraftResponse(value);
    setDraftStatus("editing");
  }

  function handleSaveDraft(closeEditor = true) {
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
    setDraftStatus("saved");

    if (closeEditor) {
      setEditingReviewId(null);
      setDraftResponse("");
      setDraftStatus("idle");
    }
  }

  function handleCancelEditing() {
    setEditingReviewId(null);
    setDraftResponse("");
    setDraftStatus("idle");
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

  function handlePrimaryQueueAction() {
    if (firstQueueReview) {
      openReview(firstQueueReview);
      return;
    }

    if (launchLocations[0]) {
      openWorkspace(launchLocations[0].id);
    }
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
                    ? isCompactViewport
                      ? portfolioActionSummary.shortDescription
                      : "Start with the personal-call flags, clear the drafted replies, and let the analytics wait until the queue hits zero."
                    : "All live locations are clear. The next useful move is checking launch readiness and keeping the auto-send rule tuned."}
                </p>
              </div>

              <div
                className={`status-summary-strip ${
                  isCompactViewport ? "status-summary-strip-compact" : ""
                }`}
              >
                <article className="status-summary-card">
                  <span>Waiting now</span>
                  <strong>{waitingCount}</strong>
                  <p>Across Savannah Taphouse and Pritchard &amp; Co.</p>
                </article>
                <article className="status-summary-card">
                  <span>Need a call</span>
                  <strong>{flaggedCount}</strong>
                  <p>Owner-level recoveries that need the first response.</p>
                </article>
                {!isCompactViewport ? (
                  <article className="status-summary-card">
                    <span>4-5 star auto-send</span>
                    <strong>{autoSendPositive ? "On" : "Off"}</strong>
                    <p>
                      {autoSendEligibleCount} positive reviews are eligible right now.
                    </p>
                  </article>
                ) : null}
              </div>
            </div>

            {isCompactViewport ? (
              <div className="compact-queue-shell">
                <div className="compact-queue-toolbar">
                  <button
                    type="button"
                    className="primary-link-button compact-primary-action"
                    onClick={handlePrimaryQueueAction}
                  >
                    {firstQueueReview ? "Open first review" : "Open launch readiness"}
                  </button>

                  <div className="queue-rule-indicator">
                    <span>4-5 star auto-send</span>
                    <strong>{autoSendPositive ? "On" : "Off"}</strong>
                  </div>
                </div>

                <section className="panel compact-queue-panel">
                  <div className="panel-header compact-queue-panel-header">
                    <div>
                      <span className="eyebrow-label">Open reviews</span>
                      <h3>Top items to clear now</h3>
                    </div>

                    {waitingCount > 0 ? (
                      <button
                        type="button"
                        className="secondary-link-button"
                        onClick={handlePrimaryQueueAction}
                      >
                        View all open reviews
                      </button>
                    ) : null}
                  </div>

                  {compactQueuePreview.length > 0 ? (
                    <div className="compact-preview-list">
                      {compactQueuePreview.map((review) => {
                        const reviewLocation = locations.find(
                          (location) => location.id === review.locationId,
                        );

                        return (
                          <article key={review.id} className="compact-preview-card">
                            <div className="compact-preview-top">
                              <span className="eyebrow-label">
                                {reviewLocation?.shortName ?? "Location"}
                              </span>
                              <span
                                className={`status-pill status-${review.status}`}
                              >
                                {review.status === "flagged"
                                  ? "owner call"
                                  : "waiting"}
                              </span>
                            </div>
                            <strong>{review.author}</strong>
                            <p className="compact-preview-meta">
                              {review.stars} star{review.stars === 1 ? "" : "s"} ·{" "}
                              {review.dateLabel}
                            </p>
                            <p className="review-snippet compact-preview-snippet">
                              {review.snippet}
                            </p>
                            <button
                              type="button"
                              className="secondary-link-button compact-preview-action"
                              onClick={() => openReview(review)}
                            >
                              Open review
                            </button>
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
                      <p>Live reviews are covered. Launch readiness is the next job.</p>
                    </article>
                  )}
                </section>
              </div>
            ) : (
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
                      <p>
                        Personal call follow-ups are sitting above the drafted
                        replies.
                      </p>
                    </article>
                    <article className="queue-summary-item">
                      <strong>{pendingCount}</strong>
                      <p>AI replies are ready to approve and send with one tap.</p>
                    </article>
                    <article className="queue-summary-item">
                      <strong>{liveLocations.length}</strong>
                      <p>
                        Live locations are feeding tonight&apos;s inbox. Launch venues
                        stay below this line.
                      </p>
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
                                  ? "owner call"
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
                                Edit draft
                              </button>
                              {(review.sentiment !== "positive" ||
                                review.stars === 1) && (
                                <button
                                  type="button"
                                  className="action-button"
                                  onClick={() => handleFlagReview(review.id)}
                                >
                                  Escalate to owner call
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
            )}
          </div>
        </section>

        <section id="locations" className="section-block">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Locations</span>
              <h2>Use cards for context, not homework.</h2>
              <p>
                Live cards surface the queue fast. Launch cards stay focused on the
                first milestones and the first 50 reviews.
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
                      compact={isCompactViewport}
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
                  <p>Readiness comes first until the first public reviews land.</p>
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
                      compact={isCompactViewport}
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
            <div
              className={`section-heading ${
                isCompactViewport ? "section-heading-compact" : ""
              }`}
            >
              <span className="eyebrow-label">Workspace</span>
              <h2>
                {activeLocation.status === "live"
                  ? `${activeLocation.name} review queue`
                  : `${activeLocation.name} launch mode`}
              </h2>
              <p>{isCompactViewport ? compactWorkspaceNote : activeLocation.detailNote}</p>
            </div>

            <article
              className={`active-location-banner ${
                isCompactViewport ? "active-location-banner-compact" : ""
              }`}
            >
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
                      week,{" "}
                      {getWeekComparisonLabel(
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
                draftStatus={draftStatus}
                focusedReviewId={focusedReviewId}
                autoSendPositive={autoSendPositive}
                isCompactViewport={isCompactViewport}
                showHeader={!isCompactViewport}
                onReviewFilterChange={setReviewFilter}
                onApproveReview={handleApproveReview}
                onFlagReview={handleFlagReview}
                onStartEditing={handleStartEditing}
                onFocusReview={setFocusedReviewId}
                onDraftResponseChange={handleDraftResponseChange}
                onSaveDraft={handleSaveDraft}
                onCancelEditing={handleCancelEditing}
                onToggleAutoSend={handleToggleAutoSend}
              />
            ) : (
              <LaunchPad
                location={activeLocation}
                milestones={activeMilestones}
                isCompactViewport={isCompactViewport}
                showHeader={!isCompactViewport}
                onToggleMilestone={handleToggleMilestone}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

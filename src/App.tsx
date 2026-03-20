import { useState } from "react";
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
import type { LaunchMilestone, ReviewItem, ReviewStatus } from "./types";

type ReviewFilter = "all" | ReviewStatus;

function App() {
  const [activeLocationId, setActiveLocationId] = useState(locations[0].id);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [launchMilestones, setLaunchMilestones] =
    useState<LaunchMilestone[]>(initialLaunchMilestones);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [draftResponse, setDraftResponse] = useState("");

  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ?? locations[0];
  const activeReviews = reviews.filter(
    (review) => review.locationId === activeLocation.id,
  );
  const activeThemes = themeCategories.filter(
    (theme) => theme.locationId === activeLocation.id,
  );
  const activeMetrics = automationMetrics.filter(
    (metric) => metric.locationId === activeLocation.id,
  );
  const activeMilestones = launchMilestones.filter(
    (milestone) => milestone.locationId === activeLocation.id,
  );
  const filteredReviews = activeReviews.filter((review) =>
    reviewFilter === "all" ? true : review.status === reviewFilter,
  );
  const upcomingLocations = locations.filter(
    (location) => location.status === "coming-soon",
  );
  const savannahThemes = themeCategories.filter(
    (theme) => theme.locationId === "savannah-taphouse",
  );
  const savannahThemeMax = Math.max(...savannahThemes.map((theme) => theme.value), 1);

  function handleSelectLocation(locationId: string) {
    setActiveLocationId(locationId);
    setReviewFilter("all");
    setEditingReviewId(null);
    setDraftResponse("");
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
    setEditingReviewId(review.id);
    setDraftResponse(review.aiResponse);
  }

  function handleSaveDraft() {
    if (!editingReviewId) {
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === editingReviewId
          ? { ...review, aiResponse: draftResponse, status: "pending" }
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

  function openWorkspace(locationId: string) {
    handleSelectLocation(locationId);
    document.getElementById("workspace")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a href="#overview" className="brand-lockup">
            <span className="brand-mark">JT</span>
            <span>
              Jay Trikha
              <strong>Reputation Dashboard</strong>
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
        <section id="overview" className="hero-section">
          <div className="section-shell">
            <div className="board-stage">
              <div className="board-header-row">
                <div className="hero-copy">
                  <span className="eyebrow-label">{demoCopy.hero.kicker}</span>
                  <h1>{demoCopy.hero.title}</h1>
                  <p className="hero-summary">{demoCopy.hero.summary}</p>
                </div>

                <div className="board-actions">
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="primary-link-button"
                      onClick={() => openWorkspace("savannah-taphouse")}
                    >
                      {demoCopy.hero.primaryCtaLabel}
                    </button>
                    <button
                      type="button"
                      className="secondary-link-button"
                      onClick={() =>
                        openWorkspace(upcomingLocations[0]?.id ?? locations[0].id)
                      }
                    >
                      {demoCopy.hero.secondaryCtaLabel}
                    </button>
                  </div>
                  <p className="demo-badge">{demoCopy.hero.demoBadge}</p>
                </div>
              </div>

              <div className="summary-stat-grid">
                {demoCopy.summaryStats.map((stat) => (
                  <article key={stat.label} className="summary-stat-card">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <p>{stat.detail}</p>
                  </article>
                ))}
              </div>

              <div className="board-grid">
                <div className="location-grid">
                  {locations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      active={location.id === activeLocation.id}
                      onSelect={openWorkspace}
                    />
                  ))}
                </div>

                <aside className="board-side-stack">
                  <section className="panel">
                    <div className="panel-header">
                      <div>
                        <span className="eyebrow-label">Savannah Taphouse</span>
                        <h4>Negative themes</h4>
                      </div>
                      <span className="panel-meta-label">last 60 days</span>
                    </div>

                    <div className="theme-list">
                      {savannahThemes.map((theme) => (
                        <div key={theme.id} className="theme-row">
                          <div className="theme-row-top">
                            <span>{theme.label}</span>
                            <span>{theme.value} mentions</span>
                          </div>
                          <div className="theme-bar-track">
                            <div
                              className={`theme-bar-fill theme-${theme.tone}`}
                              style={{
                                width: `${(theme.value / savannahThemeMax) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="panel" id="launch-board">
                    <div className="panel-header">
                      <div>
                        <span className="eyebrow-label">2026 launch queue</span>
                        <h4>Public review count starts at zero</h4>
                      </div>
                    </div>

                    <div className="launch-monitor-list">
                      {upcomingLocations.map((location) => {
                        const milestoneSet = launchMilestones.filter(
                          (milestone) => milestone.locationId === location.id,
                        );
                        const completedMilestones = milestoneSet.filter(
                          (milestone) => milestone.complete,
                        ).length;
                        const readiness =
                          milestoneSet.length === 0
                            ? 0
                            : (completedMilestones / milestoneSet.length) * 100;

                        return (
                          <button
                            key={location.id}
                            type="button"
                            className={`launch-monitor-card ${
                              activeLocation.id === location.id
                                ? "launch-monitor-card-active"
                                : ""
                            }`}
                            onClick={() => openWorkspace(location.id)}
                          >
                            <div className="launch-monitor-top">
                              <div>
                                <strong>{location.name}</strong>
                                <p>{location.ratingLabel}</p>
                              </div>
                              <span className="status-pill status-pending">0 reviews</span>
                            </div>

                            <div className="metric-progress-track">
                              <div
                                className="metric-progress-fill"
                                style={{ width: `${readiness}%` }}
                              />
                            </div>

                            <div className="launch-monitor-bottom">
                              <span>
                                {completedMilestones} / {milestoneSet.length} tasks complete
                              </span>
                              <span>{location.reviewCountLabel}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section id="workspace" className="section-block">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Workspace</span>
              <h2>{demoCopy.dashboardTitle}</h2>
              <p>{demoCopy.dashboardBody}</p>
            </div>

            <article className="active-location-banner">
              <div>
                <span className="eyebrow-label">Active location</span>
                <h3>{activeLocation.name}</h3>
                <p>{activeLocation.detailNote}</p>
              </div>
              <div className="banner-score">
                <strong>{activeLocation.ratingLabel}</strong>
                <span>{activeLocation.reviewCountLabel}</span>
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
                onReviewFilterChange={setReviewFilter}
                onApproveReview={handleApproveReview}
                onFlagReview={handleFlagReview}
                onStartEditing={handleStartEditing}
                onDraftResponseChange={setDraftResponse}
                onSaveDraft={handleSaveDraft}
                onCancelEditing={handleCancelEditing}
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
    </div>
  );
}

export default App;

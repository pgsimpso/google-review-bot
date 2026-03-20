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

  function jumpToDashboard(locationId: string) {
    handleSelectLocation(locationId);
    document.getElementById("dashboard")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a href="#hero" className="brand-lockup">
            <span className="brand-mark">AC</span>
            <span>
              Jay Trikha Presents
              <strong>Reputation Dashboard Demo</strong>
            </span>
          </a>

          <nav aria-label="Primary">
            <a href="../">Versions</a>
            {demoCopy.navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="hero" className="hero-section">
          <div className="section-shell hero-grid">
            <div className="hero-copy">
              <span className="eyebrow-label">{demoCopy.hero.kicker}</span>
              <h1>{demoCopy.hero.title}</h1>
              <p className="hero-summary">{demoCopy.hero.summary}</p>

              <div className="hero-actions">
                <a className="primary-link-button" href={demoCopy.hero.primaryCtaHref}>
                  {demoCopy.hero.primaryCtaLabel}
                </a>
                <a className="secondary-link-button" href={demoCopy.hero.secondaryCtaHref}>
                  {demoCopy.hero.secondaryCtaLabel}
                </a>
              </div>

              <p className="demo-badge">{demoCopy.hero.demoBadge}</p>
            </div>

            <div className="hero-aside">
              <article className="hero-story-card">
                <span className="eyebrow-label">Why this matters</span>
                <h2>Before Jay opens two more concepts, the review engine should already exist.</h2>
                <p>
                  The live venues prove the operating pattern. The upcoming venues are where the upside compounds: stronger first impressions, faster public responses, and a cleaner runway to the first page of reviews.
                </p>
              </article>

              <div className="hero-mini-grid">
                <article className="mini-metric-card">
                  <span>After-service asks</span>
                  <strong>Automated</strong>
                  <p>Timed messages after checks, reservations, and VIP nights</p>
                </article>
                <article className="mini-metric-card">
                  <span>Response layer</span>
                  <strong>In Jay's voice</strong>
                  <p>Approve, edit, or escalate without writing from scratch</p>
                </article>
                <article className="mini-metric-card">
                  <span>Launch mode</span>
                  <strong>Day-one ready</strong>
                  <p>New listings do not wait months to develop social proof</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="section-block">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Proof and operating logic</span>
              <h2>Review response speed and review volume both move revenue</h2>
              <p>
                The concept in this demo is not just prettier reporting. It is a system for getting more public proof, closing recovery loops faster, and giving new venues momentum from the start.
              </p>
            </div>

            <div className="proof-grid">
              {demoCopy.proofPoints.map((point) => (
                <article key={point.label} className="proof-card">
                  <span className="proof-value">{point.value}</span>
                  <h3>{point.label}</h3>
                  <p>{point.detail}</p>
                  <a href={point.sourceUrl} target="_blank" rel="noreferrer">
                    {point.sourceLabel}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="overview" className="section-block">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Portfolio overview</span>
              <h2>{demoCopy.overviewTitle}</h2>
              <p>{demoCopy.overviewBody}</p>
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

            <div className="location-grid">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  active={location.id === activeLocation.id}
                  onSelect={handleSelectLocation}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="dashboard" className="section-block">
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

        <section id="launch-pad" className="section-block">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Opening pipeline</span>
              <h2>{demoCopy.launchTitle}</h2>
              <p>{demoCopy.launchBody}</p>
            </div>

            <div className="launch-preview-grid">
              {upcomingLocations.map((location) => {
                const milestoneSet = launchMilestones.filter(
                  (milestone) => milestone.locationId === location.id,
                );
                const completedMilestones = milestoneSet.filter(
                  (milestone) => milestone.complete,
                ).length;
                const goalTarget = location.launchGoal ?? 50;
                const goalCurrent = location.launchProgress ?? 0;

                return (
                  <article key={location.id} className="launch-preview-card">
                    <div className="launch-preview-top">
                      <span className="eyebrow-label">{location.shortName}</span>
                      <span className="trend-chip trend-up">launch mode</span>
                    </div>
                    <h3>{location.name}</h3>
                    <p>{location.focusBlurb}</p>

                    <div className="launch-preview-stats">
                      <div>
                        <span>Checklist</span>
                        <strong>
                          {completedMilestones} / {milestoneSet.length}
                        </strong>
                      </div>
                      <div>
                        <span>Review target</span>
                        <strong>
                          {goalCurrent} / {goalTarget}
                        </strong>
                      </div>
                    </div>

                    <div className="metric-progress-track">
                      <div
                        className="metric-progress-fill"
                        style={{
                          width: `${Math.min((goalCurrent / goalTarget) * 100, 100)}%`,
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      className="action-button action-primary"
                      onClick={() => jumpToDashboard(location.id)}
                    >
                      Open launch workspace
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="cta" className="section-block cta-section">
          <div className="section-shell cta-shell">
            <div className="section-heading">
              <span className="eyebrow-label">Closing note</span>
              <h2>{demoCopy.ctaTitle}</h2>
              <p>{demoCopy.ctaBody}</p>
            </div>

            <div className="cta-actions">
              <a
                className="primary-link-button"
                href={demoCopy.ctaPrimaryHref}
                target="_blank"
                rel="noreferrer"
              >
                {demoCopy.ctaPrimaryLabel}
              </a>
              <a className="secondary-link-button" href={demoCopy.ctaSecondaryHref}>
                {demoCopy.ctaSecondaryLabel}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell site-footer-inner">
          <p>Built as a static React + Vite demo for GitHub Pages deployment.</p>
          <p>Demo data is interactive and intentionally non-production.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

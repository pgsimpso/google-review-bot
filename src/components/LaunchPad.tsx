import type { LaunchMilestone, LocationSummary } from "../types";

interface LaunchPadProps {
  location: LocationSummary;
  milestones: LaunchMilestone[];
  onToggleMilestone: (milestoneId: string) => void;
}

function getCountdownLabel(openingDate?: string) {
  if (!openingDate) {
    return "Opening window set";
  }

  const currentDate = new Date();
  const targetDate = new Date(`${openingDate}T12:00:00`);
  const diffMs = targetDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return `${diffDays} days to opening`;
  }

  if (diffDays === 1) {
    return "1 day to opening";
  }

  if (diffDays === 0) {
    return "Opening day";
  }

  return "Opening window passed";
}

export function LaunchPad({
  location,
  milestones,
  onToggleMilestone,
}: LaunchPadProps) {
  const completedCount = milestones.filter((milestone) => milestone.complete).length;
  const progressTarget = location.launchGoal ?? 50;
  const progressCurrent = location.launchProgress ?? 0;
  const progressPercent = Math.min((progressCurrent / progressTarget) * 100, 100);
  const readinessPercent =
    milestones.length === 0 ? 0 : Math.round((completedCount / milestones.length) * 100);
  const isExternalLink = location.linkUrl.startsWith("http");
  const timingLabel = location.openingDate
    ? getCountdownLabel(location.openingDate)
    : location.ratingLabel;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-title-row">
        <div>
          <span className="eyebrow-label">Launch workspace</span>
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

      <div className="workspace-grid launch-workspace-grid">
        <section className="panel launch-summary-panel">
          <div className="launch-kicker-row">
            <span className="status-pill status-pending">
              {location.openingLabel ?? "Launch Queue"}
            </span>
            <span className="launch-countdown">{timingLabel}</span>
          </div>

          <h4>Opening-month review runway</h4>
          <p className="launch-intro">
            Public review count is still at zero. This board tracks what has to be in place before the first reviews start landing.
          </p>

          <div className="launch-stat-grid">
            <article className="workspace-highlight-card">
              <span>Checklist</span>
              <strong>
                {completedCount} / {milestones.length}
              </strong>
              <p>Setup tasks already locked before opening week</p>
            </article>
            <article className="workspace-highlight-card">
              <span>Public review count</span>
              <strong>{location.reviewCountLabel}</strong>
              <p>Cold-start state before guests begin posting</p>
            </article>
            <article className="workspace-highlight-card">
              <span>First-review goal</span>
              <strong>
                {progressCurrent} / {progressTarget}
              </strong>
              <p>Target for the first full month after launch</p>
            </article>
          </div>

          <div className="goal-panel">
            <div className="goal-panel-top">
              <span>Readiness</span>
              <strong>{readinessPercent}%</strong>
            </div>
            <div className="metric-progress-track">
              <div
                className="metric-progress-fill"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <p>
              The launch queue covers profile setup, outreach timing, and response tone before opening night.
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow-label">Launch checklist</span>
              <h4>Opening sequence</h4>
            </div>
          </div>
          <div className="milestone-list">
            {milestones.map((milestone) => (
              <button
                key={milestone.id}
                type="button"
                className={`milestone-card ${
                  milestone.complete ? "milestone-complete" : ""
                }`}
                onClick={() => onToggleMilestone(milestone.id)}
                aria-pressed={milestone.complete}
              >
                <div className="milestone-card-top">
                  <strong>{milestone.label}</strong>
                  <span>{milestone.complete ? "complete" : "open"}</span>
                </div>
                <p>{milestone.detail}</p>
                <div className="milestone-card-meta">
                  <span>{milestone.owner}</span>
                  <span>{milestone.dueLabel}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

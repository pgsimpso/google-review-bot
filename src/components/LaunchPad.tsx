import type { LaunchMilestone, LocationSummary } from "../types";

interface LaunchPadProps {
  location: LocationSummary;
  milestones: LaunchMilestone[];
  onToggleMilestone: (milestoneId: string) => void;
}

function getCountdownLabel(openingDate?: string) {
  if (!openingDate) {
    return "Opening date pending";
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
  const isExternalLink = location.linkUrl.startsWith("http");

  return (
    <div className="dashboard-shell">
      <div className="dashboard-title-row">
        <div>
          <span className="eyebrow-label">Launch mode</span>
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
              {location.openingLabel ?? "Opening Soon"}
            </span>
            <span className="launch-countdown">
              {getCountdownLabel(location.openingDate)}
            </span>
          </div>

          <h4>Opening-month reputation target</h4>
          <p className="launch-intro">
            The point of launch mode is to keep the first page of reviews from happening by accident. This timeline, checklist, and target bar are all demo planning data.
          </p>

          <div className="launch-stat-grid">
            <article className="workspace-highlight-card">
              <span>Milestones complete</span>
              <strong>
                {completedCount} / {milestones.length}
              </strong>
              <p>Setup items already locked in</p>
            </article>
            <article className="workspace-highlight-card">
              <span>Projected opening-month reviews</span>
              <strong>
                {progressCurrent} / {progressTarget}
              </strong>
              <p>Demo target for the first full month live</p>
            </article>
            <article className="workspace-highlight-card">
              <span>Profile readiness</span>
              <strong>{Math.round((completedCount / milestones.length) * 100)}%</strong>
              <p>How close the launch system is to activation</p>
            </article>
          </div>

          <div className="goal-panel">
            <div className="goal-panel-top">
              <span>First 50 review runway</span>
              <strong>{Math.round(progressPercent)}%</strong>
            </div>
            <div className="metric-progress-track">
              <div
                className="metric-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p>
              Use this as the money slide: the venue opens with a request engine, response tone, and follow-up list already staged.
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow-label">Launch checklist</span>
              <h4>Interactive prep board</h4>
            </div>
          </div>
          <p className="panel-note">
            Toggle tasks to show how the opening sequence can be tracked in one place.
          </p>
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

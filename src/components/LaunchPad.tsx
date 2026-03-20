import type { LaunchMilestone, LocationSummary } from "../types";

interface LaunchPadProps {
  location: LocationSummary;
  milestones: LaunchMilestone[];
  onToggleMilestone: (milestoneId: string) => void;
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
  const nextOpenTask =
    milestones.find((milestone) => !milestone.complete) ?? milestones[0] ?? null;

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

      <div className="launch-panel-grid">
        <section className="panel launch-summary-panel">
          <div className="launch-kicker-row">
            <span className="launch-badge">{location.ratingLabel}</span>
            <span className="launch-countdown">{readinessPercent}% ready</span>
          </div>

          <h4>Launch mode keeps the work operational.</h4>
          <p className="launch-intro">
            There are no public reviews yet, so this screen stays focused on setup:
            claim the profile, turn on the request flow, and get the first reply
            motion ready before opening week.
          </p>

          <div className="launch-stat-grid">
            <article className="workspace-highlight-card">
              <span>Checklist progress</span>
              <strong>
                {completedCount} / {milestones.length}
              </strong>
              <p>Core launch tasks already completed.</p>
            </article>
            <article className="workspace-highlight-card">
              <span>First-50 goal</span>
              <strong>
                {progressCurrent} / {progressTarget}
              </strong>
              <p>Progress toward the first public proof target.</p>
            </article>
            <article className="workspace-highlight-card">
              <span>Next priority</span>
              <strong>{nextOpenTask?.label ?? "All set"}</strong>
              <p>{nextOpenTask?.dueLabel ?? "No open launch task remains."}</p>
            </article>
          </div>

          <div className="goal-panel">
            <div className="goal-panel-top">
              <span>Review runway</span>
              <strong>{progressCurrent} reviews lined up</strong>
            </div>
            <div className="metric-progress-track">
              <div
                className="metric-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p>
              The launch goal is a visible march toward 50 public reviews, not a
              blank placeholder.
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow-label">Launch checklist</span>
              <h4>What must be true before opening week</h4>
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

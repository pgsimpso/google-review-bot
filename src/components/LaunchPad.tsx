import { useEffect, useState } from "react";
import type { LaunchMilestone, LocationSummary } from "../types";

type LaunchView = "checklist" | "goals";

interface LaunchPadProps {
  location: LocationSummary;
  milestones: LaunchMilestone[];
  isCompactViewport: boolean;
  showHeader?: boolean;
  onToggleMilestone: (milestoneId: string) => void;
}

export function LaunchPad({
  location,
  milestones,
  isCompactViewport,
  showHeader = true,
  onToggleMilestone,
}: LaunchPadProps) {
  const [launchView, setLaunchView] = useState<LaunchView>("checklist");
  const completedCount = milestones.filter((milestone) => milestone.complete).length;
  const progressTarget = location.launchGoal ?? 50;
  const progressCurrent = location.launchProgress ?? 0;
  const progressPercent = Math.min((progressCurrent / progressTarget) * 100, 100);
  const readinessPercent =
    milestones.length === 0 ? 0 : Math.round((completedCount / milestones.length) * 100);
  const isExternalLink = location.linkUrl.startsWith("http");
  const nextOpenTask =
    milestones.find((milestone) => !milestone.complete) ?? milestones[0] ?? null;

  useEffect(() => {
    setLaunchView("checklist");
  }, [location.id]);

  const launchIntro =
    "No public reviews yet. Stay in setup mode: claim the profile, turn on requests, and lock the first reply tone.";

  const goalContent = (
    <section className="panel launch-summary-panel">
      <div className="launch-kicker-row">
        <span className="launch-badge">{location.ratingLabel}</span>
        <span className="launch-countdown">{readinessPercent}% ready</span>
      </div>

      <h4>Launch mode keeps the work operational.</h4>
      <p className="launch-intro">{launchIntro}</p>

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
        <p>The launch goal should feel like a visible march toward public proof.</p>
      </div>
    </section>
  );

  const checklistContent = (
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
  );

  return (
    <div className="dashboard-shell">
      {showHeader ? (
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
      ) : null}

      {isCompactViewport ? (
        <>
          <section className="panel compact-launch-priority">
            <span className="eyebrow-label">Next priority</span>
            <h4>{nextOpenTask?.label ?? "All launch work is covered"}</h4>
            <p>{nextOpenTask?.dueLabel ?? "No open milestone remains."}</p>
          </section>

          <div className="launch-view-toggle" role="tablist" aria-label="Launch views">
            <button
              type="button"
              className={`launch-view-chip ${
                launchView === "checklist" ? "launch-view-chip-active" : ""
              }`}
              onClick={() => setLaunchView("checklist")}
              aria-pressed={launchView === "checklist"}
            >
              Checklist
            </button>
            <button
              type="button"
              className={`launch-view-chip ${
                launchView === "goals" ? "launch-view-chip-active" : ""
              }`}
              onClick={() => setLaunchView("goals")}
              aria-pressed={launchView === "goals"}
            >
              Goals
            </button>
          </div>

          {launchView === "checklist" ? checklistContent : goalContent}
        </>
      ) : (
        <div className="launch-panel-grid">
          {goalContent}
          {checklistContent}
        </div>
      )}
    </div>
  );
}

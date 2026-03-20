import type { LaunchMilestone, LocationSummary } from "../types";

interface LocationCardProps {
  location: LocationSummary;
  milestones: LaunchMilestone[];
  unansweredCount: number;
  active: boolean;
  compact?: boolean;
  onSelect: (locationId: string) => void;
}

function renderRatingStars(rating?: number) {
  const roundedRating = Math.round(rating ?? 0);

  return (
    <span className="star-row" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={`${rating ?? 0}-${index}`}
          className={`star-icon ${index < roundedRating ? "star-icon-filled" : ""}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function LocationCard({
  location,
  milestones,
  unansweredCount,
  active,
  compact = false,
  onSelect,
}: LocationCardProps) {
  const completedMilestones = milestones.filter((milestone) => milestone.complete).length;
  const readinessPercent =
    milestones.length === 0 ? 0 : Math.round((completedMilestones / milestones.length) * 100);
  const progressTarget = location.launchGoal ?? 50;
  const progressCurrent = location.launchProgress ?? 0;
  const progressPercent = Math.min((progressCurrent / progressTarget) * 100, 100);
  const nextOpenMilestone =
    milestones.find((milestone) => !milestone.complete) ?? milestones[0] ?? null;

  if (location.status === "coming-soon") {
    return (
      <button
        type="button"
        className={`location-card location-card-launch ${
          active ? "location-card-active" : ""
        }`}
        onClick={() => onSelect(location.id)}
        aria-pressed={active}
      >
        <div className="location-card-topline">
          <span className="eyebrow-label">Launch mode</span>
          <span className="launch-badge">{readinessPercent}% ready</span>
        </div>

        <div className="location-card-main">
          <div>
            <h3>{location.name}</h3>
            <p className="location-address">{location.address}</p>
          </div>
        </div>

        {compact ? (
          <div className="location-card-compact-grid">
            <div className="location-card-compact-stat">
              <span>Next priority</span>
              <strong>{nextOpenMilestone?.label ?? "All set"}</strong>
            </div>
            <div className="location-card-compact-stat">
              <span>First-50 goal</span>
              <strong>
                {progressCurrent} / {progressTarget}
              </strong>
            </div>
          </div>
        ) : (
          <>
            <div className="launch-checklist-preview">
              {milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="launch-checklist-row">
                  <span
                    className={`launch-check-icon ${
                      milestone.complete ? "launch-check-icon-complete" : ""
                    }`}
                    aria-hidden="true"
                  >
                    {milestone.complete ? "✓" : "○"}
                  </span>
                  <span>{milestone.label}</span>
                </div>
              ))}
            </div>

            <div className="launch-goal-block">
              <div className="launch-goal-top">
                <span>First-50 review goal</span>
                <strong>
                  {progressCurrent} / {progressTarget}
                </strong>
              </div>
              <div className="metric-progress-track">
                <div
                  className="metric-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`location-card location-card-live ${
        active ? "location-card-active" : ""
      }`}
      onClick={() => onSelect(location.id)}
      aria-pressed={active}
    >
      <div className="location-card-topline">
        <span className="eyebrow-label">Live location</span>
        <span
          className={`location-card-badge ${
            unansweredCount > 0 ? "location-card-badge-alert" : "location-card-badge-clear"
          }`}
        >
          {unansweredCount > 0 ? `${unansweredCount} open` : "All caught up"}
        </span>
      </div>

      <div className="location-card-main">
        <div>
          <h3>{location.name}</h3>
          <p className="location-address">{location.address}</p>
        </div>

        {!compact ? (
          <div className="location-score-block">
            <strong>{location.ratingLabel}</strong>
            {renderRatingStars(location.rating)}
          </div>
        ) : null}
      </div>

      {compact ? (
        <div className="location-card-compact-grid">
          <div className="location-card-compact-stat">
            <span>Rating</span>
            <strong>{location.ratingLabel}</strong>
            {renderRatingStars(location.rating)}
          </div>
          <div className="location-card-compact-stat">
            <span>This week</span>
            <strong>+{location.reviewsThisWeek}</strong>
            <p>
              {location.reviewsThisWeek >= location.reviewsLastWeek ? "up" : "down"} from{" "}
              {location.reviewsLastWeek}
            </p>
          </div>
        </div>
      ) : (
        <div className="location-card-stat">
          <span>Reviews this week</span>
          <strong>+{location.reviewsThisWeek}</strong>
          <p>
            {location.reviewsThisWeek >= location.reviewsLastWeek ? "up" : "down"} from{" "}
            {location.reviewsLastWeek} last week
          </p>
        </div>
      )}
    </button>
  );
}

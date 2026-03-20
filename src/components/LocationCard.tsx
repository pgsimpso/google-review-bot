import type { LocationSummary } from "../types";
import { Sparkline } from "./Sparkline";

interface LocationCardProps {
  location: LocationSummary;
  active: boolean;
  onSelect: (locationId: string) => void;
}

const trendMeta = {
  up: { arrow: "\u2197", label: "up" },
  flat: { arrow: "\u2192", label: "flat" },
  down: { arrow: "\u2198", label: "down" },
};

export function LocationCard({
  location,
  active,
  onSelect,
}: LocationCardProps) {
  const trend = trendMeta[location.trend];
  const chipLabel = location.trendChipLabel ?? trend.label;

  return (
    <button
      type="button"
      className={`location-card ${active ? "location-card-active" : ""} ${
        location.status === "coming-soon" ? "location-card-upcoming" : ""
      }`}
      onClick={() => onSelect(location.id)}
      aria-pressed={active}
    >
      <div className="location-card-topline">
        <span className="eyebrow-label">{location.sourceLabel}</span>
        <span className={`trend-chip trend-${location.trend}`}>
          {location.status === "live" ? <span aria-hidden="true">{trend.arrow}</span> : null}
          {chipLabel}
        </span>
      </div>

      <div className="location-card-main">
        <div>
          <h3>{location.name}</h3>
          <p className="location-address">{location.address}</p>
        </div>

        <div className="location-score-block">
          <strong>{location.ratingLabel}</strong>
          <span>{location.reviewCountLabel}</span>
        </div>
      </div>

      <p className="location-focus">{location.focusBlurb}</p>

      <div className="location-card-bottom">
        <Sparkline
          values={location.sparkline}
          muted={location.status === "coming-soon"}
        />
        <p>{location.trendLabel}</p>
      </div>
    </button>
  );
}

export type LocationStatus = "live" | "coming-soon";
export type TrendDirection = "up" | "flat" | "down";
export type ReviewStatus = "responded" | "pending" | "flagged";
export type ReviewSentiment = "positive" | "mixed" | "negative";
export type ThemeTone = "critical" | "watch" | "stable";

export interface NavLink {
  id: string;
  label: string;
}

export interface ProofPoint {
  value: string;
  label: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface SummaryStat {
  label: string;
  value: string;
  detail: string;
}

export interface DemoCopy {
  navLinks: NavLink[];
  hero: {
    kicker: string;
    title: string;
    summary: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    demoBadge: string;
  };
  proofPoints: ProofPoint[];
  summaryStats: SummaryStat[];
  overviewTitle: string;
  overviewBody: string;
  dashboardTitle: string;
  dashboardBody: string;
  launchTitle: string;
  launchBody: string;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export interface LocationSummary {
  id: string;
  name: string;
  shortName: string;
  address: string;
  status: LocationStatus;
  rating?: number;
  ratingLabel: string;
  reviewCountLabel: string;
  trend: TrendDirection;
  trendLabel: string;
  sparkline: number[];
  focusBlurb: string;
  detailNote: string;
  sourceLabel: string;
  linkLabel: string;
  linkUrl: string;
  openingLabel?: string;
  openingDate?: string;
  launchGoal?: number;
  launchProgress?: number;
}

export interface ReviewItem {
  id: string;
  locationId: string;
  author: string;
  stars: number;
  dateLabel: string;
  sentiment: ReviewSentiment;
  status: ReviewStatus;
  snippet: string;
  aiResponse: string;
  tags: string[];
}

export interface ThemeCategory {
  id: string;
  locationId: string;
  label: string;
  value: number;
  tone: ThemeTone;
}

export interface AutomationMetric {
  id: string;
  locationId: string;
  label: string;
  value: string;
  sublabel: string;
  progress: number;
}

export interface LaunchMilestone {
  id: string;
  locationId: string;
  label: string;
  detail: string;
  owner: string;
  dueLabel: string;
  complete: boolean;
}

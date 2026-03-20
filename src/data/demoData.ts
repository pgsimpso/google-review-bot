import type {
  AutomationMetric,
  DemoCopy,
  LaunchMilestone,
  LocationSummary,
  ReviewItem,
  ThemeCategory,
} from "../types";

export const demoCopy: DemoCopy = {
  navLinks: [
    { id: "overview", label: "Portfolio" },
    { id: "workspace", label: "Workspace" },
  ],
  hero: {
    kicker: "Jay Trikha Restaurant Group",
    title: "Reputation Dashboard",
    summary:
      "One live venue, three 2026 launches, and a single view of review volume, response pressure, and launch readiness.",
    primaryCtaLabel: "Open Savannah Taphouse",
    primaryCtaHref: "#workspace",
    secondaryCtaLabel: "Open Launch Queue",
    secondaryCtaHref: "#workspace",
    demoBadge:
      "Interactive demo snapshot. Review actions update local state only.",
  },
  proofPoints: [],
  summaryStats: [
    {
      label: "Total locations",
      value: "4",
      detail: "Savannah live, three venues in launch mode",
    },
    {
      label: "Live public reviews",
      value: "418",
      detail: "Current Google footprint at Savannah Taphouse",
    },
    {
      label: "Portfolio rating",
      value: "4.2 / 5",
      detail: "Current live rating before the 2026 openings",
    },
    {
      label: "Launch-mode venues",
      value: "3",
      detail: "Public review count starts at zero for each opening",
    },
    {
      label: "Launch tasks complete",
      value: "4 / 12",
      detail: "Shared readiness board across the 2026 openings",
    },
  ],
  overviewTitle: "Portfolio overview",
  overviewBody:
    "Savannah Taphouse is the live listing. Pritchard & Co., Nico Angelo's, and Elsewhere enter 2026 with no public review history yet.",
  dashboardTitle: "Active workspace",
  dashboardBody:
    "Select a venue from the portfolio. Live locations open the review queue. Launching venues open their checklist and first-review runway.",
  launchTitle: "Launch Readiness",
  launchBody:
    "Each new venue needs profile setup, request templates, and the first review runway before opening week.",
  ctaTitle: "",
  ctaBody: "",
  ctaPrimaryLabel: "",
  ctaPrimaryHref: "#overview",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "#overview",
};

export const locations: LocationSummary[] = [
  {
    id: "savannah-taphouse",
    name: "Savannah Taphouse",
    shortName: "Taphouse",
    address: "125 E. Broughton St, Savannah, GA",
    status: "live",
    rating: 4.2,
    ratingLabel: "4.2 / 5",
    reviewCountLabel: "418 Google reviews",
    trend: "flat",
    trendLabel: "Stable rating with repeat complaints around waits and handoffs",
    sparkline: [38, 36, 35, 37, 34, 33, 35, 32, 34, 33, 31, 32],
    focusBlurb:
      "The live flagship gives the team real review pressure, real themes, and the clearest signal for what needs attention now.",
    detailNote:
      "Live review count and rating are the anchor. Queue state, theme buckets, and draft replies are shown as a working demo.",
    sourceLabel: "Live listing",
    linkLabel: "Open Google Maps listing",
    linkUrl:
      "https://www.google.com/maps/place/Savannah+Taphouse/data=!4m2!3m1!1s0x0:0x48adfde5d6230cb6",
  },
  {
    id: "pritchard-and-co",
    name: "Pritchard & Co.",
    shortName: "Pritchard",
    address: "207 W. Broughton St, Savannah, GA",
    status: "coming-soon",
    ratingLabel: "Launching Q2 2026",
    reviewCountLabel: "0 public reviews",
    trend: "flat",
    trendLabel: "No review history yet",
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focusBlurb:
      "Opening-year concept with no public review history yet. First-page social proof has to be staged before opening week.",
    detailNote:
      "Launch mode tracks profile setup, request templates, and the first wave of review outreach before doors open.",
    sourceLabel: "Launch mode",
    linkLabel: "Open launch workspace",
    linkUrl: "#workspace",
    openingLabel: "Launch Queue",
  },
  {
    id: "nico-angelos",
    name: "Nico Angelo's Italiano",
    shortName: "Nico Angelo's",
    address: "309 W. Congress St, Savannah, GA",
    status: "coming-soon",
    ratingLabel: "Launching April 2026",
    reviewCountLabel: "0 public reviews",
    trend: "flat",
    trendLabel: "No review history yet",
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focusBlurb:
      "Chef-led opening with a blank review slate. The first month of public sentiment will define the baseline.",
    detailNote:
      "The opening month starts at zero. Launch mode keeps profile readiness and early outreach visible before service begins.",
    sourceLabel: "Launch mode",
    linkLabel: "Open venue website",
    linkUrl: "https://www.nicosav.com/",
    openingLabel: "Launch Queue",
    launchGoal: 50,
    launchProgress: 0,
  },
  {
    id: "elsewhere",
    name: "Elsewhere",
    shortName: "Elsewhere",
    address: "18 E. Bay St, Savannah, GA",
    status: "coming-soon",
    ratingLabel: "Launching Late 2026",
    reviewCountLabel: "0 public reviews",
    trend: "flat",
    trendLabel: "No review history yet",
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focusBlurb:
      "Membership-led concept with no public review footprint yet. The opening tone matters as much as the initial volume.",
    detailNote:
      "Launch mode is focused on tone, invite sequencing, and the first 25 reviews instead of reactive cleanup later.",
    sourceLabel: "Launch mode",
    linkLabel: "Open launch workspace",
    linkUrl: "#workspace",
    openingLabel: "Launch Queue",
    launchGoal: 50,
    launchProgress: 0,
  },
];

export const reviews: ReviewItem[] = [
  {
    id: "taphouse-r1",
    locationId: "savannah-taphouse",
    author: "Hannah W.",
    stars: 2,
    dateLabel: "Mar 19, 8:47 PM",
    sentiment: "negative",
    status: "pending",
    snippet:
      "Waited almost 40 minutes after ordering and two tables seated after us got food first. Drinks were fine, but the kitchen timing lost us.",
    aiResponse:
      "Hannah, thank you for being direct about the wait. That ticket time is not the experience we want tied to Savannah Taphouse, and we are reviewing the kitchen flow from that service period now. I would like the chance to make this right on a future visit.",
    tags: ["slow kitchen", "long wait"],
  },
  {
    id: "taphouse-r2",
    locationId: "savannah-taphouse",
    author: "Marcus P.",
    stars: 2,
    dateLabel: "Mar 18, 9:16 PM",
    sentiment: "negative",
    status: "flagged",
    snippet:
      "Service changed completely after the shift swap. We had to repeat our order, nobody checked back, and the table felt forgotten for the last half of the meal.",
    aiResponse:
      "Marcus, I appreciate the detail here. A handoff between shifts should be invisible to the guest, and we clearly missed that mark with your table. I am flagging this with the floor leads so the service standard stays consistent from start to finish.",
    tags: ["shift change", "service inconsistency"],
  },
  {
    id: "taphouse-r3",
    locationId: "savannah-taphouse",
    author: "Elise R.",
    stars: 3,
    dateLabel: "Mar 17, 7:42 PM",
    sentiment: "mixed",
    status: "pending",
    snippet:
      "Love the room and the beer list, but it was freezing near the windows and the music got too loud to hold a conversation once dinner service picked up.",
    aiResponse:
      "Elise, thanks for the balanced note. We want the room to feel energetic, not uncomfortable, and the temperature and sound level should never get in the way of dinner. I am sharing this with the floor team so we tighten both.",
    tags: ["too cold", "too loud"],
  },
  {
    id: "taphouse-r4",
    locationId: "savannah-taphouse",
    author: "Chris D.",
    stars: 5,
    dateLabel: "Mar 16, 6:31 PM",
    sentiment: "positive",
    status: "responded",
    snippet:
      "Busy Saturday, but the staff kept things moving and the beer list still delivers. Exactly why we keep coming back.",
    aiResponse:
      "Chris, appreciate you coming back in. Busy nights still have to feel buttoned up from the guest side, so I am glad the team delivered for you.",
    tags: ["repeat guest", "beer list"],
  },
];

export const themeCategories: ThemeCategory[] = [
  {
    id: "taphouse-theme-1",
    locationId: "savannah-taphouse",
    label: "Slow kitchen / long waits",
    value: 23,
    tone: "critical",
  },
  {
    id: "taphouse-theme-2",
    locationId: "savannah-taphouse",
    label: "Shift-change service lapses",
    value: 17,
    tone: "critical",
  },
  {
    id: "taphouse-theme-3",
    locationId: "savannah-taphouse",
    label: "Atmosphere: cold / loud",
    value: 11,
    tone: "watch",
  },
];

export const automationMetrics: AutomationMetric[] = [
  {
    id: "taphouse-m1",
    locationId: "savannah-taphouse",
    label: "Review requests sent",
    value: "96",
    sublabel: "Last 30 days across dine-in and events",
    progress: 0.76,
  },
  {
    id: "taphouse-m2",
    locationId: "savannah-taphouse",
    label: "Request conversion",
    value: "18%",
    sublabel: "Guest follow-up that became a posted review",
    progress: 0.58,
  },
  {
    id: "taphouse-m3",
    locationId: "savannah-taphouse",
    label: "Draft response time",
    value: "14 min",
    sublabel: "Average time to first draft during recent service windows",
    progress: 0.82,
  },
  {
    id: "taphouse-m4",
    locationId: "savannah-taphouse",
    label: "Escalations this week",
    value: "2",
    sublabel: "Reviews that need an owner follow-up before posting",
    progress: 0.3,
  },
];

export const launchMilestones: LaunchMilestone[] = [
  {
    id: "pritchard-m1",
    locationId: "pritchard-and-co",
    label: "Claim Google Business Profile",
    detail: "Lock categories, hours, and opening message before first service.",
    owner: "Arcadian",
    dueLabel: "Due now",
    complete: true,
  },
  {
    id: "pritchard-m2",
    locationId: "pritchard-and-co",
    label: "Load opening-week request templates",
    detail: "Reservation follow-up and first-visit review asks staged for launch.",
    owner: "Arcadian",
    dueLabel: "Due this week",
    complete: true,
  },
  {
    id: "pritchard-m3",
    locationId: "pritchard-and-co",
    label: "Approve opening response tone",
    detail: "Lock response style before first reviews begin to land.",
    owner: "Jay + ops",
    dueLabel: "Pre-open",
    complete: false,
  },
  {
    id: "pritchard-m4",
    locationId: "pritchard-and-co",
    label: "Stage first 25 guest list",
    detail: "Identify preview guests and early regulars for the first review runway.",
    owner: "Venue team",
    dueLabel: "Pre-open",
    complete: false,
  },
  {
    id: "nico-m1",
    locationId: "nico-angelos",
    label: "Claim Google Business Profile",
    detail: "Reserve the listing name, categories, and launch messaging before soft open.",
    owner: "Arcadian",
    dueLabel: "Due now",
    complete: true,
  },
  {
    id: "nico-m2",
    locationId: "nico-angelos",
    label: "Load preview-night request flows",
    detail: "VIP dinner and reservation follow-up copy ready before the first service push.",
    owner: "Arcadian",
    dueLabel: "Due this week",
    complete: false,
  },
  {
    id: "nico-m3",
    locationId: "nico-angelos",
    label: "Build opening-week recovery flow",
    detail: "Escalation path for early misses, especially service recovery and pacing complaints.",
    owner: "Arcadian + venue lead",
    dueLabel: "Due pre-open",
    complete: false,
  },
  {
    id: "nico-m4",
    locationId: "nico-angelos",
    label: "Seed opening-month target list",
    detail: "Identify guests, regulars, and VIP previews most likely to review.",
    owner: "Venue team",
    dueLabel: "Due pre-open",
    complete: false,
  },
  {
    id: "elsewhere-m1",
    locationId: "elsewhere",
    label: "Claim profile and brand naming variants",
    detail: "Lock the correct lounge naming before search demand fragments.",
    owner: "Arcadian",
    dueLabel: "Due in Q2",
    complete: true,
  },
  {
    id: "elsewhere-m2",
    locationId: "elsewhere",
    label: "Define invitation-only review moments",
    detail: "Map follow-up moments that fit a membership experience without feeling transactional.",
    owner: "Arcadian + ops",
    dueLabel: "Due in Q3",
    complete: false,
  },
  {
    id: "elsewhere-m3",
    locationId: "elsewhere",
    label: "Train response tone for premium service issues",
    detail: "Responses should sound elevated and discreet, not templated.",
    owner: "Arcadian",
    dueLabel: "Due in Q3",
    complete: false,
  },
  {
    id: "elsewhere-m4",
    locationId: "elsewhere",
    label: "Build first-50 review runway",
    detail: "Curate launch guest segments and member follow-up sequences.",
    owner: "Venue team",
    dueLabel: "Due in Q4",
    complete: false,
  },
];

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
    { id: "proof", label: "Proof" },
    { id: "overview", label: "Locations" },
    { id: "dashboard", label: "Dashboard" },
    { id: "launch-pad", label: "Launch Pad" },
    { id: "cta", label: "Close" },
  ],
  hero: {
    kicker: "Arcadian Cloud x Jay Trikha",
    title: "A reputation engine for Savannah Taphouse and the next two openings",
    summary:
      "This interactive concept demo shows how Reputation Autopilot can ask for reviews after every visit, respond in Jay's voice, and give new venues a launch-day reputation plan instead of a cold start.",
    primaryCtaLabel: "Open the dashboard",
    primaryCtaHref: "#overview",
    secondaryCtaLabel: "Jump to launch mode",
    secondaryCtaHref: "#launch-pad",
    demoBadge:
      "Interactive concept demo. Public venue facts are mixed with clearly labeled simulated workflow data.",
  },
  proofPoints: [
    {
      value: "5-9%",
      label: "More revenue from a one-star improvement",
      detail:
        "The revenue upside is material enough that faster review generation and response handling pays for itself quickly.",
      sourceLabel: "Harvard Business School",
      sourceUrl:
        "https://www.hbs.edu/ris/Publication%20Files/12-016_a7e4a5a2-03f9-490d-b093-8f951238dba2.pdf",
    },
    {
      value: "88%",
      label: "Consumers prefer businesses that respond",
      detail:
        "Fast, thoughtful replies are not cosmetic. They change whether future guests feel safe booking a table.",
      sourceLabel: "BrightLocal 2024",
      sourceUrl:
        "https://www.brightlocal.com/research/local-consumer-review-survey-2024/",
    },
    {
      value: "97%",
      label: "Review readers also read the owner's response",
      detail:
        "The response layer is part of the public brand. Silence on a bad review reads like confirmation.",
      sourceLabel: "BrightLocal 2019",
      sourceUrl:
        "https://www.brightlocal.com/research/local-consumer-review-survey-2019/",
    },
    {
      value: "< 1 day",
      label: "Response speed raises the odds of a review upgrade",
      detail:
        "This is why the demo prioritizes minutes-to-response instead of waiting for staff to clear the queue manually.",
      sourceLabel: "Yelp / NRN",
      sourceUrl:
        "https://www.nrn.com/operations/how-turn-bad-review-around",
    },
  ],
  summaryStats: [
    {
      label: "Total review footprint",
      value: "2,762",
      detail: "Live venues plus launch-mode projections",
    },
    {
      label: "Average rating",
      value: "4.3 / 5",
      detail: "Across the active Google footprint in this scenario",
    },
    {
      label: "Reviews this month",
      value: "39",
      detail: "Shows why a shared team dashboard matters",
    },
    {
      label: "Response rate",
      value: "91%",
      detail: "Simulated operational benchmark for the concept",
    },
    {
      label: "Average response time",
      value: "22 min",
      detail: "Targeting the same-day recovery window",
    },
  ],
  overviewTitle: "Four venues, one operating view",
  overviewBody:
    "Savannah Taphouse anchors the live footprint, Pritchard & Co. shows what early traction looks like, and the next two venues get a launch dashboard before the first guest walks in.",
  dashboardTitle: "Interactive drill-down",
  dashboardBody:
    "Select a venue to inspect the live review workflow or switch into launch mode for the opening-soon properties. All numbers below marked as demo operations are simulated for presentation.",
  launchTitle: "Launch Pad for Nico Angelo's and Elsewhere",
  launchBody:
    "The opening venues should not start at zero. Launch mode tracks setup tasks, request templates, and the opening-month review target before the doors open.",
  ctaTitle: "Show Jay how the review flywheel starts before opening night",
  ctaBody:
    "The pitch is simple: turn each finished meal into a request, answer every review quickly, and give the next two venues a reputation system on day one.",
  ctaPrimaryLabel: "Visit Arcadian Cloud",
  ctaPrimaryHref: "https://arcadian.cloud",
  ctaSecondaryLabel: "Re-open the dashboard",
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
    reviewCountLabel: "2,700+ Google reviews",
    trend: "flat",
    trendLabel: "Holding steady with room to recover slower service nights",
    sparkline: [31, 29, 32, 30, 31, 28, 29, 31, 30, 32, 29, 30],
    focusBlurb:
      "High-volume flagship. The operational win is faster response coverage and more consistent post-visit review asks.",
    detailNote:
      "Venue facts are based on the live footprint. Theme scores, response drafts, and automation metrics below are demo data.",
    sourceLabel: "Public venue anchor",
    linkLabel: "Open Google Maps listing",
    linkUrl:
      "https://www.google.com/maps/place/Savannah+Taphouse/data=!4m2!3m1!1s0x0:0x48adfde5d6230cb6",
  },
  {
    id: "pritchard-and-co",
    name: "Pritchard & Co.",
    shortName: "Pritchard",
    address: "207 W. Broughton St, Savannah, GA",
    status: "live",
    rating: 4.6,
    ratingLabel: "4.6 / 5",
    reviewCountLabel: "28 early reviews",
    trend: "up",
    trendLabel: "New location with momentum and thin review volume",
    sparkline: [2, 3, 4, 5, 6, 7, 8, 10, 13, 16, 21, 28],
    focusBlurb:
      "A new listing with very little social proof. Automation matters more here because every early review shapes the baseline.",
    detailNote:
      "Opening status is real. Review velocity, response timings, and customer request metrics are simulated for demo purposes.",
    sourceLabel: "Public venue anchor",
    linkLabel: "Open Yelp listing",
    linkUrl: "https://www.yelp.com/biz/pritchard-co-savannah-2",
  },
  {
    id: "nico-angelos",
    name: "Nico Angelo's Italiano",
    shortName: "Nico Angelo's",
    address: "309 W. Congress St, Savannah, GA",
    status: "coming-soon",
    ratingLabel: "Opening April 2026",
    reviewCountLabel: "No Google footprint yet",
    trend: "up",
    trendLabel: "Launch plan should be live before the first service",
    sparkline: [0, 0, 0, 0, 0, 2, 5, 8, 11, 14, 18, 22],
    focusBlurb:
      "Chef-led opening with a chance to script the first fifty reviews instead of chasing them after launch.",
    detailNote:
      "Opening date and brand details come from the brief. Countdown, milestones, and review target progress are demo planning data.",
    sourceLabel: "Launch scenario",
    linkLabel: "Open venue website",
    linkUrl: "https://www.nicosav.com/",
    openingLabel: "Coming Soon",
    openingDate: "2026-04-18",
    launchGoal: 50,
    launchProgress: 18,
  },
  {
    id: "elsewhere",
    name: "Elsewhere",
    shortName: "Elsewhere",
    address: "18 E. Bay St, Savannah, GA",
    status: "coming-soon",
    ratingLabel: "Opening late 2026",
    reviewCountLabel: "No Google listing yet",
    trend: "up",
    trendLabel: "Brand build starts with profile readiness and invite lists",
    sparkline: [0, 0, 0, 0, 1, 2, 4, 7, 9, 12, 15, 19],
    focusBlurb:
      "A premium lounge concept where reputation tone matters as much as volume. The launch system should feel curated, not mass-market.",
    detailNote:
      "The venue exists in the brief only. All launch sequencing, metrics, and review goals are demo projections.",
    sourceLabel: "Launch scenario",
    linkLabel: "View planning note",
    linkUrl: "#launch-pad",
    openingLabel: "Coming Soon",
    openingDate: "2026-11-14",
    launchGoal: 50,
    launchProgress: 11,
  },
];

export const reviews: ReviewItem[] = [
  {
    id: "taphouse-r1",
    locationId: "savannah-taphouse",
    author: "Nicole M.",
    stars: 2,
    dateLabel: "Mar 18",
    sentiment: "negative",
    status: "pending",
    snippet:
      "The burger was solid, but we waited forever for entrees and the dining room felt louder than usual.",
    aiResponse:
      "Nicole, thanks for calling this out. A long ticket time and a noisy room are not the standard we want associated with Savannah Taphouse. We are reviewing that service window with the floor and kitchen leads, and I would like another chance to earn back your confidence.",
    tags: ["slow kitchen", "noise"],
  },
  {
    id: "taphouse-r2",
    locationId: "savannah-taphouse",
    author: "Aaron T.",
    stars: 5,
    dateLabel: "Mar 17",
    sentiment: "positive",
    status: "responded",
    snippet:
      "Great beer list, quick service, and the staff handled a packed Friday night really well.",
    aiResponse:
      "Aaron, appreciate you spending your Friday with us. Packed nights only work when the room still feels taken care of, so I am glad the team delivered for you. Hope we see you again soon.",
    tags: ["beer list", "service win"],
  },
  {
    id: "taphouse-r3",
    locationId: "savannah-taphouse",
    author: "Maria C.",
    stars: 3,
    dateLabel: "Mar 15",
    sentiment: "mixed",
    status: "flagged",
    snippet:
      "Drinks were great, but the server disappeared after the food landed and nobody checked back until the end.",
    aiResponse:
      "Maria, thank you for the balanced feedback. We love hearing the bar program landed, but disappearing service after food hits the table is a miss. I am escalating this to our floor leadership so the follow-through matches the quality of the drinks.",
    tags: ["service inconsistency"],
  },
  {
    id: "taphouse-r4",
    locationId: "savannah-taphouse",
    author: "David H.",
    stars: 4,
    dateLabel: "Mar 14",
    sentiment: "positive",
    status: "pending",
    snippet:
      "Good atmosphere and solid pub food. Patio was a nice surprise once the weather cooled off.",
    aiResponse:
      "David, glad the patio hit at the right time and that the room felt good overall. Thanks for spending the evening with us and for taking the time to leave a note.",
    tags: ["atmosphere", "patio"],
  },
  {
    id: "pritchard-r1",
    locationId: "pritchard-and-co",
    author: "Lauren S.",
    stars: 5,
    dateLabel: "Mar 18",
    sentiment: "positive",
    status: "responded",
    snippet:
      "Beautiful room and a polished first impression. You can tell the team cares about details.",
    aiResponse:
      "Lauren, thank you. We are still early in the life of Pritchard & Co., so hearing that the room and details already feel polished means a lot to us.",
    tags: ["opening buzz", "ambience"],
  },
  {
    id: "pritchard-r2",
    locationId: "pritchard-and-co",
    author: "Ben R.",
    stars: 4,
    dateLabel: "Mar 16",
    sentiment: "mixed",
    status: "pending",
    snippet:
      "Cocktails were great, but the pacing between courses felt a little long for a midweek dinner.",
    aiResponse:
      "Ben, appreciate the visit and the note about pacing. We want the meal to feel relaxed without dragging, and your feedback helps us tighten that balance while we dial in the room.",
    tags: ["pacing", "bar program"],
  },
  {
    id: "pritchard-r3",
    locationId: "pritchard-and-co",
    author: "Sofia L.",
    stars: 2,
    dateLabel: "Mar 13",
    sentiment: "negative",
    status: "flagged",
    snippet:
      "Host stand greeting felt cold and the table was not ready when we arrived for our reservation.",
    aiResponse:
      "Sofia, thanks for being direct about this. Reservation arrivals should feel smooth and warm from the first minute, and we missed that standard for you. I am flagging this for immediate review with the host team.",
    tags: ["host stand", "reservation handoff"],
  },
];

export const themeCategories: ThemeCategory[] = [
  {
    id: "taphouse-theme-1",
    locationId: "savannah-taphouse",
    label: "Slow kitchen",
    value: 82,
    tone: "critical",
  },
  {
    id: "taphouse-theme-2",
    locationId: "savannah-taphouse",
    label: "Service inconsistency",
    value: 65,
    tone: "critical",
  },
  {
    id: "taphouse-theme-3",
    locationId: "savannah-taphouse",
    label: "Noise",
    value: 44,
    tone: "watch",
  },
  {
    id: "taphouse-theme-4",
    locationId: "savannah-taphouse",
    label: "Cleanliness",
    value: 18,
    tone: "stable",
  },
  {
    id: "pritchard-theme-1",
    locationId: "pritchard-and-co",
    label: "Course pacing",
    value: 39,
    tone: "watch",
  },
  {
    id: "pritchard-theme-2",
    locationId: "pritchard-and-co",
    label: "Host stand warmth",
    value: 35,
    tone: "critical",
  },
  {
    id: "pritchard-theme-3",
    locationId: "pritchard-and-co",
    label: "Acoustics",
    value: 22,
    tone: "watch",
  },
  {
    id: "pritchard-theme-4",
    locationId: "pritchard-and-co",
    label: "Menu clarity",
    value: 15,
    tone: "stable",
  },
];

export const automationMetrics: AutomationMetric[] = [
  {
    id: "taphouse-m1",
    locationId: "savannah-taphouse",
    label: "Requests sent this week",
    value: "148",
    sublabel: "Timed after paid checks and private events",
    progress: 0.82,
  },
  {
    id: "taphouse-m2",
    locationId: "savannah-taphouse",
    label: "Request-to-review conversion",
    value: "18%",
    sublabel: "Stronger when the request lands within two hours",
    progress: 0.64,
  },
  {
    id: "taphouse-m3",
    locationId: "savannah-taphouse",
    label: "Reviews generated this week",
    value: "27",
    sublabel: "Enough volume to outpace nearby comps over time",
    progress: 0.72,
  },
  {
    id: "taphouse-m4",
    locationId: "savannah-taphouse",
    label: "Average AI response time",
    value: "18 min",
    sublabel: "Demo operations target for nights and weekends",
    progress: 0.88,
  },
  {
    id: "pritchard-m1",
    locationId: "pritchard-and-co",
    label: "Requests sent this week",
    value: "34",
    sublabel: "Smaller volume, tighter guest list",
    progress: 0.56,
  },
  {
    id: "pritchard-m2",
    locationId: "pritchard-and-co",
    label: "Request-to-review conversion",
    value: "23%",
    sublabel: "Healthy early conversion while the listing is fresh",
    progress: 0.77,
  },
  {
    id: "pritchard-m3",
    locationId: "pritchard-and-co",
    label: "Reviews generated this week",
    value: "8",
    sublabel: "Enough to build the first page of proof quickly",
    progress: 0.44,
  },
  {
    id: "pritchard-m4",
    locationId: "pritchard-and-co",
    label: "Average AI response time",
    value: "12 min",
    sublabel: "Good fit for a new concept with close monitoring",
    progress: 0.92,
  },
];

export const launchMilestones: LaunchMilestone[] = [
  {
    id: "nico-m1",
    locationId: "nico-angelos",
    label: "Claim Google Business Profile",
    detail: "Reserve name, categories, hours, and launch messaging before soft open.",
    owner: "Arcadian",
    dueLabel: "Due now",
    complete: true,
  },
  {
    id: "nico-m2",
    locationId: "nico-angelos",
    label: "Load opening-week request templates",
    detail: "Dinner, VIP event, and reservation follow-up copy ready for send.",
    owner: "Arcadian",
    dueLabel: "Due this week",
    complete: true,
  },
  {
    id: "nico-m3",
    locationId: "nico-angelos",
    label: "Build save-playbook for 1-3 star reviews",
    detail: "Escalation flow for chef-driven complaints and opening-week misses.",
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
    complete: true,
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
    detail: "Pick which membership touchpoints trigger review asks without feeling cheap.",
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

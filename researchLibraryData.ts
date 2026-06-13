export type ToolStatus = "live" | "coming_soon";
export type ToolComplexity = "Simple" | "Intermediate" | "Advanced";
export type ToolTier = "free" | "premium";

export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  status: ToolStatus;
  tier: ToolTier;
  route?: string;
  complexity?: ToolComplexity;
}

export interface AIAgent {
  id: string;
  name: string;
  title: string;
  specialty: string;
  field: string;
  bio: string;
  useCases: string[];
  iconEmoji: string;
}

export const TOOL_CATEGORIES = [
  "Safety",
  "Scheduling",
  "Cost & Estimation",
  "Logistics & FF&E",
  "Compliance",
  "Workforce",
  "Sustainability",
  "Reporting & Analytics",
  "Project Management",
  "Client Relations",
] as const;

export const TOOLS: AITool[] = [
  // ── SAFETY (6 tools) ──────────────────────────────────────────────────────
  {
    id: "jsa-generator",
    name: "JSA Generator",
    category: "Safety",
    description:
      "Generates comprehensive Job Safety Analysis documents with hazard identification, control measures, and PPE requirements for any trade scope.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/jsa-generator",
  },
  {
    id: "toolbox-talk",
    name: "Toolbox Talk Generator",
    category: "Safety",
    description:
      "Creates OSHA-aligned toolbox talk scripts for any trade topic, ready for crew briefings with hazard alerts and discussion points.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/toolbox-talk",
  },
  {
    id: "safety-assistant",
    name: "Safety Assistant",
    category: "Safety",
    description:
      "Resolves jobsite safety queries against OSHA 1926 subparts. Returns code citations, applicable forms, and compliant toolbox talk scripts.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/safety-assistant",
  },
  {
    id: "safety-score",
    name: "Safety Score Calculator",
    category: "Safety",
    description:
      "Computes composite safety scores from incident history, training records, inspection results, and near-miss reports with trend analysis.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/safety-score",
  },
  {
    id: "osha-incident-rate",
    name: "OSHA Incident Rate Calculator",
    category: "Safety",
    description:
      "Calculates TRIR, DART, and LTIR from OSHA 300 log inputs. Benchmarks output against BLS industry averages for your NAICS code.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/osha-incident-rate",
  },
  {
    id: "pre-task-plan",
    name: "Pre-Task Safety Planner",
    category: "Safety",
    description:
      "Generates scope- and crew-specific pre-task planning forms. Outputs a morning briefing document ready for field sign-off.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/pre-task-plan",
  },

  // ── SCHEDULING (5 tools) ──────────────────────────────────────────────────
  {
    id: "schedule-calculator",
    name: "Schedule Calculator",
    category: "Scheduling",
    description:
      "Computes critical path, float analysis, and milestone dates from scope inputs. Models delay impacts and compression scenarios.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/schedule-calculator",
  },
  {
    id: "room-turnover",
    name: "Room Turnover Optimizer",
    category: "Scheduling",
    description:
      "Computes optimal room turnover sequences to eliminate re-entry events, reduce callback frequency, and quantify schedule compression.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/room-turnover",
  },
  {
    id: "renovation-phases",
    name: "Renovation Phase Planner",
    category: "Scheduling",
    description:
      "Generates a floor-sequenced renovation phase plan with milestone dates, room block targets, and GC handoff windows.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/renovation-phases",
  },
  {
    id: "permit-timeline",
    name: "Permit Timeline Planner",
    category: "Scheduling",
    description:
      "Maps required permit types to project phases, computes jurisdiction-specific lead times, and flags inspection trigger points.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/permit-timeline",
  },
  {
    id: "crew-dispatch",
    name: "Crew Dispatch Optimizer",
    category: "Scheduling",
    description:
      "Optimizes multi-crew deployment across floors and zones to maximize daily completions while minimizing trade conflicts.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/crew-dispatch",
  },

  // ── COST & ESTIMATION (6 tools) ───────────────────────────────────────────
  {
    id: "scope-estimator",
    name: "Scope Estimator",
    category: "Cost & Estimation",
    description:
      "Quantifies labor hours, material quantities, and phase requirements from room count and scope type. Outputs a line-item SOW with crew sizing.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/scope-estimator",
  },
  {
    id: "cost-estimator",
    name: "Cost Estimator",
    category: "Cost & Estimation",
    description:
      "Builds detailed cost estimates from scope inputs with labor rates, material costs, overhead, and margin analysis by CSI division.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/cost-estimator",
  },
  {
    id: "ffe-budget",
    name: "FF&E Budget Calculator",
    category: "Cost & Estimation",
    description:
      "Calculates FF&E installation budgets by item type, room count, and complexity with vendor comparison and contingency modeling.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/ffe-budget",
  },
  {
    id: "material-takeoff",
    name: "Material Takeoff Calculator",
    category: "Cost & Estimation",
    description:
      "Generates material quantity takeoffs from project scope with waste factor adjustments and vendor pricing lookups.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/material-takeoff",
  },
  {
    id: "mobilization-cost",
    name: "Mobilization Cost Estimator",
    category: "Cost & Estimation",
    description:
      "Computes total mobilization cost — travel, lodging, per diem, equipment transport — from crew size, duration, and destination inputs.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/mobilization-cost",
  },
  {
    id: "renovation-roi",
    name: "Renovation ROI Calculator",
    category: "Cost & Estimation",
    description:
      "Calculates renovation ROI from ADR uplift, occupancy recovery curve, and total project spend. Outputs payback period and NPV.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/renovation-roi",
  },

  // ── WORKFORCE (2 tools) ───────────────────────────────────────────────────
  {
    id: "labor-hours",
    name: "Labor Hours Calculator",
    category: "Workforce",
    description:
      "Calculates total labor hours by trade and scope with productivity benchmarks, crew sizing, and overtime projections.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/labor-hours",
  },
  {
    id: "crew-productivity",
    name: "Crew Productivity Analyzer",
    category: "Workforce",
    description:
      "Measures daily production rate against planned targets and computes the performance gap, schedule risk, and pace-to-completion.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/crew-productivity",
  },

  // ── PROJECT MANAGEMENT (9 tools) ──────────────────────────────────────────
  {
    id: "punch-list",
    name: "Punch List Generator",
    category: "Project Management",
    description:
      "Generates scope-specific punch items indexed by trade, room type, and area. Outputs a structured closeout checklist ready for field sign-off.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/punch-list",
  },
  {
    id: "punch-organizer",
    name: "Punch List Organizer",
    category: "Project Management",
    description:
      "Organizes punch items by priority, trade, and room with status tracking, photo links, and completion percentage dashboards.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/punch-organizer",
  },
  {
    id: "punch-by-scope",
    name: "Punch List by Scope",
    category: "Project Management",
    description:
      "Outputs a trade- and area-indexed punch list keyed to the active scope. Structured for immediate field distribution and sign-off.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/punch-by-scope",
  },
  {
    id: "change-order",
    name: "Change Order Impact Analyzer",
    category: "Project Management",
    description:
      "Quantifies schedule and cost impact of proposed changes with ripple analysis, resource reallocation, and margin impact.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/change-order",
  },
  {
    id: "rfi-impact",
    name: "RFI Impact Analyzer",
    category: "Project Management",
    description:
      "Quantifies schedule float and cost exposure for each open RFI. Outputs a criticality-ranked resolution priority list.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/rfi-impact",
  },
  {
    id: "closeout-checklist",
    name: "Closeout Checklist Generator",
    category: "Project Management",
    description:
      "Produces a closeout checklist mapped to punch resolution, warranty submissions, as-built documentation, and owner handoff requirements.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/closeout-checklist",
  },
  {
    id: "variance-tracker",
    name: "Variance Tracker",
    category: "Project Management",
    description:
      "Computes budget-to-actual variance by scope line for materials and labor. Flags threshold breaches with percentage deviation.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/variance-tracker",
  },
  {
    id: "ffe-logistics",
    name: "FF&E Logistics Planner",
    category: "Project Management",
    description:
      "Outputs a multi-vendor FF&E delivery matrix aligned to staging zones and room readiness gates across all active scopes.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/ffe-logistics",
  },
  {
    id: "bid-leveling",
    name: "Bid Leveling",
    category: "Project Management",
    description:
      "Normalizes multi-bid scope packages side-by-side, flags line-item variances, and outputs a leveled comparison matrix.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/bid-leveling",
  },

  // ── CLIENT RELATIONS (2 tools) ──────────────────────────────────────────
  {
    id: "itb-builder",
    name: "ITB Builder",
    category: "Client Relations",
    description:
      "Compiles ITB documents with structured scope intent language, qualification requirements, and compliant submission protocols.",
    status: "live",
    tier: "premium",
    route: "/ai-platform/tools/itb-builder",
  },
  {
    id: "bid-leveling-client",
    name: "Subcontractor Bid Leveling",
    category: "Client Relations",
    description:
      "Normalizes multi-bid scope packages side-by-side, flags line-item variances, and outputs a leveled comparison matrix for GC review.",
    status: "live",
    tier: "free",
    route: "/ai-platform/tools/bid-leveling",
  },
];

export const AGENTS: AIAgent[] = [
  {
    id: "alex",
    name: "ALEX",
    title: "Scope Analyst",
    specialty: "Scope Definition & Estimation",
    field: "Cost & Estimation",
    bio: "ALEX is your expert scope analyst, translating raw project inputs into detailed, accurate scope-of-work packages ready for bidding. With deep knowledge of hospitality and multifamily interior scopes, ALEX eliminates ambiguity and gaps that lead to change orders.",
    useCases: [
      "Generate a detailed SOW from a room count and project type",
      "Identify scope gaps between trades to prevent re-entry",
      "Validate bid scope against contract documents",
      "Build bundled scope packages for multi-trade bids",
    ],
    iconEmoji: "🔍",
  },
  {
    id: "sierra",
    name: "SIERRA",
    title: "Safety Specialist",
    specialty: "OSHA Compliance & Site Safety",
    field: "Safety",
    bio: "SIERRA is a dedicated safety compliance expert trained on OSHA standards, hospitality construction hazards, and industry best practices. From JSA generation to incident reporting, SIERRA ensures your crews stay protected and your documentation stays audit-ready.",
    useCases: [
      "Answer any jobsite safety question with OSHA-aligned guidance",
      "Generate JSA templates for any interior installation scope",
      "Draft toolbox talk scripts for crew morning briefings",
      "Produce OSHA 300 log entries from incident summaries",
    ],
    iconEmoji: "🛡️",
  },
  {
    id: "nova",
    name: "NOVA",
    title: "Cost Optimizer",
    specialty: "Budget Analysis & Value Engineering",
    field: "Cost & Estimation",
    bio: "NOVA specializes in finding cost efficiencies without compromising scope quality or schedule integrity. By analyzing labor rates, scope bundles, and material alternatives, NOVA helps OIS and its clients achieve maximum value on every project.",
    useCases: [
      "Model bundle pricing scenarios to optimize bid competitiveness",
      "Identify VE opportunities in FF&E installation scopes",
      "Calculate crew utilization to minimize labor cost overruns",
      "Analyze change order impacts on project budget and margin",
    ],
    iconEmoji: "💡",
  },
  {
    id: "felix",
    name: "FELIX",
    title: "Logistics Coordinator",
    specialty: "FF&E Delivery & Site Logistics",
    field: "Logistics & FF&E",
    bio: "FELIX manages the complex choreography of FF&E deliveries, staging, and installation sequencing that makes or breaks hospitality renovation timelines. With sharp attention to receiving, damage control, and room readiness, FELIX keeps materials moving smoothly.",
    useCases: [
      "Coordinate multi-vendor FF&E deliveries with dock scheduling",
      "Generate receiving checklists from purchase order data",
      "Track room-by-room installation status across all scopes",
      "Plan OS&E installation sequences aligned to brand standards",
    ],
    iconEmoji: "📦",
  },
  {
    id: "diana",
    name: "DIANA",
    title: "Compliance Keeper",
    specialty: "Code, ADA & Brand Standard Compliance",
    field: "Compliance",
    bio: "DIANA is the compliance authority, ensuring every installation meets ADA requirements, local codes, and hotel brand standards from Marriott to IHG. DIANA catches compliance issues before they become costly corrections during inspections or PIR reviews.",
    useCases: [
      "Verify installation dimensions against ADA accessibility standards",
      "Cross-reference specs with Marriott, Hilton, or IHG brand standards",
      "Identify which scopes require permits by project jurisdiction",
      "Verify subcontractor insurance against GC requirements",
    ],
    iconEmoji: "⚖️",
  },
  {
    id: "marco",
    name: "MARCO",
    title: "Workforce Manager",
    specialty: "Crew Planning & Labor Optimization",
    field: "Workforce",
    bio: "MARCO is the workforce intelligence engine, optimizing crew compositions, predicting overtime risk, and planning multi-state deployments for OIS's travel-ready crews. MARCO ensures the right people are in the right place at exactly the right time.",
    useCases: [
      "Recommend optimal crew size by scope, floor count, and timeline",
      "Predict overtime risk from production rate vs. remaining scope",
      "Plan out-of-state crew travel, per diem, and lodging logistics",
      "Divide bundled scopes into clear subcontractor packages",
    ],
    iconEmoji: "👷",
  },
  {
    id: "lyra",
    name: "LYRA",
    title: "Sustainability Advisor",
    specialty: "Green Building & Waste Diversion",
    field: "Sustainability",
    bio: "LYRA guides projects toward measurable sustainability outcomes, from LEED documentation to waste diversion planning and carbon footprint estimation. LYRA helps OIS and its clients meet green building targets while maintaining schedule and budget discipline.",
    useCases: [
      "Calculate waste diversion rates from demo scopes for LEED compliance",
      "Estimate embodied carbon and identify low-carbon substitutions",
      "Prepare LEED interior materials credit documentation",
      "Plan FF&E donation and recycling logistics for removed furnishings",
    ],
    iconEmoji: "🌿",
  },
  {
    id: "titan",
    name: "TITAN",
    title: "Schedule Master",
    specialty: "Construction Scheduling & Sequencing",
    field: "Scheduling",
    bio: "TITAN is the scheduling powerhouse, building phased renovation timelines, optimizing room sequencing, and modeling delay impacts with precision. For hospitality projects where every day of room downtime matters, TITAN is the edge between on-time and over-budget.",
    useCases: [
      "Build phased hotel renovation schedules from start date to PIP completion",
      "Optimize room sequencing to minimize re-entry and accelerate turnover",
      "Model downstream schedule impact of delivery delays or scope changes",
      "Plan mobilization logistics for multi-state project deployments",
    ],
    iconEmoji: "⏱️",
  },
  {
    id: "echo",
    name: "ECHO",
    title: "Reporting Analyst",
    specialty: "Data Reporting & Project Intelligence",
    field: "Reporting & Analytics",
    bio: "ECHO transforms raw project data into polished, actionable reports for GCs, owners, and executive stakeholders. From daily field reports to portfolio-level performance dashboards, ECHO delivers intelligence that drives better project decisions.",
    useCases: [
      "Generate structured daily reports from field notes in seconds",
      "Build executive summaries with visual KPI snapshots for owner meetings",
      "Compile complete closeout documentation from project data",
      "Aggregate multi-project portfolio analytics for resource planning",
    ],
    iconEmoji: "📊",
  },
  {
    id: "vera",
    name: "VERA",
    title: "Client Relations Agent",
    specialty: "GC Communication & Business Development",
    field: "Client Relations",
    bio: "VERA manages the client-facing intelligence layer, crafting ITBs, prequal packages, and GC communications that open doors and win bids. VERA ensures every touchpoint with a general contractor or owner reflects OIS's professionalism and capabilities.",
    useCases: [
      "Draft professional ITB packages tailored to GC requirements",
      "Assemble and customize prequal packages for new client outreach",
      "Write formal GC communications including notices and status updates",
      "Generate reference letter requests for prequalification submissions",
    ],
    iconEmoji: "🤝",
  },
];

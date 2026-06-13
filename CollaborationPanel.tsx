import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Search } from "lucide-react";
import { useState } from "react";

interface ToolEntry {
  name: string;
  path: string;
  engine: "scope" | "safety" | "scheduling" | "logistics";
  description: string;
}

const ALL_TOOLS: ToolEntry[] = [
  {
    name: "Scope Estimator",
    path: "/ai-platform/tools/scope-estimator",
    engine: "scope",
    description: "Estimate scope, crew, duration, and cost",
  },
  {
    name: "Cost Estimator",
    path: "/ai-platform/tools/cost-estimator",
    engine: "scope",
    description: "Full project cost with labor + materials",
  },
  {
    name: "Scope Gap Analyzer",
    path: "/ai-platform/tools/scope-gap",
    engine: "scope",
    description: "Identify missing scopes and risk",
  },
  {
    name: "Change Order Impact",
    path: "/ai-platform/tools/change-order",
    engine: "scope",
    description: "Calculate schedule and cost impact",
  },
  {
    name: "Material Takeoff",
    path: "/ai-platform/tools/material-takeoff",
    engine: "scope",
    description: "Quantity takeoffs by scope type",
  },
  {
    name: "Renovation ROI",
    path: "/ai-platform/tools/renovation-roi",
    engine: "scope",
    description: "ROI and payback period calculator",
  },
  {
    name: "Labor Hours",
    path: "/ai-platform/tools/labor-hours",
    engine: "scope",
    description: "Crew hours by scope and room count",
  },
  {
    name: "Bid Leveling",
    path: "/ai-platform/tools/bid-leveling",
    engine: "scope",
    description: "Level and compare sub bids",
  },
  {
    name: "Safety Assistant",
    path: "/ai-platform/tools/safety-assistant",
    engine: "safety",
    description: "AI safety guidance by scope",
  },
  {
    name: "JSA Generator",
    path: "/ai-platform/tools/jsa-generator",
    engine: "safety",
    description: "Generate job safety analysis",
  },
  {
    name: "Toolbox Talk Builder",
    path: "/ai-platform/tools/toolbox-talk",
    engine: "safety",
    description: "Build tailored toolbox talks",
  },
  {
    name: "Safety Score",
    path: "/ai-platform/tools/safety-score",
    engine: "safety",
    description: "Score safety program and grade",
  },
  {
    name: "OSHA Incident Rate",
    path: "/ai-platform/tools/osha-incident-rate",
    engine: "safety",
    description: "TRIR, DART, LTIR calculations",
  },
  {
    name: "Pre-Task Plan",
    path: "/ai-platform/tools/pre-task-plan",
    engine: "safety",
    description: "Daily pre-task safety plan",
  },
  {
    name: "Closeout Checklist",
    path: "/ai-platform/tools/closeout-checklist",
    engine: "safety",
    description: "Project closeout documentation",
  },
  {
    name: "Schedule Calculator",
    path: "/ai-platform/tools/schedule-calculator",
    engine: "scheduling",
    description: "CPM schedule with float",
  },
  {
    name: "Room Turnover Optimizer",
    path: "/ai-platform/tools/room-turnover",
    engine: "scheduling",
    description: "Daily room completion targets",
  },
  {
    name: "Renovation Phases",
    path: "/ai-platform/tools/renovation-phases",
    engine: "scheduling",
    description: "Multi-phase hotel renovation planner",
  },
  {
    name: "Punch List Generator",
    path: "/ai-platform/tools/punch-list",
    engine: "scheduling",
    description: "Generate punch list by project type",
  },
  {
    name: "Punch by Scope",
    path: "/ai-platform/tools/punch-by-scope",
    engine: "scheduling",
    description: "Scope-specific punch list items",
  },
  {
    name: "Punch Organizer",
    path: "/ai-platform/tools/punch-organizer",
    engine: "scheduling",
    description: "Organize and prioritize punch items",
  },
  {
    name: "Permit Timeline",
    path: "/ai-platform/tools/permit-timeline",
    engine: "scheduling",
    description: "Permit approval timeline by state",
  },
  {
    name: "Crew Dispatch",
    path: "/ai-platform/tools/crew-dispatch",
    engine: "logistics",
    description: "Plan crew dispatch and travel",
  },
  {
    name: "FF&E Budget",
    path: "/ai-platform/tools/ffe-budget",
    engine: "logistics",
    description: "Full FF&E budget by room type",
  },
  {
    name: "FF&E Logistics",
    path: "/ai-platform/tools/ffe-logistics",
    engine: "logistics",
    description: "Delivery phases and install sequence",
  },
  {
    name: "Mobilization Cost",
    path: "/ai-platform/tools/mobilization-cost",
    engine: "logistics",
    description: "Crew mobilization cost estimator",
  },
  {
    name: "Crew Productivity",
    path: "/ai-platform/tools/crew-productivity",
    engine: "logistics",
    description: "Analyze productivity and efficiency",
  },
  {
    name: "Variance Tracker",
    path: "/ai-platform/tools/variance-tracker",
    engine: "logistics",
    description: "Track budget vs actual variance",
  },
  {
    name: "RFI Impact",
    path: "/ai-platform/tools/rfi-impact",
    engine: "logistics",
    description: "Calculate RFI delay and cost impact",
  },
  {
    name: "ITB Builder",
    path: "/ai-platform/tools/itb-builder",
    engine: "logistics",
    description: "Build invitation to bid packages",
  },
];

const ENGINE_COLORS = {
  scope: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  safety: "bg-red-500/10 text-red-400 border-red-500/20",
  scheduling: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  logistics: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function BuilderToolLauncher({
  projectName,
}: {
  projectName: string;
}) {
  const [search, setSearch] = useState("");
  const [activeEngine, setActiveEngine] = useState<string>("all");

  const filtered = ALL_TOOLS.filter((t) => {
    const matchesEngine = activeEngine === "all" || t.engine === activeEngine;
    const matchesSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesEngine && matchesSearch;
  });

  const engines = [
    "all",
    "scope",
    "safety",
    "scheduling",
    "logistics",
  ] as const;

  return (
    <section data-ocid="builder.tool_launcher">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-widest font-mono">
          {/* TOOL LAUNCHER */}
        </h2>
        <span className="text-[10px] font-mono text-foreground/40">
          {ALL_TOOLS.length} TOOLS AVAILABLE
        </span>
      </div>

      {projectName && (
        <div className="mb-3 px-3 py-2 rounded border border-[hsl(var(--construction-primary))/30] bg-[hsl(var(--construction-primary))/5]">
          <p className="text-[10px] font-mono text-[hsl(var(--construction-primary))/70]">
            ACTIVE PROJECT:{" "}
            <span className="font-bold text-[hsl(var(--construction-primary))]">
              {projectName}
            </span>
          </p>
        </div>
      )}

      <div className="flex gap-2 mb-3 flex-wrap">
        {engines.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setActiveEngine(e)}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded border transition-colors ${
              activeEngine === e
                ? "border-[hsl(var(--construction-primary))] text-[hsl(var(--construction-primary))] bg-[hsl(var(--construction-primary))/10]"
                : "border-border/40 text-foreground/40 hover:border-border hover:text-foreground/60"
            }`}
            data-ocid={`builder.tool_launcher.filter.${e}`}
          >
            {e}
          </button>
        ))}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools…"
            className="pl-6 h-7 text-xs font-mono bg-background/40 border-border/40"
            data-ocid="builder.tool_launcher.search_input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((tool, i) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group flex items-start gap-2 p-2.5 rounded border border-border/30 bg-background/30 hover:border-[hsl(var(--construction-primary))/50] hover:bg-background/60 transition-all"
            data-ocid={`builder.tool_launcher.item.${i + 1}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-xs font-semibold text-foreground truncate">
                  {tool.name}
                </p>
                <Badge
                  className={`text-[9px] font-mono border shrink-0 ${ENGINE_COLORS[tool.engine]}`}
                >
                  {tool.engine}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {tool.description}
              </p>
            </div>
            <ExternalLink className="h-3 w-3 text-foreground/20 group-hover:text-[hsl(var(--construction-primary))] shrink-0 mt-0.5 transition-colors" />
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-10 text-foreground/30"
          data-ocid="builder.tool_launcher.empty_state"
        >
          <Search className="h-6 w-6 mb-2" />
          <p className="text-sm font-mono">No tools match your filter</p>
        </div>
      )}
    </section>
  );
}

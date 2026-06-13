import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  ClipboardList,
  Shield,
  Truck,
} from "lucide-react";

interface Engine {
  id: string;
  name: string;
  domain: string;
  description: string;
  icon: React.ReactNode;
  toolPath: string;
  toolCount: number;
  status: "active" | "standby" | "maintenance";
  cplLaw: string;
}

const ENGINES: Engine[] = [
  {
    id: "scope",
    name: "Scope Engine",
    domain: "SCOPE",
    description:
      "Project scope estimation, gap analysis, material takeoffs, and cost modeling.",
    icon: <Calculator className="h-5 w-5" />,
    toolPath: "/ai-platform/tools/scope-estimator",
    toolCount: 8,
    status: "active",
    cplLaw: "CPL-SCOPE-001",
  },
  {
    id: "safety",
    name: "Safety Engine",
    domain: "SAFETY",
    description:
      "OSHA compliance, JSA generation, safety scoring, and incident rate analysis.",
    icon: <Shield className="h-5 w-5" />,
    toolPath: "/ai-platform/tools/safety-assistant",
    toolCount: 7,
    status: "active",
    cplLaw: "CPL-SAFETY-001",
  },
  {
    id: "scheduling",
    name: "Scheduling Engine",
    domain: "SCHEDULING",
    description:
      "Critical path modeling, room turnover optimization, and phase planning.",
    icon: <ClipboardList className="h-5 w-5" />,
    toolPath: "/ai-platform/tools/schedule-calculator",
    toolCount: 7,
    status: "active",
    cplLaw: "CPL-SCHED-001",
  },
  {
    id: "logistics",
    name: "Logistics Engine",
    domain: "LOGISTICS",
    description:
      "FF&E coordination, crew dispatch, mobilization costing, and bid leveling.",
    icon: <Truck className="h-5 w-5" />,
    toolPath: "/ai-platform/tools/crew-dispatch",
    toolCount: 8,
    status: "active",
    cplLaw: "CPL-LOGI-001",
  },
];

const statusConfig = {
  active: {
    label: "ACTIVE",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  standby: {
    label: "STANDBY",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
  maintenance: {
    label: "MAINT",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

export default function EngineAccessPanel() {
  return (
    <section data-ocid="builder.engine_panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-widest font-mono">
          {/* ENGINE ACCESS */}
        </h2>
        <span className="text-xs font-mono text-foreground/40">
          4 SRCE ONLINE
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ENGINES.map((engine) => {
          const status = statusConfig[engine.status];
          return (
            <Card
              key={engine.id}
              className="bg-card/60 border border-border/60 hover:border-[hsl(var(--construction-primary))/50] transition-all duration-200 group p-4"
              data-ocid={`builder.engine.${engine.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[hsl(var(--construction-primary))/10] text-[hsl(var(--construction-primary))]">
                    {engine.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {engine.name}
                    </p>
                    <p className="text-[10px] font-mono text-foreground/40">
                      {engine.cplLaw}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`text-[10px] font-mono border ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {engine.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-foreground/40">
                  {engine.toolCount} TOOLS LOADED
                </span>
                <Link
                  to={engine.toolPath}
                  className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--construction-primary))] hover:underline group-hover:gap-2 transition-all"
                  data-ocid={`builder.engine.${engine.id}.launch_link`}
                >
                  Launch <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-1.5 px-1">
        <AlertTriangle className="h-3 w-3 text-yellow-500/60" />
        <span className="text-[10px] font-mono text-foreground/30">
          All engines governed by CPL doctrine v2.1 — sovereign compute only
        </span>
      </div>
    </section>
  );
}

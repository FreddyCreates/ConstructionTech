import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { BookLock, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

interface CPLEngineRule {
  domain: string;
  lawId: string;
  lawName: string;
  thresholdKey: string;
  thresholdValue: string;
  principle: string;
}

const CPL_ENGINE_RULES: CPLEngineRule[] = [
  {
    domain: "SCOPE",
    lawId: "CPL-SCOPE-001",
    lawName: "Scope Integrity Mandate",
    thresholdKey: "Complexity Index",
    thresholdValue: "≤ 95 / 100",
    principle:
      "No scope output may exceed verified material benchmarks by >15%",
  },
  {
    domain: "SAFETY",
    lawId: "CPL-SAFETY-001",
    lawName: "Zero Harm Doctrine",
    thresholdKey: "TRIR Benchmark",
    thresholdValue: "≤ 3.2 / OSHA avg",
    principle: "Safety outputs must align with OSHA 1926 subpart thresholds",
  },
  {
    domain: "SCHEDULING",
    lawId: "CPL-SCHED-001",
    lawName: "Critical Path Sovereignty",
    thresholdKey: "Float Minimum",
    thresholdValue: "≥ 2 days buffer",
    principle:
      "Schedule outputs must include CPM float and phase buffer calculations",
  },
  {
    domain: "LOGISTICS",
    lawId: "CPL-LOGI-001",
    lawName: "Mobilization Accuracy Law",
    thresholdKey: "Cost Variance",
    thresholdValue: "±12% tolerance",
    principle:
      "Logistics cost outputs must include per-crew per-diem and fuel actuals",
  },
];

export default function CPLGovernancePanel() {
  const { actor, isFetching } = useActor(createActor);

  const brainQuery = useQuery({
    queryKey: ["nexusBrainState-cpl"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNexusBrainState();
    },
    enabled: !!actor && !isFetching,
  });

  // Derive governance version and status from Nexus brain data
  const isNexusActive = !!brainQuery.data;
  const governanceVersion = "2.1.0";

  return (
    <section data-ocid="builder.cpl_governance">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-widest font-mono">
          {/* CPL GOVERNANCE */}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-foreground/40">
            v{governanceVersion}
          </span>
          <Badge
            className={`text-[10px] font-mono border ${
              isNexusActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-foreground/5 text-foreground/40 border-border"
            }`}
          >
            {isNexusActive ? "ACTIVE" : "LOADING"}
          </Badge>
        </div>
      </div>

      {/* Governance header card */}
      <Card className="bg-card/60 border border-border/60 p-4 mb-3">
        <div className="flex items-start gap-3">
          <BookLock className="h-5 w-5 text-[hsl(var(--construction-primary))] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Coded Protocol Language (CPL)
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Governance is load-bearing — encoded into the substrate of every
              engine's decision logic. Laws are not filters applied after
              computation. They are the math itself.
            </p>
          </div>
          {isNexusActive ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-4 w-4 text-foreground/30 shrink-0 mt-0.5" />
          )}
        </div>
      </Card>

      {/* Engine law cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CPL_ENGINE_RULES.map((rule, i) => (
          <Card
            key={rule.domain}
            className="bg-background/40 border border-border/50 p-3"
            data-ocid={`builder.cpl.engine.${i + 1}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--construction-primary))/70]" />
                <span className="text-[10px] font-mono text-foreground/40">
                  {rule.domain}
                </span>
              </div>
              <span className="text-[9px] font-mono text-foreground/25">
                {rule.lawId}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {rule.lawName}
            </p>
            <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
              {rule.principle}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <span className="text-[9px] font-mono text-foreground/30">
                {rule.thresholdKey}
              </span>
              <span className="text-[10px] font-mono font-semibold text-[hsl(var(--construction-primary))]">
                {rule.thresholdValue}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

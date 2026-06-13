import { createActor } from "@/backend";
import type { NexusBrainState, NexusStats } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Brain,
  DatabaseZap,
  Heart,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function NexusConsole() {
  const { actor, isFetching } = useActor(createActor);

  const nexusStats = useQuery<NexusStats | null>({
    queryKey: ["nexusStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNexusStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const nexusBrain = useQuery<NexusBrainState | null>({
    queryKey: ["nexusBrainState"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNexusBrainState();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });

  const stats = nexusStats.data;
  const brain = nexusBrain.data;
  const isLoading = nexusStats.isLoading || nexusBrain.isLoading;

  const connectionStatus =
    stats?.healthStatus === "healthy"
      ? "CONNECTED"
      : stats
        ? "DEGRADED"
        : "INITIALIZING";
  const connectionClass =
    connectionStatus === "CONNECTED"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : connectionStatus === "DEGRADED"
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
        : "bg-foreground/5 text-foreground/40 border-border";

  const benchmarkCount = brain?.categoryStats?.length ?? 0;
  const categoryList = brain?.categoryStats?.slice(0, 3) ?? [];

  return (
    <section data-ocid="builder.nexus_console">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-widest font-mono">
          {/* OIS NEXUS INTELLIGENCE */}
        </h2>
        <div className="flex items-center gap-2">
          <Badge className={`text-[10px] font-mono border ${connectionClass}`}>
            {connectionStatus}
          </Badge>
          {nexusStats.isFetching && (
            <RefreshCw className="h-3 w-3 animate-spin text-foreground/30" />
          )}
        </div>
      </div>

      <Card className="bg-card/60 border border-border/60 p-4">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
          <Brain className="h-4 w-4 text-[hsl(var(--construction-primary))]" />
          <span className="text-sm font-semibold text-foreground">
            Nexus Brain State
          </span>
          <span className="ml-auto text-[10px] font-mono text-foreground/30">
            SOVEREIGN · NATIVE · ON-CHAIN
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <StatReadout
                icon={<DatabaseZap className="h-3.5 w-3.5" />}
                label="CALCULATIONS"
                value={stats ? stats.totalCalls.toString() : "—"}
                unit="processed"
              />
              <StatReadout
                icon={<Activity className="h-3.5 w-3.5" />}
                label="ANOMALY RATE"
                value={stats ? (stats.anomalyRate * 100).toFixed(2) : "—"}
                unit="% detected"
              />
              <StatReadout
                icon={<Brain className="h-3.5 w-3.5" />}
                label="BENCHMARKS"
                value={benchmarkCount.toString()}
                unit="in memory"
              />
              <StatReadout
                icon={<Heart className="h-3.5 w-3.5" />}
                label="HEARTBEAT"
                value={stats ? formatAge(stats.lastHeartbeat) : "—"}
                unit="last pulse"
              />
            </div>

            {/* Brain state details */}
            {brain && (
              <div className="space-y-2 pt-3 border-t border-border/30">
                <p className="text-[10px] font-mono text-foreground/40 mb-2">
                  BRAIN INTERNALS
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <ReadoutLine
                    label="GLOBAL MEAN"
                    value={brain.globalMean.toFixed(4)}
                  />
                  <ReadoutLine
                    label="GLOBAL VARIANCE"
                    value={brain.globalVariance.toFixed(4)}
                  />
                </div>
                {categoryList.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] font-mono text-foreground/30 mb-1">
                      ACTIVE CATEGORIES
                    </p>
                    {categoryList.map(([cat, count, mean]) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between py-1 border-b border-border/20 last:border-0"
                      >
                        <span className="text-[10px] font-mono text-foreground/50">
                          {cat.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-foreground/40">
                            n={count.toString()}
                          </span>
                          <span className="text-[10px] font-mono text-foreground/60">
                            μ={mean.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Z-score threshold info */}
            <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2">
              <Zap className="h-3 w-3 text-[hsl(var(--construction-primary))/60]" />
              <span className="text-[10px] font-mono text-foreground/40">
                Z-SCORE ANOMALY THRESHOLD: 2.00σ — Welford online algorithm —
                native Motoko
              </span>
            </div>
          </>
        )}
      </Card>
    </section>
  );
}

function StatReadout({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-background/60 rounded border border-border/40 px-3 py-2">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[hsl(var(--construction-primary))/70]">
          {icon}
        </span>
        <p className="text-[9px] font-mono text-foreground/40 uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-lg font-mono font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{unit}</p>
    </div>
  );
}

function ReadoutLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-mono text-foreground/30 w-28">
        {label}
      </span>
      <span className="text-[10px] font-mono text-foreground/70">{value}</span>
    </div>
  );
}

function formatAge(lastHeartbeat: bigint): string {
  const nowMs = Date.now();
  const hbMs = Number(lastHeartbeat) / 1_000_000;
  const diffSec = Math.floor((nowMs - hbMs) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  return `${Math.floor(diffSec / 3600)}h ago`;
}

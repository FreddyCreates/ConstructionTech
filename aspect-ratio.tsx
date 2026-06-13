import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { NexusInsight } from "../hooks/useNexusQueries";

interface OISNexusPanelProps {
  nexusInsights: string;
  loading?: boolean;
}

const categoryIcon = {
  cost: BarChart2,
  schedule: TrendingUp,
  safety: AlertTriangle,
  pattern: Zap,
  alert: AlertTriangle,
  benchmark: BarChart2,
};

const confidenceConfig = {
  high: {
    label: "High Confidence",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  medium: {
    label: "Medium Confidence",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  low: {
    label: "Low Confidence",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export default function OISNexusPanel({
  nexusInsights,
  loading,
}: OISNexusPanelProps) {
  const [expanded, setExpanded] = useState(false);

  let insights: NexusInsight[] = [];
  try {
    if (nexusInsights) insights = JSON.parse(nexusInsights) as NexusInsight[];
  } catch {
    insights = [];
  }

  return (
    <div
      className="rounded-xl border-l-4 border-l-orange-500 border border-border bg-[oklch(0.18_0.01_240)] overflow-hidden"
      data-ocid="nexus.panel"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
        data-ocid="nexus.panel_toggle"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              OIS Nexus Insights
            </p>
            <p className="text-xs text-muted-foreground">
              {loading
                ? "Generating..."
                : `${insights.length} insight${insights.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!loading && insights.length > 0 && (
            <Badge
              variant="outline"
              className="text-xs border-orange-500/40 text-orange-400"
            >
              Native Intelligence
            </Badge>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <div key={i} className="space-y-2 p-3 rounded-lg bg-white/5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : insights.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No insights generated for this result.
            </p>
          ) : (
            insights.map((insight, idx) => {
              const Icon = categoryIcon[insight.category] ?? Lightbulb;
              const conf =
                confidenceConfig[insight.confidence] ?? confidenceConfig.low;
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: ordered insights
                  key={idx}
                  className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">
                        {insight.title}
                      </p>
                      {insight.isAnomaly && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-red-500/20 text-red-400 border-red-500/40">
                          ANOMALY
                        </span>
                      )}
                      {!insight.isAnomaly &&
                        insight.priorityScore !== undefined &&
                        insight.priorityScore >= 9 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-orange-500/20 text-orange-400 border-orange-500/40">
                            PRIORITY
                          </span>
                        )}
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${conf.className}`}
                      >
                        {conf.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {insight.detail}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* Anomaly summary bar */}
          {insights.length > 0 &&
            (() => {
              const anomalyCount = insights.filter((i) => i.isAnomaly).length;
              return anomalyCount > 0 ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  OIS Nexus detected {anomalyCount} anomaly flag
                  {anomalyCount !== 1 ? "s" : ""} — review highlighted items
                </div>
              ) : null;
            })()}

          {/* Footer */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <div className="w-4 h-4 rounded-sm bg-orange-500 flex items-center justify-center">
              <span className="text-[8px] font-black text-white">N</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by OIS Nexus — Native Construction Intelligence
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

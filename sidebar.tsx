import { TrendingDown, TrendingUp } from "lucide-react";

export interface BenchmarkComparisonChartProps {
  metricLabel: string;
  toolResult: number;
  libraryMedian: number;
  industryRangeLow: number;
  industryRangeHigh: number;
  gcHistoricalAvg?: number;
  unit?: string;
}

export default function BenchmarkComparisonChart({
  metricLabel,
  toolResult,
  libraryMedian,
  industryRangeLow,
  industryRangeHigh,
  gcHistoricalAvg,
  unit = "",
}: BenchmarkComparisonChartProps) {
  const maxVal = Math.max(
    industryRangeHigh,
    toolResult,
    libraryMedian,
    gcHistoricalAvg ?? 0,
  );
  const minVal = Math.min(
    industryRangeLow,
    toolResult,
    libraryMedian,
    gcHistoricalAvg ?? Number.POSITIVE_INFINITY,
  );
  const range = maxVal - minVal || 1;

  const pct = (val: number) => ((val - minVal) / range) * 100;

  const deviation =
    libraryMedian > 0
      ? ((toolResult - libraryMedian) / libraryMedian) * 100
      : 0;
  const isAnomaly = Math.abs(deviation) > 20;
  const isNear = Math.abs(deviation) > 10 && !isAnomaly;

  const formatVal = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    if (unit === "%") return `${v.toFixed(1)}%`;
    if (unit === "days") return `${Math.round(v)}d`;
    return `$${v.toFixed(0)}`;
  };

  return (
    <div className="space-y-3" data-ocid="benchmark.chart">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">
          {metricLabel}
        </span>
        <div className="flex items-center gap-1.5">
          {deviation > 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-primary" />
          )}
          <span
            className={`text-xs font-mono font-bold ${isAnomaly ? "text-destructive" : isNear ? "text-accent" : "text-success"}`}
          >
            {deviation > 0 ? "+" : ""}
            {deviation.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative h-24 bg-muted/20 rounded-lg border border-border/40 px-3 py-2">
        {/* Industry range background */}
        <div
          className="absolute top-2 bottom-2 rounded bg-primary/5 border border-primary/10"
          style={{
            left: `${pct(industryRangeLow)}%`,
            width: `${pct(industryRangeHigh) - pct(industryRangeLow)}%`,
          }}
        />

        {/* 20% anomaly threshold lines */}
        {libraryMedian > 0 && (
          <>
            <div
              className="absolute top-1 bottom-1 border-l border-dashed border-destructive/30"
              style={{ left: `${pct(libraryMedian * 1.2)}%` }}
              title="+20% anomaly threshold"
            />
            <div
              className="absolute top-1 bottom-1 border-l border-dashed border-destructive/30"
              style={{ left: `${pct(libraryMedian * 0.8)}%` }}
              title="-20% anomaly threshold"
            />
          </>
        )}

        {/* Library median marker */}
        <div
          className="absolute top-1 bottom-1 w-0.5 bg-muted-foreground/60"
          style={{ left: `${pct(libraryMedian)}%` }}
        />

        {/* GC historical avg marker */}
        {gcHistoricalAvg !== undefined && gcHistoricalAvg > 0 && (
          <div
            className="absolute top-1 bottom-1 w-0.5 border-l border-dashed border-accent/60"
            style={{ left: `${pct(gcHistoricalAvg)}%` }}
          />
        )}

        {/* Tool result bar */}
        <div
          className={`absolute top-7 h-3 rounded-full transition-all duration-700 ${isAnomaly ? "bg-destructive" : isNear ? "bg-accent" : "bg-primary"}`}
          style={{
            left: `${Math.min(pct(toolResult), 98)}%`,
            width: "6px",
            transform: "translateX(-3px)",
          }}
        />

        {/* Labels row */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between text-[9px] font-mono text-muted-foreground px-1">
          <span>{formatVal(minVal)}</span>
          <span className="text-muted-foreground/50">
            Library: {formatVal(libraryMedian)}
          </span>
          <span>{formatVal(maxVal)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Result</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
          <span>Library Median</span>
        </div>
        {gcHistoricalAvg !== undefined && gcHistoricalAvg > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border border-dashed border-accent/60" />
            <span>Your Avg</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-primary/10 border border-primary/20" />
          <span>Industry Range</span>
        </div>
      </div>
    </div>
  );
}

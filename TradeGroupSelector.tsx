import type { NexusInsight } from "../types";

const TYPE_CONFIG: Record<
  string,
  { icon: string; label: string; borderColor: string; bgTint: string }
> = {
  recommendation: {
    icon: "💡",
    label: "Recommendation",
    borderColor: "oklch(0.45 0.12 245)",
    bgTint: "oklch(0.45 0.12 245 / 0.08)",
  },
  alert: {
    icon: "⚡",
    label: "Alert",
    borderColor: "oklch(0.70 0.22 42)",
    bgTint: "oklch(0.70 0.22 42 / 0.08)",
  },
  risk: {
    icon: "🚨",
    label: "Risk",
    borderColor: "oklch(0.55 0.22 25)",
    bgTint: "oklch(0.55 0.22 25 / 0.08)",
  },
  opportunity: {
    icon: "📈",
    label: "Opportunity",
    borderColor: "oklch(0.65 0.18 145)",
    bgTint: "oklch(0.65 0.18 145 / 0.08)",
  },
  benchmark: {
    icon: "📊",
    label: "Benchmark",
    borderColor: "oklch(0.40 0 0)",
    bgTint: "oklch(0.40 0 0 / 0.08)",
  },
};

interface NexusInsightPanelProps {
  insights: NexusInsight[];
  isLoading?: boolean;
  title?: string;
}

export function NexusInsightPanel({
  insights,
  isLoading,
  title = "Nexus Insights",
}: NexusInsightPanelProps) {
  if (isLoading) {
    return (
      <div className="tool-glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[oklch(0.70_0.22_42)] animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-[oklch(0.70_0.22_42)] uppercase">
            Nexus Analysis
          </span>
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-[oklch(0.20_0_0)] animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
          <p className="text-center text-xs text-[oklch(0.55_0_0)] mt-2">
            Running Nexus analysis...
          </p>
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) return null;

  const sorted = [...insights].sort((a, b) => b.priority - a.priority);

  return (
    <div className="tool-glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[oklch(0.70_0.22_42)]" />
          <span className="text-xs font-bold tracking-widest text-[oklch(0.70_0.22_42)] uppercase">
            {title}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(0.55_0_0)]">
          {insights.length} insights · CPL governed
        </span>
      </div>
      <div className="space-y-3">
        {sorted.map((insight, i) => {
          const cfg = TYPE_CONFIG[insight.type] || TYPE_CONFIG.recommendation;
          return (
            <div
              key={`${insight.text.slice(0, 8)}-${i}`}
              style={{
                borderLeftColor: cfg.borderColor,
                backgroundColor: cfg.bgTint,
                animation: "stagger-card 0.4s ease-out both",
                animationDelay: `${i * 100}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0 mt-0.5">
                  {cfg.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: cfg.borderColor }}
                    >
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-10 h-1 rounded-full bg-[oklch(0.25_0_0)] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${insight.confidence}%`,
                            backgroundColor: cfg.borderColor,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[oklch(0.60_0_0)]">
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[oklch(0.85_0_0)]">
                    {insight.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NexusInsightPanel;

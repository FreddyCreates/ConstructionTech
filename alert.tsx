import { Brain, Cpu, Zap } from "lucide-react";

export type DepthLevel = "standard" | "advanced" | "deep";

interface DepthOption {
  id: DepthLevel;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const DEPTH_OPTIONS: DepthOption[] = [
  {
    id: "standard",
    label: "Standard",
    sublabel: "Core calculations + WL benchmarks",
    icon: Cpu,
  },
  {
    id: "advanced",
    label: "Advanced",
    sublabel: "Cross-division analysis + regional data",
    icon: Zap,
  },
  {
    id: "deep",
    label: "AI Deep Analysis",
    sublabel: "Nexus multi-pass + branded PDF export",
    icon: Brain,
  },
];

interface IntelligenceDepthSelectorProps {
  value: DepthLevel;
  onChange: (level: DepthLevel) => void;
  toolId?: string;
}

export function IntelligenceDepthSelector({
  value,
  onChange,
  toolId = "tool",
}: IntelligenceDepthSelectorProps) {
  return (
    <div
      className="p-4 rounded-xl bg-card border border-border/60 space-y-2"
      data-ocid={`${toolId}.depth-selector`}
    >
      <p className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase mb-3">
        Intelligence Depth
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        {DEPTH_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              data-ocid={`${toolId}.depth.${opt.id}`}
              className={`flex-1 flex flex-col items-start gap-1 px-4 py-3 rounded-lg border text-left transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 border-primary text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.4)]"
                  : "bg-muted/30 border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {opt.label}
                </span>
                {opt.id === "deep" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono">
                    PRO
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight pl-5.5">
                {opt.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

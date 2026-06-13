import type { FC } from "react";

export interface VHDEHazard {
  hazardType: string;
  confidence: number;
  oshaSubpart: string;
  description?: string;
}

interface VHDEHazardBadgeProps {
  hazard: VHDEHazard;
  compact?: boolean;
}

function getSeverity(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 75) return "high";
  if (confidence >= 40) return "medium";
  return "low";
}

const SEVERITY_STYLES: Record<"high" | "medium" | "low", string> = {
  high: "vhde-hazard-badge vhde-hazard-badge--high bg-red-950/40 border-red-500/60 text-red-300",
  medium:
    "vhde-hazard-badge vhde-hazard-badge--medium bg-amber-950/40 border-amber-500/60 text-amber-300",
  low: "vhde-hazard-badge vhde-hazard-badge--low bg-yellow-950/30 border-yellow-500/50 text-yellow-300",
};

const SEVERITY_INDICATOR: Record<"high" | "medium" | "low", string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-yellow-400",
};

const SEVERITY_LABEL: Record<"high" | "medium" | "low", string> = {
  high: "HIGH RISK",
  medium: "MEDIUM RISK",
  low: "LOW RISK",
};

export const VHDEHazardBadge: FC<VHDEHazardBadgeProps> = ({
  hazard,
  compact = false,
}) => {
  const severity = getSeverity(hazard.confidence);
  const baseClasses = SEVERITY_STYLES[severity];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-mono font-semibold tracking-wide ${baseClasses}`}
        title={`${hazard.hazardType} — ${hazard.confidence}% confidence — OSHA ${hazard.oshaSubpart}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${SEVERITY_INDICATOR[severity]}`}
        />
        {hazard.hazardType}
        <span className="opacity-70">{hazard.confidence}%</span>
      </span>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 px-3 py-2.5 rounded-md border ${baseClasses}`}
      role="alert"
      aria-label={`${SEVERITY_LABEL[severity]}: ${hazard.hazardType}`}
    >
      <span
        className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ring-2 ring-current/30 ${SEVERITY_INDICATOR[severity]}`}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm tracking-wide">
            {hazard.hazardType}
          </span>
          <span className="text-xs font-mono opacity-80 bg-current/10 px-1.5 py-0.5 rounded">
            {hazard.confidence}% confidence
          </span>
          <span className="text-xs opacity-60 ml-auto shrink-0">
            {SEVERITY_LABEL[severity]}
          </span>
        </div>
        <div className="mt-0.5 text-xs opacity-70 font-mono">
          OSHA {hazard.oshaSubpart}
        </div>
        {hazard.description && (
          <div className="mt-1 text-xs opacity-60 leading-snug">
            {hazard.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default VHDEHazardBadge;

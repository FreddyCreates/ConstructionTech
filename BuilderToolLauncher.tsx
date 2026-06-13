import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  FileCheck,
  HardHat,
  Layers,
  Pencil,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePerceptionStream } from "../hooks/usePerceptionStream";
import PerceptionStreamDisplay from "./PerceptionStreamDisplay";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PerceptionFinding {
  findingId: string;
  category: string;
  severity: number;
  description: string;
  sourceData: string;
  confidence: number;
}

interface AnomalyFlag {
  flagId: string;
  perceptionType: string;
  severity: number;
  description: string;
  recommendedAction: string;
}

interface PerceptionEntry {
  engineId: string;
  perceptionType: string;
  findings: PerceptionFinding[];
  riskScore: number;
  confidenceScore: number;
  anomalyFlags: AnomalyFlag[];
  recommendations: string[];
}

interface SynthesisResult {
  overallRiskScore: number;
  dominantPerception: string;
  crossPerceptionInsights: string[];
  prioritizedActions: string[];
  confidenceScore: number;
  perceptionMap: PerceptionEntry[];
}

export interface NeuralPerceptionPanelProps {
  synthesisResult: SynthesisResult | null;
  isLoading: boolean;
  toolId: string;
  streamingMode?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PERCEPTION_COLORS: Record<string, string> = {
  Cost: "#f97316",
  Safety: "#ef4444",
  Schedule: "#3b82f6",
  Compliance: "#8b5cf6",
  Labor: "#06b6d4",
  Design: "#ec4899",
  Financial: "#10b981",
};

const PERCEPTION_ICONS: Record<string, React.ElementType> = {
  Cost: DollarSign,
  Safety: HardHat,
  Schedule: Clock,
  Compliance: FileCheck,
  Labor: Activity,
  Design: Pencil,
  Financial: BarChart2,
};

function getRiskColor(score: number): string {
  if (score <= 30) return "#22c55e";
  if (score <= 50) return "#eab308";
  if (score <= 70) return "#f97316";
  return "#ef4444";
}

function getRiskLabel(score: number): string {
  if (score <= 30) return "LOW";
  if (score <= 50) return "MODERATE";
  if (score <= 70) return "ELEVATED";
  return "CRITICAL";
}

function getSeverityColor(severity: number): string {
  if (severity >= 8) return "#ef4444";
  if (severity >= 5) return "#f97316";
  if (severity >= 3) return "#eab308";
  return "#22c55e";
}

// ─── SVG Helpers ─────────────────────────────────────────────────────────────

const CX = 160;
const CY = 160;
const OUTER_R = 130;
const INNER_R = 48;
const GAP_DEG = 3;

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function buildSegmentPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
): string {
  const [ox1, oy1] = polarToCartesian(cx, cy, outerR, startDeg);
  const [ox2, oy2] = polarToCartesian(cx, cy, outerR, endDeg);
  const [ix1, iy1] = polarToCartesian(cx, cy, innerR, endDeg);
  const [ix2, iy2] = polarToCartesian(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${ox1} ${oy1}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${ox2} ${oy2}`,
    `L ${ix1} ${iy1}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2}`,
    "Z",
  ].join(" ");
}

// ─── Tooltip ────────────────────────────────────────────────────────────────

interface TooltipState {
  entry: PerceptionEntry;
  x: number;
  y: number;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function RadialSkeleton() {
  const slices = 7;
  const sliceDeg = 360 / slices;
  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full h-full"
      role="img"
      aria-label="Perception radar skeleton"
    >
      <circle cx={CX} cy={CY} r={OUTER_R} fill="rgba(255,255,255,0.03)" />
      {Array.from({ length: slices }).map((_, i) => {
        const start = i * sliceDeg + GAP_DEG / 2;
        const end = (i + 1) * sliceDeg - GAP_DEG / 2;
        const d = buildSegmentPath(CX, CY, INNER_R, OUTER_R, start, end);
        return (
          <path
            key={`skel-${start.toFixed(2)}`}
            d={d}
            fill="rgba(255,255,255,0.06)"
            className="animate-pulse"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        );
      })}
      <circle cx={CX} cy={CY} r={INNER_R} fill="rgba(255,255,255,0.04)" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TooltipCard({ entry }: { entry: PerceptionEntry }) {
  const color =
    PERCEPTION_COLORS[entry.perceptionType] ?? getRiskColor(entry.riskScore);
  const topAnomaly = entry.anomalyFlags[0];
  return (
    <div
      className="rounded-lg border shadow-xl text-xs"
      style={{
        background: "oklch(0.12 0.04 260 / 0.97)",
        borderColor: `${color}60`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="px-3 py-2 border-b flex items-center gap-2"
        style={{ borderColor: `${color}30` }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <span className="font-bold text-foreground">
          {entry.perceptionType}
        </span>
        <span
          className="ml-auto font-mono font-bold"
          style={{ color: getRiskColor(entry.riskScore) }}
        >
          {entry.riskScore}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1 text-muted-foreground">
        <div className="flex justify-between gap-4">
          <span>Confidence</span>
          <span className="text-foreground font-medium">
            {entry.confidenceScore}%
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Findings</span>
          <span className="text-foreground font-medium">
            {entry.findings.length}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Anomalies</span>
          <span
            className="font-medium"
            style={{
              color: entry.anomalyFlags.length > 0 ? "#ef4444" : "#22c55e",
            }}
          >
            {entry.anomalyFlags.length}
          </span>
        </div>
        {topAnomaly && (
          <div
            className="mt-1 pt-1.5 border-t text-[10px] text-orange-400"
            style={{ borderColor: `${color}20` }}
          >
            ⚠ {topAnomaly.description.slice(0, 60)}
            {topAnomaly.description.length > 60 ? "…" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function SeverityDot({ severity }: { severity: number }) {
  const color = getSeverityColor(severity);
  return (
    <div
      className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 5px ${color}60` }}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function NeuralPerceptionPanel({
  synthesisResult,
  isLoading,
  toolId,
  streamingMode = false,
}: NeuralPerceptionPanelProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Streaming mode: use the perception stream hook
  const stream = usePerceptionStream(streamingMode ? synthesisResult : null);

  // Auto-start stream when synthesis arrives in streaming mode
  useEffect(() => {
    if (streamingMode && synthesisResult && stream.phase === "idle") {
      const t = setTimeout(() => stream.start(), 300);
      return () => clearTimeout(t);
    }
  }, [streamingMode, synthesisResult, stream]);

  // Stagger-animate segments — tie to stream completion in streaming mode
  useEffect(() => {
    if (!synthesisResult) {
      setVisibleCount(0);
      return;
    }
    if (streamingMode) {
      // visibleCount driven by stream.completedEngines.length
      setVisibleCount(stream.completedEngines.length);
      return;
    }
    setVisibleCount(0);
    const n = synthesisResult.perceptionMap.length;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= n) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [synthesisResult, streamingMode, stream.completedEngines.length]);

  // ── Null state ──────────────────────────────────────────────────────────
  if (!isLoading && !synthesisResult) {
    return (
      <div
        className="rounded-xl border border-border bg-[oklch(0.15_0.05_260)] p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[320px]"
        data-ocid="neural.panel.empty_state"
      >
        <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <Brain className="w-7 h-7 text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">
            Multi-Perception Neural Thinking Engine
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Run a tool analysis to see multi-perception intelligence across
            Cost, Safety, Schedule, Compliance, Labor, Design, and Financial
            dimensions.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
          <Layers className="w-3.5 h-3.5" />
          <span>7 perception engines · Native Nexus Intelligence</span>
        </div>
      </div>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="rounded-xl border border-border bg-[oklch(0.15_0.05_260)] p-6 space-y-5"
        data-ocid="neural.panel.loading_state"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div>
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 rounded" />
        </div>
        <div className="flex justify-center">
          <div className="w-[280px] h-[280px]">
            <RadialSkeleton />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // ── Segment geometry ─────────────────────────────────────────────────────
  const map = synthesisResult!.perceptionMap;
  const totalRisk = map.reduce((s, e) => s + Math.max(e.riskScore, 1), 0);
  let cursor = 0;
  const segments = map.map((entry, idx) => {
    const proportion = Math.max(entry.riskScore, 1) / totalRisk;
    const arcDeg = proportion * 360 - GAP_DEG;
    const startDeg = cursor + GAP_DEG / 2;
    const endDeg = startDeg + arcDeg;
    cursor += proportion * 360;
    const midDeg = startDeg + arcDeg / 2;
    const labelR = (INNER_R + OUTER_R) / 2;
    const [lx, ly] = polarToCartesian(CX, CY, labelR, midDeg);
    const color =
      PERCEPTION_COLORS[entry.perceptionType] ?? getRiskColor(entry.riskScore);
    return { entry, startDeg, endDeg, midDeg, lx, ly, color, idx };
  });

  const {
    overallRiskScore,
    dominantPerception,
    confidenceScore,
    crossPerceptionInsights,
    prioritizedActions,
  } = synthesisResult!;

  const handleSegmentHover = (
    entry: PerceptionEntry,
    e: React.MouseEvent<SVGPathElement>,
  ) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      entry,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSegmentLeave = () => setTooltip(null);

  const toggleExpand = (engineId: string) => {
    setExpandedId((prev) => (prev === engineId ? null : engineId));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-xl border border-[oklch(0.35_0.08_260)] bg-[oklch(0.13_0.04_260)] overflow-hidden"
      data-ocid="neural.panel"
    >
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3 border-b border-[oklch(0.22_0.03_260)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground tracking-wide">
              Multi-Perception Neural Thinking Engine
            </p>
            <p className="text-[11px] text-muted-foreground">
              {map.length} perception engines active ·{" "}
              <span style={{ color: getRiskColor(overallRiskScore) }}>
                {getRiskLabel(overallRiskScore)} RISK
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] border-orange-500/40 text-orange-400 tracking-widest hidden sm:flex"
          >
            NEXUS NATIVE
          </Badge>
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[oklch(0.3_0.05_260)] bg-[oklch(0.18_0.04_260)] text-[11px] text-muted-foreground hover:border-orange-500/40 hover:text-orange-400 transition-colors"
            data-ocid="neural.history_button"
          >
            <Clock className="w-3.5 h-3.5" />
            History
          </button>
        </div>
      </div>

      {/* ── Streaming terminal ── */}
      {streamingMode && (
        <div className="px-5 pt-4 pb-0">
          <PerceptionStreamDisplay streamState={stream} className="mb-5" />
        </div>
      )}

      {/* ── History panel ── */}
      {showHistory && (
        <div
          className="px-5 py-4 border-b border-[oklch(0.22_0.03_260)] bg-[oklch(0.11_0.03_260)] space-y-2"
          data-ocid="neural.history_panel"
        >
          <p className="text-xs font-semibold text-foreground mb-2 tracking-widest uppercase">
            Perception History — {toolId}
          </p>
          <p className="text-xs text-muted-foreground italic">
            No past perception analyses found for this tool. Run a tool analysis
            to begin building perception history.
          </p>
        </div>
      )}

      {/* ── Chart + legend ── */}
      <div className="px-5 py-5 flex flex-col md:flex-row gap-6 items-center">
        {/* Radial map */}
        <div className="relative w-[280px] h-[280px] flex-shrink-0">
          <svg
            ref={svgRef}
            viewBox="0 0 320 320"
            className="w-full h-full"
            role="img"
            aria-label="Multi-perception radial risk map"
            data-ocid="neural.radial_chart"
          >
            {/* Outer glow ring */}
            <circle
              cx={CX}
              cy={CY}
              r={OUTER_R + 6}
              fill="none"
              stroke="oklch(0.65 0.16 245 / 0.12)"
              strokeWidth="1"
            />
            {/* Background ring */}
            <circle
              cx={CX}
              cy={CY}
              r={OUTER_R}
              fill="oklch(0.11 0.03 260 / 0.8)"
            />

            {/* Segments */}
            {segments.map(({ entry, startDeg, endDeg, color, idx }) => {
              const visible = idx < visibleCount;
              const isExpanded = expandedId === entry.engineId;
              const hasAnomaly = entry.anomalyFlags.length > 0;
              const outerRadius = OUTER_R + (isExpanded ? 8 : 0);
              const d = buildSegmentPath(
                CX,
                CY,
                INNER_R,
                outerRadius,
                startDeg,
                endDeg,
              );
              return (
                <path
                  key={entry.engineId}
                  d={d}
                  fill={visible ? color : "transparent"}
                  fillOpacity={visible ? (isExpanded ? 0.9 : 0.65) : 0}
                  stroke={
                    visible ? (hasAnomaly ? "#ef4444" : color) : "transparent"
                  }
                  strokeWidth={visible ? (hasAnomaly ? 2 : 1) : 0}
                  style={{
                    transition: `fill-opacity 0.4s ease ${idx * 100}ms`,
                    cursor: "pointer",
                    filter: isExpanded
                      ? `drop-shadow(0 0 8px ${color}80)`
                      : undefined,
                  }}
                  onMouseMove={(e) => handleSegmentHover(entry, e)}
                  onMouseLeave={handleSegmentLeave}
                  onClick={() => toggleExpand(entry.engineId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleExpand(entry.engineId);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${entry.perceptionType} perception, risk score ${entry.riskScore}`}
                  data-ocid={`neural.segment.${entry.perceptionType.toLowerCase()}`}
                />
              );
            })}

            {/* Dashed grid rings */}
            {[0.33, 0.66, 1].map((frac) => (
              <circle
                key={`ring-${frac}`}
                cx={CX}
                cy={CY}
                r={INNER_R + frac * (OUTER_R - INNER_R)}
                fill="none"
                stroke="oklch(0.4 0.02 260 / 0.25)"
                strokeWidth="0.5"
                strokeDasharray="3 4"
              />
            ))}

            {/* Center disc */}
            <circle
              cx={CX}
              cy={CY}
              r={INNER_R - 2}
              fill="oklch(0.1 0.04 260)"
              stroke="oklch(0.35 0.08 260)"
              strokeWidth="1.5"
            />

            {/* Center: risk score */}
            <text
              x={CX}
              y={CY - 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={getRiskColor(overallRiskScore)}
              fontSize="22"
              fontWeight="800"
              fontFamily="monospace"
            >
              {overallRiskScore}
            </text>

            {/* Center: dominant perception label */}
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.6)"
              fontSize="7.5"
              fontWeight="600"
              letterSpacing="1.2"
            >
              {dominantPerception.toUpperCase()}
            </text>

            {/* Center: confidence */}
            <text
              x={CX}
              y={CY + 22}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize="6.5"
            >
              {confidenceScore}% conf
            </text>

            {/* Segment labels */}
            {segments.map(({ entry, lx, ly, idx }) => {
              if (idx >= visibleCount) return null;
              const label = entry.perceptionType.slice(0, 3).toUpperCase();
              return (
                <text
                  key={`lbl-${entry.engineId}`}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.85)"
                  fontSize="7"
                  fontWeight="700"
                  letterSpacing="0.8"
                  style={{ pointerEvents: "none" }}
                >
                  {label}
                </text>
              );
            })}
          </svg>

          {/* Floating tooltip */}
          {tooltip && (
            <div
              className="absolute z-20 min-w-[180px] max-w-[220px] pointer-events-none"
              style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
            >
              <TooltipCard entry={tooltip.entry} />
            </div>
          )}
        </div>

        {/* Perception legend list */}
        <div className="flex-1 w-full space-y-2">
          {segments.map(({ entry, color, idx }) => {
            const Icon = PERCEPTION_ICONS[entry.perceptionType] ?? Zap;
            const visible = idx < visibleCount;
            const isExpanded = expandedId === entry.engineId;
            return (
              <button
                type="button"
                key={entry.engineId}
                onClick={() => toggleExpand(entry.engineId)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left group"
                style={{
                  borderColor: isExpanded ? color : "oklch(0.28 0.04 260)",
                  background: isExpanded
                    ? `${color}18`
                    : "oklch(0.17 0.03 260 / 0.7)",
                  opacity: visible ? 1 : 0.3,
                  transform: visible ? "translateX(0)" : "translateX(-8px)",
                  transition: `all 0.35s ease ${idx * 80}ms`,
                }}
                data-ocid={`neural.perception_item.${idx + 1}`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {entry.perceptionType}
                    </span>
                    <span
                      className="text-[10px] font-bold tabular-nums"
                      style={{ color: getRiskColor(entry.riskScore) }}
                    >
                      {entry.riskScore}
                    </span>
                  </div>
                  {/* Mini risk bar */}
                  <div className="mt-1 h-1 rounded-full bg-[oklch(0.22_0.03_260)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: visible ? `${entry.riskScore}%` : "0%",
                        background: getRiskColor(entry.riskScore),
                        transitionDelay: `${idx * 100 + 200}ms`,
                      }}
                    />
                  </div>
                </div>
                {entry.anomalyFlags.length > 0 && (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                )}
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {expandedId &&
        (() => {
          const entry = map.find((e) => e.engineId === expandedId);
          if (!entry) return null;
          const color =
            PERCEPTION_COLORS[entry.perceptionType] ??
            getRiskColor(entry.riskScore);
          return (
            <div
              className="border-t border-[oklch(0.22_0.03_260)] px-5 pb-5 pt-4 space-y-4"
              data-ocid="neural.detail_panel"
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className="text-sm font-bold tracking-widest uppercase"
                  style={{ color }}
                >
                  {entry.perceptionType} Perception Detail
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    Risk:{" "}
                    <span
                      className="font-bold"
                      style={{ color: getRiskColor(entry.riskScore) }}
                    >
                      {entry.riskScore}
                    </span>
                  </span>
                  <span>
                    Confidence:{" "}
                    <span className="font-bold text-foreground">
                      {entry.confidenceScore}%
                    </span>
                  </span>
                  <span className="text-foreground font-medium">
                    {entry.findings.length} finding
                    {entry.findings.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Findings */}
              {entry.findings.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-2 tracking-widest uppercase">
                    Findings
                  </p>
                  <div className="space-y-2">
                    {entry.findings.map((f, i) => (
                      <div
                        key={f.findingId}
                        className="flex gap-3 px-3 py-2.5 rounded-lg bg-[oklch(0.17_0.03_260)] border border-[oklch(0.25_0.04_260)]"
                        data-ocid={`neural.finding.${i + 1}`}
                      >
                        <SeverityDot severity={f.severity} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                              {f.category}
                            </span>
                            <span
                              className="text-[10px] font-mono"
                              style={{ color: getSeverityColor(f.severity) }}
                            >
                              SEV {f.severity}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60">
                              {Math.round(f.confidence * 100)}% conf
                            </span>
                          </div>
                          <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                            {f.description}
                          </p>
                          {f.sourceData && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 italic">
                              Source: {f.sourceData}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anomaly flags */}
              {entry.anomalyFlags.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-2 tracking-widest uppercase">
                    Anomaly Flags ({entry.anomalyFlags.length})
                  </p>
                  <div className="space-y-2">
                    {entry.anomalyFlags.map((flag, i) => (
                      <div
                        key={flag.flagId}
                        className="flex gap-3 px-3 py-2.5 rounded-lg border"
                        style={{
                          borderColor:
                            flag.severity >= 8
                              ? "rgba(239,68,68,0.4)"
                              : "rgba(249,115,22,0.35)",
                          background:
                            flag.severity >= 8
                              ? "rgba(239,68,68,0.08)"
                              : "rgba(249,115,22,0.07)",
                        }}
                        data-ocid={`neural.anomaly_flag.${i + 1}`}
                      >
                        <AlertTriangle
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{
                            color: flag.severity >= 8 ? "#ef4444" : "#f97316",
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground font-medium leading-relaxed">
                            {flag.description}
                          </p>
                          {flag.recommendedAction && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              <span className="font-semibold text-orange-400">
                                Action:
                              </span>{" "}
                              {flag.recommendedAction}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {entry.recommendations.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-2 tracking-widest uppercase">
                    Recommendations
                  </p>
                  <ol className="space-y-1.5">
                    {entry.recommendations.map((rec, i) => (
                      <li
                        key={`rec-${rec.slice(0, 32)}`}
                        className="flex gap-2.5 text-xs text-foreground"
                      >
                        <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">
                          {i + 1}.
                        </span>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })()}

      {/* ── Cross-perception insights ── */}
      {crossPerceptionInsights.length > 0 && (
        <div className="border-t border-[oklch(0.22_0.03_260)] px-5 py-4 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1">
            Cross-Perception Insights
          </p>
          {crossPerceptionInsights.map((insight, i) => {
            const isCritical = /critical|urgent|immediate|danger/i.test(
              insight,
            );
            return (
              <div
                key={`ci-${insight.slice(0, 32)}`}
                className="flex gap-3 px-3 py-2.5 rounded-lg border text-xs"
                style={{
                  borderColor: isCritical
                    ? "rgba(239,68,68,0.4)"
                    : "rgba(249,115,22,0.3)",
                  background: isCritical
                    ? "rgba(239,68,68,0.07)"
                    : "rgba(249,115,22,0.06)",
                }}
                data-ocid={`neural.cross_insight.${i + 1}`}
              >
                {isCritical ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Zap className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-foreground leading-relaxed">
                  {insight}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Prioritized actions ── */}
      {prioritizedActions.length > 0 && (
        <div className="border-t border-[oklch(0.22_0.03_260)] px-5 py-4 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-1">
            Prioritized Actions
          </p>
          <ol className="space-y-2">
            {prioritizedActions.map((action, i) => {
              const tier = i < 2 ? "high" : i < 4 ? "medium" : "low";
              type Tier = "high" | "medium" | "low";
              const styles: Record<
                Tier,
                { border: string; bg: string; badge: string }
              > = {
                high: {
                  border: "rgba(239,68,68,0.35)",
                  bg: "rgba(239,68,68,0.08)",
                  badge: "#ef4444",
                },
                medium: {
                  border: "rgba(249,115,22,0.3)",
                  bg: "rgba(249,115,22,0.07)",
                  badge: "#f97316",
                },
                low: {
                  border: "rgba(59,130,246,0.25)",
                  bg: "rgba(59,130,246,0.06)",
                  badge: "#3b82f6",
                },
              };
              const s = styles[tier as Tier];
              return (
                <li
                  key={`pa-${action.slice(0, 32)}`}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg border text-xs"
                  style={{ borderColor: s.border, background: s.bg }}
                  data-ocid={`neural.prioritized_action.${i + 1}`}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                    style={{
                      background: `${s.badge}25`,
                      color: s.badge,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-foreground leading-relaxed flex-1">
                    {action}
                  </span>
                  {tier === "high" && (
                    <TrendingDown className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  {tier === "medium" && (
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                  )}
                  {tier === "low" && (
                    <Shield className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[oklch(0.22_0.03_260)] flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm bg-orange-500 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-black text-white">N</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Multi-Perception Neural Thinking Engine · Powered by OIS Nexus ·
          Colony Unification Theorem Enforced
        </p>
      </div>
    </div>
  );
}

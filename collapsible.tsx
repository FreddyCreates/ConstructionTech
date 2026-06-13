import { NexusInsightPanel } from "@/components/NexusInsightPanel";
import SaveResultButton from "@/components/SaveResultButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  FileDown,
  FileSpreadsheet,
  Hexagon,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  BenchmarkRecord,
  NexusInsight,
  NexusRecommendation,
} from "../types";
import { exportResultToExcel } from "../utils/excelExport";
import { generateToolPDF } from "../utils/pdfExport";

export interface BenchmarkData {
  label: string;
  yourValue: string;
  norm: string;
  normLabel?: string;
}

export interface NexusInsightItem {
  category: string;
  title: string;
  detail: string;
  confidence: string;
  priorityScore: number;
  isAnomaly: boolean;
  insightQualityScore?: number;
}

export interface NexusResultEnrichmentProps {
  toolName: string;
  toolId?: string;
  toolCategory: string;
  confidenceScore: string;
  benchmark: BenchmarkData;
  benchmarkData?: BenchmarkRecord[];
  anomalyDetected: boolean;
  anomalyMessage?: string;
  insights: NexusInsightItem[] | NexusInsight[];
  nexusInsights?: NexusInsight[];
  insightsLoading?: boolean;
  recommendations?: NexusRecommendation[];
  cplAligned?: boolean;
  region?: string;
  result: unknown;
  inputs: unknown;
}

/** CPL hexagonal badge rendered bottom-right of every enriched result panel */
export function CPLBadge() {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-card border border-border/60 text-xs font-mono text-muted-foreground"
      title="CPL Governed — output passed governance check"
    >
      <Hexagon className="w-3 h-3 text-muted-foreground" />
      CPL
    </div>
  );
}

/** Confidence percentage badge */
function ConfidenceChip({ score }: { score: string }) {
  const pct = Number.parseFloat(score);
  const color =
    pct >= 80
      ? "border-green-500/40 text-green-400 bg-green-500/10"
      : pct >= 60
        ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
        : "border-red-500/40 text-red-400 bg-red-500/10";
  return (
    <Badge variant="outline" className={color}>
      {score}% Confidence
    </Badge>
  );
}

/** Benchmark comparison row */
function BenchmarkRow({ benchmark }: { benchmark: BenchmarkData }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-lg bg-muted/40 border border-border/40">
      <div className="text-sm text-muted-foreground">{benchmark.label}</div>
      <div className="flex items-center gap-4 text-sm">
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-0.5">
            Your Result
          </div>
          <div className="font-semibold text-foreground">
            {benchmark.yourValue}
          </div>
        </div>
        <TrendingUp className="w-4 h-4 text-muted-foreground/60 shrink-0" />
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-0.5">
            {benchmark.normLabel ?? "Industry Norm"}
          </div>
          <div className="font-semibold text-accent">{benchmark.norm}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * NexusResultEnrichment — drops into any tool's result section to add:
 * confidence ring, benchmark bar, anomaly flag, Nexus Insight Engine,
 * Tool Recommendations, CPL badge, PDF export, save button
 */
export function NexusResultEnrichment({
  toolName,
  toolId,
  toolCategory,
  confidenceScore,
  benchmark,
  benchmarkData,
  anomalyDetected,
  anomalyMessage,
  insights,
  nexusInsights,
  insightsLoading: _insightsLoading = false,
  recommendations,
  cplAligned = true,
  region,
  result,
  inputs,
}: NexusResultEnrichmentProps) {
  const [showRecs, setShowRecs] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const pct = Number.parseFloat(confidenceScore);
  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (pct / 100) * circumference;

  // animate ring on mount
  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = String(offset);
    }
  }, [offset]);

  // Normalise insights to NexusInsight[]
  const normalised: NexusInsight[] =
    (nexusInsights ??
    (insights as NexusInsight[]).filter((i): i is NexusInsight => "text" in i)
      .length > 0)
      ? (insights as NexusInsight[])
      : (insights as NexusInsightItem[]).map((item) => ({
          text: item.detail || item.title,
          type: item.isAnomaly
            ? ("risk" as const)
            : ("recommendation" as const),
          confidence: Number(item.confidence) || 70,
          priority: item.priorityScore || 1,
          timestamp: new Date().toISOString(),
        }));

  const severityClass = (ins: NexusInsight) => {
    if (ins.type === "alert" || ins.type === "risk")
      return "border-l-red-500 bg-red-500/5";
    if (ins.confidence < 60) return "border-l-orange-400 bg-orange-400/5";
    if (ins.type === "benchmark") return "border-l-blue-400 bg-blue-400/5";
    return "border-l-green-500 bg-green-500/5";
  };

  const ocid = toolName.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="space-y-4 mt-4 insight-card-container"
      data-ocid={`${ocid}.nexus_panel`}
    >
      {/* Confidence ring + CPL row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Animated confidence ring */}
          <div className="relative w-12 h-12 shrink-0">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 50 50"
              aria-label="Nexus confidence score"
              role="img"
            >
              <circle
                cx="25"
                cy="25"
                r="22"
                fill="none"
                stroke="#333"
                strokeWidth="3"
              />
              <circle
                ref={ringRef}
                cx="25"
                cy="25"
                r="22"
                fill="none"
                stroke={
                  pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444"
                }
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
              {Math.round(pct)}%
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Nexus Confidence
            </p>
            <ConfidenceChip score={confidenceScore} />
          </div>
        </div>
        {/* CPL aligned / flagged */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono ${
            cplAligned
              ? "bg-green-500/10 border-green-500/40 text-green-400"
              : "bg-red-500/10 border-red-500/40 text-red-400"
          }`}
          data-ocid={`${ocid}.cpl_badge`}
        >
          <Hexagon className="w-3 h-3" />
          {cplAligned ? "CPL: ALIGNED" : "CPL: FLAGGED"}
        </div>
      </div>

      {/* Primary benchmark row */}
      <BenchmarkRow benchmark={benchmark} />

      {/* Benchmark comparison bar(s) from WL data */}
      {benchmarkData && benchmarkData.length > 0 && (
        <div className="space-y-2">
          {benchmarkData.map((b) => {
            const your =
              Number(benchmark.yourValue.replace(/[^0-9.]/g, "")) || 0;
            const pct2 =
              b.industryRangeHigh > 0
                ? Math.min((your / b.industryRangeHigh) * 100, 100)
                : 0;
            return (
              <div
                key={b.metricLabel}
                className="benchmark-comparison-viz space-y-1"
              >
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>{b.metricLabel}</span>
                  <span>Median: {b.libraryMedian.toLocaleString()}</span>
                </div>
                <div className="relative h-2 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${pct2}%` }}
                  />
                  {/* median marker */}
                  <div
                    className="absolute top-0 h-full w-px bg-accent/70"
                    style={{
                      left: `${b.industryRangeHigh > 0 ? (b.libraryMedian / b.industryRangeHigh) * 100 : 50}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Anomaly flag */}
      {anomalyDetected && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-lg border nexus-card-anomaly"
          data-ocid={`${ocid}.anomaly_flag`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              Nexus Anomaly Detected
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {anomalyMessage ??
                "This result deviates significantly from the established norm. Review inputs carefully before proceeding."}
            </p>
          </div>
        </div>
      )}

      {/* Nexus Insight cards with severity-coded left borders */}
      {normalised.length > 0 && (
        <Card className="p-5 border-border shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold bg-primary/15 text-primary">
              N
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Nexus Insight Engine
            </h3>
            <span className="ml-auto text-xs font-mono text-muted-foreground">
              {normalised.length} insight{normalised.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-2">
            {normalised
              .sort((a, b) => a.priority - b.priority)
              .map((ins, i) => (
                <div
                  key={ins.timestamp + String(i)}
                  className={`pl-3 pr-4 py-2.5 rounded-r border-l-2 text-sm ${severityClass(
                    ins,
                  )}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                  data-ocid={`${ocid}.insight_card.${i + 1}`}
                >
                  <p className="text-foreground leading-snug">{ins.text}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                    {ins.type.toUpperCase()} · {ins.confidence}% confidence
                  </p>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Tool Recommendations from Nexus */}
      {recommendations && recommendations.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2">
          <button
            type="button"
            className="w-full flex items-center justify-between text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase"
            onClick={() => setShowRecs((s) => !s)}
            data-ocid={`${ocid}.recommendations_toggle`}
          >
            <span>NEXUS TOOL RECOMMENDATIONS</span>
            <span>{showRecs ? "▲" : "▼"}</span>
          </button>
          {showRecs && (
            <div className="space-y-1 pt-1">
              {recommendations.map((r, i) => (
                <div
                  key={r.toolId + String(i)}
                  className="flex items-start gap-2 text-xs py-1.5"
                  data-ocid={`${ocid}.recommendation.${i + 1}`}
                >
                  <span className="font-mono text-primary shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-muted-foreground">{r.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export row */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-primary/40 text-primary hover:bg-primary/10 font-mono text-xs"
          onClick={() =>
            generateToolPDF(
              toolName,
              toolId ?? toolName.toLowerCase().replace(/\s+/g, "-"),
              inputs as Record<string, unknown>,
              result,
              normalised,
              benchmarkData ?? null,
              region ?? "National",
            )
          }
          data-ocid={`${ocid}.export_pdf_button`}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-mono text-xs"
          onClick={() => {
            const resultObj =
              result && typeof result === "object"
                ? (result as Record<string, unknown>)
                : { result: String(result) };
            const inputsObj =
              inputs && typeof inputs === "object"
                ? (inputs as Record<string, unknown>)
                : {};
            const extras: import("../utils/excelExport").ExcelSheet[] = [];
            if (benchmarkData && benchmarkData.length > 0) {
              extras.push({
                name: "Benchmarks",
                headers: [
                  "Metric",
                  "Median",
                  "Range Low",
                  "Range High",
                  "GC Avg",
                ],
                rows: benchmarkData.map((b) => [
                  b.metricLabel,
                  b.libraryMedian,
                  b.industryRangeLow,
                  b.industryRangeHigh,
                  b.gcHistoricalAvg,
                ]),
              });
            }
            if (normalised.length > 0) {
              extras.push({
                name: "Nexus Insights",
                headers: ["Type", "Confidence", "Priority", "Insight"],
                rows: normalised.map((i) => [
                  i.type,
                  i.confidence,
                  i.priority,
                  i.text,
                ]),
              });
            }
            exportResultToExcel(toolName, inputsObj, resultObj, extras);
          }}
          data-ocid={`${ocid}.export_excel_button`}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Save result */}
      <SaveResultButton
        toolName={toolName}
        toolCategory={toolCategory}
        result={result}
        inputs={inputs}
      />
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  FileDown,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import type { AnomalyState, BenchmarkRecord, NexusInsight } from "../types";
import { exportResultToExcel } from "../utils/excelExport";
import { generateToolPDF } from "../utils/pdfExport";
import BenchmarkComparisonChart from "./BenchmarkComparisonChart";
import { NexusInsightPanel } from "./NexusInsightPanel";
import SaveResultButton from "./SaveResultButton";

export interface ToolPageShellProps {
  title: string;
  description: string;
  toolId: string;
  toolCategory?: string;
  categoryBadge?: string;
  result?: Record<string, unknown> | null;
  nexusData?: unknown;
  nexusInsights?: NexusInsight[];
  anomaly?: AnomalyState | null;
  benchmarks?: BenchmarkRecord[];
  isLoading?: boolean;
  isSaving?: boolean;
  onExportPDF?: () => void;
  onSave?: () => void;
  inputs?: Record<string, unknown>;
  /** Show BHX worker task pipeline badge during calculation */
  workerTaskBadge?: boolean;
  /** Show pheromone signal quality badge after calculation */
  pheromoneBadge?: boolean;
  /** Enable advanced inputs collapsible section */
  advancedInputsToggle?: ReactNode;
  /** Region for PDF context */
  region?: string;
  children: ReactNode;
}

/** Format a camelCase / snake_case key into human-readable label */
function humanLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/** Render a single result value as a string */
function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (Array.isArray(val)) return val.map(String).join(", ");
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

export default function ToolPageShell({
  title,
  description,
  toolId,
  toolCategory = "General",
  categoryBadge,
  result,
  nexusInsights = [],
  anomaly,
  benchmarks,
  isLoading = false,
  isSaving = false,
  onExportPDF,
  onSave,
  inputs = {},
  workerTaskBadge = false,
  pheromoneBadge = false,
  advancedInputsToggle,
  region = "National",
  children,
}: ToolPageShellProps) {
  const hasResult = result != null && Object.keys(result).length > 0;
  const [showAdvanced, setShowAdvanced] = useState(false);

  function handleExportPDF() {
    if (onExportPDF) {
      onExportPDF();
      return;
    }
    generateToolPDF(
      title,
      toolId,
      inputs,
      result ?? {},
      nexusInsights,
      benchmarks ?? null,
      region,
    );
  }

  function handleExportExcel() {
    const extras: import("../utils/excelExport").ExcelSheet[] = [];
    if (benchmarks && benchmarks.length > 0) {
      extras.push({
        name: "Benchmarks",
        headers: ["Metric", "Your Value", "Median", "Range Low", "Range High"],
        rows: benchmarks.map((b) => [
          b.metricLabel,
          primaryValue,
          b.libraryMedian,
          b.industryRangeLow,
          b.industryRangeHigh,
        ]),
      });
    }
    if (nexusInsights.length > 0) {
      extras.push({
        name: "Nexus Insights",
        headers: ["Type", "Confidence", "Priority", "Insight"],
        rows: nexusInsights.map((i) => [
          i.type,
          i.confidence,
          i.priority,
          i.text,
        ]),
      });
    }
    exportResultToExcel(
      title,
      inputs as Record<string, unknown>,
      result as Record<string, unknown>,
      extras,
    );
  }

  // Derive a primary numeric value from result for benchmark chart
  const primaryValue = (() => {
    if (!result) return 0;
    for (const key of [
      "totalCost",
      "totalMax",
      "costMax",
      "estimatedCostUSD",
      "totalMobMax",
      "totalHours",
      "dart",
      "ltir",
      "trir",
    ]) {
      const v = result[key];
      if (typeof v === "number") return v;
      if (typeof v === "string" && !Number.isNaN(Number(v))) return Number(v);
      if (typeof v === "bigint") return Number(v);
    }
    return 0;
  })();

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
      data-ocid={`${toolId}.page`}
    >
      {/* Hero header */}
      <div
        className="tool-hero-header rounded-xl space-y-3"
        data-ocid={`${toolId}.hero_header`}
      >
        <div className="flex items-center gap-3">
          {categoryBadge && (
            <Badge
              variant="outline"
              className="text-[10px] font-mono tracking-widest uppercase border-primary/40 text-primary"
            >
              {categoryBadge}
            </Badge>
          )}
        </div>
        <h1
          className="text-3xl font-bold text-white"
          data-ocid={`${toolId}.title`}
        >
          {title}
        </h1>
        <p
          className="text-slate-400 text-sm leading-relaxed max-w-2xl"
          data-ocid={`${toolId}.description`}
        >
          {description}
        </p>
      </div>

      {/* Tool form + optional advanced inputs */}
      <div data-ocid={`${toolId}.form`}>
        {children}
        {advancedInputsToggle && (
          <div className="form-group-advanced mt-4">
            <button
              type="button"
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              onClick={() => setShowAdvanced((s) => !s)}
              data-ocid={`${toolId}.advanced_toggle`}
            >
              {showAdvanced ? "▼" : "►"} Advanced Options
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                {advancedInputsToggle}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BHX worker task badge */}
      {isLoading && workerTaskBadge && (
        <div
          className="worker-task-badge"
          data-ocid={`${toolId}.worker_task_badge`}
        >
          <span className="animate-pulse">⦿</span>
          <span className="font-mono text-xs">BHX WORKER ASSIGNED</span>
        </div>
      )}

      {/* Pheromone badge after result */}
      {hasResult && !isLoading && pheromoneBadge && (
        <div
          className="pheromone-badge"
          data-ocid={`${toolId}.pheromone_badge`}
        >
          <span>🐝</span>
          <span className="font-mono text-xs">PHEROMONE SIGNAL BROADCAST</span>
        </div>
      )}

      {/* Loading overlay with honeycomb pulse */}
      {isLoading && (
        <div
          className="flex items-center justify-center py-16"
          data-ocid={`${toolId}.loading_state`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[honeycomb-pulse_1.5s_ease-in-out_infinite]" />
              <div className="absolute inset-2 rounded-full border-2 border-accent/30 animate-[honeycomb-pulse_1.5s_ease-in-out_0.3s_infinite]" />
              <div className="absolute inset-4 rounded-full border-2 border-primary/30 animate-[honeycomb-pulse_1.5s_ease-in-out_0.6s_infinite]" />
            </div>
            <span className="text-sm font-mono text-slate-400 tracking-widest animate-pulse">
              NEXUS ANALYZING...
            </span>
          </div>
        </div>
      )}

      {/* Results section */}
      {hasResult && !isLoading && (
        <div className="space-y-4" data-ocid={`${toolId}.results_section`}>
          {/* Raw result key-value grid */}
          <div className="rounded-xl border border-orange-500/20 bg-[#1a1a1a] p-5 space-y-4">
            <h2 className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
              CALCULATION RESULTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(result!).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-lg bg-[#111] border border-white/5 px-4 py-3"
                  data-ocid={`${toolId}.result.${key}`}
                >
                  <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    {humanLabel(key)}
                  </p>
                  <p className="text-sm font-semibold text-orange-400 break-words">
                    {formatValue(val)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly badge */}
          {anomaly?.detected && (
            <div
              className="anomaly-badge anomaly-badge-pulse"
              data-ocid={`${toolId}.anomaly_badge`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>
                Anomaly Detected: {anomaly.delta > 0 ? "+" : ""}
                {anomaly.delta.toFixed(1)}% deviation
              </span>
            </div>
          )}

          {/* Benchmark comparison chart */}
          {benchmarks && benchmarks.length > 0 && primaryValue > 0 && (
            <div className="tool-glass-card p-4 space-y-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">
                BENCHMARK COMPARISON
              </h3>
              {benchmarks.map((b, _i) => (
                <BenchmarkComparisonChart
                  key={b.metricLabel}
                  metricLabel={b.metricLabel}
                  toolResult={primaryValue}
                  libraryMedian={b.libraryMedian}
                  industryRangeLow={b.industryRangeLow}
                  industryRangeHigh={b.industryRangeHigh}
                  gcHistoricalAvg={b.gcHistoricalAvg}
                />
              ))}
            </div>
          )}

          {/* Nexus Insight panel */}
          <NexusInsightPanel insights={nexusInsights} isLoading={isLoading} />

          {/* Action row */}
          <div
            className="flex flex-wrap items-center gap-3 pt-1"
            data-ocid={`${toolId}.action_row`}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10 font-mono text-xs"
              data-ocid={`${toolId}.export_pdf_button`}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-mono text-xs"
              data-ocid={`${toolId}.export_excel_button`}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            {onSave ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={onSave}
                className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10 font-mono text-xs"
                data-ocid={`${toolId}.save_button`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save to Account"
                )}
              </Button>
            ) : (
              <SaveResultButton
                toolName={title}
                toolCategory={toolCategory}
                result={result}
                inputs={inputs}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

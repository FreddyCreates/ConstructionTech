import { useCallback, useRef, useState } from "react";

import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import { generateToolPDF } from "../utils/pdfExport";

import type {
  AnomalyState,
  BenchmarkRecord,
  HazardRecord,
  NexusInsight,
  NexusRecommendation,
  RegionalFactors,
  ToolSuiteResult,
} from "../types";

export interface UseBHXToolResult {
  invoke: (toolId: string, params: Record<string, unknown>) => Promise<void>;
  invokeWithNexus: (
    toolId: string,
    params: Record<string, unknown>,
  ) => Promise<void>;
  result: Record<string, unknown> | null;
  nexusData: Record<string, string> | null;
  nexusInsights: NexusInsight[];
  anomaly: AnomalyState | null;
  confidence: number;
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;
  reset: () => void;
}

export function useBHXTool(): UseBHXToolResult {
  const { actor } = useActor(createActor);
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [nexusInsights, setNexusInsights] = useState<NexusInsight[]>([]);
  const [anomaly, setAnomaly] = useState<AnomalyState | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: actor is a stable canister ref
  const invoke = useCallback(
    async (toolId: string, params: Record<string, unknown>) => {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setNexusInsights([]);
      setAnomaly(null);

      try {
        if (!actor) throw new Error("Actor not available");
        const stringParams = Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, String(v)]),
        );
        const paramPairs: [string, string][] = Object.entries(stringParams);
        const invocationResult = await actor.invokeToolThroughBHX(toolId, {
          trade: String(params.trade || ""),
          region: String(params.region || ""),
          csidivision: String(params.csiDivision || "01"),
          inputs: paramPairs,
        });

        const workerId = invocationResult.workerId;

        // Poll for worker completion
        await new Promise<void>((resolve, reject) => {
          let attempts = 0;
          pollingRef.current = setInterval(async () => {
            attempts++;
            if (attempts > 40) {
              clearInterval(pollingRef.current!);
              reject(new Error("Worker task timed out"));
              return;
            }
            try {
              if (!actor) {
                reject(new Error("Actor not available"));
                return;
              }
              const status = await actor.getBHXWorkerStatus(workerId);
              if (status.isComplete) {
                clearInterval(pollingRef.current!);
                const resultMap: Record<string, string> = {};
                if (status.result && status.result.length > 0) {
                  for (const [k, v] of status.result[0]) {
                    resultMap[k] = v;
                  }
                }
                setResult(resultMap);
                resolve();
              }
            } catch {
              clearInterval(pollingRef.current!);
              reject(new Error("Failed to get worker status"));
            }
          }, 1500);
        });

        // Get Nexus insights
        try {
          // generateToolNexusInsights removed — backend function no longer exists
          // Nexus insights are no-op until a replacement is available
          setNexusInsights([]);
          setConfidence(0);
        } catch {
          // Nexus failure is non-fatal
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Tool invocation failed");
      } finally {
        setIsLoading(false);
      }
    },
    [result],
  );

  const reset = useCallback(() => {
    setResult(null);
    setNexusInsights([]);
    setAnomaly(null);
    setConfidence(0);
    setError(null);
  }, []);

  return {
    invoke,
    invokeWithNexus: invoke,
    result,
    nexusData: result,
    nexusInsights,
    anomaly,
    confidence,
    isLoading,
    isAnalyzing: isLoading,
    error,
    reset,
  };
}

export const useToolInvocation = useBHXTool;

// ──────────────────────────────────────────────────────────────────────────────
// useWorkspaceLibraryData — fetches benchmarks + regional factors for a toolId
// ──────────────────────────────────────────────────────────────────────────────

export interface WorkspaceLibraryData {
  benchmarks: BenchmarkRecord[];
  regionalFactor: number;
  csiDivisionLabel: string;
  laborRates: Record<string, number>;
}

export function useWorkspaceLibraryData(
  toolId: string,
  region = "National",
): { data: WorkspaceLibraryData | null; isLoading: boolean } {
  const { actor, isFetching } = useActor(createActor);
  const { data, isLoading } = useQuery({
    queryKey: ["wl-data", toolId, region],
    queryFn: async (): Promise<WorkspaceLibraryData> => {
      if (!actor)
        return {
          benchmarks: [],
          regionalFactor: 1.0,
          csiDivisionLabel: "",
          laborRates: {},
        };
      const raw = await actor.getWorkspaceLibraryBenchmarks(toolId, region);
      const benchmarks: BenchmarkRecord[] = raw.map(
        (b: {
          metricLabel: string;
          libraryMedian: bigint;
          gcHistoricalAvg: bigint;
          industryRangeLow: bigint;
          industryRangeHigh: bigint;
        }) => ({
          metricLabel: b.metricLabel,
          libraryMedian: Number(b.libraryMedian),
          gcHistoricalAvg: Number(b.gcHistoricalAvg),
          industryRangeLow: Number(b.industryRangeLow),
          industryRangeHigh: Number(b.industryRangeHigh),
        }),
      );
      return {
        benchmarks,
        regionalFactor: 1.0,
        csiDivisionLabel: toolId.toUpperCase(),
        laborRates: {},
      };
    },
    enabled: !!actor && !isFetching && !!toolId,
    staleTime: 5 * 60 * 1000,
  });
  return { data: data ?? null, isLoading };
}

// ──────────────────────────────────────────────────────────────────────────────
// usePDFExport — wraps generateToolPDF with a loading state
// ──────────────────────────────────────────────────────────────────────────────

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = useCallback(
    async (suiteResult: ToolSuiteResult, toolName: string, region?: string) => {
      setIsExporting(true);
      try {
        generateToolPDF(
          toolName,
          suiteResult.toolId,
          suiteResult.result as Record<string, unknown>,
          suiteResult.result,
          suiteResult.nexusInsights,
          suiteResult.benchmarkData,
          region ?? "National",
        );
      } finally {
        setIsExporting(false);
      }
    },
    [],
  );

  return { exportPDF, isExporting };
}

// ──────────────────────────────────────────────────────────────────────────────
// useNexusRecommendations — fetches Nexus recommendations for project context
// ──────────────────────────────────────────────────────────────────────────────

export function useNexusRecommendations(
  projectType: string,
  phase: string,
): { recommendations: NexusRecommendation[]; isLoading: boolean } {
  const { actor, isFetching } = useActor(createActor);
  const { data, isLoading } = useQuery({
    queryKey: ["nexus-recs", projectType, phase],
    queryFn: async (): Promise<NexusRecommendation[]> => {
      if (!actor) return [];
      try {
        // generateNexusInsights removed — return empty recommendations
        return [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!projectType && !!phase,
    staleTime: 10 * 60 * 1000,
  });
  return { recommendations: data ?? [], isLoading };
}

// ──────────────────────────────────────────────────────────────────────────────
// useRegionalCostIndex — fetches regional cost multipliers from the WL
// ──────────────────────────────────────────────────────────────────────────────

export function useRegionalCostIndex(region: string): {
  factors: RegionalFactors | null;
  isLoading: boolean;
} {
  const { actor, isFetching } = useActor(createActor);
  const { data, isLoading } = useQuery({
    queryKey: ["regional-cost", region],
    queryFn: async (): Promise<RegionalFactors> => {
      if (!actor) return { region, multipliers: {} };
      try {
        const raw = await actor.getWorkspaceLibraryBenchmarks(
          "cost-index",
          region,
        );
        const multipliers: Record<string, number> = {};
        for (const b of raw) {
          multipliers[b.metricLabel] = Number(b.libraryMedian);
        }
        return { region, multipliers };
      } catch {
        return { region, multipliers: { default: 1.0 } };
      }
    },
    enabled: !!actor && !isFetching && !!region,
    staleTime: 30 * 60 * 1000,
  });
  return { factors: data ?? null, isLoading };
}

// ──────────────────────────────────────────────────────────────────────────────
// useHazardLibrary — fetches OSHA hazard records for a trade type
// ──────────────────────────────────────────────────────────────────────────────

export function useHazardLibrary(tradeType: string): {
  hazards: HazardRecord[];
  isLoading: boolean;
} {
  const { actor, isFetching } = useActor(createActor);
  const { data, isLoading } = useQuery({
    queryKey: ["hazard-lib", tradeType],
    queryFn: async (): Promise<HazardRecord[]> => {
      if (!actor) return [];
      try {
        const result = await actor.deepenJSAWithHazardLib(
          tradeType,
          "general",
          BigInt(1),
        );
        return result.hazards.map(
          (h: {
            osha1926Reference: string;
            hazardName: string;
            controls: string[];
            ppe: string[];
            severity: string;
          }) => ({
            subpart: h.osha1926Reference,
            title: h.hazardName,
            hazards: [h.hazardName],
            controls: h.controls,
            ppe: h.ppe,
            severity: (h.severity as HazardRecord["severity"]) ?? "medium",
          }),
        );
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!tradeType,
    staleTime: 15 * 60 * 1000,
  });
  return { hazards: data ?? [], isLoading };
}

import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
import type {
  PerceptionInput as BackendPerceptionInput,
  SynthesisResult as BackendSynthesisResult,
} from "../backend";
import { createActor } from "../backend";

// ─── Frontend Types ───────────────────────────────────────────────────────────

export type PerceptionFinding = {
  findingId: string;
  category: string;
  severity: number;
  description: string;
  sourceData: string;
  confidence: number;
};

export type AnomalyFlag = {
  flagId: string;
  perceptionType: string;
  severity: number;
  description: string;
  recommendedAction: string;
};

export interface PerceptionEntry {
  engineId: string;
  perceptionType: string;
  findings: PerceptionFinding[];
  riskScore: number;
  confidenceScore: number;
  anomalyFlags: AnomalyFlag[];
  recommendations: string[];
}

export interface SynthesisResult {
  overallRiskScore: number;
  dominantPerception: string;
  crossPerceptionInsights: string[];
  prioritizedActions: string[];
  confidenceScore: number;
  perceptionMap: PerceptionEntry[];
}

export interface PerceptionHistoryEntry {
  timestamp: number;
  toolId: string;
  overallRiskScore: number;
  dominantPerception: string;
}

export interface PerceptionEngineStatus {
  engineCount: number;
  totalHistoryEntries: number;
  lastAnalysisTimestamp: number | null;
}

// ─── Helper: serialize arbitrary values to string tuples ─────────────────────

export function buildInputData(
  obj: Record<string, unknown>,
): Array<[string, string]> {
  return Object.entries(obj).map(([key, value]) => {
    if (value === null || value === undefined) {
      return [key, ""] as [string, string];
    }
    if (typeof value === "object") {
      return [key, JSON.stringify(value)] as [string, string];
    }
    return [key, String(value)] as [string, string];
  });
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapBackendSynthesis(raw: BackendSynthesisResult): SynthesisResult {
  const perceptionMap: PerceptionEntry[] = raw.perceptionMap.map(
    ([, output]) => {
      const engineId = output.engineId;
      const findings: PerceptionFinding[] = output.findings.map((f, index) => ({
        findingId: `${engineId}-f${index}`,
        category: engineId,
        severity: 0.5,
        description: (f as { description?: string }).description ?? String(f),
        sourceData: "",
        confidence: Number(output.confidenceScore) || 0,
      }));
      const anomalyFlags: AnomalyFlag[] = output.anomalyFlags.map(
        (a, index) => ({
          flagId: `${engineId}-a${index}`,
          perceptionType: engineId,
          severity: 0.8,
          description: (a as { description?: string }).description ?? String(a),
          recommendedAction: "",
        }),
      );
      return {
        engineId,
        perceptionType: output.perceptionType,
        findings,
        riskScore: Number(output.riskScore),
        confidenceScore: Number(output.confidenceScore),
        anomalyFlags,
        recommendations: output.recommendations,
      };
    },
  );

  return {
    overallRiskScore: Number(raw.overallRiskScore),
    dominantPerception: raw.dominantPerception,
    crossPerceptionInsights: raw.crossPerceptionInsights,
    prioritizedActions: raw.prioritizedActions,
    confidenceScore: Number(raw.confidenceScore),
    perceptionMap,
  };
}

// ─── useRunPerceptionAnalysis ─────────────────────────────────────────────────

export function useRunPerceptionAnalysis(
  toolId: string,
  inputData: Record<string, unknown>,
) {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (): Promise<SynthesisResult | null> => {
    if (!actor || isFetching) return null;

    const principal = identity?.getPrincipal();
    if (!principal) return null;

    setIsLoading(true);
    setError(null);

    try {
      const perceptionInput: BackendPerceptionInput = {
        toolId,
        inputData: buildInputData(inputData),
        timestamp: BigInt(Date.now()) * 1_000_000n,
        callerPrincipal: principal,
        projectId: undefined,
      };

      const raw = await actor.runPerceptionAnalysis(perceptionInput);
      return mapBackendSynthesis(raw);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [actor, isFetching, identity, toolId, inputData]);

  return { runAnalysis, isLoading, error };
}

// ─── useGetPerceptionHistory ──────────────────────────────────────────────────

export function useGetPerceptionHistory() {
  const { actor, isFetching } = useActor(createActor);
  const [history, setHistory] = useState<PerceptionHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!actor || isFetching) return;

    setIsLoading(true);
    setError(null);

    try {
      const raw = await actor.getPerceptionHistoryForCaller();
      const mapped: PerceptionHistoryEntry[] = raw.map((entry) => ({
        timestamp: Number(entry.timestamp),
        toolId: entry.toolId,
        overallRiskScore: Number(entry.synthesisResult.overallRiskScore),
        dominantPerception: entry.synthesisResult.dominantPerception,
      }));
      setHistory(mapped);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [actor, isFetching]);

  return { history, fetchHistory, isLoading, error };
}

// ─── useGetPerceptionEngineStatus ─────────────────────────────────────────────

export function useGetPerceptionEngineStatus() {
  const { actor, isFetching } = useActor(createActor);
  const [status, setStatus] = useState<PerceptionEngineStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!actor || isFetching) return;

    setIsLoading(true);
    setError(null);

    try {
      const raw = await actor.getPerceptionEngineStatus();
      setStatus({
        engineCount: raw.engines.length,
        totalHistoryEntries: Number(raw.totalAnalyses),
        lastAnalysisTimestamp:
          Number(raw.lastAnalysisTime) > 0
            ? Number(raw.lastAnalysisTime) / 1_000_000
            : null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [actor, isFetching]);

  return { status, fetchStatus, isLoading, error };
}

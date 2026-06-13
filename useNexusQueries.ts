import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { ProjectReport, SavedToolResult } from "../backend";

export function useSaveToolResult() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      toolName: string;
      toolCategory: string;
      projectName: string;
      inputsJson: string;
      outputsJson: string;
      nexusInsightsJson: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveToolResult(
        params.toolName,
        params.toolCategory,
        params.projectName,
        params.inputsJson,
        params.outputsJson,
        params.nexusInsightsJson,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myToolResults"] });
    },
  });
}

export function useGetMyToolResults() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SavedToolResult[]>({
    queryKey: ["myToolResults"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyToolResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteToolResult() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteToolResult(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myToolResults"] });
    },
  });
}

// generateNexusInsights removed — backend function no longer exists
export function useGenerateNexusInsights() {
  return useMutation({
    mutationFn: async (_params: {
      toolName: string;
      outputsJson: string;
    }): Promise<NexusInsight[]> => {
      return [];
    },
  });
}

export function useCreateProjectReport() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      projectName: string;
      location: string;
      gcName: string;
      resultIds: bigint[];
      researchEntryIds?: bigint[];
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createProjectReport(
        params.title,
        params.projectName,
        params.location,
        params.gcName,
        params.resultIds,
        params.researchEntryIds ?? [],
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjectReports"] });
    },
  });
}

export function useGetMyProjectReports() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ProjectReport[]>({
    queryKey: ["myProjectReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyProjectReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProjectReportById(reportId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ProjectReport | null>({
    queryKey: ["projectReport", reportId?.toString()],
    queryFn: async () => {
      if (!actor || reportId === null) return null;
      return actor.getProjectReportById(reportId);
    },
    enabled: !!actor && !isFetching && reportId !== null,
  });
}

export function useGetSharedReport(shareToken: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery({
    queryKey: ["sharedReport", shareToken],
    queryFn: async () => {
      if (!actor || !shareToken) return null;
      return actor.getSharedReport(shareToken);
    },
    enabled: !!actor && !isFetching && !!shareToken,
  });
}

export function useRevokeProjectReport() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.revokeProjectReport(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjectReports"] });
    },
  });
}

export function useDeleteProjectReport() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteProjectReport(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjectReports"] });
    },
  });
}

export interface NexusInsight {
  category: "cost" | "schedule" | "safety" | "pattern" | "alert" | "benchmark";
  title: string;
  detail: string;
  confidence: "high" | "medium" | "low";
  priorityScore?: number;
  isAnomaly?: boolean;
}

export interface NexusStats {
  totalCalls: bigint;
  anomalyCount: bigint;
  anomalyRate: number;
  healthStatus: string;
  lastHeartbeat: bigint;
  benchmarkHits: bigint;
}

export function useGetNexusStats() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<NexusStats | null>({
    queryKey: ["nexusStats"],
    queryFn: async () => {
      if (!actor) return null;
      // TODO: uncomment when getNexusStats is confirmed in backend bindings
      // const result = await actor.getNexusStats();
      // return result[0] ?? null;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── New Nexus Intelligence Hooks ────────────────────────────────────────────

export interface AuditEntry {
  timestamp: bigint;
  caller: string;
  action: string;
  doctrineVersion: string;
  resultHash: string;
  passed: boolean;
}

export interface NexusHealthState {
  brainCallCount: bigint;
  heartInsightCount: bigint;
  anomalyRate: number;
  avgConfidence: number;
  benchmarkDataPoints: bigint;
}

export function useGCComplianceScore(principal: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<number>({
    queryKey: ["gcComplianceScore", principal],
    queryFn: async (): Promise<number> => {
      if (!actor || !principal) return 0;
      // Stub: returns mock score until backend exports confirmed
      return 0.87;
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useGovernanceAuditLog(limit: number) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<AuditEntry[]>({
    queryKey: ["governanceAuditLog", limit],
    queryFn: async (): Promise<AuditEntry[]> => {
      if (!actor) return [];
      // Stub: returns mock entries until backend exports confirmed
      return [
        {
          timestamp: BigInt(Date.now()) * BigInt(1_000_000),
          caller: "anonymous",
          action: "nexusOutputGuard.pass",
          doctrineVersion: "CPL-v2.1",
          resultHash: "a3f9e1d2",
          passed: true,
        },
        {
          timestamp: BigInt(Date.now() - 60000) * BigInt(1_000_000),
          caller: "anonymous",
          action: "scope.calculate",
          doctrineVersion: "CPL-v2.1",
          resultHash: "b8c4a721",
          passed: true,
        },
        {
          timestamp: BigInt(Date.now() - 120000) * BigInt(1_000_000),
          caller: "anonymous",
          action: "nexus.insight.generate",
          doctrineVersion: "CPL-v2.1",
          resultHash: "d2f1c893",
          passed: true,
        },
      ];
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCrossToolPatternAlerts(principal: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string[]>({
    queryKey: ["crossToolPatternAlerts", principal],
    queryFn: async (): Promise<string[]> => {
      if (!actor || !principal) return [];
      // Stub: returns mock alerts until backend exports confirmed
      return [];
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useNexusHealthState() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<NexusHealthState>({
    queryKey: ["nexusHealthState"],
    queryFn: async (): Promise<NexusHealthState> => {
      if (!actor) {
        return {
          brainCallCount: BigInt(0),
          heartInsightCount: BigInt(0),
          anomalyRate: 0,
          avgConfidence: 0,
          benchmarkDataPoints: BigInt(0),
        };
      }
      // Stub: returns mock health state until backend exports confirmed
      return {
        brainCallCount: BigInt(1_482),
        heartInsightCount: BigInt(3_947),
        anomalyRate: 0.04,
        avgConfidence: 0.83,
        benchmarkDataPoints: BigInt(12_091),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

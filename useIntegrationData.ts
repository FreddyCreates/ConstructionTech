import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  BLSWageRecord,
  OSHAInspection,
  OSHAViolation,
  ToolResultRecord,
} from "../backend";

// ──────────────────────────────────────────────────────────────────────────────
// useBLSWage — fetches live BLS wage data for a trade + state from the backend
// ──────────────────────────────────────────────────────────────────────────────

export interface BLSWageData {
  trade: string;
  state: string;
  medianWage: number;
  meanWage: number;
  percentile10: number;
  percentile90: number;
  year: number;
  source: string;
}

export function useBLSWage(
  trade: string,
  state: string,
): { data: BLSWageData | null; isLoading: boolean } {
  const { actor, isFetching } = useActor(createActor);
  const { data, isLoading } = useQuery({
    queryKey: ["bls-wage", trade, state],
    queryFn: async (): Promise<BLSWageData | null> => {
      if (!actor) return null;
      try {
        const raw: BLSWageRecord | null = await actor.getBLSWageByTrade(
          trade,
          state,
          BigInt(new Date().getFullYear()),
        );
        if (!raw) return null;
        return {
          trade: raw.trade,
          state: raw.state,
          medianWage: raw.medianWage,
          meanWage: raw.meanWage,
          percentile10: raw.percentile10,
          percentile90: raw.percentile90,
          year: Number(raw.year),
          source: raw.source,
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!trade && !!state,
    staleTime: 30 * 60 * 1000,
  });
  return { data: data ?? null, isLoading };
}

// ──────────────────────────────────────────────────────────────────────────────
// useOSHAData — fetches OSHA inspections + violations for a NAICS/trade combo
// ──────────────────────────────────────────────────────────────────────────────

export interface OSHADataResult {
  inspections: OSHAInspection[];
  violations: OSHAViolation[];
  totalViolations: number;
  avgPenalty: number;
  severityBreakdown: Record<string, number>;
}

export function useOSHAData(
  naics: string | null,
  trade: string | null,
): { data: OSHADataResult | null; isLoading: boolean } {
  const { actor, isFetching } = useActor(createActor);
  const naicsCode = naics ?? "2380";
  const { data, isLoading } = useQuery({
    queryKey: ["osha-data", naicsCode, trade],
    queryFn: async (): Promise<OSHADataResult | null> => {
      if (!actor) return null;
      try {
        const [inspections, violations] = await Promise.all([
          actor.getOSHAInspections(naicsCode, "National", BigInt(10)),
          actor.getOSHAViolations(naicsCode, BigInt(20)),
        ]);
        const totalViolations = violations.length;
        const avgPenalty =
          totalViolations > 0
            ? violations.reduce((s, v) => s + v.penaltyAmount, 0) /
              totalViolations
            : 0;
        const severityBreakdown: Record<string, number> = {};
        for (const v of violations) {
          severityBreakdown[v.gravity] =
            (severityBreakdown[v.gravity] ?? 0) + 1;
        }
        return {
          inspections,
          violations,
          totalViolations,
          avgPenalty,
          severityBreakdown,
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 60 * 1000,
  });
  return { data: data ?? null, isLoading };
}

// ──────────────────────────────────────────────────────────────────────────────
// useSendToAgent — mutation that sends a tool result to an agent for follow-up
// ──────────────────────────────────────────────────────────────────────────────

export interface SendToAgentResult {
  success: boolean;
  response: string;
  messageId: string;
}

export function useSendToAgent() {
  const { actor } = useActor(createActor);

  const mutation = useMutation({
    mutationFn: async ({
      agentId,
      message,
    }: {
      agentId: string;
      message: string;
    }): Promise<SendToAgentResult> => {
      if (!actor) throw new Error("Actor not available");
      const conversationId = `tool-${Date.now()}`;
      const res = await actor.sendAgentMessage(
        agentId,
        message,
        conversationId,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return {
        success: true,
        response: res.ok.message,
        messageId: String(res.ok.timestamp),
      };
    },
  });

  return {
    sendToAgent: (agentId: string, message: string) =>
      mutation.mutateAsync({ agentId, message }),
    isSending: mutation.isPending,
    sendError: mutation.error?.message ?? null,
    lastResponse: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// usePrincipalHistory — fetches tool result history for the authenticated user
// ──────────────────────────────────────────────────────────────────────────────

export interface PrincipalHistoryEntry {
  toolName: string;
  result: string;
  projectId: string;
  timestamp: number;
}

export function usePrincipalHistory(limit = 20): {
  history: PrincipalHistoryEntry[];
  isLoading: boolean;
} {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  const { data, isLoading } = useQuery({
    queryKey: ["principal-history", identity?.getPrincipal().toText() ?? ""],
    queryFn: async (): Promise<PrincipalHistoryEntry[]> => {
      if (!actor || !identity) return [];
      try {
        const principal = identity.getPrincipal();
        const raw: ToolResultRecord[] = await actor.getPrincipalToolResults(
          principal,
          BigInt(limit),
        );
        return raw.map((r) => ({
          toolName: r.toolName,
          result: r.result,
          projectId: r.projectId,
          timestamp: Number(r.timestamp),
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 2 * 60 * 1000,
  });

  return { history: data ?? [], isLoading };
}

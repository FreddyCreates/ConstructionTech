import { createActor } from "@/backend";
import type { Handoff, RecipientGroup, ScopeItem } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListHandoffs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Handoff[]>({
    queryKey: ["handoffs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listHandoffs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListHandoffsByProject(projectId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Handoff[]>({
    queryKey: ["handoffs", "project", projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listHandoffsByProject(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useGetHandoffDeliveryStatus(handoffId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{ recipientGroups: RecipientGroup[]; overallStatus: string }>(
    {
      queryKey: ["handoffs", "delivery", handoffId?.toString()],
      queryFn: async () => {
        if (!actor || handoffId === null)
          return { recipientGroups: [], overallStatus: "unknown" };
        return actor.getHandoffDeliveryStatus(handoffId);
      },
      enabled: !!actor && !isFetching && handoffId !== null,
      refetchInterval: 10_000,
    },
  );
}

export function useAutoDetectTradeGroups() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (scopeItems: ScopeItem[]) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.autoDetectTradeGroupsForScope(scopeItems);
    },
  });
}

export function useGenerateHandoffPackage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      projectName: string;
      scopeItems: ScopeItem[];
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.generateHandoffPackage(
        data.projectId,
        data.projectName,
        data.scopeItems,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] });
    },
  });
}

export function useSetHandoffRecipients() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      handoffId: bigint;
      recipientGroups: RecipientGroup[];
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.setHandoffRecipients(
        data.handoffId,
        data.recipientGroups,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] });
    },
  });
}

export function useSendHandoff() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (handoffId: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.sendHandoff(handoffId);
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] });
    },
  });
}

export function useResendHandoffPackage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { handoffId: bigint; groupIndex: number }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.resendHandoffPackage(
        data.handoffId,
        BigInt(data.groupIndex),
      );
      if ("err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] });
    },
  });
}

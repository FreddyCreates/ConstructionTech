import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

export function useGenerateFreeJSA() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      task: string;
      trade: string;
      additionalHazards: string[];
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.generateFreeJSA(
        params.task,
        params.trade,
        params.additionalHazards,
      );
    },
  });
}

export function useGetFreeHazardLibrary() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (keyword: string) => {
      if (!actor) throw new Error("Backend not available");
      return actor.getFreeHazardLibrary(keyword);
    },
  });
}

export function useCalculateFreeSafetyRisk() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      tasks: string[];
      trade: string;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.calculateFreeSafetyRisk(params.tasks, params.trade);
    },
  });
}

export function useCalculateFreeCostEstimate() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      scopeItems: string[];
      trade: string;
      laborHours: number;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.calculateFreeCostEstimate(
        params.scopeItems,
        params.trade,
        params.laborHours,
      );
    },
  });
}

export function useCalculateTRIR() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: { recordables: bigint; totalHours: bigint }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.calculateTRIR(params.recordables, params.totalHours);
    },
  });
}

export function useCalculateDART() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: { dartCases: bigint; totalHours: bigint }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.calculateDART(params.dartCases, params.totalHours);
    },
  });
}

export function useGenerateStopWorkAuthority() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      hazardDescription: string;
      location: string;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.generateStopWorkAuthority(
        params.hazardDescription,
        params.location,
      );
    },
  });
}

export function useCalculateScewScore() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      weeklyObservations: bigint;
      correctiveActions: bigint;
      nearMisses: bigint;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.calculateScewScore(
        params.weeklyObservations,
        params.correctiveActions,
        params.nearMisses,
      );
    },
  });
}

export function useCalculateSuluScore() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (params: {
      siteVisits: bigint;
      toolboxTalks: bigint;
      hazardConversations: bigint;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.calculateSuluScore(
        params.siteVisits,
        params.toolboxTalks,
        params.hazardConversations,
      );
    },
  });
}

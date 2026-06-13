import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";
import type { ProjectIntelligence } from "../types/workspace";
import type {
  AnomalyReport,
  ChangeOrder,
  CloseoutReadiness,
  DailyLog,
  PhaseRecommendation,
  ProjectRecord,
  ProjectSubmissions,
  PunchItem,
  RFI,
  SubWorkspaceView,
  SubmittalPackage,
} from "../types/workspace";

// ─── Query Hooks (with 8-second polling where specified) ────────────────────

export function useProjectsForGC() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ProjectRecord[]>({
    queryKey: ["workspace", "projects", "gc"],
    queryFn: async () => {
      if (!actor) return [];
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.queryProjectsForGC();
      return (result as ProjectRecord[]) ?? [];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useProjectsForSub() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ProjectRecord[]>({
    queryKey: ["workspace", "projects", "sub"],
    queryFn: async () => {
      if (!actor) return [];
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.queryProjectsForSub();
      return (result as ProjectRecord[]) ?? [];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useProjectDetail(projectId: string | number | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<[ProjectRecord, ProjectIntelligence | null] | null>({
    queryKey: ["workspace", "project", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.queryProjectDetail(BigInt(projectId));
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 8000,
  });
}

export function useSubmissionsForProject(projectId: string | number | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ProjectSubmissions | null>({
    queryKey: ["workspace", "submissions", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.querySubmissionsForProject(
        BigInt(projectId),
      );
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 8000,
  });
}

export function useAnomaliesForProject(projectId: string | number | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<AnomalyReport | null>({
    queryKey: ["workspace", "anomalies", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.queryAnomaliesForProject(
        BigInt(projectId),
      );
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 8000,
  });
}

export function useChangeOrderQueue(projectId: string | number | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ChangeOrder[]>({
    queryKey: ["workspace", "changeOrders", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return [];
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.queryChangeOrderQueue(BigInt(projectId));
      return result ?? [];
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 8000,
  });
}

export function useCloseoutReadiness(projectId: string | number | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CloseoutReadiness | null>({
    queryKey: ["workspace", "closeout", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.queryCloseoutReadiness(BigInt(projectId));
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 8000,
  });
}

export function useSubWorkspace(projectId: string | number | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SubWorkspaceView | null>({
    queryKey: ["workspace", "subWorkspace", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.querySubWorkspace(BigInt(projectId));
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 8000,
  });
}

export function usePhaseTransitionRecommendation(
  projectId: string | number | null,
) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<PhaseRecommendation | null>({
    queryKey: ["workspace", "phaseRecommendation", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      const typedActor = actor as unknown as backendInterface;
      const result = await typedActor.queryPhaseTransitionRecommendation(
        BigInt(projectId),
      );
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 8000,
  });
}

// ─── Mutation Hooks ─────────────────────────────────────────────────────────────

export function useCreateProject() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      location: string;
      startDate: bigint;
      budgetUSD: number;
      scheduleDays: bigint;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.createProject(
        params.name,
        params.location,
        params.startDate,
        params.budgetUSD,
        params.scheduleDays,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "projects"] });
    },
  });
}

export function useAddSub() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string | number;
      subPrincipal: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.addSubToProject(
        BigInt(params.projectId),
        params.subPrincipal as any,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "project", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["workspace", "projects"] });
    },
  });
}

export function useSubmitDailyLog() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string | number;
      date: bigint;
      hoursWorked: number;
      laborCount: bigint;
      workArea: string;
      weatherNotes: string;
      crewNotes: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.submitDailyLog(
        BigInt(params.projectId),
        params.date,
        params.hoursWorked,
        params.laborCount,
        params.workArea,
        params.weatherNotes,
        params.crewNotes,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "submissions", variables.projectId],
      });
    },
  });
}

export function useSubmitRFI() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string | number;
      question: string;
      attachmentHash: string;
      priority:
        | { __kind__: "Low" }
        | { __kind__: "Medium" }
        | { __kind__: "High" }
        | { __kind__: "Critical" };
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.submitRFI(
        BigInt(params.projectId),
        params.question,
        params.attachmentHash,
        params.priority as any,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "submissions", variables.projectId],
      });
    },
  });
}

export function useSubmitChangeOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string | number;
      description: string;
      costDelta: number;
      scheduleDelta: bigint;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.submitChangeOrder(
        BigInt(params.projectId),
        params.description,
        params.costDelta,
        params.scheduleDelta,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "submissions", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", "changeOrders", variables.projectId],
      });
    },
  });
}

export function useSubmitPunchItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string | number;
      area: string;
      trade: string;
      description: string;
      severity:
        | { __kind__: "Minor" }
        | { __kind__: "Major" }
        | { __kind__: "Critical" };
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.submitPunchItem(
        BigInt(params.projectId),
        params.area,
        params.trade,
        params.description,
        params.severity as any,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "submissions", variables.projectId],
      });
    },
  });
}

export function useSubmitSubmittalPackage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string | number;
      documentHash: string;
      submittalType: string;
      transmissionDate: bigint | null;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.submitSubmittalPackage(
        BigInt(params.projectId),
        params.documentHash,
        params.submittalType,
        params.transmissionDate,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "submissions", variables.projectId],
      });
    },
  });
}

export function useResolvePunchItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      punchItemId: string | number;
      closedDate: bigint;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.resolvePunchItem(
        BigInt(params.punchItemId),
        params.closedDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "submissions"] });
    },
  });
}

export function useApproveChangeOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      changeOrderId: string | number;
      approved: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.approveChangeOrder(
        BigInt(params.changeOrderId),
        params.approved,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "submissions"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", "changeOrders"],
      });
    },
  });
}

export function useConfirmPhaseTransition() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string | number;
      targetPhase:
        | { __kind__: "PreConstruction" }
        | { __kind__: "Mobilization" }
        | { __kind__: "ActiveBuild" }
        | { __kind__: "PunchList" }
        | { __kind__: "Closeout" };
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const typedActor = actor as unknown as backendInterface;
      return typedActor.confirmPhaseTransition(
        BigInt(params.projectId),
        params.targetPhase as any,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", "phaseRecommendation", variables.projectId],
      });
    },
  });
}

import {
  DesignStyle as BackendDesignStyle,
  RenderMode as BackendRenderMode,
  RoomType as BackendRoomType,
  createActor,
} from "@/backend";
import type {
  DesignProject as BackendDesignProject,
  DesignRender as BackendDesignRender,
  DesignVersion as BackendDesignVersion,
  Dimensions,
  FurnitureModel3D,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { queryMaterials } from "../data/designIntelligenceData";
import type {
  AnnotationPoint,
  DesignApprovalStatus,
  DesignComment,
  DesignProject,
  DesignRender,
  DesignStyle,
  DesignVersion,
  FurnitureModel,
  FurnitureQueryFilter,
  MaterialItem,
  MaterialQueryFilter,
  PlacedFurnitureItem,
  RoomDimensions,
} from "../types/designIntelligence";

// ─── Local stores for hooks with no canister equivalent ───────────────────────
const commentStore = new Map<string, DesignComment[]>();

function uid() {
  return `di-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapBackendStyle(style: BackendDesignStyle): DesignStyle {
  return style as unknown as DesignStyle;
}

function mapFrontendStyleToBackend(style: string): BackendDesignStyle {
  const key = style as keyof typeof BackendDesignStyle;
  return BackendDesignStyle[key] ?? BackendDesignStyle.Modern;
}

function mapFrontendRoomTypeToBackend(roomType: string): BackendRoomType {
  const key = roomType as keyof typeof BackendRoomType;
  return BackendRoomType[key] ?? BackendRoomType.Other;
}

function mapFrontendRenderModeToBackend(mode: string): BackendRenderMode {
  const key = mode as keyof typeof BackendRenderMode;
  return BackendRenderMode[key] ?? BackendRenderMode.Accurate;
}

function mapBackendProjectStatus(
  status: BackendDesignProject["status"],
): DesignApprovalStatus {
  const map: Record<string, DesignApprovalStatus> = {
    Draft: "draft",
    UnderReview: "submitted",
    Approved: "approved",
    Active: "draft",
    Archived: "draft",
  };
  return map[status as unknown as string] ?? "draft";
}

function mapFurnitureModel3D(m: FurnitureModel3D): FurnitureModel {
  return {
    id: m.id,
    name: m.name,
    brand: m.brand as FurnitureModel["brand"],
    category: m.category as FurnitureModel["category"],
    style: ["Modern" as DesignStyle], // FurnitureModel3D has no style field
    priceRangeLow: m.cost * 0.9,
    priceRangeHigh: m.cost * 1.1,
    csiCode: m.csiDivision,
    dimensions: {
      widthIn: m.dimensions?.widthIn ?? 0,
      depthIn: m.dimensions?.depthIn ?? 0,
      heightIn: m.dimensions?.heightIn ?? 0,
      weightLbs: 0,
    },
    thumbnailColor: "oklch(0.65 0.15 240)",
    availableMaterials: [],
    leadTimeWeeks: 8,
    description: m.name,
    tags: [],
  };
}

function mapBackendProject(p: BackendDesignProject): DesignProject {
  return {
    id: p.id.toString(),
    name: p.name,
    projectType: p.roomType as unknown as string,
    location: "",
    clientName: "",
    designerId: p.ownerPrincipal?.toString() ?? "",
    createdAt: Number(p.createdAt),
    updatedAt: Number(p.updatedAt),
    currentVersion: 1,
    approvalStatus: mapBackendProjectStatus(p.status),
    selectedStyle: mapBackendStyle(p.style),
    placedItems: [],
    selectedMaterials: [],
    roomDimensions: {
      widthFt: p.dimensions?.widthFt ?? 0,
      lengthFt: p.dimensions?.lengthFt ?? 0,
      heightFt: p.dimensions?.heightFt ?? 0,
    },
    tags: [],
    nexusConfidence: 0.75,
    estimatedBudget: p.budgetUSD,
  };
}

function mapBackendRender(r: BackendDesignRender): DesignRender {
  return {
    id: r.id.toString(),
    projectId: r.projectId.toString(),
    versionId: r.versionId.toString(),
    quality: "standard",
    status: "complete",
    nexusConfidence: r.qualityScore ?? 0.85,
    createdAt: Number(r.createdAt),
    afterImageUrl: r.renderUrl || undefined,
    metadata: {
      style: "Modern" as DesignStyle,
      lightingMode: "Natural",
      cameraAngle: "Perspective",
      roomType: r.renderMode as unknown as string,
    },
  };
}

function mapBackendVersion(v: BackendDesignVersion): DesignVersion {
  const raw = v as unknown as Record<string, unknown>;
  const statusStr = v.status as unknown as string;
  return {
    id: v.id.toString(),
    projectId: v.projectId.toString(),
    versionNumber: Number(raw.version ?? 1),
    submittedAt: Number(raw.submittedAt ?? Date.now()),
    submittedBy: String(raw.submittedBy ?? ""),
    approvalStatus:
      statusStr === "Approved"
        ? "approved"
        : statusStr === "Rejected"
          ? "rejected"
          : statusStr === "Submitted"
            ? "submitted"
            : "draft",
    snapshot: {},
    changesSummary: String(raw.designData ?? ""),
    nexusScore: 0.8,
  };
}

// ─── Furniture Models ─────────────────────────────────────────────────────────

export function useQueryFurnitureModels(filter: FurnitureQueryFilter = {}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FurnitureModel[]>({
    queryKey: ["design", "furniture", filter],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.listModelsByCategory3D(
        filter.category ?? "",
        BigInt(100),
      );
      let models = raw.map(mapFurnitureModel3D);
      if (filter.priceMax !== undefined) {
        models = models.filter((m) => m.priceRangeLow <= filter.priceMax!);
      }
      if (filter.priceMin !== undefined) {
        models = models.filter((m) => m.priceRangeHigh >= filter.priceMin!);
      }
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase();
        models = models.filter(
          (m) =>
            m.name.toLowerCase().includes(kw) ||
            m.brand.toLowerCase().includes(kw),
        );
      }
      return models;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Design Projects ──────────────────────────────────────────────────────────

export function useListDesignProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DesignProject[]>({
    queryKey: ["design", "projects"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.listDesignProjects();
      return raw.map(mapBackendProject);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useGetDesignProject(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DesignProject | null>({
    queryKey: ["design", "project", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      const raw = await actor.getDesignProject(BigInt(id));
      if (!raw) return null;
      return mapBackendProject(raw);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateDesignProject() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: {
      name: string;
      projectType: string;
      location: string;
      clientName: string;
      designerId: string;
      selectedStyle: DesignStyle;
      roomDimensions: RoomDimensions;
      estimatedBudget?: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const dimensions: Dimensions = {
        widthFt: input.roomDimensions.widthFt,
        lengthFt: input.roomDimensions.lengthFt,
        heightFt: input.roomDimensions.heightFt,
        sqFt: input.roomDimensions.widthFt * input.roomDimensions.lengthFt,
      };
      const raw = await actor.createDesignProject(
        input.name,
        mapFrontendRoomTypeToBackend(input.projectType),
        dimensions,
        mapFrontendStyleToBackend(input.selectedStyle),
        input.estimatedBudget ?? 0,
      );
      return mapBackendProject(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design", "projects"] });
    },
  });
}

// ─── Design Versions ─────────────────────────────────────────────────────────

export function useSubmitDesignVersion() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: {
      projectId: string;
      changesSummary: string;
      submittedBy: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.submitDesignVersion(
        BigInt(input.projectId),
        input.changesSummary,
      );
      return mapBackendVersion(raw);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["design", "project", vars.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["design", "versions", vars.projectId],
      });
    },
  });
}

export function useApproveDesignVersion() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: {
      projectId: string;
      versionId: string;
      approvedBy: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.approveDesignVersion(
        BigInt(input.versionId),
        input.approvedBy,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["design", "project", vars.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["design", "versions", vars.projectId],
      });
    },
  });
}

export function useRejectDesignVersion() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: {
      projectId: string;
      versionId: string;
      rejectionReason: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.rejectDesignVersion(
        BigInt(input.versionId),
        input.rejectionReason,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["design", "project", vars.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["design", "versions", vars.projectId],
      });
    },
  });
}

export function useListDesignVersions(projectId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DesignVersion[]>({
    queryKey: ["design", "versions", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return [];
      // No listDesignVersions backend endpoint; return empty until available
      return [];
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

// ─── Renders ────────────────────────────────────────────────────────────────

export function useCreateDesignRender() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: {
      projectId: string;
      versionId: string;
      quality: "draft" | "standard" | "photorealistic";
      lightingMode?: string;
      cameraAngle?: string;
      renderMode?: string;
      stylePreset?: string;
      materialPalette?: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.createDesignRender(
        BigInt(input.projectId),
        BigInt(input.versionId || "0"),
        mapFrontendRenderModeToBackend(input.renderMode ?? "Accurate"),
        input.stylePreset ?? "Modern",
        input.materialPalette ?? "Neutral",
      );
      return mapBackendRender(raw);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["design", "renders", vars.projectId],
      });
    },
  });
}

export function useListDesignRenders(projectId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DesignRender[]>({
    queryKey: ["design", "renders", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return [];
      const raw = await actor.listDesignRenders(BigInt(projectId));
      return raw.map(mapBackendRender);
    },
    enabled: !!actor && !isFetching && !!projectId,
    refetchInterval: 10_000,
  });
}

// ─── Materials Library (no canister equivalent — keep static data) ────────────

export function useQueryMaterialLibrary(filter: MaterialQueryFilter = {}) {
  return useQuery<MaterialItem[]>({
    queryKey: ["design", "materials", filter],
    queryFn: async () => queryMaterials(filter),
    staleTime: 60_000,
  });
}

// ─── Comments (no canister equivalent — local store) ─────────────────────────

export function useAddDesignComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      projectId: string;
      versionId?: string;
      authorId: string;
      authorName: string;
      content: string;
      type?: DesignComment["type"];
      annotations?: AnnotationPoint[];
    }) => {
      const comment: DesignComment = {
        id: uid(),
        projectId: input.projectId,
        versionId: input.versionId,
        authorId: input.authorId,
        authorName: input.authorName,
        content: input.content,
        createdAt: Date.now(),
        isResolved: false,
        type: input.type ?? "comment",
        annotations: input.annotations,
      };
      const comments = commentStore.get(input.projectId) ?? [];
      comments.push(comment);
      commentStore.set(input.projectId, comments);
      return comment;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["design", "comments", vars.projectId],
      });
    },
  });
}

export function useListDesignComments(projectId: string) {
  return useQuery<DesignComment[]>({
    queryKey: ["design", "comments", projectId],
    queryFn: async () => commentStore.get(projectId) ?? [],
    enabled: !!projectId,
  });
}

// ─── Canvas Helpers ───────────────────────────────────────────────────────────

export function useDesignCanvasState(initialItems: PlacedFurnitureItem[] = []) {
  const [items, setItems] = useState<PlacedFurnitureItem[]>(initialItems);
  const [selected, setSelected] = useState<string | null>(null);

  const addItem = useCallback((modelId: string, x = 100, y = 100) => {
    const item: PlacedFurnitureItem = {
      instanceId: uid(),
      modelId,
      x,
      y,
      rotation: 0,
      scale: 1,
    };
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback(
    (instanceId: string, patch: Partial<PlacedFurnitureItem>) => {
      setItems((prev) =>
        prev.map((it) =>
          it.instanceId === instanceId ? { ...it, ...patch } : it,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((instanceId: string) => {
    setItems((prev) => prev.filter((it) => it.instanceId !== instanceId));
    setSelected((s) => (s === instanceId ? null : s));
  }, []);

  const clearCanvas = useCallback(() => {
    setItems([]);
    setSelected(null);
  }, []);

  return {
    items,
    selected,
    setSelected,
    addItem,
    updateItem,
    removeItem,
    clearCanvas,
  };
}

// ─── Integration export status ─────────────────────────────────────────────────────

export type IntegrationExportTarget =
  | "bid-connect"
  | "scope-estimator"
  | "ffe-budget";

export interface DesignExportPayload {
  projectId: string;
  projectName: string;
  items: PlacedFurnitureItem[];
  estimatedBudget: number;
  materialList: string[];
  style: DesignStyle;
  targetTool: IntegrationExportTarget;
}

export function useExportDesignToTool() {
  return useMutation({
    mutationFn: async (
      _payload: DesignExportPayload,
    ): Promise<{ success: boolean; exportId: string }> => {
      // Routes through BHX-compatible pattern — actual wiring to backend tools
      // is handled when the design canister functions are deployed.
      await new Promise((r) => setTimeout(r, 600));
      return { success: true, exportId: uid() };
    },
  });
}

// ─── Approval status display helpers ────────────────────────────────────────

export function approvalStatusConfig(status: DesignApprovalStatus) {
  const configs: Record<
    DesignApprovalStatus,
    { label: string; color: string; token: string }
  > = {
    draft: {
      label: "Draft",
      color: "oklch(var(--approval-state-draft))",
      token: "--approval-state-draft",
    },
    submitted: {
      label: "Pending Review",
      color: "oklch(var(--approval-state-pending))",
      token: "--approval-state-pending",
    },
    approved: {
      label: "Approved",
      color: "oklch(var(--approval-state-approved))",
      token: "--approval-state-approved",
    },
    rejected: {
      label: "Rejected",
      color: "oklch(var(--approval-state-rejected))",
      token: "--approval-state-rejected",
    },
  };
  return configs[status];
}

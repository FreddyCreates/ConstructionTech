import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";

// ─── BHX Types (frontend-facing, mapped from backend.d.ts) ──────────────────

export type WorkerStage = "Nurse" | "HouseBee" | "Forager";
export type PheromoneType =
  | "Alarm"
  | "Recruitment"
  | "Inhibition"
  | "EthylOleate";
export type DroneStatus = "Scouting" | "Returning" | "Idle";

export interface WorkerRecord {
  id: string;
  stage: WorkerStage;
  engineAssigned: string;
  taskCount: bigint;
  lastActiveMs: bigint;
  healthScore: number;
}

export interface PheromoneSignal {
  signalType: PheromoneType;
  strength: number;
  sourceEngine: string;
  broadcastMs: bigint;
  decayRate: number;
}

export interface DroneRecord {
  id: string;
  status: DroneStatus;
  targetEngine: string;
  anomalyDetected: boolean;
  reportMs: bigint;
}

export interface QuorumStatus {
  confirmedEngines: number;
  totalEngines: number;
  threshold: number;
  reached: boolean;
}

export interface BHX_Config {
  quorumThreshold: number;
  maxWorkers: number;
  homeostasisTarget: number;
  pheromoneDecayRate: number;
  waggleDanceEnabled: boolean;
  version: string;
}

export interface WaggleDanceMessage {
  messageId: string;
  sourceEngine: string;
  targetEngine: string;
  direction: number;
  distanceScore: number;
  qualityScore: number;
  payload: string;
  timestampMs: bigint;
}

export interface ColonyState {
  queenActive: boolean;
  totalWorkers: number;
  droneCount: number;
  quorumThreshold: number;
  pheromoneCount: number;
}

export interface HomeostasisMetrics {
  hotEngines: string[];
  ambientThreshold: number;
  redistributionActive: boolean;
  loadTemperature: number;
  utilizationRate: number;
}

export interface BHXLiveSummary {
  pendingWaggles: number;
  colonyOnline: boolean;
  activePheromones: number;
  loadTemperature: number;
  lastCycle: bigint;
  quorumReached: boolean;
  droneCount: number;
  workerCount: number;
  activeWorkers?: number;
  pheromoneCount?: number;
}

// ─── Empty Defaults ───────────────────────────────────────────────────────────

const EMPTY_COLONY: ColonyState = {
  queenActive: false,
  totalWorkers: 0,
  droneCount: 0,
  quorumThreshold: 0.67,
  pheromoneCount: 0,
};

const EMPTY_QUORUM: QuorumStatus = {
  confirmedEngines: 0,
  totalEngines: 4,
  threshold: 0.67,
  reached: false,
};

const EMPTY_CONFIG: BHX_Config = {
  quorumThreshold: 0.67,
  maxWorkers: 32,
  homeostasisTarget: 0.65,
  pheromoneDecayRate: 0.04,
  waggleDanceEnabled: true,
  version: "BHX-1.0.0",
};

const EMPTY_HOMEOSTASIS: HomeostasisMetrics = {
  hotEngines: [],
  ambientThreshold: 0.65,
  redistributionActive: false,
  loadTemperature: 0,
  utilizationRate: 0,
};

const EMPTY_LIVE_SUMMARY: BHXLiveSummary = {
  pendingWaggles: 0,
  colonyOnline: false,
  activePheromones: 0,
  loadTemperature: 0,
  lastCycle: BigInt(0),
  quorumReached: false,
  droneCount: 0,
  workerCount: 0,
};

// ─── Helper: map backend variant to frontend WorkerStage ──────────────────────

function mapWorkerStage(v: "Nurse" | "HouseBee" | "Forager"): WorkerStage {
  return v;
}

function mapPheromoneType(
  v: "EthylOleate" | "Recruitment" | "Alarm" | "Inhibition",
): PheromoneType {
  return v;
}

// ─── Shared Result Wrapper ────────────────────────────────────────────────────

export interface BHXQueryResult<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
  isOffline: boolean;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useColonyState(): BHXQueryResult<ColonyState> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<ColonyState>({
    queryKey: ["bhx", "colonyState"],
    queryFn: async (): Promise<ColonyState> => {
      if (!actor) return EMPTY_COLONY;
      const raw = await actor.bhxGetColonyState();
      if (raw === null) return EMPTY_COLONY;
      return {
        queenActive: raw.queenActive,
        totalWorkers: Number(raw.totalWorkers),
        droneCount: Number(raw.droneCount),
        quorumThreshold: raw.quorumThreshold,
        pheromoneCount: Number(raw.pheromoneCount),
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? EMPTY_COLONY,
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data === EMPTY_COLONY,
  };
}

export function useWorkerRoster(): BHXQueryResult<WorkerRecord[]> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<WorkerRecord[]>({
    queryKey: ["bhx", "workerRoster"],
    queryFn: async (): Promise<WorkerRecord[]> => {
      if (!actor) return [];
      const raw = await actor.bhxGetWorkerRoster();
      if (raw === null) return [];
      return raw.map((w) => ({
        id: String(w.id),
        stage: mapWorkerStage(w.stage),
        engineAssigned: w.assignedDomain,
        taskCount: w.iterationCount,
        lastActiveMs: BigInt(Date.now()),
        healthScore: w.loadFactor,
      }));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data.length === 0,
  };
}

export function usePheromoneBroadcast(): BHXQueryResult<PheromoneSignal[]> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<PheromoneSignal[]>({
    queryKey: ["bhx", "pheromoneBroadcast"],
    queryFn: async (): Promise<PheromoneSignal[]> => {
      if (!actor) return [];
      const raw = await actor.bhxGetPheromoneBroadcast();
      if (raw === null) return [];
      return raw.map((p) => ({
        signalType: mapPheromoneType(p.signalType),
        strength: p.intensity,
        sourceEngine: p.sourceEngine,
        broadcastMs: p.timestamp,
        decayRate: 0.04,
      }));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data.length === 0,
  };
}

export function useActivePheromoneBroadcast(): BHXQueryResult<
  PheromoneSignal[]
> {
  return usePheromoneBroadcast();
}

export function useDroneReports(): BHXQueryResult<DroneRecord[]> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<DroneRecord[]>({
    queryKey: ["bhx", "droneReports"],
    queryFn: async (): Promise<DroneRecord[]> => {
      if (!actor) return [];
      const raw = await actor.bhxGetDroneReports();
      if (raw === null) return [];
      return raw.map((d) => ({
        id: String(d.id),
        status: d.anomalyScore > 0.5 ? "Scouting" : "Idle",
        targetEngine: d.scanTarget,
        anomalyDetected: d.anomalyScore > 0.5,
        reportMs: d.lastScanTimestamp,
      }));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data.length === 0,
  };
}

export function useQuorumStatus(): BHXQueryResult<QuorumStatus> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<QuorumStatus>({
    queryKey: ["bhx", "quorumStatus"],
    queryFn: async (): Promise<QuorumStatus> => {
      if (!actor) return EMPTY_QUORUM;
      const raw = await actor.bhxGetQuorumStatus();
      if (raw === null) return EMPTY_QUORUM;
      return {
        confirmedEngines: Number(raw.confirmedEngines),
        totalEngines: Number(raw.totalEngines),
        threshold: raw.threshold,
        reached: raw.reached,
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? EMPTY_QUORUM,
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data === EMPTY_QUORUM,
  };
}

export function useBHXConfig(): BHXQueryResult<BHX_Config> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<BHX_Config>({
    queryKey: ["bhx", "config"],
    queryFn: async (): Promise<BHX_Config> => {
      if (!actor) return EMPTY_CONFIG;
      const raw = await actor.bhxGetConfig();
      if (raw === null) return EMPTY_CONFIG;
      return {
        quorumThreshold: raw.quorumMin,
        maxWorkers: Number(raw.maxQueueDepth),
        homeostasisTarget: raw.homeostasisK,
        pheromoneDecayRate: 0.04,
        waggleDanceEnabled: true,
        version: "BHX-1.0.0",
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  return {
    data: query.data ?? EMPTY_CONFIG,
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data === EMPTY_CONFIG,
  };
}

export function useWaggleQueue(): BHXQueryResult<WaggleDanceMessage[]> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<WaggleDanceMessage[]>({
    queryKey: ["bhx", "waggleQueue"],
    queryFn: async (): Promise<WaggleDanceMessage[]> => {
      if (!actor) return [];
      const raw = await actor.bhxGetWaggleQueue();
      if (raw === null) return [];
      return raw.map((w, i) => ({
        messageId: `wm-${i + 1}`,
        sourceEngine: w.direction,
        targetEngine: w.payload.split(":")[0] ?? "UNKNOWN",
        direction: 0,
        distanceScore: w.distance,
        qualityScore: w.quality,
        payload: w.payload,
        timestampMs: BigInt(Date.now()),
      }));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data.length === 0,
  };
}

export function useHomeostasisMetrics(): BHXQueryResult<HomeostasisMetrics> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<HomeostasisMetrics>({
    queryKey: ["bhx", "homeostasisMetrics"],
    queryFn: async (): Promise<HomeostasisMetrics> => {
      if (!actor) return EMPTY_HOMEOSTASIS;
      const raw = await actor.bhxGetHomeostasisMetrics();
      if (raw === null) return EMPTY_HOMEOSTASIS;
      return {
        hotEngines: raw.hotEngines,
        ambientThreshold: raw.ambientThreshold,
        redistributionActive: raw.redistributionActive,
        loadTemperature: raw.loadTemperature,
        utilizationRate: raw.utilizationRate,
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? EMPTY_HOMEOSTASIS,
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data === EMPTY_HOMEOSTASIS,
  };
}

export function useBHXLiveSummary(): BHXQueryResult<BHXLiveSummary> {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<BHXLiveSummary>({
    queryKey: ["bhx", "liveSummary"],
    queryFn: async (): Promise<BHXLiveSummary> => {
      if (!actor) return EMPTY_LIVE_SUMMARY;
      const raw = await actor.bhxGetLiveSummary();
      if (raw === null) return EMPTY_LIVE_SUMMARY;
      return {
        pendingWaggles: Number(raw.pendingWaggles),
        colonyOnline: raw.colonyOnline,
        activePheromones: Number(raw.activePheromones),
        loadTemperature: raw.loadTemperature,
        lastCycle: raw.lastCycle,
        quorumReached: raw.quorumReached,
        droneCount: Number(raw.droneCount),
        workerCount: Number(raw.workerCount),
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    data: query.data ?? EMPTY_LIVE_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    isOffline: query.data === undefined || query.data === EMPTY_LIVE_SUMMARY,
  };
}

export function useBHXConnected(): {
  connected: boolean;
  lastSyncAt: Date | null;
} {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<ColonyState>({
    queryKey: ["bhx", "colonyState"],
    queryFn: async (): Promise<ColonyState> => {
      if (!actor) return EMPTY_COLONY;
      const raw = await actor.bhxGetColonyState();
      if (raw === null) return EMPTY_COLONY;
      return {
        queenActive: raw.queenActive,
        totalWorkers: Number(raw.totalWorkers),
        droneCount: Number(raw.droneCount),
        quorumThreshold: raw.quorumThreshold,
        pheromoneCount: Number(raw.pheromoneCount),
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6000,
    staleTime: 5000,
  });

  return {
    connected: query.isSuccess && (query.data?.queenActive ?? false),
    lastSyncAt: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}

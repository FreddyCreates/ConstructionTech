import type { BidInviteRecord, NexusBidScore } from "@/backend";

export type { BidInviteRecord, NexusBidScore };

export interface ToolInvocationResult {
  workerId: string;
  result: Record<string, string>;
  pheromoneSignalId: string;
  nexusInsightIds: string[];
}

export interface NexusInsight {
  text: string;
  type: "recommendation" | "alert" | "risk" | "opportunity" | "benchmark";
  confidence: number;
  priority: number;
  timestamp: string;
}

export interface BenchmarkRecord {
  metricLabel: string;
  libraryMedian: number;
  gcHistoricalAvg: number;
  industryRangeLow: number;
  industryRangeHigh: number;
}

export interface AnomalyState {
  detected: boolean;
  delta: number;
  benchmarkMedian: number;
  toolResult: number;
}

/** Full result package emitted by a BHX tool invocation */
export interface ToolSuiteResult {
  toolId: string;
  result: Record<string, unknown>;
  nexusInsights: NexusInsight[];
  benchmarkData: BenchmarkRecord[];
  confidence: number;
  pheromoneQuality: number;
  workerTaskId: string;
  timestamp: string;
}

/** Regional cost multipliers from the Workspace Library */
export interface RegionalFactors {
  region: string;
  multipliers: Record<string, number>;
}

/** OSHA/safety hazard record from the hazard library */
export interface HazardRecord {
  subpart: string;
  title: string;
  hazards: string[];
  controls: string[];
  ppe: string[];
  severity: "low" | "medium" | "high" | "critical";
}

/** Brand standard record (Marriott, Hilton, IHG, etc.) */
export interface BrandStandard {
  brand: string;
  roomBudget: number;
  ffeCycles: number;
  complianceChecklist: string[];
}

/** Nexus recommendation for a tool+project combination */
export interface NexusRecommendation {
  toolId: string;
  reason: string;
  priority: number;
}

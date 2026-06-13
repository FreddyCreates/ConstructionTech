import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BenchmarkRecord } from "../types";

export interface WorkspaceLibraryRates {
  productivityRate: number;
  benchmarkMedian: number;
  industryRangeHigh: number;
  industryRangeLow: number;
  laborRate: number;
  materialCostMax: number;
  materialCostMin: number;
}

export function useWorkspaceLibraryRates(
  trade: string,
  region: string,
  csiDivision: string,
) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<WorkspaceLibraryRates | null>({
    queryKey: ["workspaceLibraryRates", trade, region, csiDivision],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await actor.queryWorkspaceLibraryRates(
        trade,
        region,
        csiDivision,
      );
      if (!raw) return null;
      return {
        productivityRate: Number(raw.productivityRate),
        benchmarkMedian: Number(raw.benchmarkMedian),
        industryRangeHigh: Number(raw.industryRangeHigh),
        industryRangeLow: Number(raw.industryRangeLow),
        laborRate: Number(raw.laborRate),
        materialCostMax: Number(raw.materialCostMax),
        materialCostMin: Number(raw.materialCostMin),
      };
    },
    enabled: !!actor && !isFetching && !!trade && !!region,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}

export function useWorkspaceLibraryBenchmarks(
  toolCategory: string,
  region: string,
) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BenchmarkRecord[]>({
    queryKey: ["workspaceLibraryBenchmarks", toolCategory, region],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getWorkspaceLibraryBenchmarks(
        toolCategory,
        region,
      );
      return raw.map((r) => ({
        metricLabel: r.metricLabel,
        libraryMedian: Number(r.libraryMedian),
        gcHistoricalAvg: Number(r.gcHistoricalAvg),
        industryRangeLow: Number(r.industryRangeLow),
        industryRangeHigh: Number(r.industryRangeHigh),
      }));
    },
    enabled: !!actor && !isFetching && !!toolCategory,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}

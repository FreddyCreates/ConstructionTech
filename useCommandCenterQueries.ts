import {
  useGetActivityFeed,
  useGetERAESummary,
  useGetFIESummaryByTenant,
  useGetProjectSafetyDashboard,
  useGetRecentDocuments,
  useGetSCIEScore,
  useQueryCRMPipeline,
  useQueryCRMProjects,
} from "./useQueries";

export function useCommandCenterData(
  tenantId: string | number | undefined,
  role: string | null,
) {
  const activity = useGetActivityFeed(
    typeof tenantId === "string"
      ? Number.parseInt(tenantId, 10) || undefined
      : tenantId,
  );
  const financial = useGetFIESummaryByTenant(tenantId);
  const safety = useGetERAESummary(String(tenantId ?? ""));
  const culture = useGetSCIEScore(String(tenantId ?? ""));
  const projects = useQueryCRMProjects();
  const pipeline = useQueryCRMPipeline();
  const documents = useGetRecentDocuments(
    typeof tenantId === "string" ? tenantId : String(tenantId ?? ""),
  );

  const isLoading =
    activity.isLoading ||
    financial.isLoading ||
    safety.isLoading ||
    culture.isLoading ||
    projects.isLoading ||
    pipeline.isLoading ||
    documents.isLoading;

  return {
    summary: {
      activeProjects: projects.data?.length ?? 0,
      safetyScore: culture.data?.overallScore ?? 0,
      totalContractValue: projects.data?.reduce(
        (sum, p) => sum + (p.contractValueUSD ?? 0),
        0,
      ),
      activeBids: pipeline.data?.length ?? 0,
      documentsThisWeek: documents.data?.length ?? 0,
      cplScore: culture.data?.benchmarkComparison?.percentile ?? 0,
    },
    pipeline: pipeline.data ?? [],
    projects: projects.data ?? [],
    safety: safety.data,
    financial: financial.data,
    compliance: culture.data,
    activity: activity.data ?? [],
    alerts: [],
    isLoading,
    role,
  };
}

export {
  useGetActivityFeed,
  useGetERAESummary,
  useGetFIESummaryByTenant,
  useGetProjectSafetyDashboard,
  useGetRecentDocuments,
  useGetSCIEScore,
  useQueryCRMProjects,
  useQueryCRMPipeline,
};

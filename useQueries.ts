import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createActor } from "../backend";
import type {
  CRMPipelineItem,
  CRMPipelineStage,
  CRMProjectRecord,
  DocumentType,
  ExternalBlob,
  GCRelationshipScore,
  Project,
  SafetyDocument,
  SafetyDocumentCategory,
  UserProfile,
} from "../backend";

export function useGetAllProjects() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

// Safety Document Queries
export function useGetAllSafetyDocuments() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SafetyDocument[]>({
    queryKey: ["safetyDocuments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSafetyDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadSafetyDocument() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      category: SafetyDocumentCategory;
      description: string;
      file: ExternalBlob;
      documentType: DocumentType;
      isCurated: boolean;
      altText: string;
      filename: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.uploadSafetyDocument(
        data.title,
        data.category,
        data.description,
        data.file,
        data.documentType,
        data.isCurated,
        data.altText,
        data.filename,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safetyDocuments"] });
    },
  });
}

export function useUpdateSafetyDocument() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      category: SafetyDocumentCategory;
      description: string;
      file: ExternalBlob;
      documentType: DocumentType;
      isCurated: boolean;
      altText: string;
      filename: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateSafetyDocument(
        data.id,
        data.title,
        data.category,
        data.description,
        data.file,
        data.documentType,
        data.isCurated,
        data.altText,
        data.filename,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safetyDocuments"] });
    },
  });
}

export function useDeleteSafetyDocument() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteSafetyDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safetyDocuments"] });
    },
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Hospitality Partner Metrics (mock data - backend methods don't exist)
export function useGetHospitalityPartnerMetrics() {
  return useQuery<{
    averageProjectScale: string;
    roomTurnoverRate: string;
    crewCapacity: string;
    mobilizationSpeed: string;
    onTimeCompletion: string;
    safetyRecord: string;
  }>({
    queryKey: ["hospitalityPartnerMetrics"],
    queryFn: async () => {
      return {
        averageProjectScale: "$50K - $500K per project",
        roomTurnoverRate: "8-12 rooms per day completion",
        crewCapacity: "15-25 person crews",
        mobilizationSpeed: "48-72 hour deployment",
        onTimeCompletion: "95% project completion rate",
        safetyRecord: "Zero lost-time incidents (2024)",
      };
    },
  });
}

// Hospitality Owner Metrics (mock data - backend methods don't exist)
export function useGetHospitalityOwnerMetrics() {
  return useQuery<{
    dailyRoomCompletion: string;
    reducedMobilizationCosts: string;
    nationwideCoverage: string;
    schedulingResponsiveness: string;
  }>({
    queryKey: ["hospitalityOwnerMetrics"],
    queryFn: async () => {
      return {
        dailyRoomCompletion: "8-12 rooms per day turnover",
        reducedMobilizationCosts: "30% savings with bundled scopes",
        nationwideCoverage: "15+ states with crews",
        schedulingResponsiveness: "Same-day response, 24/7 scheduling",
      };
    },
  });
}

// Phase 2 AI Tool Mutations
export function useCalculateFFEBudget() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      roomCount: bigint;
      projectType: string;
      includesAppliances: boolean;
      includesElectronics: boolean;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateFFEBudget(
        data.roomCount,
        data.projectType,
        data.includesAppliances,
        data.includesElectronics,
      );
    },
  });
}

export function useCalculateLaborHours() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      scopeTypes: string[];
      roomCount: bigint;
      crewSize: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateLaborHours(
        data.scopeTypes,
        data.roomCount,
        data.crewSize,
      );
    },
  });
}

export function useAnalyzeScopeGap() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      selectedScopes: string[];
      projectType: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.analyzeScopeGap(data.selectedScopes, data.projectType);
    },
  });
}

export function useCalculateChangeOrderImpact() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      scopeAdded: string;
      currentRoomCount: bigint;
      currentCrewSize: bigint;
      currentDurationDays: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateChangeOrderImpact(
        data.scopeAdded,
        data.currentRoomCount,
        data.currentCrewSize,
        data.currentDurationDays,
      );
    },
  });
}

export function useGenerateJSA() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      tenantId: string;
      projectId: string;
      scopeType: string;
      workLocation: string;
      crewSize: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const formData = JSON.stringify({
        scopeType: data.scopeType,
        workLocation: data.workLocation,
        crewSize: data.crewSize,
      });
      return actor.generateJSA(data.tenantId, data.projectId, formData);
    },
  });
}

export function useGenerateToolboxTalk() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      tenantId: string;
      projectId: string;
      topic: string;
      targetTrade: string;
      durationMinutes: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const formData = JSON.stringify({
        topic: data.topic,
        targetTrade: data.targetTrade,
        durationMinutes: data.durationMinutes,
      });
      return actor.generateToolboxTalk(data.tenantId, data.projectId, formData);
    },
  });
}

export function useCalculateSafetyScore() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      incidentCount: bigint;
      nearMissCount: bigint;
      inspectionsPassed: bigint;
      totalInspections: bigint;
      trainingCompliance: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateSafetyScore(
        data.incidentCount,
        data.nearMissCount,
        data.inspectionsPassed,
        data.totalInspections,
        data.trainingCompliance,
      );
    },
  });
}

export function useCalculateScopeEstimate() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      projectType: string;
      roomCount: bigint;
      scopes: string[];
      includeDemo: boolean;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateScopeEstimate(
        data.projectType,
        data.roomCount,
        data.scopes,
        data.includeDemo,
      );
    },
  });
}

export function useCalculateProjectCost() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      scopeTypes: string[];
      roomCount: bigint;
      location: string;
      laborType: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateProjectCost(
        data.scopeTypes,
        data.roomCount,
        data.location,
        data.laborType,
      );
    },
  });
}

export function useCalculateProjectSchedule() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      scopeTypes: string[];
      roomCount: bigint;
      crewAvailability: string;
      hasOverlap: boolean;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateProjectSchedule(
        data.scopeTypes,
        data.roomCount,
        data.crewAvailability,
        data.hasOverlap,
      );
    },
  });
}

export function usePlanCrewDispatch() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      projectLocation: string;
      crewCount: bigint;
      projectDurationDays: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.planCrewDispatch(
        data.projectLocation,
        data.crewCount,
        data.projectDurationDays,
      );
    },
  });
}

// generateNexusInsightsV2 removed — backend function no longer exists
export function useGenerateNexusInsightsV2() {
  return useMutation({
    mutationFn: async (_data: {
      toolName: string;
      outputsJson: string;
      roomCount: bigint;
      scopeTypeCount: bigint;
      totalBudget: number;
      crewSize: bigint;
    }): Promise<string> => {
      return "[]";
    },
  });
}

export function useSaveToolResult() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      toolName: string;
      toolCategory: string;
      projectName: string;
      inputsJson: string;
      outputsJson: string;
      nexusInsightsJson: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveToolResult(
        data.toolName,
        data.toolCategory,
        data.projectName,
        data.inputsJson,
        data.outputsJson,
        data.nexusInsightsJson,
      );
    },
  });
}

// CRM Queries
export function useQueryCRMProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CRMProjectRecord[]>({
    queryKey: ["crmProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryCRMProjects();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useQueryGCRelationshipScores() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GCRelationshipScore[]>({
    queryKey: ["gcRelationshipScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryGCRelationshipScores();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useQueryCRMPipeline() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CRMPipelineItem[]>({
    queryKey: ["crmPipeline"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryCRMPipeline();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useAddCRMProject() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      gcName: string;
      projectType: string;
      scopesPerformed: string[];
      contractValueUSD: number;
      scheduledDays: bigint;
      actualDays: bigint;
      qualityScore: number;
      repeatBusiness: boolean;
      occupiedRenovation: boolean;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addCRMProject(
        data.gcName,
        data.projectType,
        data.scopesPerformed,
        data.contractValueUSD,
        data.scheduledDays,
        data.actualDays,
        data.qualityScore,
        data.repeatBusiness,
        data.occupiedRenovation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crmProjects"] });
    },
  });
}

// generateCaseStudy removed — backend function no longer exists
export function useGenerateCaseStudy() {
  return useMutation({
    mutationFn: async (_data: {
      gcPrincipal: Principal;
      projectId: string;
      title: string;
      scopeSummary: string;
      challenge: string;
      solution: string;
    }): Promise<string> => {
      return "{}";
    },
  });
}

export function useMatchReferenceProject() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: { projectType: string; scopeTypes: string[] }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.matchReferenceProject(data.projectType, data.scopeTypes);
    },
  });
}

export function useAddCRMPipelineItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      gcName: string;
      projectType: string;
      estimatedValueUSD: number;
      expectedStartDate: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addCRMPipelineItem(
        data.gcName,
        data.projectType,
        data.estimatedValueUSD,
        data.expectedStartDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crmPipeline"] });
    },
  });
}

export function useUpdatePipelineStage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { itemId: bigint; stage: CRMPipelineStage }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateCRMPipelineStage(data.itemId, data.stage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crmPipeline"] });
    },
  });
}

// ── BidConnect Intelligence Hooks ──────────────────────────────────────────
export function useBidLeadScoring12D() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      projectName: string;
      estimatedValueUSD: number;
      timelineWeeks: bigint;
      locationState: string;
      clientRelHistory: string;
      scopeComplexity: string;
      competitorCount: bigint;
      decisionMakerAccess: string;
      paymentHistoryFlag: string;
      riskProfile: string;
      strategicValue: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.bidLeadScoring12D(
        data.projectName,
        data.estimatedValueUSD,
        data.timelineWeeks,
        data.locationState,
        data.clientRelHistory,
        data.scopeComplexity,
        data.competitorCount,
        data.decisionMakerAccess,
        data.paymentHistoryFlag,
        data.riskProfile,
        data.strategicValue,
      );
    },
  });
}

export function useScopeGapDetection() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      projectType: string;
      submittedScope: string[];
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.scopeGapDetection(data.projectType, data.submittedScope);
    },
  });
}

// generatePayAppIntelligence removed — backend function no longer exists
export function useGeneratePayAppIntelligence() {
  return useMutation({
    mutationFn: async (_data: {
      applicationNumber: bigint;
      periodEndDate: string;
      contractValue: number;
      changeOrdersToDate: number;
      retainagePct: number;
      lineItems: Array<{
        prevCompletedPct: number;
        thisperiodPct: number;
        description: string;
        csiCode: string;
        scheduledValue: number;
        storedMaterials: number;
      }>;
    }): Promise<string> => {
      return "{}";
    },
  });
}

export function useCashFlowProjection90Day() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      projectValue: number;
      paymentTerms: bigint;
      mobilizationPct: number;
      weeklyBurnRate: number;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.cashFlowProjection90Day(
        data.projectValue,
        data.paymentTerms,
        data.mobilizationPct,
        data.weeklyBurnRate,
      );
    },
  });
}

export function useContractIntelligence() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: { contractText: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.contractIntelligence(data.contractText);
    },
  });
}

// ── Safety Intelligence Hooks ────────────────────────────────────────────────
export function useCalculateSafetyCultureScore() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      toolboxTalkFreqPerMonth: bigint;
      nearMissReportingRate: number;
      inspectionCompletionPct: number;
      trainingHrsPerWorker: number;
      correctiveActionClosePct: number;
      safetyObservationCount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.calculateSafetyCultureScore(
        data.toolboxTalkFreqPerMonth,
        data.nearMissReportingRate,
        data.inspectionCompletionPct,
        data.trainingHrsPerWorker,
        data.correctiveActionClosePct,
        data.safetyObservationCount,
      );
    },
  });
}

export function usePredictiveIncidentModeling() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      workforceSize: bigint;
      projectType: string;
      durationWeeks: bigint;
      recordableRate: number;
      nearMissLastMonth: bigint;
      weatherCondition: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.predictiveIncidentModeling(
        data.workforceSize,
        data.projectType,
        data.durationWeeks,
        data.recordableRate,
        data.nearMissLastMonth,
        data.weatherCondition,
      );
    },
  });
}

export function useGenerateSafetyBriefing() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      tenantId: string;
      projectId: string;
      tradeType: string;
      workActivity: string;
      hazardsId: string[];
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const formData = JSON.stringify({
        tradeType: data.tradeType,
        workActivity: data.workActivity,
        hazardsId: data.hazardsId,
      });
      return actor.generateSafetyBriefing(
        data.tenantId,
        data.projectId,
        formData,
      );
    },
  });
}

export function useGenerateEmergencyResponsePlan() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data: {
      tenantId: string;
      projectId: string;
      projectName: string;
      location: string;
      workforceSize: bigint;
      projectType: string;
      nearbyHospital: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const formData = JSON.stringify({
        projectName: data.projectName,
        location: data.location,
        workforceSize: data.workforceSize,
        projectType: data.projectType,
        nearbyHospital: data.nearbyHospital,
      });
      return actor.generateEmergencyResponsePlan(
        data.tenantId,
        data.projectId,
        formData,
      );
    },
  });
}

// generateEnhancedPDF removed — backend function no longer exists
export function useGenerateEnhancedPDF() {
  return useMutation({
    mutationFn: async (_data: {
      toolType: string;
      toolResults: string[];
      nexusInsights: string[];
      benchmarkContext: string[];
      projectInfo: string;
    }): Promise<string> => {
      return "";
    },
  });
}

export function useSignDocument() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      documentId: string;
      documentContent: string;
      role: string;
      displayName: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return (actor as any).signDocument(
        data.documentId,
        data.documentContent,
        data.role,
        data.displayName,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signedDocuments"] });
    },
  });
}

export interface MintTokenInput {
  tenantId: string;
  projectId: string;
  sessionType: string;
  metadata: string;
}

export function useMintSessionToken() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: MintTokenInput) => {
      if (!actor) throw new Error("Actor not initialized");
      return (actor as any).mintSessionToken(input);
    },
  });
}

export interface JSADailyInput {
  tenantId: string;
  projectId: string;
  jsaId: string;
  activity: string;
  crewSize: bigint;
  riskScore: bigint;
}

export function useRecordDailyJSA() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: JSADailyInput) => {
      if (!actor) throw new Error("Actor not initialized");
      return (actor as any).recordDailyJSA(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyJSAs"] });
    },
  });
}

export interface JSAProQuestion {
  id: string;
  label: string;
  placeholder: string;
}

export interface JSAProQuestionsResponse {
  questions: JSAProQuestion[];
}

export function useGetJSAProQuestions(activity: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<JSAProQuestionsResponse>({
    queryKey: ["jsaProQuestions", activity],
    queryFn: async () => {
      if (!actor) return { questions: [] };
      const result = await (actor as any).getJSAProQuestions(activity);
      return result as JSAProQuestionsResponse;
    },
    enabled: !!actor && !isFetching && !!activity,
  });
}

export function useGetAIPlatformStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    totalTools: bigint;
    totalAgents: bigint;
    totalEngines: bigint;
    totalResearchEntries: bigint;
  }>({
    queryKey: ["aiPlatformStats"],
    queryFn: async () => {
      if (!actor)
        return {
          totalTools: BigInt(0),
          totalAgents: BigInt(0),
          totalEngines: BigInt(0),
          totalResearchEntries: BigInt(0),
        };
      return actor.getAIPlatformStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Tenant & Role Hooks ────────────────────────────────────────────────────
export function useGetCallerTenants() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      id: string;
      name: string;
      owner: Principal;
      createdAt: bigint;
      plan: string;
    }>
  >({
    queryKey: ["callerTenants"],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-expect-error backend method not yet in bindings
      return actor.getCallerTenants();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTenantMembers(tenantId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      principal: Principal;
      joinedAt: bigint;
      invitedBy?: Principal;
      tenantId: bigint;
      roles: string[];
    }>
  >({
    queryKey: ["tenantMembers", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTenantMembers(BigInt(tenantId));
    },
    enabled: !!actor && !isFetching && !!tenantId,
  });
}

export function useCreateTenant() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; plan: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      // @ts-expect-error backend method not yet in bindings
      return actor.createTenant(data.name, data.plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerTenants"] });
    },
  });
}

export function useInviteToTenant() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      tenantId: string;
      email: string;
      role: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      // @ts-expect-error backend method not yet in bindings
      return actor.inviteToTenant(data.tenantId, data.email, data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantInvites"] });
    },
  });
}

export function useAcceptTenantInvite() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Actor not initialized");
      // @ts-expect-error backend method not yet in bindings
      return actor.acceptTenantInvite(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerTenants"] });
    },
  });
}

// ── Safety Receipts & Session Token Hooks ─────────────────────────────────
export function useGetReceiptsByTenant(tenantId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      id: string;
      activityType: string;
      projectId: string;
      date: bigint;
      attendees: string[];
      hazards: string[];
      integrity: string;
      auditHash: string;
    }>
  >({
    queryKey: ["receipts", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getReceiptsByTenant(tenantId);
    },
    enabled: !!actor && !isFetching && !!tenantId,
  });
}

export function useGetReceiptById(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    id: string;
    activityType: string;
    projectId: string;
    date: bigint;
    attendees: string[];
    hazards: string[];
    correctiveActions: string[];
    integrity: string;
    auditHash: string;
    signatures: string[];
  } | null>({
    queryKey: ["receipt", id],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getReceiptById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useVerifyReceiptIntegrity() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return (actor as any).verifyReceiptIntegrity(id);
    },
  });
}

export function useGetTokensByClient(clientId: string, tenantId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      id: string;
      sessionNumber: number;
      sessionType: string;
      date: bigint;
      crewCount: number;
      topics: string[];
      complianceStatus: string;
      attendees: string[];
      hazards: string[];
      correctiveActions: string[];
    }>
  >({
    queryKey: ["tokens", "client", clientId, tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTokensByClient(clientId, tenantId);
    },
    enabled: !!actor && !isFetching && !!clientId && !!tenantId,
  });
}

export function useGetTokensByProject(projectId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      id: string;
      sessionNumber: number;
      sessionType: string;
      date: bigint;
      crewCount: number;
      topics: string[];
      complianceStatus: string;
      attendees: string[];
      hazards: string[];
      correctiveActions: string[];
    }>
  >({
    queryKey: ["tokens", "project", projectId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTokensByProject(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useUpdateTokenCompliance() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return (actor as any).updateTokenCompliance(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
  });
}

export function useGetComplianceSummary(
  tenantId: string,
  startDate: string,
  endDate: string,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    totalCrews: number;
    compliant: number;
    overdue: number;
    complianceRate: number;
    dailyTrend: Array<{ date: string; rate: number }>;
  }>({
    queryKey: ["complianceSummary", tenantId, startDate, endDate],
    queryFn: async () => {
      if (!actor)
        return {
          totalCrews: 0,
          compliant: 0,
          overdue: 0,
          complianceRate: 0,
          dailyTrend: [],
        };
      return (actor as any).getComplianceSummary(tenantId, startDate, endDate);
    },
    enabled: !!actor && !isFetching && !!tenantId,
  });
}

export function useGetOverdueCrews(tenantId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      crewName: string;
      projectId: string;
      taskType: string;
      daysOverdue: number;
      riskLevel: string;
    }>
  >({
    queryKey: ["overdueCrews", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getOverdueCrews(tenantId);
    },
    enabled: !!actor && !isFetching && !!tenantId,
  });
}

export function useGetERAESummary(tenantId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    totalProjects: number;
    activeProjects: number;
    highRiskProjects: number;
    mediumRiskProjects: number;
    lowRiskProjects: number;
    totalOpenTags: number;
    totalOpenCorrectiveActions: number;
    incidentRate30d: number;
    nearMissRate30d: number;
    inspectionPassRate: number;
    trainingComplianceRate: number;
    riskHeatMap: Array<{
      projectId: string;
      projectName: string;
      riskScore: number;
      riskLevel: string;
      openHazards: number;
      lastIncidentDate: string;
    }>;
  }>({
    queryKey: ["eraeSummary", tenantId],
    queryFn: async () => {
      if (!actor)
        return {
          totalProjects: 0,
          activeProjects: 0,
          highRiskProjects: 0,
          mediumRiskProjects: 0,
          lowRiskProjects: 0,
          totalOpenTags: 0,
          totalOpenCorrectiveActions: 0,
          incidentRate30d: 0,
          nearMissRate30d: 0,
          inspectionPassRate: 0,
          trainingComplianceRate: 0,
          riskHeatMap: [],
        };
      return (actor as any).getERAESummary(tenantId);
    },
    enabled: !!actor && !isFetching && !!tenantId,
  });
}

export function useGetSCIEScore(tenantId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    overallScore: number;
    leadingIndicators: {
      nearMissReportingRate: number;
      inspectionCompletionRate: number;
      trainingComplianceRate: number;
      correctiveActionCloseRate: number;
      toolboxTalkFrequency: number;
      safetyObservationRate: number;
    };
    trend30d: Array<{ date: string; score: number }>;
    benchmarkComparison: {
      companyAverage: number;
      industryAverage: number;
      percentile: number;
    };
    predictiveInsights: {
      incidentProbability30d: number;
      incidentProbability60d: number;
      incidentProbability90d: number;
      topRiskFactors: string[];
    };
  }>({
    queryKey: ["scieScore", tenantId],
    queryFn: async () => {
      if (!actor)
        return {
          overallScore: 0,
          leadingIndicators: {
            nearMissReportingRate: 0,
            inspectionCompletionRate: 0,
            trainingComplianceRate: 0,
            correctiveActionCloseRate: 0,
            toolboxTalkFrequency: 0,
            safetyObservationRate: 0,
          },
          trend30d: [],
          benchmarkComparison: {
            companyAverage: 0,
            industryAverage: 0,
            percentile: 0,
          },
          predictiveInsights: {
            incidentProbability30d: 0,
            incidentProbability60d: 0,
            incidentProbability90d: 0,
            topRiskFactors: [],
          },
        };
      return (actor as any).getSCIEScore(tenantId);
    },
    enabled: !!actor && !isFetching && !!tenantId,
  });
}

export function useGetProjectSafetyDashboard(
  projectId: string,
  tenantId: string,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    projectId: string;
    projectName: string;
    riskLevel: string;
    openTags: number;
    sessionCompliance: number;
    activeHazards: number;
    lastInspectionDate: string;
    recentIncidents: Array<{
      id: string;
      date: string;
      type: string;
      severity: string;
      description: string;
    }>;
    upcomingInspections: Array<{
      id: string;
      date: string;
      type: string;
      assignedTo: string;
    }>;
    crewCompliance: Array<{
      crewName: string;
      complianceRate: number;
      lastSessionDate: string;
      overdueItems: number;
    }>;
  }>({
    queryKey: ["projectSafetyDashboard", projectId, tenantId],
    queryFn: async () => {
      if (!actor)
        return {
          projectId: "",
          projectName: "",
          riskLevel: "LOW",
          openTags: 0,
          sessionCompliance: 0,
          activeHazards: 0,
          lastInspectionDate: "",
          recentIncidents: [],
          upcomingInspections: [],
          crewCompliance: [],
        };
      return (actor as any).getProjectSafetyDashboard(projectId, tenantId);
    },
    enabled: !!actor && !isFetching && !!projectId && !!tenantId,
  });
}

export function useGetComplianceByProject(projectId: string, date: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<{
    compliant: number;
    total: number;
    rate: number;
  }>({
    queryKey: ["complianceByProject", projectId, date],
    queryFn: async () => {
      if (!actor) return { compliant: 0, total: 0, rate: 0 };
      return (actor as any).getComplianceByProject(projectId, date);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

// Alias exports for pages that import shorter names
export const useAcceptInvite = useAcceptTenantInvite;
export const useGenerateInvite = useInviteToTenant;
export const useGetTenant = useGetCallerTenants;

// ── Document Generation Engine (DGE) Hooks ─────────────────────────────────
export function useGetTemplateLibrary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      templateId: string;
      name: string;
      category: { [key: string]: null };
      industry: { [key: string]: null };
      estimatedPages: bigint;
      isPackage: boolean;
      tags: string[];
      description: string;
      officialForm: boolean;
      sections: Array<{
        sectionId: string;
        sectionName: string;
        order: bigint;
        fields: Array<any>;
        isPageBreak: boolean;
      }>;
    }>
  >({
    queryKey: ["templateLibrary"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTemplateLibrary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetRecentDocuments(principal: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      id: string;
      templateId: string;
      templateName: string;
      generatedAt: bigint;
      pageCount: bigint;
      fieldsFilled: bigint;
      fieldsTotal: bigint;
      status: { [key: string]: null };
    }>
  >({
    queryKey: ["recentDocuments", principal],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getRecentDocuments(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
    refetchInterval: 8000,
  });
}

export function useGetDocumentCount(principal: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["documentCount", principal],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return (actor as any).getDocumentCount(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useSearchTemplates(searchTerm: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      templateId: string;
      name: string;
      category: { [key: string]: null };
      industry: { [key: string]: null };
      estimatedPages: bigint;
      isPackage: boolean;
      tags: string[];
      description: string;
      officialForm: boolean;
      sections: Array<{
        sectionId: string;
        sectionName: string;
        order: bigint;
        fields: Array<any>;
        isPageBreak: boolean;
      }>;
    }>
  >({
    queryKey: ["searchTemplates", searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).searchTemplates(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm,
  });
}

export function useGetTemplatesByCategory(category: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      templateId: string;
      name: string;
      category: { [key: string]: null };
      industry: { [key: string]: null };
      estimatedPages: bigint;
      isPackage: boolean;
      tags: string[];
      description: string;
      officialForm: boolean;
      sections: Array<{
        sectionId: string;
        sectionName: string;
        order: bigint;
        fields: Array<any>;
        isPageBreak: boolean;
      }>;
    }>
  >({
    queryKey: ["templatesByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTemplatesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

// ── FIE Summary Hook ─────────────────────────────────────────────────────────
export function useGetFIESummary(principal: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    Array<{
      id: string;
      templateId: string;
      templateName: string;
      generatedAt: bigint;
      pageCount: bigint;
      fieldsFilled: bigint;
      fieldsTotal: bigint;
      status: { [key: string]: null };
    }>
  >({
    queryKey: ["fieSummary", principal],
    queryFn: async () => {
      if (!actor) return [];
      const docs = await (actor as any).getRecentDocuments(principal);
      const financialIds = [
        "pay_app",
        "lien",
        "financial",
        "g702",
        "g703",
        "g701",
        "cashflow",
        "eac",
      ];
      return docs.filter((d: any) =>
        financialIds.some(
          (id) =>
            d.templateId?.toLowerCase().includes(id) ||
            d.templateName?.toLowerCase().includes(id),
        ),
      );
    },
    enabled: !!actor && !isFetching && !!principal,
    refetchInterval: 8000,
  });
}

type ActivityFeedItem = {
  actorName: string;
  id: string;
  itemType: string;
  title: string;
  description: string;
  projectId: string;
  tenantId: number;
  timestamp: bigint;
  route: string;
};

type GoNoGoDimension = {
  name: string;
  score: number;
  weight: number;
  rationale: string;
};

type GoNoGoScore = {
  bidId: string;
  compositeScore: number;
  recommendation: string;
  confidence: number;
  dimensions: GoNoGoDimension[];
};

type FIESummary = {
  totalPayApps: number;
  pendingPayApps: number;
  cashFlow90Day: number;
  retainageHeld: number;
  openLienWaivers: number;
  eacAlerts: number;
};

export function useGetActivityFeed(tenantId: number | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ActivityFeedItem[]>({
    queryKey: ["activityFeed", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTenantActivityFeed(tenantId);
    },
    refetchInterval: 8000,
    enabled: !!tenantId && !!actor && !isFetching,
  });
}

export function useGetGoNoGoScore(bidId: string, tenantId: number | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GoNoGoScore | null>({
    queryKey: ["goNoGo", bidId, tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getGoNoGoScore(bidId, tenantId);
    },
    enabled: !!bidId && !!tenantId && !!actor && !isFetching,
  });
}

export function useGetFIESummaryByTenant(
  tenantId: string | number | undefined,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FIESummary | null>({
    queryKey: ["fieSummary", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getFIESummary(tenantId);
    },
    enabled: !!tenantId && !!actor && !isFetching,
    staleTime: 30000,
  });
}

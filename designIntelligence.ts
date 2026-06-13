// Re-export backend types for workspace usage to ensure single source of truth.
// All workspace types come from backend.d.ts — do NOT define conflicting local types.

export type {
  AnomalyReport,
  ChangeOrder,
  CloseoutReadiness,
  DailyLog,
  PhaseRecommendation,
  ProjectIntelligence,
  ProjectRecord,
  ProjectSubmissions,
  PunchItem,
  RFI,
  SubmittalPackage,
  SubScore,
  SubWorkspaceView,
} from "../backend";

export {
  LifecyclePhase,
  PunchSeverity,
  RFIPriority,
  PunchStatus,
  RFIStatus,
  ChangeOrderStatus,
  SubmittalApprovalStatus,
  ScopeItemStatus,
} from "../backend";

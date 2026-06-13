import { Toaster } from "@/components/ui/sonner";
import CommandCenterPage from "@/pages/workspace/CommandCenterPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import Layout from "./components/Layout";
import { TenantProvider } from "./contexts/TenantContext";
import AIAgentsPage from "./pages/AIAgentsPage";
import AIEnginesPage from "./pages/AIEnginesPage";
import AIOperatingSystemPage from "./pages/AIOperatingSystemPage";
import AIPlatformPage from "./pages/AIPlatformPage";
import AIStreamsHubPage from "./pages/AIStreamsHubPage";
import AIToolsPage from "./pages/AIToolsPage";
import AccountDashboardPage from "./pages/AccountDashboardPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AgentChatPage from "./pages/AgentChatPage";
import AgentSMSBridgePage from "./pages/AgentSMSBridgePage";
import AppShell from "./pages/AppShell";
import BidConnectPage from "./pages/BidConnectPage";
import BuilderDashboardPage from "./pages/BuilderDashboardPage";
import BundlesPage from "./pages/BundlesPage";
import CalculationHistoryPage from "./pages/CalculationHistoryPage";
import CareersPage from "./pages/CareersPage";
import ColonySDKPage from "./pages/ColonySDKPage";
import ContactDirectoryPage from "./pages/ContactDirectoryPage";
import ContactPage from "./pages/ContactPage";
import CreateReportPage from "./pages/CreateReportPage";
import DailyLogFormPage from "./pages/DailyLogFormPage";
import DesignIntelligencePage from "./pages/DesignIntelligencePage";
import DocumentFusionDetailPage from "./pages/DocumentFusionDetailPage";
import DocumentFusionPage from "./pages/DocumentFusionPage";
import FaqPage from "./pages/FaqPage";
import FinancialIntelligencePage from "./pages/FinancialIntelligencePage";
import HandoffDashboardPage from "./pages/HandoffDashboardPage";
import HandoffDetailPage from "./pages/HandoffDetailPage";
import HomePage from "./pages/HomePage";
import HospitalityOwnersPage from "./pages/HospitalityOwnersPage";
import HospitalityPartnersPage from "./pages/HospitalityPartnersPage";
import JoinTenantPage from "./pages/JoinPage";
import MultifamilyPage from "./pages/MultifamilyPage";
import OfficeServicesPage from "./pages/OfficeServicesPage";
import PrequalPage from "./pages/PrequalPage";
import PricingPage from "./pages/PricingPage";
import ProcurementPage from "./pages/ProcurementPage";
import ProjectIntelligencePage from "./pages/ProjectIntelligencePage";
import ProjectReportsPage from "./pages/ProjectReportsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProtocolsPage from "./pages/ProtocolsPage";
import PunchItemFormPage from "./pages/PunchItemFormPage";
import RFIFormPage from "./pages/RFIFormPage";
import ResearchLibraryPage from "./pages/ResearchLibraryPage";
import SafetyPage from "./pages/SafetyPage";
import SafetyPortalPage from "./pages/SafetyPortalPage";
import ServicesPage from "./pages/ServicesPage";
import SharedReportPage from "./pages/SharedReportPage";
import TenantAdminPage from "./pages/TenantAdminPage";
import WhereWeWorkPage from "./pages/WhereWeWorkPage";
import WorkspacePage from "./pages/WorkspacePage";
import BidLevelingPage from "./pages/ai-tools/BidLevelingPage";
import ChangeOrderPage from "./pages/ai-tools/ChangeOrderPage";
import CloseoutChecklistPage from "./pages/ai-tools/CloseoutChecklistPage";
import CostEstimatorPage from "./pages/ai-tools/CostEstimatorPage";
import CrewDispatchPage from "./pages/ai-tools/CrewDispatchPage";
import CrewProductivityPage from "./pages/ai-tools/CrewProductivityPage";
import FFEBudgetPage from "./pages/ai-tools/FFEBudgetPage";
import FFELogisticsPage from "./pages/ai-tools/FFELogisticsPage";
import ITBBuilderPage from "./pages/ai-tools/ITBBuilderPage";
import JSAGeneratorPage from "./pages/ai-tools/JSAGeneratorPage";
import LaborHoursPage from "./pages/ai-tools/LaborHoursPage";
import MaterialTakeoffPage from "./pages/ai-tools/MaterialTakeoffPage";
import MobilizationCostPage from "./pages/ai-tools/MobilizationCostPage";
import OshaIncidentRatePage from "./pages/ai-tools/OshaIncidentRatePage";
import PermitTimelinePage from "./pages/ai-tools/PermitTimelinePage";
import PreTaskPlanPage from "./pages/ai-tools/PreTaskPlanPage";
import PunchByScopePage from "./pages/ai-tools/PunchByScopePage";
import PunchListPage from "./pages/ai-tools/PunchListPage";
import PunchOrganizerPage from "./pages/ai-tools/PunchOrganizerPage";
import RFIImpactPage from "./pages/ai-tools/RFIImpactPage";
import RenovationPhasesPage from "./pages/ai-tools/RenovationPhasesPage";
import RenovationROIPage from "./pages/ai-tools/RenovationROIPage";
import RoomTurnoverPage from "./pages/ai-tools/RoomTurnoverPage";
import SafetyAssistantPage from "./pages/ai-tools/SafetyAssistantPage";
import SafetyScorePage from "./pages/ai-tools/SafetyScorePage";
import ScheduleCalculatorPage from "./pages/ai-tools/ScheduleCalculatorPage";
import ScopeEstimatorPage from "./pages/ai-tools/ScopeEstimatorPage";
import ScopeGapPage from "./pages/ai-tools/ScopeGapPage";
import ToolboxTalkPage from "./pages/ai-tools/ToolboxTalkPage";
import VarianceTrackerPage from "./pages/ai-tools/VarianceTrackerPage";
import AIRenderEnginePage from "./pages/design-intelligence/AIRenderEnginePage";
import CollaborationWorkspacePage from "./pages/design-intelligence/CollaborationWorkspacePage";
import FurnitureDesignerPage from "./pages/design-intelligence/FurnitureDesignerPage";
import ModelLibraryPage from "./pages/design-intelligence/ModelLibraryPage";
import VirtualStagingPage from "./pages/design-intelligence/VirtualStagingPage";
import DocumentsHubPage from "./pages/documents/DocumentsHubPage";
import FinancialsHubPage from "./pages/financials/FinancialsHubPage";
import CompanyProfilePage from "./pages/safety/CompanyProfilePage";
import EmergencyResponsePage from "./pages/safety/EmergencyResponsePage";
import EnterpriseSafetyDashboardPage from "./pages/safety/EnterpriseSafetyDashboardPage";
import HazardAssessmentPage from "./pages/safety/HazardAssessmentPage";
import IncidentPredictorPage from "./pages/safety/IncidentPredictorPage";
import JSADailyTrackerPage from "./pages/safety/JSADailyTrackerPage";
import SafetyPreTaskPlanPage from "./pages/safety/PreTaskPlanPage";
import SafetyAuditPage from "./pages/safety/SafetyAuditPage";
import SafetyBriefingPage from "./pages/safety/SafetyBriefingPage";
import SafetyCultureScorePage from "./pages/safety/SafetyCultureScorePage";
import SafetyDirectorPortalPage from "./pages/safety/SafetyDirectorPortalPage";
import SafetyReceiptsPage from "./pages/safety/SafetyReceiptsPage";
import SafetyReportBuilderPage from "./pages/safety/SafetyReportBuilderPage";
import SafetySuiteHubPage from "./pages/safety/SafetySuiteHubPage";
import SafetyTagDashboardPage from "./pages/safety/SafetyTagDashboardPage";
import SafetyTagDetailPage from "./pages/safety/SafetyTagDetailPage";
import SafetyTagManagerPage from "./pages/safety/SafetyTagManagerPage";
import SessionTokenDashboardPage from "./pages/safety/SessionTokenDashboardPage";
import ToolboxSessionDetailPage from "./pages/safety/ToolboxSessionDetailPage";
import ToolboxSessionPage from "./pages/safety/ToolboxSessionPage";
import ToolboxSuiteDashboardPage from "./pages/safety/ToolboxSuiteDashboardPage";
import ProjectDashboardPage from "./pages/workspace/ProjectDashboardPage";
import ProjectDetailPage from "./pages/workspace/ProjectDetailPage";
import ProjectsListPage from "./pages/workspace/ProjectsListPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});

const bundlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bundles",
  component: BundlesPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectIntelligencePage,
});

const prequalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/prequal",
  component: PrequalPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const safetyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety",
  component: SafetyPage,
});

const safetyCompanyProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/company-profile",
  component: CompanyProfilePage,
});

const safetyReportBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/report-builder",
  component: SafetyReportBuilderPage,
});

const safetyPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety-portal",
  component: SafetyPortalPage,
});
const safetyCultureScoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/culture-score",
  component: SafetyCultureScorePage,
});
const safetyIncidentPredictorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/incident-predictor",
  component: IncidentPredictorPage,
});
const safetyBriefingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/briefing-generator",
  component: SafetyBriefingPage,
});
const safetyEmergencyResponseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/emergency-response",
  component: EmergencyResponsePage,
});

const whereWeWorkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/where-we-work",
  component: WhereWeWorkPage,
});

const careersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/careers",
  component: CareersPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FaqPage,
});

const hospitalityPartnersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospitality-partners",
  component: HospitalityPartnersPage,
});

const hospitalityOwnersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospitality-owners",
  component: HospitalityOwnersPage,
});

const multifamilyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/multifamily",
  component: MultifamilyPage,
});

const officeServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/office-services",
  component: OfficeServicesPage,
});

const aiPlatformRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform",
  component: AIPlatformPage,
});

const aiToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools",
  component: AIToolsPage,
});

const aiAgentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/agents",
  component: AIAgentsPage,
});

const aiEnginesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/engines",
  component: AIEnginesPage,
});

const aiOperatingSystemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/os",
  component: AIOperatingSystemPage,
});

const researchLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/research-library",
  component: ResearchLibraryPage,
});
const protocolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/protocols",
  component: ProtocolsPage,
});

const scopeEstimatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/scope-estimator",
  component: ScopeEstimatorPage,
});

const safetyAssistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/safety-assistant",
  component: SafetyAssistantPage,
});

const itbBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/itb-builder",
  component: ITBBuilderPage,
});

const punchListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/punch-list",
  component: PunchListPage,
});

const ffeBudgetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/ffe-budget",
  component: FFEBudgetPage,
});

const laborHoursRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/labor-hours",
  component: LaborHoursPage,
});

const scopeGapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/scope-gap",
  component: ScopeGapPage,
});

const changeOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/change-order",
  component: ChangeOrderPage,
});

const jsaGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/jsa-generator",
  component: JSAGeneratorPage,
});

const toolboxTalkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/toolbox-talk",
  component: ToolboxTalkPage,
});

const safetyScoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/safety-score",
  component: SafetyScorePage,
});

const costEstimatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/cost-estimator",
  component: CostEstimatorPage,
});

const scheduleCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/schedule-calculator",
  component: ScheduleCalculatorPage,
});

const materialTakeoffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/material-takeoff",
  component: MaterialTakeoffPage,
});

const crewDispatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/crew-dispatch",
  component: CrewDispatchPage,
});

const punchOrganizerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/punch-organizer",
  component: PunchOrganizerPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plans",
  component: PricingPage,
});

const roomTurnoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/room-turnover",
  component: RoomTurnoverPage,
});
const oshaIncidentRateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/osha-incident-rate",
  component: OshaIncidentRatePage,
});
const mobilizationCostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/mobilization-cost",
  component: MobilizationCostPage,
});
const bidLevelingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/bid-leveling",
  component: BidLevelingPage,
});
const renovationPhasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/renovation-phases",
  component: RenovationPhasesPage,
});
const punchByScopeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/punch-by-scope",
  component: PunchByScopePage,
});
const varianceTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/variance-tracker",
  component: VarianceTrackerPage,
});
const closeoutChecklistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/closeout-checklist",
  component: CloseoutChecklistPage,
});
const crewProductivityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/crew-productivity",
  component: CrewProductivityPage,
});
const ffeLogisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/ffe-logistics",
  component: FFELogisticsPage,
});
const rfiImpactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/rfi-impact",
  component: RFIImpactPage,
});
const preTaskPlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/pre-task-plan",
  component: PreTaskPlanPage,
});

const safetyPreTaskPlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/pre-task-plan",
  component: SafetyPreTaskPlanPage,
});
const permitTimelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/permit-timeline",
  component: PermitTimelinePage,
});
const renovationROIRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/tools/renovation-roi",
  component: RenovationROIPage,
});
const builderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder",
  component: BuilderDashboardPage,
});

const accountDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountDashboardPage,
});

const calculationHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account/history",
  component: CalculationHistoryPage,
});

const projectReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account/reports",
  component: ProjectReportsPage,
});

const createReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account/reports/create",
  component: CreateReportPage,
});

const sharedReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports/$shareToken",
  component: SharedReportPage,
});

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace",
  component: WorkspacePage,
});

const workspaceProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace/projects",
  component: ProjectsListPage,
});

const workspaceProjectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace/project/$projectId",
  component: ProjectDetailPage,
});

const workspaceDailyLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace/submit/dailylog",
  component: DailyLogFormPage,
});

const workspaceRFIRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace/submit/rfi",
  component: RFIFormPage,
});

const workspacePunchItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace/submit/punchitem",
  component: PunchItemFormPage,
});

const bidConnectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bidconnect",
  component: BidConnectPage,
});

const agentChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/agents/$agentId/chat",
  component: AgentChatPage,
});

const agentSMSBridgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-platform/agents/sms-bridge",
  component: AgentSMSBridgePage,
});

const documentFusionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/document-fusion",
  component: DocumentFusionPage,
});

const documentFusionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/document-fusion/$docId",
  component: DocumentFusionDetailPage,
});

const colonySDKRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/colony-sdk",
  component: ColonySDKPage,
});
const designIntelligenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-intelligence",
  component: DesignIntelligencePage,
});

const designRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design",
  component: DesignIntelligencePage,
});

const designRenderEngineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-intelligence/render-engine",
  component: AIRenderEnginePage,
});

const design3dLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-intelligence/3d-library",
  component: ModelLibraryPage,
});

const designFurnitureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-intelligence/furniture-designer",
  component: FurnitureDesignerPage,
});

const designVirtualStagingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-intelligence/virtual-staging",
  component: VirtualStagingPage,
});

const designCollabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-intelligence/workspace/$projectId",
  component: CollaborationWorkspacePage,
});

const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contacts",
  component: ContactDirectoryPage,
});

const handoffsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/handoffs",
  component: HandoffDashboardPage,
});

const handoffDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/handoffs/$handoffId",
  component: HandoffDetailPage,
});

const aiStreamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-streams",
  component: AIStreamsHubPage,
});

const safetyAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/audit",
  component: SafetyAuditPage,
});

const toolboxSuiteDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/toolbox-suite/dashboard",
  component: ToolboxSuiteDashboardPage,
});

const toolboxSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/toolbox-suite/session",
  component: ToolboxSessionPage,
});

const toolboxSessionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/toolbox-suite/session/$sessionId",
  component: ToolboxSessionDetailPage,
});

const safetyHazardAssessmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/hazard-assessment",
  component: HazardAssessmentPage,
});

const safetyTagDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/tag-dashboard",
  component: SafetyTagDashboardPage,
});

const safetyTagManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/tags",
  component: SafetyTagManagerPage,
});

const safetyTagDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/tags/$tagId",
  component: SafetyTagDetailPage,
});

const jsaDailyTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/jsa-daily-tracker",
  component: JSADailyTrackerPage,
});

const sessionTokensRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/session-tokens",
  component: SessionTokenDashboardPage,
});

const safetyReceiptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/receipts",
  component: SafetyReceiptsPage,
});

const tenantAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tenant-admin",
  component: TenantAdminPage,
});
const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: AdminSettingsPage,
});

const joinTenantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/join",
  component: JoinTenantPage,
});

const financialIntelligenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/financial",
  component: FinancialIntelligencePage,
});

const documentsHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents",
  component: DocumentsHubPage,
});

const financialsHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/financials",
  component: FinancialsHubPage,
});

const procurementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/procurement",
  component: ProcurementPage,
});

const enterpriseSafetyDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/enterprise-dashboard",
  component: EnterpriseSafetyDashboardPage,
});

const safetyDirectorPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety/director-portal",
  component: SafetyDirectorPortalPage,
});

const workspaceCommandCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace/command-center",
  component: CommandCenterPage,
});

const projectDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace/project-dashboard",
  component: ProjectDashboardPage,
});

const appShellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: AppShell,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  bundlesRoute,
  projectsRoute,
  prequalRoute,
  contactRoute,
  safetyRoute,
  safetyPortalRoute,
  whereWeWorkRoute,
  careersRoute,
  faqRoute,
  hospitalityPartnersRoute,
  hospitalityOwnersRoute,
  multifamilyRoute,
  officeServicesRoute,
  aiPlatformRoute,
  aiToolsRoute,
  aiAgentsRoute,
  aiEnginesRoute,
  aiOperatingSystemRoute,
  researchLibraryRoute,
  protocolsRoute,
  scopeEstimatorRoute,
  safetyAssistantRoute,
  itbBuilderRoute,
  punchListRoute,
  ffeBudgetRoute,
  laborHoursRoute,
  scopeGapRoute,
  changeOrderRoute,
  jsaGeneratorRoute,
  toolboxTalkRoute,
  safetyScoreRoute,
  costEstimatorRoute,
  scheduleCalculatorRoute,
  materialTakeoffRoute,
  crewDispatchRoute,
  punchOrganizerRoute,
  roomTurnoverRoute,
  oshaIncidentRateRoute,
  mobilizationCostRoute,
  bidLevelingRoute,
  renovationPhasesRoute,
  punchByScopeRoute,
  varianceTrackerRoute,
  closeoutChecklistRoute,
  crewProductivityRoute,
  ffeLogisticsRoute,
  rfiImpactRoute,
  preTaskPlanRoute,
  permitTimelineRoute,
  renovationROIRoute,
  builderRoute,
  accountDashboardRoute,
  calculationHistoryRoute,
  projectReportsRoute,
  createReportRoute,
  sharedReportRoute,
  pricingRoute,
  workspaceRoute,
  workspaceProjectsRoute,
  workspaceProjectDetailRoute,
  workspaceDailyLogRoute,
  workspaceRFIRoute,
  workspacePunchItemRoute,
  bidConnectRoute,
  agentChatRoute,
  agentSMSBridgeRoute,
  documentFusionRoute,
  documentFusionDetailRoute,
  colonySDKRoute,
  designIntelligenceRoute,
  designRoute,
  designRenderEngineRoute,
  design3dLibraryRoute,
  designFurnitureRoute,
  designVirtualStagingRoute,
  designCollabRoute,
  contactsRoute,
  handoffsRoute,
  handoffDetailRoute,
  safetyCultureScoreRoute,
  safetyIncidentPredictorRoute,
  safetyBriefingRoute,
  safetyEmergencyResponseRoute,
  safetyAuditRoute,
  safetyHazardAssessmentRoute,
  toolboxSuiteDashboardRoute,
  toolboxSessionRoute,
  toolboxSessionDetailRoute,
  safetyCompanyProfileRoute,
  safetyReportBuilderRoute,
  safetyPreTaskPlanRoute,
  aiStreamsRoute,
  safetyTagDashboardRoute,
  safetyTagManagerRoute,
  safetyTagDetailRoute,
  jsaDailyTrackerRoute,
  sessionTokensRoute,
  safetyReceiptsRoute,
  adminSettingsRoute,
  tenantAdminRoute,
  joinTenantRoute,
  financialIntelligenceRoute,
  documentsHubRoute,
  financialsHubRoute,
  procurementRoute,
  enterpriseSafetyDashboardRoute,
  safetyDirectorPortalRoute,
  appShellRoute,
  projectDashboardRoute,
  workspaceCommandCenterRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TenantProvider>
            <RouterProvider router={router} />
          </TenantProvider>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

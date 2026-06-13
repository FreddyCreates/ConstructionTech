// Command Center domain types — executive mission control aggregation layer.
// Aggregates data from workspace, safety-tags, fie, psie, cpl, nexus, and tenant modules.
import Debug "mo:core/Debug";

module {

  // ── Role-based view filtering ──────────────────────────────────────────────
  // Mirrors tenant.mo Role for query filtering (subset re-export for clarity)
  public type ViewRole = {
    #OwnerAdmin;
    #GC;
    #PM;
    #SafetyOfficer;
    #SubTradeContractor;
    #DesignerArchitect;
    #Reseller;
    #Client;
  };

  // ── KPI metric primitives ──────────────────────────────────────────────────
  public type KpiTrend = { #up; #down; #flat };

  public type KpiCard = {
    displayLabel : Text;
    value        : Text;           // pre-formatted for display
    rawValue  : Int;            // numeric raw value for sorting/graphing
    unit      : ?Text;          // e.g. "$", "%", "days"
    trend     : KpiTrend;
    trendPct  : Int;            // signed basis-points change vs prior period
    source    : Text;           // engine name: "FIE", "VHDE", "PSIE", etc.
    timestamp : Int;
  };

  // ── Executive Summary ──────────────────────────────────────────────────────
  /// Top-level KPI card row shown to all roles (filtered by role).
  public type ExecutiveSummary = {
    tenantId        : Nat;
    role            : ViewRole;
    activeProjects  : Nat;
    safetyScore     : Nat;           // 0-100 composite from VHDE/ERAE/SCIE
    openHazards     : Nat;
    financialHealth : Nat;           // 0-100 composite from FIE
    totalContractValue : Int;        // cents
    retainageBalance   : Nat;        // cents
    pendingPayApps     : Nat;
    bidPipelineCount   : Nat;
    bidPipelineValue   : Int;        // cents
    documentsGenerated : Nat;
    complianceScore    : Nat;        // 0-100 composite from CPL
    openRfis           : Nat;
    openChangeOrders   : Nat;
    openSubmittals     : Nat;
    kpiCards           : [KpiCard];
    generatedAt        : Int;
  };

  // ── Project Pipeline Row ───────────────────────────────────────────────────
  public type ProjectPhase = {
    #programming;
    #schematicDesign;
    #designDevelopment;
    #constructionDocuments;
    #procurement;
    #constructionAdmin;
    #commissioning;
    #closeout;
  };

  public type ProjectPipelineRow = {
    projectId          : Text;
    projectName        : Text;
    clientName         : Text;
    phase              : ProjectPhase;
    phaseLabel         : Text;       // human-readable phase name
    budgetCents        : Nat;
    spentCents         : Nat;
    budgetVariancePct  : Int;        // signed basis points
    scheduleVarianceDays : Int;      // signed days vs baseline
    safetyScore        : Nat;        // 0-100
    openHazards        : Nat;
    openRfis           : Nat;
    openChangeOrders   : Nat;
    completionPct      : Nat;        // 0-100
    cpiScore           : Int;        // cost performance index × 100
    spiScore           : Int;        // schedule performance index × 100
    lastActivity       : Int;
    riskLevel          : Text;       // "low" | "medium" | "high" | "critical"
  };

  // ── Safety Metrics ─────────────────────────────────────────────────────────
  public type HazardHeatCell = {
    subpart      : Text;   // OSHA 1926 subpart code, e.g. "M"
    displayLabel : Text;   // e.g. "Fall Protection"
    openCount    : Nat;
    riskScore    : Nat;    // 0-100
  };

  public type SafetyMetrics = {
    tenantId            : Nat;
    overallScore        : Nat;          // 0-100
    trir                : Int;          // total recordable incident rate × 100
    dart                : Int;          // days away / restricted / transfer × 100
    openTags            : Nat;
    criticalTags        : Nat;
    overdueTagsPct      : Nat;          // basis points
    jsaCompliance       : Nat;          // basis points (e.g. 9500 = 95%)
    toolboxCompliance   : Nat;          // basis points
    incidentsYtd        : Nat;
    nearMissesYtd       : Nat;
    openOsha300Entries  : Nat;
    heatmap             : [HazardHeatCell];
    focusFourExposure   : [Text];       // active Focus Four hazard labels
    topCorrectiveActions: [Text];       // top 3 open corrective action descriptions
    nextJsaDueAt        : ?Int;
    generatedAt         : Int;
  };

  // ── Financial Metrics ──────────────────────────────────────────────────────
  public type CashFlowPoint = {
    periodLabel : Text;  // e.g. "Jun 2026"
    inflow      : Int;   // cents
    outflow     : Int;   // cents
    net         : Int;   // cents
  };

  public type FinancialMetrics = {
    tenantId             : Nat;
    totalContractValue   : Int;        // cents
    totalBilled          : Nat;        // cents — cumulative pay apps submitted
    totalReceived        : Nat;        // cents — cumulative payments received
    retainageBalance     : Nat;        // cents — held across all projects
    pendingPayApps       : Nat;
    pendingPayAppValue   : Int;        // cents
    approvedPayApps      : Nat;
    overduePayApps       : Nat;
    openChangeOrderValue : Int;        // cents — sum of pending COs
    openLienWaivers      : Nat;
    avgCpi               : Int;        // average CPI × 100 across active projects
    avgSpi               : Int;        // average SPI × 100
    contractRiskFlags    : [Text];     // top risk clauses detected by FIE
    cashFlow90Day        : [CashFlowPoint];
    generatedAt          : Int;
  };

  // ── Compliance & Governance Metrics ───────────────────────────────────────
  public type CplAuditEntry = {
    action    : Text;
    principal : Text;   // principal.toText()
    passed    : Bool;
    timestamp : Int;
  };

  public type ComplianceMetrics = {
    tenantId              : Nat;
    cplScore              : Nat;        // 0-100 overall CPL governance health
    openRfis              : Nat;
    overdueRfis           : Nat;
    openSubmittals        : Nat;
    overdueSubmittals     : Nat;
    pendingChangeOrders   : Nat;
    approvedChangeOrders  : Nat;
    openPunchItems        : Nat;
    closedPunchItems      : Nat;
    activeCertifications  : Nat;
    expiredCertifications : Nat;
    recentAuditEntries    : [CplAuditEntry];
    contractReviewStatus  : [Text];     // contract IDs currently flagged for review
    generatedAt           : Int;
  };

  // ── Anomaly Alert ─────────────────────────────────────────────────────────
  public type AlertSeverity = { #info; #warning; #critical; #emergencyAction };

  public type AnomalyAlert = {
    alertId     : Text;
    tenantId    : Nat;
    engine      : Text;             // "VHDE" | "FIE" | "PSIE" | "CPL" | "NEXUS" | etc.
    severity    : AlertSeverity;
    title       : Text;
    description : Text;
    projectId   : ?Text;
    resourceId  : ?Text;
    actionUrl   : ?Text;            // deep-link into the relevant suite hub
    acknowledged: Bool;
    timestamp   : Int;
  };

  // ── Activity Log Entry ─────────────────────────────────────────────────────
  public type ActivitySource = {
    #safety;
    #financials;
    #bidConnect;
    #workspace;
    #documents;
    #design;
    #compliance;
    #tenant;
    #platform;
  };

  public type ActivityLogEntry = {
    entryId     : Text;
    tenantId    : Nat;
    source      : ActivitySource;
    actorName   : Text;             // principal.toText() or display name
    action      : Text;             // e.g. "Generated JSA for Structural Steel"
    projectId   : ?Text;
    resourceId  : ?Text;
    resourceLabel : ?Text;
    nexusScore  : ?Nat;             // Nexus synthesis score attached to this event (0-100)
    timestamp   : Int;
  };

  // ── Aggregate Command Center Payload ─────────────────────────────────────
  /// Full mission-control snapshot returned by getCommandCenterData.
  public type CommandCenterData = {
    tenantId    : Nat;
    role        : ViewRole;
    summary     : ExecutiveSummary;
    pipeline    : [ProjectPipelineRow];
    safety      : SafetyMetrics;
    financial   : FinancialMetrics;
    compliance  : ComplianceMetrics;
    alerts      : [AnomalyAlert];
    activity    : [ActivityLogEntry];
    generatedAt : Int;
  };

}

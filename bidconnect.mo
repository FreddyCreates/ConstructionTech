// types/project.mo — Project Intelligence Domain Types
// BuildSafe Project Intelligence Suite: cost estimation, schedule prediction,
// scope analysis, budget tracking, CPM, change orders, RFIs, evidence alignment.
import Time "mo:core/Time";

module {

  // ─── Identity ────────────────────────────────────────────────────────────
  public type TenantId = Nat;
  public type ProjectId = Text;
  public type ActivityId = Text;
  public type ChangeOrderId = Text;
  public type RFIId = Text;

  // ─── Cost Estimation ─────────────────────────────────────────────────────

  /// CSI MasterFormat line item with quantity take-off + unit cost
  public type CsiLineItem = {
    csiCode       : Text;    // e.g. "03 30 00"
    description   : Text;
    division      : Nat;     // 1–49
    quantity      : Float;
    unit          : Text;    // sqft, each, linear ft, ton, etc.
    unitLaborCost : Float;   // USD per unit (Davis-Bacon prevailing wage)
    unitMaterial  : Float;   // USD per unit material
    laborHours    : Float;   // total labor hours for this item
    totalCost     : Float;   // quantity * (unitLaborCost + unitMaterial)
    regionalFactor: Float;   // regional multiplier applied
    tradeType     : Text;
  };

  public type CostEstimate = {
    id             : Text;
    tenantId       : TenantId;
    projectId      : ProjectId;
    projectType    : Text;   // "Healthcare" | "Civil" | "Stadium" | "Commercial" | ...
    state          : Text;   // US state for prevailing wage zone
    lineItems      : [CsiLineItem];
    totalLaborCost : Float;
    totalMaterialCost : Float;
    generalConditionsPct : Float;  // % of direct cost
    overheadProfitPct : Float;
    contingencyPct : Float;
    estimatedTotal : Float;
    escalationIndex : Float;  // material escalation factor
    createdAt      : Int;
    updatedAt      : Int;
  };

  // ─── Schedule Prediction ─────────────────────────────────────────────────

  public type ActivityStatus = {
    #notStarted;
    #inProgress;
    #complete;
    #delayed;
    #blocked;
  };

  public type ScheduleActivity = {
    id              : ActivityId;
    tenantId        : TenantId;
    projectId       : ProjectId;
    csiCode         : Text;
    description     : Text;
    trade           : Text;
    plannedStartDate : Int;   // nanoseconds epoch
    plannedEndDate   : Int;
    actualStartDate  : ?Int;
    actualEndDate    : ?Int;
    durationDays     : Nat;
    crewSize         : Nat;
    productivityRate : Float;  // units/crew-day benchmark
    quantity         : Float;
    unit             : Text;
    predecessors     : [ActivityId];
    successors       : [ActivityId];
    floatDays        : Int;    // total float; negative = behind critical path
    isCriticalPath   : Bool;
    status           : ActivityStatus;
    learningCurveAdj : Float;  // 0.85 typical for repetitive tasks
    percentComplete  : Nat;    // 0–100
  };

  public type SchedulePrediction = {
    projectId          : ProjectId;
    tenantId           : TenantId;
    baselineDays       : Nat;
    predictedDays      : Nat;
    confidenceScore    : Nat;  // 0–100
    criticalPathActivities : [ActivityId];
    slackAlerts        : [Text];   // activities with float < 3 days
    resourceConflicts  : [Text];
    productivityDelta  : Float;   // actual vs benchmark %
    createdAt          : Int;
  };

  // ─── Budget Tracking / EAC ───────────────────────────────────────────────

  public type BudgetLineItem = {
    csiCode          : Text;
    description      : Text;
    originalBudget   : Float;
    approvedCOs      : Float;   // approved change order sum
    revisedBudget    : Float;   // originalBudget + approvedCOs
    actualCostToDate : Float;
    committedCost    : Float;   // POs + subcontracts
    eacCost          : Float;   // Estimate at Completion
    etcCost          : Float;   // Estimate to Complete
    variancePct      : Float;   // (eac - revisedBudget) / revisedBudget * 100
    percentComplete  : Nat;
  };

  public type EacModel = {
    id               : Text;
    tenantId         : TenantId;
    projectId        : ProjectId;
    contractValue    : Float;
    approvedCOs      : Float;
    revisedContract  : Float;
    actualCostToDate : Float;
    eac              : Float;
    etc              : Float;
    cpi              : Float;   // Cost Performance Index = earned / actual
    spi              : Float;   // Schedule Performance Index
    variance         : Float;   // revisedContract - eac
    riskFlags        : [Text];
    lineItems        : [BudgetLineItem];
    calculatedAt     : Int;
    trend            : Text;    // "overBudget" | "onBudget" | "underBudget"
  };

  // ─── Change Orders ───────────────────────────────────────────────────────

  public type ChangeOrderStatus = {
    #draft;
    #submitted;
    #pendingOwner;
    #approved;
    #rejected;
    #void;
  };

  public type ChangeOrderItem = {
    description  : Text;
    csiCode      : Text;
    laborCost    : Float;
    materialCost : Float;
    equipmentCost: Float;
    markup       : Float;   // overhead + profit %
    totalCost    : Float;
    scheduleDays : Int;     // positive = extension, negative = compression
  };

  public type ChangeOrder = {
    id              : ChangeOrderId;
    tenantId        : TenantId;
    projectId       : ProjectId;
    coNumber        : Nat;
    title           : Text;
    description     : Text;
    reason          : Text;   // "Owner Request" | "Differing Conditions" | "Design Error" | ...
    items           : [ChangeOrderItem];
    totalCost       : Float;
    scheduleDays    : Int;
    status          : ChangeOrderStatus;
    submittedBy     : Text;
    submittedAt     : Int;
    approvedBy      : ?Text;
    approvedAt      : ?Int;
    scopeDelta      : Text;   // AI-detected scope change description
    riskScore       : Nat;    // 0–100
    linkedRFIs      : [RFIId];
    createdAt       : Int;
    updatedAt       : Int;
  };

  // ─── RFI Management ──────────────────────────────────────────────────────

  public type RFIStatus = {
    #open;
    #submitted;
    #answered;
    #closed;
    #void;
  };

  public type RFI = {
    id              : RFIId;
    tenantId        : TenantId;
    projectId       : ProjectId;
    rfiNumber       : Nat;
    subject         : Text;
    description     : Text;
    submittedBy     : Text;
    assignedTo      : Text;
    status          : RFIStatus;
    priority        : Text;   // "low" | "medium" | "high" | "critical"
    questionDate    : Int;
    responseRequired: Int;    // deadline
    responseDate    : ?Int;
    response        : Text;
    linkedCOs       : [ChangeOrderId];
    linkedActivities: [ActivityId];
    scheduleImpact  : Bool;
    costImpact      : Bool;
    impactDescription : Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  // ─── Scope Analysis ──────────────────────────────────────────────────────

  public type ScopeSection = {
    csiDivision  : Nat;
    divisionName : Text;
    items        : [CsiLineItem];
    subtotal     : Float;
    percentOfTotal : Float;
  };

  public type ScopeAnalysis = {
    id           : Text;
    tenantId     : TenantId;
    projectId    : ProjectId;
    projectType  : Text;
    sections     : [ScopeSection];
    totalEstimate: Float;
    gapItems     : [Text];   // items missing vs CSI standard for project type
    alignmentScore : Nat;    // 0–100 EvidenceEngine alignment
    recommendations : [Text];
    createdAt    : Int;
  };

  // ─── Project Record ──────────────────────────────────────────────────────

  public type ProjectPhase = {
    #preconstruction;
    #bidding;
    #construction;
    #closeout;
    #warranty;
  };

  public type ProjectRecord = {
    id             : ProjectId;
    tenantId       : TenantId;
    name           : Text;
    projectType    : Text;
    state          : Text;
    city           : Text;
    contractValue  : Float;
    startDate      : Int;
    targetEndDate  : Int;
    currentPhase   : ProjectPhase;
    gcCompany      : Text;
    ownerName      : Text;
    architectName  : Text;
    createdAt      : Int;
    updatedAt      : Int;
  };

  // ─── Project Intelligence Work Result ───────────────────────────────────

  public type PIResult = {
    #estimate(CostEstimate);
    #schedule(SchedulePrediction);
    #eac(EacModel);
    #changeOrder(ChangeOrder);
    #rfi(RFI);
    #scopeAnalysis(ScopeAnalysis);
  };

  public type PIWorkResult = {
    id            : Text;
    tenantId      : TenantId;
    projectId     : ProjectId;
    result        : PIResult;
    cplAuditToken : Text;
    createdAt     : Int;
  };

  // ─── State ───────────────────────────────────────────────────────────────

  public type PIState = {
    projects      : Map_PIProjectMap;
    estimates     : List_PIEstimateList;
    activities    : List_PIActivityList;
    changeOrders  : List_PIChangeOrderList;
    rfis          : List_PIRFIList;
    workResults   : List_PIWorkResultList;
    counters      : PICounters;
  };

  // opaque aliases required so List/Map work correctly in module scope
  public type Map_PIProjectMap     = ?Nat; // placeholder resolved in lib
  public type List_PIEstimateList  = ?Nat;
  public type List_PIActivityList  = ?Nat;
  public type List_PIChangeOrderList = ?Nat;
  public type List_PIRFIList       = ?Nat;
  public type List_PIWorkResultList = ?Nat;

  public type PICounters = {
    var nextEstimateId : Nat;
    var nextActivityId : Nat;
    var nextCONumber   : Nat;
    var nextRFINumber  : Nat;
  };
}

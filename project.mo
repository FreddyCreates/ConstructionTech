// FIE — Fiscus Intelligentia Engine Types
// Financial Intelligence Engine: AIA pay apps, lien waivers, cash flow, EAC, contract risk
module {

  // ─── Schedule of Values ────────────────────────────────────────────────────
  public type SovLineItem = {
    itemNo       : Text;
    description  : Text;
    scheduledValue : Nat;        // in cents
    workCompleted  : Nat;        // cumulative, in cents
    storedMaterials: Nat;        // in cents
    retainageRate  : Nat;        // basis points (e.g. 1000 = 10%)
  };

  public type ScheduleOfValues = {
    projectId    : Text;
    tenantId     : Nat;
    contractAmount : Nat;        // in cents
    items        : [SovLineItem];
    createdAt    : Int;
    updatedAt    : Int;
  };

  // ─── AIA G702/G703 Pay Application ────────────────────────────────────────
  public type PayAppStatus = {
    #draft;
    #submitted;
    #approved;
    #rejected;
    #paid;
  };

  public type PayApplication = {
    payAppNo       : Nat;
    projectId      : Text;
    tenantId       : Nat;
    applicationDate: Int;
    periodThrough  : Int;
    architect      : Text;
    owner          : Text;
    contractor     : Text;
    contractNo     : Text;
    contractDate   : Int;
    originalContractSum : Nat;    // cents
    netChangeByChangeOrders : Int; // cents, can be negative
    contractSumToDate : Nat;       // cents
    totalCompleted   : Nat;        // cents
    retainageHeld    : Nat;        // cents
    lessRetainagePrevious : Nat;
    totalEarned      : Nat;        // cents
    lessPreviousCertifications : Nat;
    currentPaymentDue : Nat;       // cents
    balanceToFinish  : Int;        // cents, can be negative
    sov              : ScheduleOfValues;
    status           : PayAppStatus;
    nexusScore       : Nat;        // 0-100
    riskFlags        : [Text];
    createdAt        : Int;
  };

  // ─── Lien Waivers ─────────────────────────────────────────────────────────
  public type LienWaiverType = {
    #conditionalPartial;
    #unconditionalPartial;
    #conditionalFinal;
    #unconditionalFinal;
  };

  public type LienWaiverTier = {
    #gc;
    #sub;
    #supplier;
  };

  public type LienWaiver = {
    waiverId     : Text;
    projectId    : Text;
    tenantId     : Nat;
    waiverType   : LienWaiverType;
    tier         : LienWaiverTier;
    claimantName : Text;
    customerName : Text;
    jobLocation  : Text;
    throughDate  : Int;
    paymentAmount: Nat;           // cents
    conditionText: ?Text;         // for conditional waivers
    signedBy     : ?Text;
    signedAt     : ?Int;
    state        : Text;          // 2-letter state code for state-specific language
    createdAt    : Int;
  };

  // ─── Cash Flow Projection ─────────────────────────────────────────────────
  public type CashFlowEntry = {
    periodStart  : Int;
    periodEnd    : Int;
    projectedInflow : Nat;        // cents — expected from owner pay apps
    projectedOutflow : Nat;       // cents — subs + suppliers + labor
    retainageExpected : Nat;      // cents — retainage release this period
    netCashFlow  : Int;           // cents — inflow - outflow
    cumulativeCash : Int;         // cents — running total
  };

  public type CashFlowProjection = {
    projectId    : Text;
    tenantId     : Nat;
    generatedAt  : Int;
    projectionDays : Nat;         // 30, 60, or 90
    entries      : [CashFlowEntry];
    peakNegative : Int;           // worst cash position (cents)
    breakEvenDay : ?Nat;          // days to positive cumulative cash
    nexusInsight : Text;
    riskLevel    : Text;          // "low" | "medium" | "high" | "critical"
  };

  // ─── EAC — Estimate at Completion ─────────────────────────────────────────
  public type EacModel = {
    projectId        : Text;
    tenantId         : Nat;
    originalBudget   : Nat;       // cents
    actualCostToDate : Nat;       // cents
    percentComplete  : Nat;       // basis points (0-10000)
    earnedValue      : Nat;       // cents
    plannedValue     : Nat;       // cents
    costVariance     : Int;       // cents — EV - AC
    scheduleVariance : Int;       // cents — EV - PV
    cpi              : Nat;       // Cost Performance Index × 1000 (e.g. 950 = 0.950)
    spi              : Nat;       // Schedule Performance Index × 1000
    eacAtCompletion  : Nat;       // cents — projected final cost
    varianceAtCompletion : Int;   // cents — Budget - EAC
    toCompletePI     : Nat;       // TCPI × 1000 — needed CPI to hit budget
    nexusInsight     : Text;
    generatedAt      : Int;
  };

  // ─── Contract Risk Detection ──────────────────────────────────────────────
  public type RiskSeverity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  public type ContractRiskClause = {
    clauseId     : Text;
    category     : Text;  // "indemnification" | "liquidated_damages" | "change_order" | "warranty" | "dispute" | "termination"
    severity     : RiskSeverity;
    title        : Text;
    description  : Text;
    recommendation : Text;
    oshaRef      : ?Text;
    aiaRef       : ?Text;
    csiRef       : ?Text;
  };

  public type ContractRiskReport = {
    reportId     : Text;
    projectId    : Text;
    tenantId     : Nat;
    contractType : Text;  // "subcontract" | "prime" | "owner-gc"
    riskClauses  : [ContractRiskClause];
    overallRisk  : RiskSeverity;
    overallScore : Nat;    // 0-100 (higher = riskier)
    nexusInsight : Text;
    generatedAt  : Int;
  };

  // ─── Change Order Workflow ──────────────────────────────────────────────
  public type ChangeOrderStatus = {
    #draft;
    #submitted;
    #underReview;
    #approved;
    #rejected;
    #void;
  };

  public type ChangeOrderType = {
    #cor;   // Change Order Request
    #cop;   // Change Order Proposal
    #g701;  // AIA G701 Change Order (executed)
    #g714;  // AIA G714 Construction Change Directive (unilateral)
    #tm;    // Time & Material tag
  };

  public type ChangeOrderImpact = {
    costImpact     : Int;    // cents, positive = increase, negative = credit
    daysImpact     : Int;    // calendar days to substantial completion
    scheduledValue : Nat;    // cents — line item value added to SOV
    affectedCsiDiv : Text;   // CSI MasterFormat division reference (e.g. "09 29 00")
  };

  public type TmEntry = {
    date        : Int;
    craftType   : Text;    // e.g. "Ironworker", "Electrician", "Laborer"
    workers     : Nat;
    hoursWorked : Nat;     // in tenths (e.g. 80 = 8.0 hours)
    ratePerHour : Nat;     // cents
    materials   : Nat;     // cents
    equipment   : Nat;     // cents
    description : Text;
  };

  public type ChangeOrder = {
    changeOrderId  : Text;
    projectId      : Text;
    tenantId       : Nat;
    coNumber       : Nat;
    coType         : ChangeOrderType;
    status         : ChangeOrderStatus;
    description    : Text;
    reason         : Text;  // "Owner-directed" | "Differing site conditions" | "Design error" | "Scope gap"
    initiatedBy    : Text;  // "Owner" | "Architect" | "GC" | "Sub"
    impact         : ChangeOrderImpact;
    tmEntries      : [TmEntry];  // populated for #tm type
    totalTmCost    : Nat;        // cents — computed from tmEntries
    aiaRef         : Text;       // "G701" | "G714" | "COR"
    contractNo     : Text;
    architect      : Text;
    owner          : Text;
    contractor     : Text;
    submittedAt    : ?Int;
    approvedAt     : ?Int;
    nexusScore     : Nat;  // 0-100 — risk score
    riskFlags      : [Text];
    createdAt      : Int;
  };

  // ─── Retainage Release ────────────────────────────────────────────────────
  public type RetainageReleaseTrigger = {
    #percentComplete : Nat;    // basis points — e.g. 5000 = 50%
    #substantialCompletion;
    #finalCompletion;
    #customMilestone : Text;
  };

  public type RetainageReleaseSchedule = {
    projectId      : Text;
    tenantId       : Nat;
    contractAmount : Nat;        // cents
    retainageRate  : Nat;        // initial basis points (e.g. 1000 = 10%)
    reducedRate    : ?Nat;       // reduced rate after trigger (e.g. 500 = 5%)
    triggers       : [RetainageReleaseTrigger];
    heldToDate     : Nat;        // cents accumulated
    releasedToDate : Nat;        // cents released
    netHeld        : Nat;        // cents currently withheld
    releases       : [RetainageReleaseEvent];
    createdAt      : Int;
    updatedAt      : Int;
  };

  public type RetainageReleaseEvent = {
    releaseId    : Text;
    trigger      : RetainageReleaseTrigger;
    releasedAt   : Int;
    amountReleased : Nat;        // cents
    percentCompleteAtRelease : Nat;  // basis points
    approvedBy   : ?Text;
    payAppNo     : ?Nat;         // associated pay app if applicable
  };

  // ─── Job Cost Ledger ──────────────────────────────────────────────────────
  public type CostCategory = {
    #material;
    #labor;
    #equipment;
    #subcontract;
    #generalConditions;
    #overhead;
    #contingency;
  };

  public type CostCode = {
    code        : Text;    // CSI MasterFormat e.g. "03 30 00"
    description : Text;
    division    : Text;    // e.g. "Division 03 — Concrete"
    category    : CostCategory;
  };

  public type JobCostEntry = {
    entryId     : Text;
    projectId   : Text;
    tenantId    : Nat;
    costCode    : CostCode;
    description : Text;
    budgeted    : Nat;     // cents
    committed   : Nat;     // cents — signed subcontracts/POs
    actualCost  : Nat;     // cents — invoiced/paid
    projectedFinal : Nat;  // cents — best estimate to complete
    variance    : Int;     // cents — budgeted - projectedFinal
    percentSpent : Nat;    // basis points
    vendor      : ?Text;
    invoiceRef  : ?Text;
    poRef       : ?Text;
    enteredAt   : Int;
    updatedAt   : Int;
  };

  public type JobCostLedger = {
    ledgerId    : Text;
    projectId   : Text;
    tenantId    : Nat;
    projectName : Text;
    totalBudget : Nat;     // cents
    totalCommitted : Nat;  // cents
    totalActual : Nat;     // cents
    totalProjectedFinal : Nat; // cents
    totalVariance : Int;   // cents
    percentSpent  : Nat;   // basis points
    entries     : [JobCostEntry];
    byCategory  : [CategorySummary];
    byCostCode  : [CostCodeSummary];
    nexusInsight : Text;
    generatedAt : Int;
  };

  public type CategorySummary = {
    category    : CostCategory;
    budgeted    : Nat;
    committed   : Nat;
    actualCost  : Nat;
    projectedFinal : Nat;
    variance    : Int;
  };

  public type CostCodeSummary = {
    costCode    : CostCode;
    budgeted    : Nat;
    committed   : Nat;
    actualCost  : Nat;
    projectedFinal : Nat;
    variance    : Int;
    percentSpent : Nat;
  };

  // ─── Subcontractor Pay App Consolidation ─────────────────────────────────
  public type SubPayApplication = {
    subPayAppId   : Text;
    projectId     : Text;
    tenantId      : Nat;
    subName       : Text;
    subContract   : Text;   // subcontract number
    subAmount     : Nat;    // total subcontract value, cents
    periodThrough : Int;
    completedToDate : Nat;  // cents
    retainageHeld   : Nat;  // cents
    netPaymentDue   : Nat;  // cents
    lienWaiverReceived : Bool;
    lienWaiverType  : ?LienWaiverType;
    invoiceNo     : Text;
    invoiceDate   : Int;
    csiDivisions  : [Text];  // e.g. ["03 30 00", "09 29 00"]
    status        : PayAppStatus;
    createdAt     : Int;
  };

  public type ConsolidatedPrimeApplication = {
    primeAppId    : Text;
    projectId     : Text;
    tenantId      : Nat;
    primePayAppNo : Nat;
    periodThrough : Int;
    subApplications : [SubPayApplication];
    totalSubAmount    : Nat;   // cents — sum of all sub net amounts
    totalSubRetainage : Nat;   // cents — sum of all sub retainage
    gcSelfPerformAmount : Nat; // cents — GC's own work
    gcRetainage       : Nat;   // cents
    totalApplicationAmount : Nat;  // cents — total to owner
    totalRetainageHeld     : Nat;  // cents — all retainage
    currentPaymentDue      : Nat;  // cents
    lienWaiverChecklist : [LienWaiverCheckItem];
    allLienWaiversReceived : Bool;
    blockedSubCount   : Nat;   // subs with missing lien waivers
    nexusInsight      : Text;
    generatedAt       : Int;
  };

  public type LienWaiverCheckItem = {
    party       : Text;   // sub name or "GC"
    tier        : LienWaiverTier;
    required    : LienWaiverType;
    received    : Bool;
    waiverId    : ?Text;
    amount      : Nat;    // cents
    blocksPrime : Bool;   // if missing, blocks prime submission
  };

  // ─── Evidence Engine Integration ─────────────────────────────────────────
  public type EvidenceAlignmentScore = {
    scoreId       : Text;
    projectId     : Text;
    tenantId      : Nat;
    subject       : Text;    // what was scored ("PayApp-5", "Contract-Risk", etc.)
    alignmentScore : Nat;    // 0-100 — how well financial data aligns with evidence
    evidenceItems : [EvidenceItem];
    discrepancies : [Text];  // flagged mismatches
    auditTrail    : Text;    // CPL-encoded audit reference
    scoredAt      : Int;
  };

  public type EvidenceItem = {
    itemId      : Text;
    category    : Text;  // "pay_app" | "lien_waiver" | "change_order" | "invoice" | "daily_log"
    description : Text;
    sourceRef   : Text;  // document reference
    alignedTo   : Text;  // what SOV/cost code this aligns to
    verified    : Bool;
    verifiedAt  : ?Int;
    verifiedBy  : ?Text;
  };

  // ─── FIE Result (BHX pheromone payload) ──────────────────────────────────
  public type FIEResult = {
    #payApp          : PayApplication;
    #lienWaiver      : LienWaiver;
    #cashFlow        : CashFlowProjection;
    #eac             : EacModel;
    #contractRisk    : ContractRiskReport;
    #changeOrder     : ChangeOrder;
    #jobCostLedger   : JobCostLedger;
    #consolidatedApp : ConsolidatedPrimeApplication;
    #retainageSchedule : RetainageReleaseSchedule;
    #evidenceScore   : EvidenceAlignmentScore;
  };

  // PerceptionOutput type matching perception.mo — used for real Nexus feeds
  public type FIEPerceptionFinding = {
    findingId   : Text;
    category    : Text;
    severity    : Nat;
    description : Text;
    sourceData  : Text;
    confidence  : Nat;
  };

  public type FIEAnomalyFlag = {
    flagId            : Text;
    perceptionType    : Text;
    severity          : Nat;
    description       : Text;
    recommendedAction : Text;
  };

  public type FIEPerceptionOutput = {
    engineId        : Text;
    perceptionType  : Text;
    findings        : [FIEPerceptionFinding];
    riskScore       : Nat;
    confidenceScore : Nat;
    anomalyFlags    : [FIEAnomalyFlag];
    recommendations : [Text];
  };

  public type FIEWorkResult = {
    resultId   : Text;
    tenantId   : Nat;
    projectId  : Text;
    result     : FIEResult;
    perception : FIEPerceptionOutput;   // real typed PerceptionOutput-compatible record
    cplAudit   : Text;
    createdAt  : Int;
  };
};

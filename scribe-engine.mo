// PROTOCOLS — OIS Platform Construction Industry Protocol Types
// AIA contract document families, CSI MasterFormat 2026 (50 divisions),
// National CAD Standard (NCS), and Project Lifecycle Phases.
// All data sourced from published industry standards.
module {

  // ── CPL — Code-Physics-Law Governance Protocol ─────────────────────────────

  public type CPLGovernanceRule = {
    ruleId      : Nat;
    lawName     : Text;
    category    : Text;   // "governance" | "write" | "read" | "admin"
    description : Text;
    enforcement : Text;
    sealed      : Bool;
  };

  public type CPLValidationResult = {
    passed    : Bool;
    ruleId    : Nat;
    reason    : Text;
    timestamp : Int;
  };

  public type CPLAuditEntry = {
    entryId   : Nat;
    tenantId  : Text;
    caller    : Text;
    action    : Text;
    objectId  : Text;
    change    : Text;
    timestamp : Int;
    lawsChecked : [Nat];
  };

  // ── BHX — Beehive Execution Protocol ────────────────────────────────────────

  public type BHXCaste = {
    #Queen;    // governance — orchestrates colony
    #Worker;   // task execution — lifecycle roles
    #Drone;    // anomaly detection — sentinel
  };

  public type BHXWorkerRole = {
    #JSAGenerator;
    #PayAppProcessor;
    #SafetyAnalyzer;
    #DocumentComposer;
    #CostEstimator;
    #BidScorer;
    #ComplianceAuditor;
  };

  public type BHXWorkerTask = {
    taskId     : Text;
    tenantId   : Text;
    caste      : BHXCaste;
    role       : BHXWorkerRole;
    payload    : [(Text, Text)];  // key-value params
    status     : Text;  // "queued" | "running" | "complete" | "failed"
    createdAt  : Int;
    completedAt : ?Int;
    result     : ?Text;
  };

  public type BHXPheromoneSignal = {
    signalId  : Text;
    source    : Text;   // engine name
    target    : Text;   // "all" | engine name
    strength  : Float;  // 0.0-1.0 signal intensity
    payload   : Text;   // JSON-encoded signal data
    emittedAt : Int;
  };

  // ── Nexus — 7-Engine Aggregation Protocol ───────────────────────────────────

  public type NexusEngineWeight = {
    engineId : Text;   // "VHDE" | "SIE" | "ERAE" | "SCIE" | "FIE" | "PSIE" | "DGE"
    weight   : Float;  // normalized 0.0-1.0; all weights must sum to 1.0
  };

  public type NexusPerceptionScore = {
    dimension  : Text;   // "cost" | "safety" | "schedule" | "compliance" | "labor" | "design" | "financial"
    score      : Float;  // 0-100
    confidence : Float;  // CPL confidence 0.0-1.0
    magnitude  : Float;  // data weight
    sources    : [Text]; // engine IDs that contributed
  };

  public type NexusSynthesisResult = {
    synthesisId      : Text;
    tenantId         : Text;
    projectId        : Text;
    overallScore     : Float;
    riskLevel        : Text;  // "Low" | "Moderate" | "High" | "Critical"
    perceptionScores : [NexusPerceptionScore];
    engineWeights    : [NexusEngineWeight];
    anomaliesDetected : Nat;
    recommendations  : [Text];
    synthesizedAt    : Int;
  };

  // ── VHDE — Hazard Detection Protocol ────────────────────────────────────────

  public type VHDEHazardCategory = {
    #Fall;         // 1926.502 family
    #Electrical;   // 1926.416/417
    #StrikenBy;    // 1926.1424
    #CaughtIn;     // 1926.852 (excavation/equipment)
    #Chemical;     // HazCom / silica
    #Fire;         // 1926.352
    #ConfinedSpace; // 1926.1203
    #Ergonomic;
    #Other;
  };

  public type VHDEHazardSignature = {
    signatureId   : Text;
    category      : VHDEHazardCategory;
    oshaRef       : Text;
    keywords      : [Text];   // spectral pattern tokens
    severity      : Text;     // "Critical" | "High" | "Moderate" | "Low"
    stopWorkFlag  : Bool;
    controlSteps  : [Text];
  };

  public type VHDEDetectionResult = {
    resultId         : Text;
    tenantId         : Text;
    inputText        : Text;
    signaturesMatched : [VHDEHazardSignature];
    overallSeverity  : Text;
    stopWorkRequired : Bool;
    confidence       : Float;
    detectedAt       : Int;
  };

  // ── SIE — Session Intelligence Protocol ─────────────────────────────────────

  public type SIESessionType = {
    #ToolboxTalk;
    #PreTaskBriefing;
    #SafetyMeeting;
    #Orientation;
    #IncidentReview;
  };

  public type SIEOSHATopic = {
    topicId     : Text;
    title       : Text;
    oshaRef     : Text;
    subpart     : Text;   // OSHA 1926 subpart letter
    mandatory   : Bool;   // required on every job
  };

  public type SIEAnalysisResult = {
    sessionId         : Text;
    sessionType       : SIESessionType;
    topicsCovered     : [SIEOSHATopic];
    complianceScore   : Float;  // 0-100
    missingTopics     : [Text];
    attendanceCount   : Nat;
    certificateIssued : Bool;
    analysedAt        : Int;
  };

  // ── ERAE — Enterprise Risk Aggregation Protocol ──────────────────────────────

  public type ERAERiskCategory = {
    #Safety;
    #Financial;
    #Schedule;
    #Compliance;
    #Procurement;
    #Labor;
    #Design;
  };

  public type ERAERiskRecord = {
    riskId      : Text;
    tenantId    : Text;
    category    : ERAERiskCategory;
    description : Text;
    probability : Float;  // 0.0-1.0
    impact      : Float;  // 0.0-10.0
    riskScore   : Float;  // probability * impact
    mitigation  : Text;
    status      : Text;   // "open" | "mitigated" | "accepted" | "closed"
    createdAt   : Int;
  };

  public type ERAEPortfolioSummary = {
    tenantId           : Text;
    totalRisks         : Nat;
    openCritical       : Nat;
    weightedRiskScore  : Float;
    topRiskCategories  : [Text];
    trendDirection     : Text;  // "improving" | "stable" | "worsening"
    aggregatedAt       : Int;
  };

  // ── SCIE — Safety Culture Protocol ──────────────────────────────────────────

  public type SCIELeadingIndicator = {
    indicatorId : Text;
    name        : Text;
    value       : Float;
    target      : Float;
    trend       : Text;   // "up" | "down" | "stable"
    period      : Text;   // "daily" | "weekly" | "monthly"
  };

  public type SCIECultureScore = {
    tenantId         : Text;
    projectId        : Text;
    scewScore        : Float;   // Safety Culture Engagement Watch
    suluScore        : Float;   // Safety Understands Leadership Understands
    leadingIndicators : [SCIELeadingIndicator];
    predictedTrir    : Float;   // predicted Total Recordable Incident Rate
    cultureLevel     : Text;    // "Exemplary" | "Active" | "Developing" | "Reactive"
    scoredAt         : Int;
  };

  // ── FIE — Financial Intelligence Protocol ───────────────────────────────────

  public type FIEPayAppStatus = {
    #Draft;
    #Submitted;
    #UnderReview;
    #Approved;
    #Paid;
    #Disputed;
  };

  public type FIELineItem = {
    itemNo           : Nat;
    description      : Text;
    scheduledValue   : Float;
    previouslyBilled : Float;
    thisPeriod       : Float;
    storedMaterials  : Float;
    totalToDate      : Float;
    percentComplete  : Float;
    retainage        : Float;
  };

  public type FIEPayAppRecord = {
    payAppId         : Text;
    tenantId         : Text;
    projectId        : Text;
    applicationNo    : Nat;
    status           : FIEPayAppStatus;
    contractSum      : Float;
    totalEarned      : Float;
    retainageAmount  : Float;
    currentDue       : Float;
    lineItems        : [FIELineItem];
    aiaForm          : Text;   // "G702" | "G703"
    submittedAt      : ?Int;
    paidAt           : ?Int;
  };

  // ── PSIE — Procurement Protocol ──────────────────────────────────────────────

  public type PSIESupplierTier = {
    #PreferredVendor;   // highest score, fastest delivery, best price
    #Approved;          // meets all baseline requirements
    #Conditional;       // meets requirements with conditions
    #NotQualified;
  };

  public type PSIESupplierScore = {
    supplierId      : Text;
    supplierName    : Text;
    tier            : PSIESupplierTier;
    qualityScore    : Float;   // 0-100
    deliveryScore   : Float;
    priceScore      : Float;
    complianceScore : Float;
    overallScore    : Float;
    leadTimeDays    : Nat;
    scoredAt        : Int;
  };

  public type PSIERFQRecord = {
    rfqId         : Text;
    tenantId      : Text;
    projectId     : Text;
    csiDivision   : Text;
    description   : Text;
    dueDate       : Int;
    invitedCount  : Nat;
    responsesCount : Nat;
    status        : Text;  // "draft" | "sent" | "closed" | "awarded"
    createdAt     : Int;
  };

  // ── DGE — Document Generation Protocol ──────────────────────────────────────

  public type DGETemplateCategory = {
    #AIA;          // G702, G703, G701, G714, G704, G716, A305, A310
    #CSI;          // MasterFormat standard forms
    #OSHA;         // OSHA 300/300A/301, Written Safety Programs
    #Healthcare;   // healthcare-specific forms
    #Business;     // business letters, proposals, presentations
    #Construction; // RFIs, submittals, daily logs, closeout
  };

  public type DGETemplate = {
    templateId    : Text;
    name          : Text;
    category      : DGETemplateCategory;
    description   : Text;
    pageCount     : Nat;   // typical page count 1-35+
    autoFillFields : [Text]; // fields auto-filled from project data
    outputFormats : [Text]; // "PDF" | "XLSX" | "DOCX"
  };

  public type DGEGenerationRequest = {
    templateId : Text;
    tenantId   : Text;
    projectId  : Text;
    fieldData  : [(Text, Text)]; // field overrides
    outputFormat : Text;
  };

  // ── COMPE — Compliance Protocol ──────────────────────────────────────────────

  public type COMPERegulation = {
    regulationId : Text;
    title        : Text;
    authority    : Text;   // "OSHA" | "AIA" | "CSI" | "State" | "Local"
    reference    : Text;   // e.g. "29 CFR 1926.502"
    description  : Text;
    applicability : [Text]; // trade/work types this applies to
  };

  public type COMPECheckResult = {
    checkId      : Text;
    tenantId     : Text;
    projectId    : Text;
    regulationId : Text;
    compliant    : Bool;
    findings     : [Text];
    corrective   : [Text];  // corrective actions
    checkedAt    : Int;
  };

  // ── CPE — Cost Perception Protocol ───────────────────────────────────────────

  public type CPEBenchmark = {
    projectType   : Text;   // "office" | "multifamily" | "healthcare" | "industrial"
    region        : Text;
    costPerSF     : Float;  // $ per square foot
    laborPct      : Float;  // labor as % of total
    materialPct   : Float;  // material as % of total
    contingencyPct : Float;
    dataSource    : Text;   // "Davis-Bacon" | "RSMeans" | "JE Dunn Historical"
    year          : Nat;
  };

  public type CPEEstimateResult = {
    estimateId   : Text;
    tenantId     : Text;
    totalCost    : Float;
    laborCost    : Float;
    materialCost : Float;
    contingency  : Float;
    benchmarkRsf : Float;
    confidence   : Float;
    generatedAt  : Int;
  };

  // ── SCPE — Schedule Perception Protocol ──────────────────────────────────────

  public type SCPEScheduleHealth = {
    #OnTrack;
    #AtRisk;
    #Behind;
    #Critical;
  };

  public type SCPEActivityMetrics = {
    activityId      : Text;
    description     : Text;
    plannedStart    : Int;
    plannedFinish   : Int;
    actualStart     : ?Int;
    actualFinish    : ?Int;
    percentComplete : Float;
    float_          : Int;   // schedule float in days
    health          : SCPEScheduleHealth;
  };

  public type SCPEForecast = {
    tenantId         : Text;
    projectId        : Text;
    healthScore      : Float;   // 0-100
    spi              : Float;   // Schedule Performance Index
    predictedFinish  : Int;     // predicted completion timestamp
    criticalPathLength : Nat;   // critical path activity count
    delayRiskDays    : Nat;     // expected delay days at current trajectory
    forecastedAt     : Int;
  };

  // ── LPE — Labor Perception Protocol ──────────────────────────────────────────

  public type LPELaborClass = {
    #Journeyman;
    #Apprentice;
    #Foreman;
    #Superintendent;
    #LaborerGeneral;
  };

  public type LPEWageRecord = {
    trade          : Text;
    laborClass     : LPELaborClass;
    region         : Text;
    straightTime   : Float;   // $/hour straight time
    overtime       : Float;   // $/hour OT (1.5x or 2x)
    burdenedRate   : Float;   // loaded rate with benefits/taxes
    davisBaconRef  : Text;    // Davis-Bacon wage determination ref
    effectiveDate  : Int;
  };

  public type LPEProductivityFactor = {
    trade          : Text;
    activity       : Text;
    unit           : Text;   // "LF" | "SF" | "CY" | "EA"
    ratePerHour    : Float;  // units per craft hour
    crewSize       : Nat;
    equipmentNeeded : [Text];
  };

  // ── DEPE — Design Perception Protocol ────────────────────────────────────────

  public type DEPEDesignStage = {
    #ProgrammingSD;   // 0-15% design
    #SchematicDesign; // 15-35%
    #DesignDevelopment; // 35-65%
    #ConstructionDocs; // 65-100%
  };

  public type DEPEDesignConflict = {
    conflictId   : Text;
    description  : Text;
    discipline1  : Text;  // "Architectural" | "Structural" | "MEP"
    discipline2  : Text;
    severity     : Text;  // "Minor" | "Major" | "Critical"
    proposedFix  : Text;
    detectedAt   : Int;
  };

  public type DEPEDesignHealth = {
    projectId         : Text;
    designStage       : DEPEDesignStage;
    completionPct     : Float;
    conflictCount     : Nat;
    openRFIs          : Nat;
    coordScore        : Float;  // 0-100 BIM coordination score
    estimatedReworkCost : Float;
    assessedAt        : Int;
  };

  // ── SPE — Safety Perception Protocol ─────────────────────────────────────────

  public type SPERiskDimension = {
    name       : Text;   // "fall" | "electrical" | "struck-by" | "caught-in" | "chemical"
    score      : Float;  // 0-100 (100 = fully controlled)
    openHazards : Nat;
    trend      : Text;   // "improving" | "stable" | "worsening"
  };

  public type SPESafetySnapshot = {
    tenantId       : Text;
    projectId      : Text;
    overallScore   : Float;  // composite safety score 0-100
    riskDimensions : [SPERiskDimension];
    openTagCount   : Nat;
    daysWithoutIncident : Nat;
    emr            : Float;   // Experience Modification Rate
    trir           : Float;   // Total Recordable Incident Rate
    snapshotAt     : Int;
  };

  // ── ME — Messaging Protocol ───────────────────────────────────────────────────

  public type MEMessageType = {
    #Notification;   // informational push
    #Alert;          // requires action
    #Escalation;     // auto-escalate if unacknowledged
    #Report;         // scheduled delivery
    #Broadcast;      // all-tenant
  };

  public type MERoutingRule = {
    ruleId      : Nat;
    eventType   : Text;  // "stopWork" | "payAppApproved" | "jsaCreated" | "bidAwarded"
    recipient   : Text;  // "safetyDirector" | "pm" | "gc" | "all"
    messageType : MEMessageType;
    priority    : Nat;   // 1-5 (1=highest)
    delaySeconds : Nat;  // 0 = immediate
  };

  public type MEDeliveryRecord = {
    messageId   : Text;
    tenantId    : Text;
    eventType   : Text;
    recipient   : Text;
    messageType : MEMessageType;
    subject     : Text;
    body        : Text;
    deliveredAt : ?Int;
    acknowledged : Bool;
    status      : Text;  // "queued" | "sent" | "delivered" | "failed"
  };

  // ── OSHA — 1926 Regulation Encoding ──────────────────────────────────────────

  public type OSHASubpart = {
    subpart     : Text;   // letter, e.g. "C", "E", "M", "R"
    title       : Text;   // e.g. "General Safety and Health Provisions"
    cfr         : Text;   // e.g. "29 CFR 1926.20-35"
    focusFour   : Bool;   // true if this is one of the Focus Four
    description : Text;
    keyStandards : [Text]; // e.g. ["1926.20", "1926.21", "1926.25"]
  };

  public type OSHAViolationType = {
    #Willful;     // employer aware and intentional
    #Serious;     // substantial probability of injury
    #OtherThanSerious;
    #Repeated;    // same standard previously cited
    #DeMinimis;   // technical violation, no direct safety impact
    #FailureToAbate;
  };

  public type OSHAViolationRecord = {
    violationId   : Text;
    tenantId      : Text;
    projectId     : Text;
    cfr           : Text;
    description   : Text;
    violationType : OSHAViolationType;
    penalty       : Float;   // USD
    abatementDate : ?Int;
    status        : Text;    // "open" | "abated" | "contested"
    citedAt       : Int;
  };

  // ── AIA Contract Document Families ─────────────────────────────────────────

  public type AIAContractFamily = {
    #Conventional;     // A201 family — design-bid-build
    #DesignBuild;      // A141 family
    #CMasAdvisor;      // CMa — A132 family
    #CMasConstructor;  // CMc — A133 family
    #IPD;              // Integrated Project Delivery — A195 family
    #Interiors;        // Interiors-specific family
    #VolumetricModular; // Modular construction
  };

  public type AIADocumentRef = {
    docNumber : Text;   // e.g. "A201"
    title     : Text;
    purpose   : Text;
    parties   : [Text]; // parties to the agreement
    family    : AIAContractFamily;
  };

  public type AIAContractFamilyRecord = {
    family      : AIAContractFamily;
    name        : Text;
    description : Text;
    documents   : [AIADocumentRef];
    primaryUse  : Text;
    deliveryMethod : Text;
  };

  // ── CSI MasterFormat 2026 ───────────────────────────────────────────────────

  public type CSIDivision = {
    number      : Text;    // e.g. "03"
    title       : Text;    // e.g. "Concrete"
    description : Text;
    sections    : [CSISection];
    trades      : [Text];  // trade contractors that self-perform this division
  };

  public type CSISection = {
    sectionNumber : Text;   // e.g. "03 30 00"
    title         : Text;   // e.g. "Cast-in-Place Concrete"
    description   : Text;
    typicalItems  : [Text]; // representative work items
  };

  // ── National CAD Standard (NCS) ─────────────────────────────────────────────

  public type NCSLayerCategory = {
    #Architectural;
    #Structural;
    #Mechanical;
    #Electrical;
    #Plumbing;
    #FireProtection;
    #Civil;
    #Landscape;
    #Interiors;
    #Equipment;
    #Communication;
  };

  public type NCSLayerRule = {
    discipline  : Text;   // single-letter code: A, S, M, E, P, F, C, L, I, Q, T
    major       : Text;   // major group (WALL, DOOR, ANNO, etc.)
    minor1      : Text;   // first minor group (optional)
    minor2      : Text;   // second minor group (optional)
    status      : Text;   // N=new, E=existing, D=demolish, F=future
    description : Text;
    color       : Text;   // CAD color number
    lineType    : Text;   // CONTINUOUS, HIDDEN, DASHED, etc.
    lineWeight  : Text;   // 0.13, 0.18, 0.25, 0.35, 0.50 mm
  };

  public type NCSSheetType = {
    #GeneralSheets;    // G-series
    #HazardousSheets;  // H-series
    #SurveySheets;     // V-series
    #DemolitionSheets; // D-series (optional by project)
    #CivilSheets;      // C-series
    #LandscapeSheets;  // L-series
    #StructuralSheets; // S-series
    #ArchitecturalSheets; // A-series
    #InteriorsSheets;  // I-series
    #EquipmentSheets;  // Q-series
    #FireProtectionSheets; // F-series
    #PlumbingSheets;   // P-series
    #MechanicalSheets; // M-series
    #ElectricalSheets; // E-series
    #TelecomSheets;    // T-series
    #ResourceSheets;   // R-series
  };

  public type NCSSheetOrganization = {
    sheetType       : NCSSheetType;
    seriesCode      : Text;   // letter prefix (A, S, M, E, P, etc.)
    sequenceNumbers : Text;   // format description (e.g. "XX.XX")
    description     : Text;
    typicalContents : [Text];
  };

  public type NCSReference = {
    section     : Text;
    title       : Text;
    description : Text;
    layerRules  : [NCSLayerRule];
    sheetOrgs   : [NCSSheetOrganization];
  };

  // ── Project Lifecycle Phases ─────────────────────────────────────────────────

  public type ProjectPhase = {
    #ProgrammingPreDesign;
    #SchematicDesign;
    #DesignDevelopment;
    #ConstructionDocuments;
    #ProcurementGMP;
    #Construction;
    #CommissioningCloseout;
  };

  public type PhaseDeliverable = {
    name        : Text;
    description : Text;
    responsible : Text; // "Owner" | "Architect" | "GC" | "CM"
    aiaTrigger  : ?Text; // AIA form triggered at this milestone
  };

  public type ProjectLifecyclePhase = {
    phase         : ProjectPhase;
    phaseNumber   : Nat;
    name          : Text;
    description   : Text;
    typicalDuration : Text;
    percentDesign : Nat;   // design completion at end of phase (0-100)
    deliverables  : [PhaseDeliverable];
    platformTools : [Text]; // OIS tools active in this phase
    csiDivisions  : [Text]; // relevant CSI divisions active
  };

  // ── Communication Paths ──────────────────────────────────────────────────────

  public type CommPath = {
    docType  : Text;   // "RFI" | "Submittal" | "ChangeOrder" | "PayApp"
    from     : [Text]; // originating parties
    routing  : [Text]; // review sequence
    finalTo  : Text;   // ultimate recipient/approver
    typicalDays : Nat; // standard response time (calendar days)
    aiaForm  : ?Text;  // AIA form used
  };

  // ── Query / Response types (shared — no var fields) ─────────────────────────

  public type ProtocolQuery = {
    csiDivision    : ?Text;   // filter by division number
    projectPhase   : ?ProjectPhase;
    contractFamily : ?AIAContractFamily;
    keyword        : ?Text;
  };

  public type ProtocolSummary = {
    csiDivisionCount   : Nat;
    aiaFamilyCount     : Nat;
    lifecyclePhaseCount : Nat;
    ncsSectionCount    : Nat;
  };

};

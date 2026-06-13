// types/procurement.mo — Full Procurement Lifecycle Types
// Covers pre-bid, bid evaluation, buyout, long-lead, subcontractor management,
// and 12-dimension Go/No-Go scoring for the OIS Construction Intelligence Platform.
module {

  // ─── Pre-Bid Phase ────────────────────────────────────────────────────────

  public type BidDocumentType = {
    #itb;   // Invitation to Bid
    #rfp;   // Request for Proposal
    #rfq;   // Request for Qualifications
    #bidPackage;
    #preBidMinutes;
    #siteVisitLog;
  };

  public type BidOpportunityStatus = {
    #preBid;
    #open;
    #closed;
    #awarded;
    #cancelled;
    #noGo;
  };

  // Invitation to Bid — formal solicitation document
  public type ITBRecord = {
    itbId        : Text;
    projectId    : Text;
    tenantId     : Nat;
    projectName  : Text;
    owner        : Text;
    projectType  : Text;          // "Commercial TI", "Ground-Up", "Healthcare", etc.
    location     : Text;
    estimatedValue : Nat;         // dollars
    scopeSummary : Text;
    bidDate      : Int;           // Unix timestamp nanoseconds
    bondRequired : Bool;
    bondAmount   : Nat;           // dollars
    prevailingWage : Bool;
    insuranceReqs : [Text];       // list of required coverages
    contactName  : Text;
    contactEmail : Text;
    status       : BidOpportunityStatus;
    invitedSubs  : [Text];        // sub company names or IDs
    createdAt    : Int;
    updatedAt    : Int;
  };

  // Request for Proposal — narrative-heavy, qualifications-based solicitation
  public type RFPRecord = {
    rfpId        : Text;
    projectId    : Text;
    tenantId     : Nat;
    projectName  : Text;
    owner        : Text;
    scopeNarrative : Text;
    evaluationCriteria : [Text];
    submissionRequirements : [Text];
    dueDate      : Int;
    awardCriteria : Text;         // "best value", "low bid", "qualifications"
    status       : BidOpportunityStatus;
    createdAt    : Int;
    updatedAt    : Int;
  };

  // Request for Qualifications — prequalification before bid invitation
  public type RFQSubmission = {
    rfqSubmissionId : Text;
    rfqId       : Text;
    subId       : Text;
    tenantId    : Nat;
    companyName : Text;
    licenseNo   : Text;
    bondingCapacity : Nat;        // dollars
    emr         : Nat;            // Experience Modification Rate × 100 (e.g. 95 = 0.95)
    yearsInBusiness : Nat;
    relevantProjects : [Text];    // project names or descriptions
    submittedAt : Int;
    status      : { #submitted; #approved; #rejected };
  };

  // Pre-bid meeting log
  public type PreBidMeeting = {
    meetingId   : Text;
    projectId   : Text;
    tenantId    : Nat;
    meetingDate : Int;
    location    : Text;
    attendees   : [Text];
    agendaItems : [Text];
    minutesSummary : Text;
    questionsAnswers : [(Text, Text)]; // (question, answer)
    createdAt   : Int;
  };

  // Site visit log
  public type SiteVisitLog = {
    visitId     : Text;
    projectId   : Text;
    tenantId    : Nat;
    visitDate   : Int;
    attendees   : [Text];
    siteConditions : Text;
    accessRequirements : Text;
    photos      : [Text];         // objectStorage keys
    notes       : Text;
    createdAt   : Int;
  };

  // ─── Go/No-Go Scoring (12 Dimensions) ────────────────────────────────────

  public type GoNoGoScoreDimension = {
    dimension   : Text;           // name
    score       : Nat;            // 0-10
    weight      : Nat;            // percentage weight (must sum to 100)
    rationale   : Text;           // scoring rationale
  };

  public type GoNoGoDecision = { #go; #noGo; #conditional };

  public type GoNoGoResult = {
    resultId    : Text;
    projectId   : Text;
    tenantId    : Nat;
    projectName : Text;
    projectType : Text;
    estimatedValue : Nat;
    dimensions  : [GoNoGoScoreDimension];
    compositeScore : Nat;         // 0-100 weighted composite
    decision    : GoNoGoDecision;
    nexusInsight : Text;
    recommendations : [Text];
    riskFlags   : [Text];
    generatedAt : Int;
  };

  // ─── Bid Evaluation ───────────────────────────────────────────────────────

  public type BidScopeGap = {
    csiDivision : Text;
    description : Text;
    estimatedCost : Nat;          // dollars
    severity    : Text;           // "minor", "moderate", "critical"
  };

  public type BidLevelingEntry = {
    subId       : Text;
    subName     : Text;
    csiDivision : Text;
    baseBid     : Nat;            // dollars
    alternates  : [(Text, Int)];  // (description, dollar impact)
    qualifications : [Text];
    scopeGaps   : [BidScopeGap];
    leveledTotal : Nat;           // base + gap adjustments
    recommendation : Text;
  };

  public type BidLevelingSheet = {
    sheetId     : Text;
    projectId   : Text;
    tenantId    : Nat;
    title       : Text;
    csiDivision : Text;
    entries     : [BidLevelingEntry];
    lowestBase  : Nat;
    lowestLeveled : Nat;
    bestValue   : Text;           // subId
    nexusInsight : Text;
    generatedAt : Int;
  };

  // Scope clarification request
  public type ScopeClarification = {
    clarificationId : Text;
    projectId   : Text;
    tenantId    : Nat;
    subId       : Text;
    subName     : Text;
    question    : Text;
    response    : Text;
    status      : { #pending; #answered; #withdrawn };
    issuedAt    : Int;
    answeredAt  : ?Int;
  };

  // Value Engineering proposal
  public type VEProposal = {
    veId        : Text;
    projectId   : Text;
    tenantId    : Nat;
    subId       : Text;
    subName     : Text;
    csiDivision : Text;
    description : Text;
    costSavings : Nat;            // dollars
    scheduleSavingsDays : Int;
    qualityImpact : Text;         // "none", "minor", "significant"
    approvalStatus : { #proposed; #approved; #rejected };
    nexusInsight : Text;
    submittedAt : Int;
    reviewedAt  : ?Int;
  };

  // ─── Buyout Phase ─────────────────────────────────────────────────────────

  public type SubcontractStatus = {
    #scopeReview;
    #negotiation;
    #pendingExecution;
    #executed;
    #terminated;
  };

  public type InsuranceCoverage = {
    coverageType  : Text;         // "GL", "Workers Comp", "Auto", "Umbrella", "Professional"
    policyNumber  : Text;
    carrier       : Text;
    perOccurrence : Nat;          // dollars
    aggregate     : Nat;          // dollars
    expirationDate : Int;
    verified      : Bool;
  };

  public type BondRecord = {
    bondType    : Text;           // "Performance", "Payment", "Bid"
    bondNo      : Text;
    surety      : Text;
    amount      : Nat;            // dollars
    expirationDate : Int;
    verified    : Bool;
  };

  public type FlowDownProvision = {
    clause      : Text;           // e.g., "Indemnification", "Liquidated Damages"
    contractReference : Text;     // e.g., "AIA A201 §3.18"
    required    : Bool;
    included    : Bool;
  };

  public type SubcontractRecord = {
    subcontractId : Text;
    projectId    : Text;
    tenantId     : Nat;
    subId        : Text;
    subName      : Text;
    csiDivisions : [Text];
    scopeSummary : Text;
    contractValue : Nat;          // dollars
    retainagePct  : Nat;          // basis points (e.g. 1000 = 10%)
    startDate    : Int;
    endDate      : Int;
    status       : SubcontractStatus;
    insurance    : [InsuranceCoverage];
    bonds        : [BondRecord];
    flowDownProvisions : [FlowDownProvision];
    insuranceVerified : Bool;
    bondingVerified   : Bool;
    executedAt   : ?Int;
    createdAt    : Int;
    updatedAt    : Int;
  };

  // ─── Long-Lead Procurement ────────────────────────────────────────────────

  public type LongLeadStatus = {
    #identified;
    #loiIssued;
    #poIssued;
    #confirmed;
    #inProduction;
    #shipped;
    #delivered;
    #installed;
  };

  // Letter of Intent — pre-purchase commitment
  public type LOIRecord = {
    loiId       : Text;
    projectId   : Text;
    tenantId    : Nat;
    supplierId  : Text;
    supplierName : Text;
    materialDescription : Text;
    csiCode     : Text;
    estimatedValue : Nat;         // dollars
    requiredOnSite : Int;         // target delivery date
    issuedAt    : Int;
    expiresAt   : Int;
    acknowledged : Bool;
  };

  // Purchase Order
  public type POLineItem = {
    lineNo      : Nat;
    description : Text;
    csiCode     : Text;
    quantity    : Nat;
    unit        : Text;
    unitPrice   : Nat;            // cents
    totalPrice  : Nat;            // cents
    leadDays    : Nat;
  };

  public type PurchaseOrder = {
    poId        : Text;
    projectId   : Text;
    tenantId    : Nat;
    supplierId  : Text;
    supplierName : Text;
    poNumber    : Text;
    lineItems   : [POLineItem];
    totalAmount : Nat;            // cents
    deliveryAddress : Text;
    requiredDate : Int;
    status      : LongLeadStatus;
    loiId       : ?Text;          // linked LOI if any
    issuedAt    : Int;
    updatedAt   : Int;
  };

  // Long-lead item tracking record
  public type LongLeadItem = {
    itemId      : Text;
    projectId   : Text;
    tenantId    : Nat;
    description : Text;
    csiCode     : Text;
    supplierId  : Text;
    supplierName : Text;
    leadDays    : Nat;            // 12-26+ week items
    orderDate   : ?Int;
    requiredOnSite : Int;
    currentStatus : LongLeadStatus;
    poId        : ?Text;
    loiId       : ?Text;
    stagingLocation : Text;
    storageRequirements : Text;
    milestones  : [(Text, Int, Bool)]; // (description, targetDate, completed)
    riskLevel   : Text;           // "low", "medium", "high", "critical"
    notes       : Text;
    createdAt   : Int;
    updatedAt   : Int;
  };

  // ─── Subcontractor Management ─────────────────────────────────────────────

  public type SubPrequalStatus = { #pending; #approved; #conditional; #rejected; #expired };

  public type SubPrequalification = {
    prequalId   : Text;
    subId       : Text;
    tenantId    : Nat;
    companyName : Text;
    licenseNo   : Text;
    licenseState : Text;
    licenseExpiry : Int;
    // Financial scoring
    annualRevenue : Nat;          // dollars
    bondingCapacity : Nat;        // dollars
    currentBacklogPct : Nat;      // % of capacity in active work
    financialScore : Nat;         // 0-100
    // Safety scoring
    emr         : Nat;            // Experience Modification Rate × 100
    trir        : Nat;            // Total Recordable Incident Rate × 100
    dart        : Nat;            // Days Away Restricted Transfer × 100
    safetyProgramScore : Nat;     // 0-100
    // Experience scoring
    yearsInBusiness : Nat;
    relevantProjectCount : Nat;
    projectTypes : [Text];
    experienceScore : Nat;        // 0-100
    // Bonding
    singleJobLimit : Nat;         // dollars
    aggregateLimit : Nat;         // dollars
    bondingScore   : Nat;         // 0-100
    // Composite
    overallScore   : Nat;         // 0-100 weighted composite
    status         : SubPrequalStatus;
    approvedTrades : [Text];      // CSI divisions approved for
    notes          : Text;
    submittedAt    : Int;
    reviewedAt     : ?Int;
    expiresAt      : Int;
  };

  public type SubPerformanceRecord = {
    recordId    : Text;
    subId       : Text;
    projectId   : Text;
    tenantId    : Nat;
    period      : Text;           // "2024-Q4"
    // Scores 0-100
    scheduleScore   : Nat;        // on-time milestone delivery
    qualityScore    : Nat;        // deficiency rate
    safetyScore     : Nat;        // incident rate vs benchmark
    communicationScore : Nat;     // RFI response time, submittal quality
    cleanupScore    : Nat;        // site cleanliness
    compositeScore  : Nat;        // weighted average
    rfiCount        : Nat;
    rfiAvgResponseDays : Nat;
    submittalReturnCount : Nat;   // times submittals were returned for revision
    deficiencyCount : Nat;
    incidentCount   : Nat;
    notes           : Text;
    evaluatedBy     : Principal;
    evaluatedAt     : Int;
  };

  public type BackCharge = {
    backChargeId : Text;
    subId        : Text;
    projectId    : Text;
    tenantId     : Nat;
    description  : Text;
    amount       : Nat;           // dollars
    csiDivision  : Text;
    incidentDate : Int;
    status       : { #open; #acknowledged; #disputed; #settled; #written_off };
    supportingPhotos : [Text];    // objectStorage keys
    nexusNote    : Text;
    issuedAt     : Int;
    resolvedAt   : ?Int;
  };

  public type SubPaymentRecord = {
    paymentId   : Text;
    subId       : Text;
    projectId   : Text;
    tenantId    : Nat;
    payAppNo    : Nat;
    periodEnd   : Int;
    contractValue : Nat;          // total
    previousBilled : Nat;
    currentBilling : Nat;
    retainageHeld : Nat;
    netPayment  : Nat;
    lienWaiverReceived : Bool;
    lienWaiverType : Text;        // "conditional_partial", "unconditional_partial", etc.
    paidAt      : ?Int;
    status      : { #pending; #approved; #paid; #disputed };
  };

  public type SubCloseoutDoc = {
    docId       : Text;
    subId       : Text;
    projectId   : Text;
    tenantId    : Nat;
    docType     : Text;           // "as-built", "o&m_manual", "warranty", "final_lien_waiver", "certificate_of_completion"
    description : Text;
    fileKey     : ?Text;          // objectStorage key
    received    : Bool;
    receivedAt  : ?Int;
    notes       : Text;
  };

  // Consolidated subcontractor profile
  public type SubcontractorProfile = {
    subId       : Text;
    tenantId    : Nat;
    companyName : Text;
    contactName : Text;
    contactEmail : Text;
    contactPhone : Text;
    address     : Text;
    licenseNo   : Text;
    licenseState : Text;
    trades      : [Text];         // CSI divisions
    region      : Text;
    prequalStatus : SubPrequalStatus;
    overallScore  : Nat;          // from most recent prequal
    activeProjectCount : Nat;
    createdAt   : Int;
    updatedAt   : Int;
  };

  // ─── Procurement Result (BHX pheromone payload) ───────────────────────────

  public type ProcurementResult = {
    #goNoGo          : GoNoGoResult;
    #itb             : ITBRecord;
    #rfp             : RFPRecord;
    #bidLeveling     : BidLevelingSheet;
    #veProposal      : VEProposal;
    #subcontract     : SubcontractRecord;
    #longLeadItem    : LongLeadItem;
    #purchaseOrder   : PurchaseOrder;
    #subPrequal      : SubPrequalification;
    #subPerformance  : SubPerformanceRecord;
    #backCharge      : BackCharge;
    #subPayment      : SubPaymentRecord;
  };

  public type ProcurementWorkResult = {
    resultId    : Text;
    tenantId    : Nat;
    projectId   : Text;
    result      : ProcurementResult;
    cplAudit    : Text;
    createdAt   : Int;
  };
};

// PSIE — Provisio Supplica Intelligentia Engine Types
// Procurement & Supply Chain Intelligence Engine
module {

  // ─── Material Categories ──────────────────────────────────────────────────
  public type MaterialCategory = {
    #concrete;
    #steel;
    #mep;
    #finishes;
    #lumber;
    #roofing;
    #glazing;
    #earthwork;
    #mechanical;
    #electrical;
    #plumbing;
    #specialConstruction;
    #other;
  };

  // ─── Supplier ─────────────────────────────────────────────────────────────
  public type SupplierRecord = {
    supplierId     : Text;
    tenantId       : Nat;
    name           : Text;
    contactEmail   : Text;
    contactPhone   : Text;
    region         : Text;
    categories     : [MaterialCategory];
    onTimeRate     : Nat;          // basis points (0-10000)
    qualityDefectRate : Nat;       // basis points
    priceVariancePct  : Int;       // basis points, signed (negative = under quote)
    responsivenessScore : Nat;     // 0-100
    overallScore   : Nat;          // 0-100 composite
    lastEvaluated  : Int;
    createdAt      : Int;
  };

  // ─── Material Lead Times ──────────────────────────────────────────────────
  public type LeadTimeRecord = {
    leadTimeId   : Text;
    supplierId   : Text;
    tenantId     : Nat;
    category     : MaterialCategory;
    materialName : Text;
    currentLeadDays : Nat;
    historicalAvgDays : Nat;
    trend        : Text;          // "stable" | "increasing" | "decreasing"
    region       : Text;
    updatedAt    : Int;
  };

  // ─── RFQ — Request for Quotation ─────────────────────────────────────────
  public type RfqLineItem = {
    lineNo      : Nat;
    description : Text;
    csiCode     : Text;
    quantity    : Nat;
    unit        : Text;
    specNotes   : Text;
  };

  public type RfqStatus = {
    #draft;
    #sent;
    #quoteReceived;
    #awarded;
    #cancelled;
  };

  public type RfqRecord = {
    rfqId        : Text;
    projectId    : Text;
    tenantId     : Nat;
    title        : Text;
    dueDate      : Int;
    lineItems    : [RfqLineItem];
    invitedSuppliers : [Text];    // supplierIds
    status       : RfqStatus;
    notes        : Text;
    createdAt    : Int;
    updatedAt    : Int;
  };

  // ─── Supplier Quote ───────────────────────────────────────────────────────
  public type QuoteLineItem = {
    lineNo      : Nat;
    unitPrice   : Nat;            // cents
    totalPrice  : Nat;            // cents
    leadDays    : Nat;
    notes       : Text;
  };

  public type SupplierQuote = {
    quoteId      : Text;
    rfqId        : Text;
    supplierId   : Text;
    tenantId     : Nat;
    lineItems    : [QuoteLineItem];
    totalAmount  : Nat;           // cents
    validThrough : Int;
    receivedAt   : Int;
  };

  // ─── Quote Comparison ────────────────────────────────────────────────────
  public type QuoteVariance = {
    supplierId   : Text;
    supplierName : Text;
    totalAmount  : Nat;           // cents
    variancePct  : Int;           // basis points vs lowest
    leadDays     : Nat;
    scoreBonus   : Nat;           // 0-100 from supplier performance score
    recommendation : Text;
  };

  public type QuoteComparison = {
    rfqId        : Text;
    projectId    : Text;
    tenantId     : Nat;
    quotes       : [QuoteVariance];
    lowestQuote  : Text;          // supplierId
    bestValue    : Text;          // supplierId (cost + performance)
    nexusInsight : Text;
    generatedAt  : Int;
  };

  // ─── Escalation Alert ────────────────────────────────────────────────────
  public type EscalationAlert = {
    alertId      : Text;
    tenantId     : Nat;
    category     : MaterialCategory;
    materialName : Text;
    region       : Text;
    currentPrice : Nat;           // cents per unit
    previousPrice: Nat;           // cents per unit
    changePct    : Int;           // basis points
    trend        : Text;          // "spike" | "surge" | "drop" | "volatile"
    recommendation : Text;
    severity     : Text;          // "low" | "medium" | "high" | "critical"
    issuedAt     : Int;
  };

  // ─── Substitution Recommendation ─────────────────────────────────────────
  public type SubstitutionOption = {
    alternateName    : Text;
    category         : MaterialCategory;
    costDelta        : Int;       // cents per unit, signed (positive = more expensive)
    leadDeltaDays    : Int;       // days delta vs primary
    qualityScore     : Nat;       // 0-100
    availabilityScore: Nat;       // 0-100
    overallScore     : Nat;       // composite 0-100
    csiCode          : Text;
    notes            : Text;
  };

  public type SubstitutionReport = {
    reportId     : Text;
    tenantId     : Nat;
    primaryMaterial : Text;
    category     : MaterialCategory;
    reason       : Text;          // "unavailable" | "cost" | "lead_time" | "quality"
    options      : [SubstitutionOption];
    recommended  : Text;          // name of best option
    nexusInsight : Text;
    generatedAt  : Int;
  };

  // ─── Davis-Bacon / Prevailing Wage Compliance ────────────────────────────
  public type WageComplianceStatus = {
    #compliant;
    #deficient;
    #unverified;
  };

  public type WageLineCheck = {
    trade        : Text;
    region       : Text;
    postedRate   : Nat;           // cents per hour
    blsRate      : Nat;           // cents per hour (from WL BLS data)
    delta        : Int;           // cents, signed
    status       : WageComplianceStatus;
    notes        : Text;
  };

  public type WageComplianceReport = {
    reportId     : Text;
    projectId    : Text;
    tenantId     : Nat;
    checks       : [WageLineCheck];
    overallStatus: WageComplianceStatus;
    deficiencyCount : Nat;
    nexusInsight : Text;
    generatedAt  : Int;
  };

  // ─── PSIE Result (BHX pheromone payload) ─────────────────────────────────
  public type PSIEResult = {
    #leadTime       : LeadTimeRecord;
    #supplierScore  : SupplierRecord;
    #rfq            : RfqRecord;
    #quoteComparison: QuoteComparison;
    #escalationAlert: EscalationAlert;
    #substitution   : SubstitutionReport;
    #wageCompliance : WageComplianceReport;
  };

  // PerceptionOutput-compatible record for Nexus synthesis feeds
  public type PSIEPerceptionFinding = {
    findingId   : Text;
    category    : Text;
    severity    : Nat;
    description : Text;
    sourceData  : Text;
    confidence  : Nat;
  };

  public type PSIEAnomalyFlag = {
    flagId            : Text;
    perceptionType    : Text;
    severity          : Nat;
    description       : Text;
    recommendedAction : Text;
  };

  public type PSIEPerceptionOutput = {
    engineId        : Text;
    perceptionType  : Text;
    findings        : [PSIEPerceptionFinding];
    riskScore       : Nat;
    confidenceScore : Nat;
    anomalyFlags    : [PSIEAnomalyFlag];
    recommendations : [Text];
  };

  public type PSIEWorkResult = {
    resultId   : Text;
    tenantId   : Nat;
    projectId  : Text;
    result     : PSIEResult;
    perception : PSIEPerceptionOutput;  // real typed PerceptionOutput-compatible record
    cplAudit   : Text;
    createdAt  : Int;
  };
};

// types/bidconnect.mo — BidConnect Smart Token Types
// Typed data records that carry bid intelligence through the full bid lifecycle pipeline.
// From Lead intake → Go/No-Go → Site Walk → ITB → Bidding → Leveling → Award → Contracted → Construction → Closeout
import List "mo:core/List";

module {

  // ─── Core Enums ──────────────────────────────────────────────────────────

  public type BidStatus = {
    #Lead;
    #GoNoGo;
    #SiteWalk;
    #ITB;
    #Bidding;
    #Leveling;
    #Awarded;
    #Contracted;
    #Construction;
    #Closeout;
  };

  public type GoNoGoRecommendation = {
    #Go;
    #NoGo;
    #Proceed_With_Caution;
  };

  public type DimensionId = {
    #ProjectType;
    #EstimatedValue;
    #ScheduleAlignment;
    #TeamAvailability;
    #ActiveProjects;
    #IncidentRate;
    #PaymentHistory;
    #BondRequirement;
    #DesignRisk;
    #SubMarketConditions;
    #MarginExpectation;
    #StrategicValue;
  };

  // ─── Go/No-Go Scoring ────────────────────────────────────────────────────

  /// One scoring dimension: weight (0–1), score (0–10), and auto-calc flag.
  /// All 12 dimensions are required for a complete evaluation.
  public type GoNoGoFactor = {
    dimensionId   : DimensionId;
    dimensionName : Text;
    weight        : Float;   // 0.0 to 1.0 — sum of all weights = 1.0
    score         : Float;   // 0.0 to 10.0
    autoCalculated : Bool;   // true = derived from project data
    notes         : Text;
  };

  public type GoNoGoResult = {
    totalScore      : Float;  // 0.0 to 100.0 (weighted sum * 10)
    recommendation  : GoNoGoRecommendation;
    reasoning       : Text;
    flaggedFactors  : [Text]; // dimension names scoring below threshold
    calculatedAt    : Int;    // Time.now() nanoseconds
  };

  // ─── Sub Invites & ITB ───────────────────────────────────────────────────

  public type SubInviteStatus = {
    #Sent;
    #Viewed;
    #Declined;
    #Bidding;
    #Submitted;
    #NotInvited;
  };

  public type SubInvite = {
    inviteId    : Text;
    subName     : Text;
    subContact  : Text;    // email or phone
    trade       : Text;    // CSI scope of work
    emr         : Float;   // Experience Modification Rate
    sentAt      : Int;
    dueDate     : Int;
    status      : SubInviteStatus;
    itbPackage  : Text;    // JSON-encoded ITB details
  };

  // ─── RFQ ─────────────────────────────────────────────────────────────────

  public type RFQ = {
    rfqId       : Text;
    scope       : Text;
    sentTo      : [Text]; // sub company names
    sentAt      : Int;
    dueDate     : Int;
    responses   : Nat;   // count of responses received
    lowestQuote : ?Float;
  };

  // ─── Bid Submissions ─────────────────────────────────────────────────────

  public type BidLineItem = {
    csiCode     : Text;   // e.g. "03 30 00"
    description : Text;
    quantity    : Float;
    unit        : Text;
    unitPrice   : Float;
    totalPrice  : Float;
    inclusions  : [Text];
    exclusions  : [Text];
    notes       : Text;
  };

  public type BidSubmission = {
    submissionId   : Text;
    subName        : Text;
    submittedAt    : Int;
    baseAmount     : Float;
    alternates     : [(Text, Float)]; // (alternate description, add/deduct)
    lineItems      : [BidLineItem];
    scopeGaps      : [Text];          // identified missing scope items
    qualifications : [Text];
    bondable       : Bool;
    scheduledStart : ?Int;
    notes          : Text;
  };

  // ─── Bid Leveling ────────────────────────────────────────────────────────

  public type LeveledLineItem = {
    csiCode         : Text;
    description     : Text;
    lowestPrice     : Float;
    highestPrice    : Float;
    averagePrice    : Float;
    normalizedPrice : Float;  // scope-adjusted cost per unit
    scopeGapSubs    : [Text]; // subs missing this item
    recommendedSub  : Text;   // lowest responsible bidder for this line
    notes           : Text;
  };

  public type LeveledBid = {
    levelingId        : Text;
    createdAt         : Int;
    submissions       : [Text];    // submissionIds included
    leveledItems      : [LeveledLineItem];
    lowestBase        : Float;
    lowestResponsible : Float;     // after scope normalization
    recommendedAward  : Text;      // subName
    totalSavings      : Float;     // vs. highest bid
    notes             : Text;
    excelData         : Text;      // JSON array of rows for Excel export
  };

  // ─── Pay App Token ───────────────────────────────────────────────────────

  /// AIA G702/G703-compatible pay application token.
  /// All calculated fields are derived from inputs — no double entry.
  public type PayApp = {
    payAppId                  : Text;
    payAppNumber              : Int;
    periodFrom                : Int;    // nanoseconds
    periodTo                  : Int;    // nanoseconds
    scheduledValue            : Float;
    workCompletedPrevious     : Float;
    workCompletedThisPeriod   : Float;
    materialsStoredPrevious   : Float;
    materialsStoredThisPeriod : Float;
    totalCompleted            : Float;  // calculated
    retainagePercent          : Float;  // e.g. 10.0
    retainageAmount           : Float;  // calculated
    totalEarnedLessRetainage  : Float;  // calculated
    previousPayments          : Float;
    currentPaymentDue         : Float;  // calculated
    balanceToFinish           : Float;  // calculated
    status                    : Text;   // "Draft" | "Submitted" | "Approved" | "Paid"
    createdAt                 : Int;
  };

  // ─── Pay App Input ───────────────────────────────────────────────────────

  public type PayAppInput = {
    payAppNumber              : Int;
    periodFrom                : Int;
    periodTo                  : Int;
    scheduledValue            : Float;
    workCompletedPrevious     : Float;
    workCompletedThisPeriod   : Float;
    materialsStoredPrevious   : Float;
    materialsStoredThisPeriod : Float;
    retainagePercent          : Float;
    previousPayments          : Float;
  };

  // ─── Proposal Document ───────────────────────────────────────────────────

  public type ProposalSection = {
    title   : Text;
    content : Text;
    order   : Nat;
  };

  public type ProposalDocument = {
    proposalId  : Text;
    bidId       : Text;
    createdAt   : Int;
    sections    : [ProposalSection];
    totalPages  : Nat;
    status      : Text;  // "Draft" | "Submitted" | "Accepted" | "Rejected"
  };

  // ─── BidToken (Smart Token) ───────────────────────────────────────────────

  /// The central smart token — carries all bid intelligence through the pipeline.
  /// Created at Lead stage; enriched at every lifecycle transition.
  public type BidToken = {
    bidId           : Text;
    tenantId        : Text;
    projectName     : Text;
    gcName          : Text;
    scopeOfWork     : Text;
    projectType     : Text;    // "Healthcare" | "Commercial" | "Industrial" | etc.
    projectAddress  : Text;
    estimatedValue  : Float;
    dueDate         : Int;     // nanoseconds
    status          : BidStatus;
    createdAt       : Int;
    updatedAt       : Int;
    // Go/No-Go
    goNoGoScore     : Float;
    goNoGoFactors   : [GoNoGoFactor];
    goNoGoResult    : ?GoNoGoResult;
    // Pipeline
    subInvites      : [SubInvite];
    rfqsSent        : [RFQ];
    bidsReceived    : [BidSubmission];
    leveledBid      : ?LeveledBid;
    awardedTo       : ?Text;
    contractValue   : ?Float;
    // Construction
    payApps         : [PayApp];
    projectWorkspaceId : ?Text;  // linked project workspace record
    proposal        : ?ProposalDocument;
    notes           : Text;
  };

  // ─── Insurance & Pre-Mobilization ──────────────────────────────────────

  public type InsuranceCertStatus = {
    #Pending;
    #Received;
    #Verified;
    #Expired;
    #Rejected;
  };

  public type InsuranceCert = {
    certId         : Text;
    subName        : Text;
    policyType     : Text;   // "General Liability" | "Workers Comp" | "Umbrella" | "Auto"
    carrier        : Text;
    policyNumber   : Text;
    coverageAmount : Float;
    expiresAt      : Int;
    receivedAt     : Int;
    status         : InsuranceCertStatus;
    notes          : Text;
  };

  public type PreMobChecklistItem = {
    itemId      : Text;
    category    : Text;  // "Safety" | "Administrative" | "Insurance" | "Personnel" | "Equipment"
    description : Text;
    required    : Bool;
    completed   : Bool;
    completedAt : ?Int;
    completedBy : Text;
    notes       : Text;
  };

  public type PreMobChecklist = {
    checklistId   : Text;
    bidId         : Text;
    createdAt     : Int;
    completedAt   : ?Int;
    items         : [PreMobChecklistItem];
    percentComplete : Float;
    readyToMobilize : Bool;
  };

  // ─── Lien Waivers ──────────────────────────────────────────────────────

  public type LienWaiverType = {
    #Conditional_Progress;
    #Unconditional_Progress;
    #Conditional_Final;
    #Unconditional_Final;
  };

  public type LienWaiverStatus = {
    #Requested;
    #Pending;
    #Received;
    #Rejected;
  };

  public type LienWaiver = {
    waiverId      : Text;
    bidId         : Text;
    subName       : Text;
    waiverType    : LienWaiverType;
    payAppNumber  : Int;
    amount        : Float;
    throughDate   : Int;
    receivedAt    : ?Int;
    status        : LienWaiverStatus;
    signedByName  : Text;
    signedByTitle : Text;
    notes         : Text;
  };

  // ─── Sub Portal & Communications ───────────────────────────────────────

  public type SubPortalMessage = {
    messageId   : Text;
    bidId       : Text;
    fromSub     : Text;   // sub name or "GC"
    toParty     : Text;   // "GC" or sub name
    subject     : Text;
    body        : Text;
    sentAt      : Int;
    readAt      : ?Int;
    attachments : [Text]; // attachment names/IDs
  };

  public type SubPortalEntry = {
    subName         : Text;
    tenantId        : Text;
    activeBids      : [Text];   // bidIds this sub is participating in
    submittedPayApps : [Text];  // payAppIds submitted by this sub
    lienWaivers     : [LienWaiver];
    insuranceCerts  : [InsuranceCert];
    messages        : [SubPortalMessage];
    lastActivity    : Int;
  };

  // ─── Evidence & Alignment Scoring ──────────────────────────────────────

  public type EvidenceAlignment = {
    bidId           : Text;
    alignmentScore  : Float;    // 0–100, derived from OSHA/safety/financial data
    safetyScore     : Float;    // TRIR, EMR, citations
    financialScore  : Float;    // payment history, bonding capacity
    capacityScore   : Float;    // backlog, crew availability
    reputationScore : Float;    // past performance, references
    riskFlags       : [Text];   // flagged concerns from evidence
    evidenceSources : [Text];   // OSHA API, BLS, Davis-Bacon, internal records
    calculatedAt    : Int;
  };

  // ─── Award & Contract ──────────────────────────────────────────────────

  public type AwardRecord = {
    awardId          : Text;
    bidId            : Text;
    awardedSubName   : Text;
    contractValue    : Float;
    contractType     : Text;   // "Lump Sum" | "GMP" | "T&M" | "Unit Price"
    awardedAt        : Int;
    noticeToProceed  : ?Int;
    workspaceId      : Text;
    insuranceStatus  : Text;   // "Pending" | "Verified" | "Expired"
    preMobStatus     : Text;   // "Not Started" | "In Progress" | "Complete"
    signedContract   : Bool;
    notes            : Text;
  };

  // ─── BidConnect Engine State ──────────────────────────────────────────────

  public type BidConnectState = {
    tokens       : List.List<BidToken>;
    subPortal    : List.List<SubPortalEntry>;
    awardRecords : List.List<AwardRecord>;
    counter      : { var nextId : Nat };
  };

};

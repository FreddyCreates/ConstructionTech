// types/smart-contracts.mo — Smart Contract & Token Lifecycle Types
// Construction OS: bid token → award token → pay app token → completion token
// All state transitions checked via CPL governance; audit log is immutable on-chain.
import List "mo:core/List";

module {

  // ─── Token Lifecycle Variants ──────────────────────────────────────────────

  /// The four canonical construction smart tokens — each wraps domain data
  /// and carries CPL governance metadata through the pipeline.
  public type TokenKind = {
    #BidToken;
    #AwardToken;
    #PayAppToken;
    #CompletionToken;
  };

  /// Full state machine for a construction smart token.
  /// States are ordered; transitions can only advance (never skip).
  public type TokenState = {
    // BidToken states
    #BidDraft;         // token created, not yet submitted
    #BidSubmitted;     // submitted to GC / owner
    #BidAwarded;       // GC has selected this bidder
    #BidRejected;      // not selected
    // AwardToken states
    #AwardPending;     // award issued, awaiting contractor signature
    #AwardSigned;      // contractor signed — triggers workspace creation
    #AwardExecuted;    // fully executed (all parties signed)
    // PayAppToken states
    #PayAppDraft;      // pay app assembled, not submitted
    #PayAppSubmitted;  // submitted for review
    #PayAppApproved;   // owner / GC approved
    #PayAppRejected;   // returned with comments
    #PayAppPaid;       // payment released (lien waiver + approval chain complete)
    // CompletionToken states
    #CompletionPending;  // punch list open
    #CompletionReady;    // all punch items cleared
    #CompletionReleased; // final retention released, project closed
  };

  /// Approval in the chain: each approver signs in sequence.
  public type ApprovalRecord = {
    approvalId  : Text;
    tokenId     : Text;
    approverRole : Text;   // "GC_PM" | "Owner" | "Architect" | "Lender" | "Safety"
    approverName : Text;
    approved    : Bool;
    signedAt    : ?Int;    // null = pending
    comments    : Text;
    signature   : Text;    // hash of approver principal + timestamp
  };

  /// Lien waiver attached to a pay app token — must be present before payment release.
  public type LienWaiverRef = {
    waiverId    : Text;
    waiverType  : Text;    // "conditional_partial" | "unconditional_partial" | "conditional_final" | "unconditional_final"
    tier        : Text;    // "gc" | "sub" | "supplier"
    claimant    : Text;
    throughDate : Int;
    signedAt    : ?Int;
    state       : Text;    // 2-letter state code
  };

  /// CPL governance check result embedded in every token state transition.
  public type CPLCheckResult = {
    passed      : Bool;
    lawId       : Nat;     // which CPL law was evaluated (1-6)
    lawName     : Text;
    action      : Text;    // what action was checked
    reason      : Text;    // human-readable outcome
    checkedAt   : Int;
  };

  /// Payment terms codified in an award token — atomic release conditions.
  public type PaymentTerms = {
    contractValue      : Nat;   // cents
    retainagePercent   : Nat;   // basis points (e.g. 1000 = 10%)
    paymentDays        : Nat;   // net days from invoice
    scheduledPayments  : [ScheduledPayment];
    conditionalRelease : Bool;  // true = lien waiver required before payment
    finalRetentionDays : Nat;   // days after substantial completion
    prevailingWage     : Bool;
    liquidatedDamagesPerDay : Nat; // cents per calendar day
  };

  /// One milestone-based scheduled payment.
  public type ScheduledPayment = {
    milestoneId   : Text;
    description   : Text;
    percentComplete : Nat; // 0-10000 basis points
    amount        : Nat;   // cents
    dueDate       : ?Int;  // null = TBD based on schedule
  };

  // ─── Core Token Records ────────────────────────────────────────────────────

  /// BidToken — wraps bid intelligence; created at lead, expires at award or rejection.
  public type BidTokenRecord = {
    tokenId     : Text;
    tenantId    : Text;
    projectId   : Text;
    bidId       : Text;      // FK → BidConnect BidToken
    state       : TokenState;
    kind        : TokenKind;
    createdAt   : Int;
    updatedAt   : Int;
    createdBy   : Text;      // Principal as Text
    approvals   : [ApprovalRecord];
    cplChecks   : [CPLCheckResult];
    metadata    : Text;      // JSON-encoded domain-specific data
  };

  /// AwardToken — issued when a bid is awarded; triggers workspace creation + payment terms.
  public type AwardTokenRecord = {
    tokenId            : Text;
    tenantId           : Text;
    projectId          : Text;
    bidTokenId         : Text;      // FK → BidTokenRecord that was awarded
    contractorName     : Text;
    gcName             : Text;
    ownerName          : Text;
    contractValue      : Nat;       // cents
    paymentTerms       : PaymentTerms;
    state              : TokenState;
    kind               : TokenKind;
    workspaceCreated   : Bool;
    workspaceId        : ?Text;     // linked workspace ID after creation
    contractDocumentId : ?Text;     // linked AIA contract document
    createdAt          : Int;
    updatedAt          : Int;
    createdBy          : Text;
    approvals          : [ApprovalRecord];
    cplChecks          : [CPLCheckResult];
    metadata           : Text;
  };

  /// PayAppToken — wraps AIA G702/G703 pay application; atomic release after lien waivers + approvals.
  public type PayAppTokenRecord = {
    tokenId          : Text;
    tenantId         : Text;
    projectId        : Text;
    awardTokenId     : Text;        // FK → AwardTokenRecord
    payAppNumber     : Nat;
    periodFrom       : Int;
    periodTo         : Int;
    scheduledValue   : Nat;         // cents
    workCompleted    : Nat;         // cents cumulative
    materialsStored  : Nat;         // cents
    retainageHeld    : Nat;         // cents
    currentPaymentDue : Nat;        // cents — released only when conditions met
    lienWaivers      : [LienWaiverRef];
    allLienWaiversSigned : Bool;
    approvalChainComplete : Bool;
    state            : TokenState;
    kind             : TokenKind;
    createdAt        : Int;
    updatedAt        : Int;
    createdBy        : Text;
    approvals        : [ApprovalRecord];
    cplChecks        : [CPLCheckResult];
    metadata         : Text;
  };

  /// CompletionToken — final project lifecycle token; releases retention.
  public type CompletionTokenRecord = {
    tokenId            : Text;
    tenantId           : Text;
    projectId          : Text;
    awardTokenId       : Text;
    finalPayAppTokenId : Text;
    punchListItems     : [PunchListItem];
    allPunchClear      : Bool;
    retentionAmount    : Nat;        // cents
    finalWaivers       : [LienWaiverRef];
    allFinalWaivers    : Bool;
    state              : TokenState;
    kind               : TokenKind;
    createdAt          : Int;
    updatedAt          : Int;
    createdBy          : Text;
    approvals          : [ApprovalRecord];
    cplChecks          : [CPLCheckResult];
    metadata           : Text;
  };

  public type PunchListItem = {
    itemId      : Text;
    description : Text;
    trade       : Text;
    assignedTo  : Text;
    cleared     : Bool;
    clearedAt   : ?Int;
  };

  // ─── Immutable Audit Log Entry ─────────────────────────────────────────────

  /// Every state transition is permanently recorded here — cannot be modified or deleted.
  public type TokenAuditEntry = {
    auditId       : Text;
    tokenId       : Text;
    tokenKind     : Text;     // text representation of TokenKind
    tenantId      : Text;
    fromState     : Text;     // text representation of prior TokenState
    toState       : Text;     // text representation of new TokenState
    actorPrincipal : Text;     // Principal as Text
    action        : Text;     // "create" | "transition" | "approve" | "reject" | "release"
    cplLawId      : Nat;      // CPL law that governed this transition (1-6)
    cplPassed     : Bool;
    details       : Text;     // additional context
    timestamp     : Int;
  };

  // ─── Inter-Canister Message Types ─────────────────────────────────────────

  /// Message sent between canisters when a token state changes.
  public type TokenMessage = {
    messageId    : Text;
    fromModule   : Text;    // "BidConnect" | "FinancialEngine" | "SafetyEngine" | "WorkspaceEngine" | "DocumentEngine"
    toModule     : Text;
    tokenId      : Text;
    tokenKind    : Text;
    eventType    : Text;    // "awarded" | "signed" | "approved" | "released" | "workspace_created"
    payload      : Text;    // JSON-encoded event data
    sentAt       : Int;
    delivered    : Bool;
    deliveredAt  : ?Int;
  };

  // ─── Smart Contract (wrapper for all 4 token types) ────────────────────────

  /// A unified smart contract wrapper that holds references to all lifecycle tokens
  /// and their current collective state for a single construction project.
  public type SmartContract = {
    contractId         : Text;
    tenantId           : Text;
    projectId          : Text;
    projectName        : Text;
    contractType       : Text;   // "prime" | "subcontract" | "owner-gc"
    industry           : Text;   // "commercial" | "healthcare" | "civil" | "stadium" | "environmental" | "industrial"
    bidTokenId         : ?Text;
    awardTokenId       : ?Text;
    payAppTokenIds     : [Text];
    completionTokenId  : ?Text;
    currentPhase       : Text;   // "Bidding" | "Award" | "Construction" | "Completion"
    csiDivisions       : [Text]; // CSI MasterFormat divisions in scope
    createdAt          : Int;
    updatedAt          : Int;
    createdBy          : Text;
    active             : Bool;
  };

  // ─── Engine State ──────────────────────────────────────────────────────────

  public type SmartContractsState = {
    contracts        : List.List<SmartContract>;
    bidTokens        : List.List<BidTokenRecord>;
    awardTokens      : List.List<AwardTokenRecord>;
    payAppTokens     : List.List<PayAppTokenRecord>;
    completionTokens : List.List<CompletionTokenRecord>;
    auditLog         : List.List<TokenAuditEntry>;
    messageQueue     : List.List<TokenMessage>;
    counters         : SmartContractCounters;
  };

  public type SmartContractCounters = {
    var nextContractId   : Nat;
    var nextBidTokenId   : Nat;
    var nextAwardTokenId : Nat;
    var nextPayAppTokenId: Nat;
    var nextCompletionId : Nat;
    var nextAuditId      : Nat;
    var nextMessageId    : Nat;
  };

};

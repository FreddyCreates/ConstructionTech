// types/groq-ai.mo — Groq Construction AI (PRO-1) type definitions

module {

  // ─── Message & Chat ───────────────────────────────────────────────────────

  public type MessageRole = {
    #user;
    #assistant;
    #sysRole;
  };

  public type ChatMessage = {
    id        : Text;           // UUID-style id
    role      : MessageRole;
    content   : Text;
    timestamp : Int;            // nanoseconds (Time.now())
    model     : ?Text;          // which Groq model produced this (assistant only)
    tokens    : ?Nat;           // approximate token count
  };

  // ─── Assistant Context ────────────────────────────────────────────────────

  /// Page tokens that the assistant uses to tailor its system prompt.
  public type AppPage = {
    #home;
    #safety;
    #bidconnect;
    #workspace;
    #financials;
    #documents;
    #design;
    #commandCenter;
    #toolbox;
    #safetyTags;
    #jsaGenerator;
    #payApp;
    #rfi;
    #changeOrder;
    #documents_dge;
    #other : Text;
  };

  /// Active engine label for context-aware routing.
  public type ActiveEngine = {
    #vhde;   // Visus Hazardus Detectio Engine
    #sie;    // Sessio Intelligentia Engine
    #erae;   // Empresa Risicus Aggregatio Engine
    #scie;   // Scientia Culturae Intelligentia Engine
    #fie;    // Fiscus Intelligentia Engine
    #psie;   // Provisio Supplica Intelligentia Engine
    #dge;    // Documentum Generatio Engine
    #nexus;  // Synthesis brain
    #none;
  };

  /// Runtime context sent with every message so the assistant knows
  /// exactly where in the platform the user is operating.
  public type AssistantContext = {
    currentPage      : AppPage;
    currentProjectId : ?Text;    // active project in scope (if any)
    tenantId         : ?Text;    // tenant organisation
    userRole         : ?Text;    // e.g. "safety_director", "gc_pm", "designer"
    activeEngine     : ActiveEngine;
    sessionId        : Text;     // unique per browser session
  };

  // ─── Action Triggers ──────────────────────────────────────────────────────

  /// High-level action types the assistant can request.
  public type ActionType = {
    #navigateTo;          // route the user to a page
    #generateDocument;    // invoke DGE
    #analyzeHazard;       // invoke VHDE
    #runGoNoGo;           // invoke PSIE bid scoring
    #createJsa;           // open JSA generator
    #createSafetyTag;     // open Safety Tag engine
    #calculatePayApp;     // invoke FIE pay-app calculator
    #generateRfi;         // create AIA G716
    #createChangeOrder;   // create G701
    #runNexusSynthesis;   // request full Nexus analysis
    #openToolboxSession;  // start Toolbox Talk
    #lookupOsha;          // query OSHA library
    #lookupCsi;           // query CSI MasterFormat
    #lookupAia;           // query AIA document list
    #custom : Text;       // engine-specific action name
  };

  /// A structured action the assistant wants to trigger on the frontend.
  public type ActionTrigger = {
    actionType    : ActionType;
    parameters    : [(Text, Text)];   // key-value pairs (serialisable)
    targetEngine  : ActiveEngine;
    description   : Text;             // human-readable summary
  };

  // ─── Groq HTTP Types ──────────────────────────────────────────────────────

  /// A single message in the Groq chat completion request body.
  public type GroqRequestMessage = {
    role    : Text;   // "system" | "user" | "assistant"
    content : Text;
  };

  /// Request body sent to Groq /openai/v1/chat/completions via HTTP outcall.
  public type GroqChatRequest = {
    model        : Text;
    messages     : [GroqRequestMessage];
    temperature  : ?Float;    // default 0.7
    max_tokens   : ?Nat;      // hard-cap per call
    top_p        : ?Float;    // default 1.0
    stream       : Bool;      // always false for ICP HTTP outcalls
  };

  /// Usage info returned by Groq.
  public type GroqUsage = {
    prompt_tokens     : Nat;
    completion_tokens : Nat;
    total_tokens      : Nat;
  };

  /// A single completion choice from Groq.
  public type GroqChoice = {
    message       : GroqRequestMessage;
    finish_reason : Text;
    index         : Nat;
  };

  /// Full Groq chat completion response.
  public type GroqChatResponse = {
    id         : Text;
    objectKind : Text;
    created    : Nat;
    model   : Text;
    choices : [GroqChoice];
    usage   : ?GroqUsage;
  };

  // ─── Model Configuration ──────────────────────────────────────────────────

  /// Rate-limit and token-limit metadata for a single Groq model.
  public type GroqModelConfig = {
    modelId         : Text;
    displayName     : Text;
    requestsPerDay  : Nat;      // free-tier daily request cap
    tokensPerMinute : Nat;      // free-tier tokens-per-minute cap
    maxContextTokens: Nat;      // max context window
    recommended     : Bool;     // preferred model for platform tasks
  };

  // ─── Session Store ────────────────────────────────────────────────────────

  /// Persisted chat session for one user × one context.
  public type ChatSession = {
    sessionId  : Text;
    tenantId   : ?Text;
    userPrincipal : Text;
    messages   : [ChatMessage];
    context    : AssistantContext;
    createdAt  : Int;
    updatedAt  : Int;
  };

  // ─── API Boundary Types ───────────────────────────────────────────────────

  /// Result returned to the frontend after a sendMessage call.
  public type SendMessageResult = {
    #ok  : ChatMessage;
    #err : Text;
  };

  /// Result for getAvailableModels.
  public type ModelsResult = {
    #ok  : [GroqModelConfig];
    #err : Text;
  };

  /// Result for getChatHistory.
  public type HistoryResult = {
    #ok  : [ChatMessage];
    #err : Text;
  };

  /// Result for getAssistantContext.
  public type ContextResult = {
    #ok  : AssistantContext;
    #err : Text;
  };

  /// Result for triggerAction.
  public type TriggerActionResult = {
    #ok  : ActionTrigger;
    #err : Text;
  };

  // ─── Key Management & Usage Tracking Types ──────────────────────────────

  /// Status of the Groq API key configuration.
  public type GroqKeyStatus = {
    configured : Bool;
    keyPreview : Text; // last 4 chars only, or "none"
    lastUpdated : Int;
  };

  /// Result of a live key validation test.
  public type GroqKeyValidation = {
    #ok  : { model : Text; response : Text };
    #err : Text;
  };

  /// Per-model daily usage statistics.
  public type UsageStat = {
    modelId      : Text;
    requestCount : Nat;
    tokenCount   : Nat;
    lastUsed     : Int;
  };

  /// Result for usage stats query.
  public type UsageStatsResult = {
    #ok  : [UsageStat];
    #err : Text;
  };

  /// A tenant-scoped chat message for shared team history.
  public type TenantChatMessage = {
    id            : Text;
    sessionId     : Text;
    userPrincipal : Text;
    userId        : Text;    // display name or user ID
    role          : Text;    // "user" | "assistant"
    userRole      : Text;    // platform role: "gc_pm" | "safety_director" | etc.
    content       : Text;
    model         : ?Text;
    tokens        : ?Nat;
    timestamp     : Int;
    pageContext   : Text;    // page user was on when message sent

  };

  /// Result for tenant chat history.
  public type TenantChatResult = {
    #ok  : [TenantChatMessage];
    #err : Text;
  };

  // ─── Engine Output Shared Types (all fields are primitive/shared) ──────────────────

  /// JSA output — shared version with flat arrays of strings
  public type JSAOutputShared = {
    jsaId            : Text;
    tenantId         : Text;
    projectType      : Text;
    trade            : Text;
    taskDescription  : Text;
    stepCount        : Nat;
    stopWorkRequired : Bool;
    emergencyProcedures : [Text];
    hierarchyOfControls : [Text];
    generatedAt      : Int;
    generatedBy      : Text;
    oshaReferences   : [Text];
    ppeRequired      : [Text];
    hazards          : [Text];
    controls         : [Text];
  };

  /// Pay App output — shared version
  public type PayAppOutputShared = {
    payAppId                 : Text;
    tenantId                 : Text;
    projectId                : Text;
    applicationNo            : Nat;
    contractSum              : Float;
    netChangeOrders          : Float;
    contractSumToDate        : Float;
    totalCompletedStored     : Float;
    retainagePercent         : Float;
    retainageAmount          : Float;
    totalEarnedLessRetainage : Float;
    previousPayments         : Float;
    currentPaymentDue        : Float;
    balanceToFinish          : Float;
    lineItemCount            : Nat;
    generatedAt              : Int;
    aiaForm                  : Text;
  };

  /// Safety analysis output — shared version
  public type SafetyAnalysisOutputShared = {
    analysisId               : Text;
    tenantId                 : Text;
    projectId                : Text;
    overallRiskScore         : Nat;
    riskLevel                : Text;
    hazardCount              : Nat;
    enterpriseSummary        : Text;
    cultureScore             : Nat;
    predictedIncidentProb30d : Float;
    stopWorkRequired         : Bool;
    recommendations          : [Text];
    analysedAt               : Int;
    engines                  : [Text];
  };

  /// Cost estimate output — shared version
  public type CostEstimateOutputShared = {
    estimateId    : Text;
    tenantId      : Text;
    projectType   : Text;
    sqFt          : Float;
    totalCost     : Float;
    laborTotal    : Float;
    materialTotal : Float;
    contingency   : Float;
    grandTotal    : Float;
    benchmarkRsf  : Float;
    generatedAt   : Int;
    source        : Text;
    lineItemCount : Nat;
  };

  /// Bid score output — shared version
  public type BidScoreOutputShared = {
    scoreId         : Text;
    tenantId        : Text;
    overallScore    : Nat;
    recommendation  : Text;
    dimensionScores : [(Text, Nat)];
    strengths       : [Text];
    risks           : [Text];
    conditions      : [Text];
    generatedAt     : Int;
  };

  /// Union result from executeEngineFromChat
  public type EngineExecutionResultShared = {
    #jsa            : JSAOutputShared;
    #payApp         : PayAppOutputShared;
    #safetyAnalysis : SafetyAnalysisOutputShared;
    #costEstimate   : CostEstimateOutputShared;
    #bidScore       : BidScoreOutputShared;
    #textResponse   : Text;
    #err            : Text;
  };

  /// Audio transcription result
  public type TranscribeResult = {
    #ok  : { text : Text; language : Text; duration : ?Float };
    #err : Text;
  };

  /// Simple result alias for the chat() function
  public type ChatResult = {
    #ok  : ChatMessage;
    #err : Text;
  };

  // ─── Audit Trail ─────────────────────────────────────────────────────────

  /// One CPL audit log entry — every backend action is recorded here.
  public type AuditEntry = {
    id        : Nat;
    tenantId  : Text;
    userId    : Text;    // caller principal text
    userRole  : Text;
    action    : Text;    // function name or event type
    objectKind : Text;    // affected resource (projectId, jsaId, etc.)
    change    : Text;    // brief description of the change
    timestamp : Int;
    engine    : Text;    // which engine performed the action
  };

  public type AuditTrailResult = {
    #ok  : [AuditEntry];
    #err : Text;
  };
};


// types/pro1.mo — PRO-1 Think-Work-Check-Verify-Deliver engine types
// Ollama + Groq unified AI pipeline types

module {

  // ─── Think Engine Types ──────────────────────────────────────────────────

  /// Classified user intent after think-phase parsing
  public type IntentClass = {
    #conversation;                // General question, no engine trigger
    #jsa : { trade : Text; task : Text };          // Job Safety Analysis
    #safetyAnalysis;             // Full VHDE+ERAE+SCIE analysis
    #payApp : { projectId : Text };               // AIA G702/G703
    #costEstimate : { projectType : Text; sqFt : Float }; // Cost estimate
    #bidScore;                   // Go/No-Go scoring
    #document : { templateType : Text };          // DGE document generation
    #nexus;                      // Full synthesis
    #oshaLookup : { searchText : Text };          // OSHA standards lookup
    #csiLookup : { division : Text };             // CSI MasterFormat
    #aiaLookup : { formNumber : Text };           // AIA form lookup
    #teamChatHistory;            // Retrieve team chat
    #projectStatus;              // Project KPIs and status
  };

  /// Confidence level for intent classification
  public type Confidence = {
    #high;     // > 80% — direct keyword match
    #medium;   // 40–80% — contextual inference
    #low;      // < 40% — conversational default
  };

  /// Think-phase output: structured intent plan
  public type ThinkOutput = {
    originalMessage  : Text;
    intentClass      : IntentClass;
    confidence       : Confidence;
    language         : Text;        // "en" | "es"
    requiresEngine   : Bool;
    engineSequence   : [Text];      // ordered list of engines to invoke
    ollamaAligned    : Bool;        // true if Ollama evidence check passed
    alignmentNotes   : Text;        // Ollama alignment/evidence notes
    planSummary      : Text;        // human-readable plan
  };

  // ─── Work Engine Types ────────────────────────────────────────────────────

  /// Result from each engine invocation in the work phase
  public type EngineWorkItem = {
    engineName : Text;
    outputType : Text;     // "jsa" | "safetyAnalysis" | "payApp" | etc.
    success    : Bool;
    data       : Text;     // JSON-encoded output or error message
    durationMs : Nat;      // execution time
  };

  /// Work-phase output: all engine results
  public type WorkOutput = {
    items          : [EngineWorkItem];
    primaryResult  : Text;   // key engine result (JSON)
    primaryEngine  : Text;
    success        : Bool;
  };

  // ─── Check Engine Types ───────────────────────────────────────────────────

  /// A single validation rule result
  public type ValidationResult = {
    rule     : Text;    // rule name (e.g. "OSHA_1926_501_fall_protection")
    passed   : Bool;
    message  : Text;
    severity : Text;   // "error" | "warning" | "info"
  };

  /// Check-phase output: validation results
  public type CheckOutput = {
    passed      : Bool;
    validations : [ValidationResult];
    errorCount  : Nat;
    warnCount   : Nat;
    summary     : Text;
  };

  // ─── Verify Engine Types ──────────────────────────────────────────────────

  /// Verify-phase output: confirms deliverable is real
  public type VerifyOutput = {
    hasData       : Bool;   // non-empty response content
    hasMath       : Bool;   // numeric calculations verified
    hasOshaRefs   : Bool;   // OSHA citations present when required
    hasDocStruct  : Bool;   // document structure is complete
    isSpanishOk   : Bool;   // Spanish translation correct if needed
    qualityScore  : Nat;    // 0–100
    verified      : Bool;   // overall pass
    notes         : Text;
  };

  // ─── Ollama Integration Types ─────────────────────────────────────────────

  /// Ollama chat message
  public type OllamaMessage = {
    role    : Text;   // "system" | "user" | "assistant"
    content : Text;
  };

  /// Ollama chat request body
  public type OllamaChatRequest = {
    model    : Text;
    messages : [OllamaMessage];
    stream   : Bool;
  };

  /// Ollama response content
  public type OllamaResponse = {
    model            : Text;
    content          : Text;
    done             : Bool;
    total_duration   : ?Nat;   // nanoseconds
    eval_count       : ?Nat;   // tokens generated
  };

  /// Result of Ollama alignment check
  public type OllamaAlignmentResult = {
    #ok : { aligned : Bool; notes : Text; model : Text };
    #err : Text;
    #unavailable;   // Ollama not running on localhost
  };

  // ─── Full PRO-1 Pipeline Output ───────────────────────────────────────────

  /// Complete PRO-1 response after all 5 phases
  public type PRO1Response = {
    messageId     : Text;
    content       : Text;         // Final response text
    model         : Text;         // Groq model used
    tokens        : ?Nat;
    language      : Text;         // "en" | "es"
    think         : ThinkOutput;
    workItems     : [EngineWorkItem];
    checkPassed   : Bool;
    verifyScore   : Nat;           // 0–100
    engineResults : [Text];        // engine names invoked
    timestamp     : Int;
  };

  /// PRO-1 chat result
  public type PRO1Result = {
    #ok  : PRO1Response;
    #err : Text;
  };

  // ─── Context Injection Types ──────────────────────────────────────────────

  /// Platform context injected into every PRO-1 call
  public type PlatformContext = {
    tenantId        : Text;
    userId          : Text;
    userRole        : Text;
    currentPage     : Text;
    projectId       : ?Text;
    safetyScore     : ?Nat;     // Latest ERAE risk score (0–100)
    activeHazards   : Nat;      // Count of open safety tags
    cashFlowStatus  : ?Text;    // "positive" | "neutral" | "negative"
    activeBids      : Nat;      // Count of active bids
    sessionId       : Text;
    language        : Text;     // "en" | "es"
  };

};

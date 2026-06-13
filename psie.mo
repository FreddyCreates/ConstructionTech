/// Evidence + Alignment types for BuildSafe
/// Every AI output is traceable to specific regulations, not vague 'standards'.
module {

  // ─── Source identifiers ───────────────────────────────────────────────────

  public type SourceCorpus = {
    #OSHA_1926;     // OSHA 29 CFR Part 1926 — Construction
    #OSHA_1910;     // OSHA 29 CFR Part 1910 — General Industry
    #AIA_G702;      // AIA G702 Application for Payment
    #AIA_G703;      // AIA G703 Continuation Sheet
    #AIA_G701;      // AIA G701 Change Order
    #AIA_G704;      // AIA G704 Certificate of Substantial Completion
    #AIA_G714;      // AIA G714 Construction Change Directive
    #CSI_DIV01;     // CSI MasterFormat Division 01 — General Requirements
    #CSI_DIV02;     // Division 02 — Existing Conditions
    #CSI_DIV03;     // Division 03 — Concrete
    #CSI_DIV04;     // Division 04 — Masonry
    #CSI_DIV05;     // Division 05 — Metals
    #CSI_DIV06;     // Division 06 — Wood, Plastics, Composites
    #CSI_DIV07;     // Division 07 — Thermal and Moisture Protection
    #CSI_DIV08;     // Division 08 — Openings
    #CSI_DIV09;     // Division 09 — Finishes
    #CSI_DIV10;     // Division 10 — Specialties
    #CSI_DIV11;     // Division 11 — Equipment
    #CSI_DIV12;     // Division 12 — Furnishings
    #CSI_DIV13;     // Division 13 — Special Construction
    #CSI_DIV14;     // Division 14 — Conveying Equipment
    #CSI_DIV21;     // Division 21 — Fire Suppression
    #CSI_DIV22;     // Division 22 — Plumbing
    #CSI_DIV23;     // Division 23 — HVAC
    #CSI_DIV25;     // Division 25 — Integrated Automation
    #CSI_DIV26;     // Division 26 — Electrical
    #CSI_DIV27;     // Division 27 — Communications
    #CSI_DIV28;     // Division 28 — Electronic Safety and Security
    #CSI_DIV31;     // Division 31 — Earthwork
    #CSI_DIV32;     // Division 32 — Exterior Improvements
    #CSI_DIV33;     // Division 33 — Utilities
    #CSI_DIV34;     // Division 34 — Transportation
    #CSI_DIV35;     // Division 35 — Waterway and Marine
    #CSI_DIV40;     // Division 40 — Process Integration
    #CSI_DIV41;     // Division 41 — Material Processing
    #CSI_DIV42;     // Division 42 — Process Heating
    #CSI_DIV43;     // Division 43 — Process Gas/Liquid Handling
    #CSI_DIV44;     // Division 44 — Pollution/Waste Control
    #CSI_DIV48;     // Division 48 — Electrical Power Generation
    #NFPA_70;       // NEC — National Electrical Code
    #ANSI_A10;      // ANSI A10 — Construction and Demolition Safety
    #EPA_NPDES;     // EPA NPDES — Stormwater Permit
    #JOINT_COMMISSION; // Joint Commission — Healthcare Construction
    #LEED_V4;       // LEED v4 — Green Building
    #ADA;           // Americans with Disabilities Act
  };

  // ─── Regulation citation ─────────────────────────────────────────────────
  // e.g. OSHA 1926.1053(b)(1) — not just "OSHA says"

  public type Citation = {
    corpus : SourceCorpus;
    section : Text;         // "1926.1053(b)(1)"
    title : Text;           // "Ladder Safety Requirements"
    fullRef : Text;         // "OSHA 29 CFR 1926.1053(b)(1) — Ladder Safety"
    relevanceScore : Float; // 0.0–1.0 cosine similarity
  };

  // ─── Evidence vector entry ─────────────────────────────────────────────────
  // 768-dim Ollama nomic-embed-text embedding stored as 768 Float values
  // (truncated to 64 dims for on-chain storage; full embed queried at runtime)

  public type EmbedVector = [Float];  // length 64 (compressed), 768 at query time

  public type EvidenceChunk = {
    id : Text;              // corpus#section e.g. "OSHA_1926#1926.502(d)(16)"
    corpus : SourceCorpus;
    section : Text;
    title : Text;
    content : Text;         // full regulation text
    keywords : [Text];      // indexed for fast pre-filter
    embed : EmbedVector;    // 64-dim compressed embedding
    lastUpdated : Int;      // Time.now()
  };

  // ─── Construction risk taxonomy (28 categories) ─────────────────────────

  public type RiskCategory = {
    #Falls;                  // OSHA Focus 4
    #Electrocution;          // OSHA Focus 4
    #StrikeBy;               // OSHA Focus 4
    #CaughtInBetween;        // OSHA Focus 4
    #Excavation;             // OSHA 1926 Subpart P
    #Scaffolding;            // OSHA 1926 Subpart L
    #Cranes;                 // OSHA 1926 Subpart CC
    #PoweredIndustrialTrucks;// OSHA 1910.178
    #ConfidedSpaces;         // OSHA 1926 Subpart AA
    #HazardousMaterials;     // OSHA 1926.59 / HazCom
    #LeadExposure;           // OSHA 1926.62
    #SilicaExposure;         // OSHA 1926.1153
    #AsbestosExposure;       // OSHA 1926.1101
    #HeatStress;             // OSHA heat illness prevention
    #NoiseSIP;               // OSHA 1926.52 — hearing conservation
    #PPE;                    // OSHA 1926.95–106
    #FirePrevention;         // OSHA 1926.150
    #Explosives;             // OSHA 1926.900
    #WeldingCutting;         // OSHA 1926.350
    #DemolitionWork;         // OSHA 1926 Subpart T
    #RoofingWork;            // OSHA 1926.500
    #SteelErection;          // OSHA 1926 Subpart R
    #MasonryWork;            // OSHA 1926.701
    #ConcreteWork;           // OSHA 1926.700
    #TunnelWork;             // OSHA 1926 Subpart S
    #CofferdamWork;          // OSHA 1926 Subpart P
    #EnvironmentalHazards;   // EPA / NPDES
    #ContractCompliance;     // AIA contract violations
  };

  // ─── Alignment check result ───────────────────────────────────────────────

  public type AlignmentStatus = {
    #Compliant;
    #Warning : { message : Text; citations : [Citation] };
    #NonCompliant : { violations : [AlignmentViolation] };
  };

  public type AlignmentViolation = {
    riskCategory : RiskCategory;
    severity : { #Critical; #Major; #Minor };
    description : Text;
    regulationRef : Text;   // e.g. "OSHA 1926.502(d)(16)"
    remediation : Text;     // actionable fix
    citations : [Citation];
  };

  // ─── Audit trail entry ─────────────────────────────────────────────────────

  public type AuditEntry = {
    id : Text;
    timestamp : Int;
    engine : Text;          // e.g. "VHDE", "SIE", "FIE", "PRO1"
    caller : Principal;
    inputSummary : Text;    // brief description of input
    decision : Text;        // what the engine decided
    reasoning : Text;       // why
    evidenceChain : [Citation]; // ordered evidence citations
    alignmentStatus : AlignmentStatus;
    modelUsed : Text;       // e.g. "ollama/nomic-embed-text", "groq/llama-3.3-70b"
    confidenceScore : Float; // 0.0–1.0
  };

  // ─── Tagged AI response ────────────────────────────────────────────────────
  // Every AI response surface wraps output in this type

  public type EvidenceTaggedResponse = {
    content : Text;         // the actual response
    citations : [Citation]; // supporting regulations
    alignmentStatus : AlignmentStatus;
    modelUsed : Text;
    confidenceScore : Float;
    auditId : Text;         // reference into AuditStore
    generatedAt : Int;
  };

  // ─── Ollama embedding request/response ────────────────────────────────────

  public type OllamaEmbedRequest = {
    model : Text;           // "nomic-embed-text"
    input : Text;
  };

  public type OllamaEmbedResponse = {
    embeddings : [[Float]]; // 768-dim vectors
  };

  // ─── Evidence engine state ─────────────────────────────────────────────────

  public type EvidenceState = {
    chunks : [EvidenceChunk];         // corpus embedded chunks
    auditLog : [AuditEntry];          // immutable decision log
    var nextAuditId : Nat;            // monotonic counter
    var ollamaAvailable : Bool;       // checked at init
  };
};

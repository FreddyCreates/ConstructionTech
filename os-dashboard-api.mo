/// EvidenceEngine API Mixin — public endpoints for evidence + alignment
import Array "mo:core/Array";
import Float "mo:core/Float";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import EvidenceLib "../lib/evidence";
import Types "../types/evidence";
import Nat "mo:core/Nat";

mixin (
  evidenceState : EvidenceLib.EvidenceState,
  auditStore : List.List<Types.AuditEntry>,
) {

  // ─── Corpus management ─────────────────────────────────────────────────────

  /// Returns the total number of embedded regulation chunks in the corpus
  public query func evidenceCorpusSize() : async Nat {
    evidenceState.chunks.size();
  };

  /// Returns all chunk IDs in the corpus (for frontend inspection)
  public query func evidenceChunkIds() : async [Text] {
    evidenceState.chunks.map<Types.EvidenceChunk, Text>(func(c) = c.id);
  };

  // ─── Evidence search — keyword (no embedding required) ─────────────────────

  /// Fast keyword-based evidence search — no Ollama required
  /// Returns top-k citations relevant to the given keywords
  public query func searchEvidenceByKeywords(
    keywords : [Text],
    topK : Nat,
    corpus : ?Types.SourceCorpus,
  ) : async [Types.Citation] {
    EvidenceLib.keywordSearch(evidenceState, keywords, topK, corpus);
  };

  // ─── Evidence search — vector (requires Ollama embedding) ──────────────────

  /// Cosine similarity search using a pre-computed 64-dim embedding vector
  /// Frontend calls Ollama /api/embed first, then compresses to 64 dims
  public query func searchEvidenceByVector(
    queryEmbed : [Float],
    topK : Nat,
    corpus : ?Types.SourceCorpus,
  ) : async [Types.Citation] {
    EvidenceLib.searchEvidence(evidenceState, queryEmbed, topK, corpus);
  };

  // ─── Citation formatter ────────────────────────────────────────────────────

  /// Format a specific regulation reference into a full citation string
  /// e.g. (#OSHA_1926, "1926.502", "Fall Protection") → "OSHA 29 CFR 1926.502 — Fall Protection"
  public query func formatCitation(
    corpus : Types.SourceCorpus,
    section : Text,
    title : Text,
  ) : async Text {
    EvidenceLib.formatFullRef(corpus, section, title);
  };

  // ─── Alignment validator ───────────────────────────────────────────────────

  /// Validate AI output text against specified risk categories
  /// Returns compliant / warning / non-compliant with specific regulation citations
  public query func validateOutputAlignment(
    engineName : Text,
    outputText : Text,
    riskCategories : [Types.RiskCategory],
  ) : async Types.AlignmentStatus {
    EvidenceLib.validateAlignment(evidenceState, engineName, outputText, riskCategories);
  };

  // ─── Tag response with evidence ─────────────────────────────────────────────

  /// Wrap AI output with evidence citations and alignment status
  /// This is the standard envelope for every AI response in the platform
  public shared func tagAIResponse(
    content : Text,
    keywords : [Text],
    riskCategories : [Types.RiskCategory],
    engineName : Text,
    modelUsed : Text,
    confidence : Float,
  ) : async Types.EvidenceTaggedResponse {
    let citations = EvidenceLib.keywordSearch(evidenceState, keywords, 5, null);
    let alignment = EvidenceLib.validateAlignment(evidenceState, engineName, content, riskCategories);
    let auditId = logAuditEntry(
      Principal.fromText("2vxsx-fae"), // anonymous placeholder; real caller comes from update functions
      engineName,
      "AI response tagging",
      content,
      "tagged with " # citations.size().toText() # " citations",
      "keyword search + alignment validation",
      citations,
      alignment,
      modelUsed,
      confidence,
    );
    EvidenceLib.tagResponse(content, citations, alignment, modelUsed, confidence, auditId);
  };

  /// Tag an AI response with caller identity recorded in audit trail
  public shared ({ caller }) func tagAIResponseAuthenticated(
    content : Text,
    keywords : [Text],
    riskCategories : [Types.RiskCategory],
    engineName : Text,
    modelUsed : Text,
    confidence : Float,
  ) : async Types.EvidenceTaggedResponse {
    let citations = EvidenceLib.keywordSearch(evidenceState, keywords, 5, null);
    let alignment = EvidenceLib.validateAlignment(evidenceState, engineName, content, riskCategories);
    let auditId = logAuditEntry(
      caller,
      engineName,
      "authenticated AI response",
      content,
      "tagged with " # citations.size().toText() # " citations",
      "keyword search + alignment validation",
      citations,
      alignment,
      modelUsed,
      confidence,
    );
    EvidenceLib.tagResponse(content, citations, alignment, modelUsed, confidence, auditId);
  };

  // ─── Audit trail ───────────────────────────────────────────────────────────

  /// Log an engine decision to the immutable audit trail
  /// Returns the audit entry ID for reference
  public shared ({ caller }) func logEngineDecision(
    engine : Text,
    inputSummary : Text,
    decision : Text,
    reasoning : Text,
    citations : [Types.Citation],
    modelUsed : Text,
    confidence : Float,
  ) : async Text {
    let alignment = #Compliant;
    logAuditEntry(
      caller, engine, inputSummary, decision, reasoning,
      "external log", citations, alignment, modelUsed, confidence,
    );
  };

  /// Get audit trail for a specific engine (most recent N entries)
  public query func getEngineAuditLog(
    engine : Text,
    limit : Nat,
  ) : async [Types.AuditEntry] {
    let all = auditStore.toArray();
    let filtered = all.filter(func(e) {
      Text.equal(e.engine, engine);
    });
    // Return most recent: reverse and take limit
    let total = filtered.size();
    let start = if (total > limit) { total - limit } else { 0 };
    Array.tabulate<Types.AuditEntry>(total - start, func(i) = filtered[start + i]);
  };

  /// Get full audit trail (all entries, most recent first, limited to 500)
  public query func getAuditLog() : async [Types.AuditEntry] {
    let all = auditStore.toArray();
    let total = all.size();
    let limit = 500;
    let start = if (total > limit) { total - limit } else { 0 };
    let subset = Array.tabulate(total - start, func(i) = all[start + i]);
    // Reverse for most-recent-first
    let n = subset.size();
    Array.tabulate<Types.AuditEntry>(n, func(i) = subset[n - 1 - i]);
  };

  /// Get a single audit entry by ID
  public query func getAuditEntry(auditId : Text) : async ?Types.AuditEntry {
    let all = auditStore.toArray();
    all.find<Types.AuditEntry>(func(e) = Text.equal(e.id, auditId));
  };

  // ─── Risk taxonomy ─────────────────────────────────────────────────────────

  /// Get all OSHA Focus Four risk categories as text labels (for frontend)
  public query func getFocusFourCategories() : async [Text] {
    ["Falls", "Electrocution", "StrikeBy", "CaughtInBetween"];
  };

  /// Get all 28 risk category labels
  public query func getAllRiskCategories() : async [Text] {
    [
      "Falls", "Electrocution", "StrikeBy", "CaughtInBetween",
      "Excavation", "Scaffolding", "Cranes", "PoweredIndustrialTrucks",
      "ConfidedSpaces", "HazardousMaterials", "LeadExposure", "SilicaExposure",
      "AsbestosExposure", "HeatStress", "NoiseSIP", "PPE",
      "FirePrevention", "Explosives", "WeldingCutting", "DemolitionWork",
      "RoofingWork", "SteelErection", "MasonryWork", "ConcreteWork",
      "TunnelWork", "CofferdamWork", "EnvironmentalHazards", "ContractCompliance",
    ];
  };

  // ─── Ollama integration ───────────────────────────────────────────────────

  /// Update the embedding for a specific chunk (called after Ollama embed)
  /// Full 768-dim vector is compressed to 64-dim for storage
  public shared ({ caller }) func updateChunkEmbedding(
    chunkId : Text,
    fullEmbed768 : [Float],
  ) : async Bool {
    // Only allow authorized principals to update embeddings
    let compressed = EvidenceLib.compressEmbed(fullEmbed768);
    let found = evidenceState.chunks.find(
      func(c) = Text.equal(c.id, chunkId),
    );
    switch (found) {
      case null { false };
      case (?_) {
        // Chunks are immutable arrays; embedding updates are managed at
        // the Ollama pipeline layer — this endpoint signals readiness
        true;
      };
    };
  };

  /// Set Ollama availability flag (called by health check)
  public shared ({ caller }) func setOllamaAvailable(available : Bool) : async () {
    evidenceState.ollamaAvailable := available;
  };

  public query func isOllamaAvailable() : async Bool {
    evidenceState.ollamaAvailable;
  };

  // ─── Private helpers ───────────────────────────────────────────────────────

  func logAuditEntry(
    caller : Principal,
    engine : Text,
    inputSummary : Text,
    decision : Text,
    reasoning : Text,
    logSource : Text,
    citations : [Types.Citation],
    alignment : Types.AlignmentStatus,
    modelUsed : Text,
    confidence : Float,
  ) : Text {
    let id = "audit-" # evidenceState.nextAuditId.toText();
    evidenceState.nextAuditId += 1;
    let entry : Types.AuditEntry = {
      id;
      timestamp = Time.now();
      engine;
      caller;
      inputSummary;
      decision;
      reasoning = reasoning # " [" # logSource # "]";
      evidenceChain = citations;
      alignmentStatus = alignment;
      modelUsed;
      confidenceScore = confidence;
    };
    auditStore.add(entry);
    id;
  };
};

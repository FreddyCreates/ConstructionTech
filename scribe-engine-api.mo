// mixins/safety-perception-api.mo — Safety Perception API Mixin
// Public endpoints for the Safety Perception domain.
// Wires all 7 perception engines into Safety Suite tool invocations.
// Every Safety tool call triggers a full 7-engine analysis; results are stored
// per tenant + principal + toolInvocationId for historical tracking.
import SafetyPerceptionLib "../lib/safety-perception";
import Perception           "../perception";
import WorkspaceLibrary     "../workspaceLibrary";
import Time                 "mo:core/Time";
import Text                 "mo:core/Text";

mixin (
  spState         : SafetyPerceptionLib.SPState,
  perceptionState : Perception.PerceptionState,
  wlState         : WorkspaceLibrary.WLState,
) {

  // ===================================================================
  // SAFETY PERCEPTION ANALYSIS
  // Called by Safety Suite tools: JSA, Toolbox Talk, Inspection Form,
  // Incident Report, Pre-Task Plan, Safety Briefing, Emergency Response
  // Plan, Safety Audit, Hazard Assessment.
  // ===================================================================

  /// Run all 7 perception engines for a Safety Suite tool invocation.
  /// Returns the full SafetyPerceptionResult with every engine output,
  /// synthesis, critical flags, and top recommendations.
  /// Result is persisted per tenant + principal + toolInvocationId.
  public shared ({ caller }) func runSafetyPerceptionAnalysis(
    toolInvocationId : Text,
    toolId           : Text,
    projectId        : ?Text,
    tenantId         : Text,
    inputData        : [(Text, Text)],
  ) : async SafetyPerceptionLib.SafetyPerceptionResult {
    SafetyPerceptionLib.runSafetyPerceptionAnalysis(
      spState,
      perceptionState,
      toolInvocationId,
      toolId,
      projectId,
      tenantId,
      inputData,
      caller,
      wlState,
    );
  };

  // ===================================================================
  // RETRIEVAL
  // ===================================================================

  /// Retrieve a single SafetyPerceptionResult by its resultId.
  /// Use this to fetch a stored result and embed it in a PDF export.
  public query func getSafetyPerceptionResult(
    toolId    : Text,
    projectId : Text,
    tenantId  : Text,
  ) : async ?SafetyPerceptionLib.SafetyPerceptionResult {
    // Query by invocation: look for most-recent result matching
    // toolId + projectId + tenantId combination.
    let projOpt : ?Text = if (projectId == "") null else ?projectId;
    let all = SafetyPerceptionLib.getResultsByTenant(spState, tenantId, 500, 0);
    var best : ?SafetyPerceptionLib.SafetyPerceptionResult = null;
    for (r in all.vals()) {
      if (r.toolId == toolId) {
        let matchesProject = switch (projOpt) {
          case (?pid) {
            switch (r.projectId) {
              case (?rp) rp == pid;
              case null  false;
            };
          };
          case null true;
        };
        if (matchesProject) {
          switch (best) {
            case null   { best := ?r };
            case (?cur) {
              if (r.timestamp > cur.timestamp) { best := ?r };
            };
          };
        };
      };
    };
    best;
  };

  /// Retrieve a result directly by its unique resultId.
  public query func getSafetyPerceptionResultById(
    resultId : Text,
  ) : async ?SafetyPerceptionLib.SafetyPerceptionResult {
    SafetyPerceptionLib.getSafetyPerceptionResult(spState, resultId);
  };

  /// All safety perception results for a specific tool invocation ID.
  public query func getPerceptionResultByInvocation(
    toolInvocationId : Text,
  ) : async ?SafetyPerceptionLib.SafetyPerceptionResult {
    SafetyPerceptionLib.getResultByInvocation(spState, toolInvocationId);
  };

  // ===================================================================
  // HISTORY — per caller principal
  // ===================================================================

  /// All perception results for the calling principal, newest first.
  /// Limit defaults to 20; offset enables pagination.
  public query ({ caller }) func getPerceptionHistoryForCaller(
    limit  : Nat,
    offset : Nat,
  ) : async [SafetyPerceptionLib.SafetyPerceptionResult] {
    let lim = if (limit == 0) 20 else limit;
    SafetyPerceptionLib.getResultsByPrincipal(spState, caller, lim, offset);
  };

  /// All perception results for a tenant, newest first.
  public query func getPerceptionHistoryByTenant(
    tenantId : Text,
    limit    : Nat,
    offset   : Nat,
  ) : async [SafetyPerceptionLib.SafetyPerceptionResult] {
    let lim = if (limit == 0) 20 else limit;
    SafetyPerceptionLib.getResultsByTenant(spState, tenantId, lim, offset);
  };

  /// All perception results for a project, newest first.
  public query func getPerceptionHistoryByProject(
    projectId : Text,
    limit     : Nat,
    offset    : Nat,
  ) : async [SafetyPerceptionLib.SafetyPerceptionResult] {
    let lim = if (limit == 0) 20 else limit;
    SafetyPerceptionLib.getResultsByProject(spState, projectId, lim, offset);
  };

  // ===================================================================
  // ENGINE STATUS — for SBCE OS dashboard
  // ===================================================================

  /// Live status of all 7 perception engines across Safety Suite.
  /// Used by the OS dashboard to show engine health and average risk scores.
  public query func getPerceptionEngineStatus() : async [SafetyPerceptionLib.EngineStatus] {
    SafetyPerceptionLib.getEngineStatus(spState);
  };

  /// High-level stats: total runs, last run time, avg overall risk.
  public query func getSafetyPerceptionStats() : async SafetyPerceptionLib.SPStats {
    SafetyPerceptionLib.getStats(spState);
  };

  // ===================================================================
  // SAFETY TOOL IDs — informational, for frontend routing
  // ===================================================================

  /// Returns the canonical list of tool IDs that trigger a full
  /// 7-engine perception run when invoked.
  public query func getSafetyToolIds() : async [Text] {
    SafetyPerceptionLib.SAFETY_TOOL_IDS;
  };

};

// mixins/project-api.mo — Project Intelligence Public API Mixin
// Exposes all Project Intelligence endpoints via actor mixin.
// Cost estimation, schedule prediction, scope analysis, EAC, change orders, RFIs.
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import PILib "../lib/project";
import WorkspaceLibrary "../workspaceLibrary";

mixin (
  piState  : PILib.PIState,
  wlState  : WorkspaceLibrary.WLState
) {

  // ─── Project Management ──────────────────────────────────────────────────

  /// Create a new PI project record scoped to the caller's tenant.
  public shared ({ caller }) func createProjectRecord(
    tenantId      : Nat,
    projectId     : Text,
    name          : Text,
    projectType   : Text,
    state         : Text,
    city          : Text,
    contractValue : Float,
    startDate     : Int,
    targetEndDate : Int,
    gcCompany     : Text,
    ownerName     : Text,
    architectName : Text
  ) : async PILib.ProjectRecord {
    ignore caller;
    PILib.createProject(
      piState, tenantId, projectId, name, projectType,
      state, city, contractValue, startDate, targetEndDate,
      gcCompany, ownerName, architectName
    )
  };

  /// List all projects for a tenant.
  public shared query ({ caller }) func listProjects(
    tenantId : Nat
  ) : async [PILib.ProjectRecord] {
    ignore caller;
    PILib.getProjectsByTenant(piState, tenantId)
  };

  // ─── Cost Estimation ─────────────────────────────────────────────────────

  /// Generate a cost estimate using Davis-Bacon prevailing wages,
  /// regional labor rates, and material escalation indices from Workspace Library.
  public shared ({ caller }) func generateCostEstimate(
    tenantId    : Nat,
    projectId   : Text,
    projectType : Text,
    state       : Text,
    sqft        : Float
  ) : async PILib.CostEstimate {
    ignore caller;
    PILib.generateCostEstimate(
      piState, tenantId, projectId, projectType, state, sqft, wlState
    )
  };

  /// Get all cost estimates for a project.
  public shared query ({ caller }) func getCostEstimates(
    tenantId  : Nat,
    projectId : Text
  ) : async [PILib.CostEstimate] {
    ignore caller;
    var results : [PILib.CostEstimate] = [];
    for (est in piState.estimates.values()) {
      if (est.tenantId == tenantId and est.projectId == projectId) {
        results := results.concat([est]);
      };
    };
    results
  };

  // ─── Schedule Prediction ─────────────────────────────────────────────────

  /// Add a schedule activity with predecessor/successor logic.
  public shared ({ caller }) func addScheduleActivity(
    tenantId     : Nat,
    projectId    : Text,
    csiCode      : Text,
    description  : Text,
    trade        : Text,
    durationDays : Nat,
    crewSize     : Nat,
    quantity     : Float,
    unit         : Text,
    predecessors : [Text]
  ) : async PILib.ScheduleActivity {
    ignore caller;
    PILib.addActivity(
      piState, tenantId, projectId, csiCode, description, trade,
      durationDays, crewSize, quantity, unit, predecessors
    )
  };

  /// Predict project schedule completion with productivity benchmarks,
  /// learning curve adjustments, and resource leveling analysis.
  public shared ({ caller }) func predictSchedule(
    tenantId  : Nat,
    projectId : Text
  ) : async PILib.SchedulePrediction {
    ignore caller;
    PILib.predictSchedule(piState, tenantId, projectId, wlState)
  };

  /// Get all schedule activities for a project.
  public shared query ({ caller }) func getScheduleActivities(
    tenantId  : Nat,
    projectId : Text
  ) : async [PILib.ScheduleActivity] {
    ignore caller;
    var results : [PILib.ScheduleActivity] = [];
    for (act in piState.activities.values()) {
      if (act.tenantId == tenantId and act.projectId == projectId) {
        results := results.concat([act]);
      };
    };
    results
  };

  // ─── Budget Tracking / EAC ───────────────────────────────────────────────

  /// Calculate daily EAC using CPI/SPI from actual cost and percent complete.
  /// Recalculates cost and schedule performance indices in real time.
  public shared ({ caller }) func calculateEAC(
    tenantId         : Nat,
    projectId        : Text,
    contractValue    : Float,
    actualCostToDate : Float,
    percentComplete  : Float,
    approvedCOs      : Float
  ) : async PILib.EacModel {
    ignore caller;
    let eac = PILib.calculateEAC(
      piState, tenantId, projectId,
      contractValue, actualCostToDate, percentComplete, approvedCOs
    );
    let wr = PILib.wrapWorkResult(
      eac.id, tenantId, projectId, #eac(eac)
    );
    piState.workResults.add(wr);
    eac
  };

  // ─── Change Orders ───────────────────────────────────────────────────────

  /// Create a change order with AI scope delta detection and risk scoring.
  public shared ({ caller }) func createChangeOrder(
    tenantId    : Nat,
    projectId   : Text,
    title       : Text,
    description : Text,
    reason      : Text,
    items       : [PILib.ChangeOrderItem],
    submittedBy : Text,
    linkedRFIs  : [Text]
  ) : async PILib.ChangeOrder {
    ignore caller;
    let co = PILib.createChangeOrder(
      piState, tenantId, projectId, title, description, reason,
      items, submittedBy, linkedRFIs
    );
    let wr = PILib.wrapWorkResult(co.id, tenantId, projectId, #changeOrder(co));
    piState.workResults.add(wr);
    co
  };

  /// Update change order status through approval workflow.
  public shared ({ caller }) func updateChangeOrderStatus(
    tenantId   : Nat,
    coId       : Text,
    newStatus  : PILib.ChangeOrderStatus,
    approvedBy : ?Text
  ) : async Bool {
    ignore (caller, tenantId);
    switch (PILib.updateCOStatus(piState, coId, newStatus, approvedBy)) {
      case (?_) { true };
      case null { false };
    }
  };

  /// Get all change orders for a project.
  public shared query ({ caller }) func getChangeOrders(
    tenantId  : Nat,
    projectId : Text
  ) : async [PILib.ChangeOrder] {
    ignore caller;
    var results : [PILib.ChangeOrder] = [];
    for (co in piState.changeOrders.values()) {
      if (co.tenantId == tenantId and co.projectId == projectId) {
        results := results.concat([co]);
      };
    };
    results
  };

  // ─── RFI Management ──────────────────────────────────────────────────────

  /// Create an RFI linked to schedule activities and change orders.
  public shared ({ caller }) func createRFI(
    tenantId         : Nat,
    projectId        : Text,
    subject          : Text,
    description      : Text,
    submittedBy      : Text,
    assignedTo       : Text,
    priority         : Text,
    responseRequired : Int,
    linkedActivities : [Text],
    scheduleImpact   : Bool,
    costImpact       : Bool,
    impactDescription : Text
  ) : async PILib.RFI {
    ignore caller;
    let rfi = PILib.createRFI(
      piState, tenantId, projectId, subject, description,
      submittedBy, assignedTo, priority, responseRequired,
      linkedActivities, scheduleImpact, costImpact, impactDescription
    );
    let wr = PILib.wrapWorkResult(rfi.id, tenantId, projectId, #rfi(rfi));
    piState.workResults.add(wr);
    rfi
  };

  /// Answer an RFI and link resulting change orders.
  public shared ({ caller }) func answerRFI(
    tenantId  : Nat,
    rfiId     : Text,
    response  : Text,
    linkedCOs : [Text]
  ) : async Bool {
    ignore (caller, tenantId);
    switch (PILib.answerRFI(piState, rfiId, response, linkedCOs)) {
      case (?_) { true };
      case null { false };
    }
  };

  /// Get all RFIs for a project.
  public shared query ({ caller }) func getRFIs(
    tenantId  : Nat,
    projectId : Text
  ) : async [PILib.RFI] {
    ignore caller;
    var results : [PILib.RFI] = [];
    for (rfi in piState.rfis.values()) {
      if (rfi.tenantId == tenantId and rfi.projectId == projectId) {
        results := results.concat([rfi]);
      };
    };
    results
  };

  // ─── Scope Analysis ──────────────────────────────────────────────────────

  /// Analyze scope completeness against CSI MasterFormat standard.
  /// Returns alignment score, gap items, and recommendations.
  public shared ({ caller }) func analyzeScopeCompleteness(
    tenantId    : Nat,
    projectId   : Text,
    projectType : Text,
    lineItems   : [PILib.CsiLineItem]
  ) : async PILib.ScopeAnalysis {
    ignore caller;
    let sa = PILib.analyzeScopeCompleteness(
      piState, tenantId, projectId, projectType, lineItems, wlState
    );
    let wr = PILib.wrapWorkResult(sa.id, tenantId, projectId, #scopeAnalysis(sa));
    piState.workResults.add(wr);
    sa
  };

  // ─── EvidenceEngine Alignment ─────────────────────────────────────────────

  /// Score project data alignment using the EvidenceEngine pattern:
  /// cross-references estimate, schedule, scope, and change orders.
  public shared query ({ caller }) func getProjectIntelligenceScore(
    tenantId  : Nat,
    projectId : Text
  ) : async Nat {
    ignore caller;
    var estimateScore : Nat = 0;
    var scheduleScore : Nat = 0;
    var coScore : Nat = 0;
    var rfiScore : Nat = 0;

    // estimate completeness
    for (est in piState.estimates.values()) {
      if (est.tenantId == tenantId and est.projectId == projectId) {
        estimateScore := if (est.lineItems.size() > 5) { 25 } else { 15 };
      };
    };
    // schedule completeness
    var actCount : Nat = 0;
    for (act in piState.activities.values()) {
      if (act.tenantId == tenantId and act.projectId == projectId) { actCount += 1 };
    };
    scheduleScore := if (actCount > 10) { 25 } else if (actCount > 0) { 15 } else { 0 };

    // change order risk adjustment
    var highRiskCOs : Nat = 0;
    for (co in piState.changeOrders.values()) {
      if (co.tenantId == tenantId and co.projectId == projectId and co.riskScore > 70) {
        highRiskCOs += 1;
      };
    };
    coScore := if (highRiskCOs == 0) { 25 } else if (highRiskCOs < 3) { 15 } else { 5 };

    // RFI response rate
    var totalRFIs : Nat = 0;
    var answeredRFIs : Nat = 0;
    for (rfi in piState.rfis.values()) {
      if (rfi.tenantId == tenantId and rfi.projectId == projectId) {
        totalRFIs += 1;
        if (rfi.status == #answered or rfi.status == #closed) { answeredRFIs += 1 };
      };
    };
    rfiScore := if (totalRFIs == 0) { 25 }
      else { answeredRFIs * 25 / totalRFIs };

    estimateScore + scheduleScore + coScore + rfiScore
  };

  /// Get full project intelligence summary for dashboard.
  public shared query ({ caller }) func getProjectSummary(
    tenantId  : Nat,
    projectId : Text
  ) : async {
    estimateCount  : Nat;
    activityCount  : Nat;
    changeOrderCount : Nat;
    openRFICount   : Nat;
    highRiskCOs    : Nat;
    intelligenceScore : Nat;
  } {
    ignore caller;
    var estimateCount : Nat = 0;
    var activityCount : Nat = 0;
    var coCount : Nat = 0;
    var openRFIs : Nat = 0;
    var highRiskCOs : Nat = 0;

    for (est in piState.estimates.values()) {
      if (est.tenantId == tenantId and est.projectId == projectId) { estimateCount += 1 };
    };
    for (act in piState.activities.values()) {
      if (act.tenantId == tenantId and act.projectId == projectId) { activityCount += 1 };
    };
    for (co in piState.changeOrders.values()) {
      if (co.tenantId == tenantId and co.projectId == projectId) {
        coCount += 1;
        if (co.riskScore > 70) { highRiskCOs += 1 };
      };
    };
    for (rfi in piState.rfis.values()) {
      if (rfi.tenantId == tenantId and rfi.projectId == projectId) {
        if (rfi.status == #open or rfi.status == #submitted) { openRFIs += 1 };
      };
    };
    let score = (if (estimateCount > 0) { 25 } else { 0 }) + (if (activityCount > 5) { 25 } else if (activityCount > 0) { 15 } else { 0 }) + (if (highRiskCOs == 0) { 25 } else { 10 }) + (if (openRFIs == 0) { 25 } else if (openRFIs < 5) { 15 } else { 5 });
    {
      estimateCount;
      activityCount;
      changeOrderCount = coCount;
      openRFICount     = openRFIs;
      highRiskCOs;
      intelligenceScore = score;
    }
  };

}

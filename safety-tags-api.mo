// mixins/handoff-api.mo — Designer Workflow Handoff public API
// CPL governance check on every function entry.
// Colony Unification Theorem: every send dispatches a BHX Worker task;
// every delivery fires a native MessagingEngine signal.
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import CPL "../cpl";
import HandoffLib "../lib/handoff";
import MessagingEngine "../messaging";

mixin (
  _handoffState : HandoffLib.HandoffStateInternal,
  _messagingState : MessagingEngine.MessagingState,
) {

  // ── CPL governance helper ─────────────────────────────────────────────────
  func _cplCheck(caller : Principal) : () {
    let ok = CPL.authorityCheck(#GCUser, #GCUser);
    if (not ok) { Runtime.trap("CPL authority check failed") };
    if (caller.isAnonymous()) { Runtime.trap("Authentication required: anonymous callers rejected") };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // generateHandoffPackage
  // Creates a new Handoff record in draft status; auto-detects recipient groups.
  // ─────────────────────────────────────────────────────────────────────────
  public shared ({ caller }) func generateHandoffPackage(
    projectId   : Text,
    projectName : Text,
    scopeItems  : [HandoffLib.ScopeItem],
  ) : async { #ok : HandoffLib.Handoff; #err : Text } {
    _cplCheck(caller);
    if (projectId == "") { return #err("projectId cannot be empty") };
    if (projectName == "") { return #err("projectName cannot be empty") };
    if (scopeItems.size() == 0) { return #err("scopeItems cannot be empty") };

    let handoff = HandoffLib.createHandoff(
      _handoffState, caller, projectId, projectName, scopeItems,
    );

    // Auto-detect and wire recipient groups immediately
    let groups = HandoffLib.autoDetectTradeGroups(scopeItems);
    switch (HandoffLib.setRecipients(_handoffState, caller, handoff.id, groups)) {
      case (#ok(h)) { #ok(h) };
      case (#err(e)) { #err(e) };
    };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // autoDetectTradeGroups
  // Pure function — maps scope item CSI divisions to trade group recipients.
  // ─────────────────────────────────────────────────────────────────────────
  public shared ({ caller }) func autoDetectTradeGroupsForScope(
    scopeItems : [HandoffLib.ScopeItem],
  ) : async [HandoffLib.RecipientGroup] {
    _cplCheck(caller);
    HandoffLib.autoDetectTradeGroups(scopeItems);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // setHandoffRecipients
  // Replaces the recipient group list on an existing handoff (manual override).
  // ─────────────────────────────────────────────────────────────────────────
  public shared ({ caller }) func setHandoffRecipients(
    handoffId       : Nat,
    recipientGroups : [HandoffLib.RecipientGroup],
  ) : async { #ok : HandoffLib.Handoff; #err : Text } {
    _cplCheck(caller);
    HandoffLib.setRecipients(_handoffState, caller, handoffId, recipientGroups);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // sendHandoff
  // Validates scope, marks status "sending", then dispatches one native message
  // per recipient group through the MessagingEngine (fire-and-forget).
  // ─────────────────────────────────────────────────────────────────────────
  public shared ({ caller }) func sendHandoff(
    handoffId : Nat,
  ) : async { #ok : HandoffLib.Handoff; #err : Text } {
    _cplCheck(caller);
    let handoffOpt = HandoffLib.getHandoff(_handoffState, handoffId);
    switch handoffOpt {
      case null { return #err("Handoff " # handoffId.toText() # " not found") };
      case (?h) {
        if (h.designerPrincipal != caller) {
          return #err("Unauthorized: not the handoff owner");
        };
        if (h.status == "sent" or h.status == "completed") {
          return #err("Handoff already sent");
        };
        if (h.recipientGroups.size() == 0) {
          return #err("No recipient groups configured — call setHandoffRecipients first");
        };

        // Scope validation — Nexus gap detection
        let validation = HandoffLib.validateScope(h.scopeItems);
        if (not validation.valid) {
          HandoffLib.setHandoffStatus(_handoffState, handoffId, "validating");
          // Surface gaps as a structured error so the UI can prompt the designer
          let gapSummary = validation.gaps.foldLeft(
            "",
            func(acc, g) { acc # "[" # g.severity # "] div " # g.csiDivision # ": " # g.description # "; " },
          );
          let anomalySummary = validation.budgetAnomalies.foldLeft(
            "",
            func(acc, a) { acc # a # "; " },
          );
          // Non-blocking: warnings only stop with #err when anomalies present
          // Gaps are warnings; proceed but surface them. Budget anomalies block.
          if (validation.budgetAnomalies.size() > 0) {
            return #err("Budget anomalies detected: " # anomalySummary # "Gaps: " # gapSummary);
          };
          // Gaps are warnings only — continue sending but note them
        };

        HandoffLib.setHandoffStatus(_handoffState, handoffId, "sending");

        // Dispatch one native message per recipient group (fire-and-forget).
        // State is mutated before the inter-canister calls to satisfy ICP best practice.
        var groupIndex : Nat = 0;
        for (group in h.recipientGroups.vals()) {
          let subject = "[OIS Handoff] " # h.projectName # " — " # group.groupName # " Package";
          let body    = HandoffLib.buildMessageBody(h, group);

          // Re-read h to get the freshest state for each iteration
          let hNow : HandoffLib.Handoff = switch (HandoffLib.getHandoff(_handoffState, handoffId)) {
            case (?x) x; case null h;
          };

          // Fire-and-forget: send via MessagingEngine, mark group sent on success
          let msgResult = await MessagingEngine.sendNativeMessage(
            _messagingState,
            caller,
            hNow.designerPrincipal,  // sender = designer principal (loop-back for logging)
            subject # "\n" # body,
            1,  // priority 1 = high
          );
          let success = msgResult.deliveryStatus == #sent or msgResult.deliveryStatus == #delivered;
          HandoffLib.markGroupSent(_handoffState, handoffId, groupIndex, success);
          groupIndex += 1;
        };

        // Return final handoff state
        switch (HandoffLib.getHandoff(_handoffState, handoffId)) {
          case (?final) { #ok(final) };
          case null     { #err("Handoff state lost after send — internal error") };
        };
      };
    };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // getHandoff
  // ─────────────────────────────────────────────────────────────────────────
  public query ({ caller }) func getHandoff(handoffId : Nat) : async ?HandoffLib.Handoff {
    _cplCheck(caller);
    HandoffLib.getHandoff(_handoffState, handoffId);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // listHandoffs — all handoffs owned by the calling principal
  // ─────────────────────────────────────────────────────────────────────────
  public query ({ caller }) func listHandoffs() : async [HandoffLib.Handoff] {
    _cplCheck(caller);
    HandoffLib.listHandoffsForCaller(_handoffState, caller);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // listHandoffsByProject
  // ─────────────────────────────────────────────────────────────────────────
  public query ({ caller }) func listHandoffsByProject(
    projectId : Text,
  ) : async [HandoffLib.Handoff] {
    _cplCheck(caller);
    HandoffLib.listHandoffsByProject(_handoffState, projectId);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // getHandoffDeliveryStatus
  // Returns per-group delivery status and a rolled-up overall status.
  // ─────────────────────────────────────────────────────────────────────────
  public query ({ caller }) func getHandoffDeliveryStatus(
    handoffId : Nat,
  ) : async { recipientGroups : [HandoffLib.RecipientGroup]; overallStatus : Text } {
    _cplCheck(caller);
    switch (HandoffLib.getHandoff(_handoffState, handoffId)) {
      case null {
        { recipientGroups = []; overallStatus = "not_found" };
      };
      case (?h) {
        let overall = HandoffLib.computeOverallStatus(h.recipientGroups);
        { recipientGroups = h.recipientGroups; overallStatus = overall };
      };
    };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // resendHandoffPackage
  // Resends to a single recipient group by index.
  // ─────────────────────────────────────────────────────────────────────────
  public shared ({ caller }) func resendHandoffPackage(
    handoffId  : Nat,
    groupIndex : Nat,
  ) : async { #ok : (); #err : Text } {
    _cplCheck(caller);
    switch (HandoffLib.getHandoff(_handoffState, handoffId)) {
      case null { #err("Handoff " # handoffId.toText() # " not found") };
      case (?h) {
        if (h.designerPrincipal != caller) {
          return #err("Unauthorized: not the handoff owner");
        };
        if (groupIndex >= h.recipientGroups.size()) {
          return #err("groupIndex " # groupIndex.toText() # " out of range");
        };
        let group   = h.recipientGroups[groupIndex];
        let subject = "[OIS Resend] " # h.projectName # " — " # group.groupName # " Package";
        let body    = HandoffLib.buildMessageBody(h, group);

        let msgResult = await MessagingEngine.sendNativeMessage(
          _messagingState,
          caller,
          h.designerPrincipal,
          subject # "\n" # body,
          1,
        );
        let success = msgResult.deliveryStatus == #sent or msgResult.deliveryStatus == #delivered;
        HandoffLib.markGroupSent(_handoffState, handoffId, groupIndex, success);
        if (success) { #ok(()) } else { #err("Message delivery failed for group " # group.groupName) };
      };
    };
  };

}

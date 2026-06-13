// mixins/procurement-api.mo — Full Procurement Lifecycle API Mixin
// Pre-bid phase, 12-dimension Go/No-Go, bid evaluation, buyout,
// long-lead procurement, and subcontractor management.
import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Procurement "../lib/procurement";
import ProcTypes "../types/procurement";

mixin (state : Procurement.ProcurementState) {

  // ─── Pre-Bid Phase ────────────────────────────────────────────────────────

  /// Create an Invitation to Bid (ITB) for a project.
  public shared ({ caller }) func createITB(
    tenantId       : Nat,
    projectId      : Text,
    projectName    : Text,
    owner          : Text,
    projectType    : Text,
    location       : Text,
    estimatedValue : Nat,
    scopeSummary   : Text,
    bidDate        : Int,
    bondRequired   : Bool,
    bondAmount     : Nat,
    prevailingWage : Bool,
    insuranceReqs  : [Text],
    contactName    : Text,
    contactEmail   : Text,
    invitedSubs    : [Text]
  ) : async ProcTypes.ITBRecord {
    ignore caller;
    let record = Procurement.createITB(
      projectId, tenantId, projectName, owner, projectType, location,
      estimatedValue, scopeSummary, bidDate, bondRequired, bondAmount,
      prevailingWage, insuranceReqs, contactName, contactEmail, invitedSubs
    );
    state.itbs.add(record);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #itb(record), caller));
    record
  };

  /// Get all ITBs for a tenant.
  public shared query ({ caller }) func getITBs(
    tenantId : Nat
  ) : async [ProcTypes.ITBRecord] {
    ignore caller;
    var results : [ProcTypes.ITBRecord] = [];
    for (r in state.itbs.values()) {
      if (r.tenantId == tenantId) { results := results.concat([r]) };
    };
    results
  };

  /// Get a single ITB by ID.
  public shared query ({ caller }) func getITB(
    tenantId : Nat,
    itbId    : Text
  ) : async ?ProcTypes.ITBRecord {
    ignore caller;
    state.itbs.values().find(func(r : ProcTypes.ITBRecord) : Bool {
      r.tenantId == tenantId and r.itbId == itbId
    })
  };

  /// Create a Request for Proposal (RFP).
  public shared ({ caller }) func createRFP(
    tenantId               : Nat,
    projectId              : Text,
    projectName            : Text,
    owner                  : Text,
    scopeNarrative         : Text,
    evaluationCriteria     : [Text],
    submissionRequirements : [Text],
    dueDate                : Int,
    awardCriteria          : Text
  ) : async ProcTypes.RFPRecord {
    ignore caller;
    let record = Procurement.createRFP(
      projectId, tenantId, projectName, owner, scopeNarrative,
      evaluationCriteria, submissionRequirements, dueDate, awardCriteria
    );
    state.rfps.add(record);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #rfp(record), caller));
    record
  };

  /// Log a pre-bid meeting.
  public shared ({ caller }) func logPreBidMeeting(
    tenantId         : Nat,
    projectId        : Text,
    meetingDate      : Int,
    location         : Text,
    attendees        : [Text],
    agendaItems      : [Text],
    minutesSummary   : Text,
    questionsAnswers : [(Text, Text)]
  ) : async ProcTypes.PreBidMeeting {
    ignore caller;
    let record = Procurement.logPreBidMeeting(
      projectId, tenantId, meetingDate, location, attendees,
      agendaItems, minutesSummary, questionsAnswers
    );
    state.preBidMeetings.add(record);
    record
  };

  /// Log a site visit walkthrough.
  public shared ({ caller }) func logSiteVisit(
    tenantId            : Nat,
    projectId           : Text,
    visitDate           : Int,
    attendees           : [Text],
    siteConditions      : Text,
    accessRequirements  : Text,
    notes               : Text
  ) : async ProcTypes.SiteVisitLog {
    ignore caller;
    let record = Procurement.logSiteVisit(
      projectId, tenantId, visitDate, attendees,
      siteConditions, accessRequirements, notes
    );
    state.siteVisits.add(record);
    record
  };

  // ─── 12-Dimension Go/No-Go Scoring ────────────────────────────────────────

  /// Run the 12-dimension Go/No-Go scoring model.
  /// scoreInputs must be 12 values (0-10), one per dimension in order:
  /// [projectTypeFit, geographicProximity, valueBondingCapacity, ownerRelationship,
  ///  designTeamRelationship, scheduleFeasibility, backlogCapacity, estimatedMargin,
  ///  riskProfile, subcontractorAvailability, competition, strategicValue]
  public shared ({ caller }) func scoreBidGoNoGo(
    tenantId       : Nat,
    projectId      : Text,
    projectName    : Text,
    projectType    : Text,
    estimatedValue : Nat,
    scoreInputs    : [Nat]
  ) : async ProcTypes.GoNoGoResult {
    ignore caller;
    let result = Procurement.scoreGoNoGo(
      projectId, tenantId, projectName, projectType, estimatedValue, scoreInputs
    );
    state.goNoGoResults.add(result);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #goNoGo(result), caller));
    result
  };

  /// Get all Go/No-Go results for a tenant.
  public shared query ({ caller }) func getGoNoGoResults(
    tenantId : Nat
  ) : async [ProcTypes.GoNoGoResult] {
    ignore caller;
    var results : [ProcTypes.GoNoGoResult] = [];
    for (r in state.goNoGoResults.values()) {
      if (r.tenantId == tenantId) { results := results.concat([r]) };
    };
    results
  };

  /// Get a specific Go/No-Go result.
  public shared query ({ caller }) func getGoNoGoResult(
    tenantId  : Nat,
    projectId : Text
  ) : async ?ProcTypes.GoNoGoResult {
    ignore caller;
    state.goNoGoResults.values().find(func(r : ProcTypes.GoNoGoResult) : Bool {
      r.tenantId == tenantId and r.projectId == projectId
    })
  };

  // ─── Bid Evaluation ───────────────────────────────────────────────────────

  /// Submit a bid leveling sheet — apples-to-apples comparison for a CSI division.
  public shared ({ caller }) func levelBids(
    tenantId    : Nat,
    projectId   : Text,
    title       : Text,
    csiDivision : Text,
    entries     : [ProcTypes.BidLevelingEntry]
  ) : async ProcTypes.BidLevelingSheet {
    ignore caller;
    let sheet = Procurement.levelBids(projectId, tenantId, title, csiDivision, entries);
    state.bidLevelingSheets.add(sheet);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #bidLeveling(sheet), caller));
    sheet
  };

  /// Get all bid leveling sheets for a project.
  public shared query ({ caller }) func getBidLevelingSheets(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.BidLevelingSheet] {
    ignore caller;
    var results : [ProcTypes.BidLevelingSheet] = [];
    for (s in state.bidLevelingSheets.values()) {
      if (s.tenantId == tenantId and s.projectId == projectId) { results := results.concat([s]) };
    };
    results
  };

  /// Create a scope clarification request to a sub.
  public shared ({ caller }) func createScopeClarification(
    tenantId  : Nat,
    projectId : Text,
    subId     : Text,
    subName   : Text,
    question  : Text
  ) : async ProcTypes.ScopeClarification {
    ignore caller;
    let record = Procurement.createScopeClarification(projectId, tenantId, subId, subName, question);
    state.scopeClarifications.add(record);
    record
  };

  /// Answer a scope clarification.
  public shared ({ caller }) func answerScopeClarification(
    tenantId        : Nat,
    clarificationId : Text,
    response        : Text
  ) : async ProcTypes.ScopeClarification {
    ignore (caller, tenantId);
    switch (state.scopeClarifications.values().find(
      func(c : ProcTypes.ScopeClarification) : Bool { c.clarificationId == clarificationId }
    )) {
      case null { Runtime.trap("Scope clarification not found: " # clarificationId) };
      case (?existing) {
        let updated = Procurement.answerClarification(existing, response);
        state.scopeClarifications.mapInPlace(func(c : ProcTypes.ScopeClarification) : ProcTypes.ScopeClarification {
          if (c.clarificationId == clarificationId) { updated } else { c }
        });
        updated
      };
    }
  };

  /// Submit a Value Engineering proposal.
  public shared ({ caller }) func submitVEProposal(
    tenantId            : Nat,
    projectId           : Text,
    subId               : Text,
    subName             : Text,
    csiDivision         : Text,
    description         : Text,
    costSavings         : Nat,
    scheduleSavingsDays : Int,
    qualityImpact       : Text
  ) : async ProcTypes.VEProposal {
    ignore caller;
    let proposal = Procurement.submitVEProposal(
      projectId, tenantId, subId, subName, csiDivision,
      description, costSavings, scheduleSavingsDays, qualityImpact
    );
    state.veProposals.add(proposal);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #veProposal(proposal), caller));
    proposal
  };

  /// Get all VE proposals for a project.
  public shared query ({ caller }) func getVEProposals(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.VEProposal] {
    ignore caller;
    var results : [ProcTypes.VEProposal] = [];
    for (v in state.veProposals.values()) {
      if (v.tenantId == tenantId and v.projectId == projectId) { results := results.concat([v]) };
    };
    results
  };

  // ─── Buyout Phase ─────────────────────────────────────────────────────────

  /// Create a subcontract record after scope review.
  public shared ({ caller }) func createSubcontract(
    tenantId           : Nat,
    projectId          : Text,
    subId              : Text,
    subName            : Text,
    csiDivisions       : [Text],
    scopeSummary       : Text,
    contractValue      : Nat,
    retainagePct       : Nat,
    startDate          : Int,
    endDate            : Int,
    flowDownProvisions : [ProcTypes.FlowDownProvision]
  ) : async ProcTypes.SubcontractRecord {
    ignore caller;
    let record = Procurement.createSubcontract(
      projectId, tenantId, subId, subName, csiDivisions, scopeSummary,
      contractValue, retainagePct, startDate, endDate, flowDownProvisions
    );
    state.subcontracts.add(record);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #subcontract(record), caller));
    record
  };

  /// Get standard AIA A401 flow-down provisions for inclusion in subcontracts.
  public shared query ({ caller }) func getStandardFlowDownProvisions() : async [ProcTypes.FlowDownProvision] {
    ignore caller;
    Procurement.standardFlowDownProvisions()
  };

  /// Add insurance certificates to a subcontract.
  public shared ({ caller }) func verifySubInsurance(
    tenantId      : Nat,
    subcontractId : Text,
    coverages     : [ProcTypes.InsuranceCoverage]
  ) : async ProcTypes.SubcontractRecord {
    ignore (caller, tenantId);
    switch (state.subcontracts.values().find(
      func(s : ProcTypes.SubcontractRecord) : Bool { s.subcontractId == subcontractId }
    )) {
      case null { Runtime.trap("Subcontract not found: " # subcontractId) };
      case (?existing) {
        let updated = Procurement.verifyInsurance(existing, coverages);
        state.subcontracts.mapInPlace(func(s : ProcTypes.SubcontractRecord) : ProcTypes.SubcontractRecord {
          if (s.subcontractId == subcontractId) { updated } else { s }
        });
        updated
      };
    }
  };

  /// Add bond records to a subcontract.
  public shared ({ caller }) func verifySubBonding(
    tenantId      : Nat,
    subcontractId : Text,
    bonds         : [ProcTypes.BondRecord]
  ) : async ProcTypes.SubcontractRecord {
    ignore (caller, tenantId);
    switch (state.subcontracts.values().find(
      func(s : ProcTypes.SubcontractRecord) : Bool { s.subcontractId == subcontractId }
    )) {
      case null { Runtime.trap("Subcontract not found: " # subcontractId) };
      case (?existing) {
        let updated = Procurement.verifyBonding(existing, bonds);
        state.subcontracts.mapInPlace(func(s : ProcTypes.SubcontractRecord) : ProcTypes.SubcontractRecord {
          if (s.subcontractId == subcontractId) { updated } else { s }
        });
        updated
      };
    }
  };

  /// Execute a subcontract — marks it as fully executed.
  public shared ({ caller }) func executeSubcontract(
    tenantId      : Nat,
    subcontractId : Text
  ) : async ProcTypes.SubcontractRecord {
    ignore (caller, tenantId);
    switch (state.subcontracts.values().find(
      func(s : ProcTypes.SubcontractRecord) : Bool { s.subcontractId == subcontractId }
    )) {
      case null { Runtime.trap("Subcontract not found: " # subcontractId) };
      case (?existing) {
        let updated = Procurement.executeSubcontract(existing);
        state.subcontracts.mapInPlace(func(s : ProcTypes.SubcontractRecord) : ProcTypes.SubcontractRecord {
          if (s.subcontractId == subcontractId) { updated } else { s }
        });
        updated
      };
    }
  };

  /// Get all subcontracts for a project.
  public shared query ({ caller }) func getSubcontracts(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.SubcontractRecord] {
    ignore caller;
    var results : [ProcTypes.SubcontractRecord] = [];
    for (s in state.subcontracts.values()) {
      if (s.tenantId == tenantId and s.projectId == projectId) { results := results.concat([s]) };
    };
    results
  };

  // ─── Long-Lead Procurement ────────────────────────────────────────────────

  /// Register a long-lead procurement item (12-26+ week lead times).
  public shared ({ caller }) func registerLongLeadItem(
    tenantId            : Nat,
    projectId           : Text,
    description         : Text,
    csiCode             : Text,
    supplierId          : Text,
    supplierName        : Text,
    leadDays            : Nat,
    requiredOnSite      : Int,
    stagingLocation     : Text,
    storageRequirements : Text
  ) : async ProcTypes.LongLeadItem {
    ignore caller;
    let item = Procurement.registerLongLeadItem(
      projectId, tenantId, description, csiCode, supplierId, supplierName,
      leadDays, requiredOnSite, stagingLocation, storageRequirements
    );
    state.longLeadItems.add(item);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #longLeadItem(item), caller));
    item
  };

  /// Update the status of a long-lead item.
  public shared ({ caller }) func updateLongLeadStatus(
    tenantId  : Nat,
    itemId    : Text,
    newStatus : ProcTypes.LongLeadStatus,
    notes     : Text
  ) : async ProcTypes.LongLeadItem {
    ignore (caller, tenantId);
    switch (state.longLeadItems.values().find(
      func(i : ProcTypes.LongLeadItem) : Bool { i.itemId == itemId }
    )) {
      case null { Runtime.trap("Long-lead item not found: " # itemId) };
      case (?existing) {
        let updated = Procurement.updateLongLeadStatus(existing, newStatus, notes);
        state.longLeadItems.mapInPlace(func(i : ProcTypes.LongLeadItem) : ProcTypes.LongLeadItem {
          if (i.itemId == itemId) { updated } else { i }
        });
        updated
      };
    }
  };

  /// Issue a Letter of Intent for a long-lead material.
  public shared ({ caller }) func issueLOI(
    tenantId            : Nat,
    projectId           : Text,
    supplierId          : Text,
    supplierName        : Text,
    materialDescription : Text,
    csiCode             : Text,
    estimatedValue      : Nat,
    requiredOnSite      : Int
  ) : async ProcTypes.LOIRecord {
    ignore caller;
    let loi = Procurement.issueLOI(
      projectId, tenantId, supplierId, supplierName,
      materialDescription, csiCode, estimatedValue, requiredOnSite
    );
    state.lois.add(loi);
    loi
  };

  /// Issue a Purchase Order.
  public shared ({ caller }) func issuePurchaseOrder(
    tenantId        : Nat,
    projectId       : Text,
    supplierId      : Text,
    supplierName    : Text,
    poNumber        : Text,
    lineItems       : [ProcTypes.POLineItem],
    deliveryAddress : Text,
    requiredDate    : Int,
    loiId           : ?Text
  ) : async ProcTypes.PurchaseOrder {
    ignore caller;
    let po = Procurement.issuePO(
      projectId, tenantId, supplierId, supplierName,
      poNumber, lineItems, deliveryAddress, requiredDate, loiId
    );
    state.purchaseOrders.add(po);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #purchaseOrder(po), caller));
    po
  };

  /// Get all long-lead items for a project.
  public shared query ({ caller }) func getLongLeadItems(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.LongLeadItem] {
    ignore caller;
    var results : [ProcTypes.LongLeadItem] = [];
    for (i in state.longLeadItems.values()) {
      if (i.tenantId == tenantId and i.projectId == projectId) { results := results.concat([i]) };
    };
    results
  };

  /// Get all purchase orders for a project.
  public shared query ({ caller }) func getPurchaseOrders(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.PurchaseOrder] {
    ignore caller;
    var results : [ProcTypes.PurchaseOrder] = [];
    for (po in state.purchaseOrders.values()) {
      if (po.tenantId == tenantId and po.projectId == projectId) { results := results.concat([po]) };
    };
    results
  };

  // ─── Subcontractor Management ─────────────────────────────────────────────

  /// Submit a subcontractor prequalification application.
  public shared ({ caller }) func submitSubPrequal(
    tenantId               : Nat,
    subId                  : Text,
    companyName            : Text,
    licenseNo              : Text,
    licenseState           : Text,
    licenseExpiry          : Int,
    annualRevenue          : Nat,
    bondingCapacity        : Nat,
    currentBacklogPct      : Nat,
    emr                    : Nat,
    trir                   : Nat,
    dart                   : Nat,
    yearsInBusiness        : Nat,
    relevantProjectCount   : Nat,
    projectTypes           : [Text],
    singleJobLimit         : Nat,
    aggregateLimit         : Nat,
    approvedTrades         : [Text],
    estimatedContractValue : Nat
  ) : async ProcTypes.SubPrequalification {
    ignore caller;
    let prequal = Procurement.createSubPrequal(
      subId, tenantId, companyName, licenseNo, licenseState, licenseExpiry,
      annualRevenue, bondingCapacity, currentBacklogPct,
      emr, trir, dart,
      yearsInBusiness, relevantProjectCount, projectTypes,
      singleJobLimit, aggregateLimit, approvedTrades, estimatedContractValue
    );
    state.subPrequals.add(prequal);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, subId, #subPrequal(prequal), caller));
    prequal
  };

  /// Get all prequalification records for a tenant.
  public shared query ({ caller }) func getSubPrequals(
    tenantId : Nat
  ) : async [ProcTypes.SubPrequalification] {
    ignore caller;
    var results : [ProcTypes.SubPrequalification] = [];
    for (p in state.subPrequals.values()) {
      if (p.tenantId == tenantId) { results := results.concat([p]) };
    };
    results
  };

  /// Score subcontractor field performance for a period.
  public shared ({ caller }) func scoreSubPerformance(
    tenantId               : Nat,
    subId                  : Text,
    projectId              : Text,
    period                 : Text,
    scheduleScore          : Nat,
    qualityScore           : Nat,
    safetyScore            : Nat,
    communicationScore     : Nat,
    cleanupScore           : Nat,
    rfiCount               : Nat,
    rfiAvgResponseDays     : Nat,
    submittalReturnCount   : Nat,
    deficiencyCount        : Nat,
    incidentCount          : Nat,
    notes                  : Text
  ) : async ProcTypes.SubPerformanceRecord {
    ignore tenantId;
    let record = Procurement.scoreSubPerformance(
      subId, projectId, tenantId, period,
      scheduleScore, qualityScore, safetyScore, communicationScore, cleanupScore,
      rfiCount, rfiAvgResponseDays, submittalReturnCount,
      deficiencyCount, incidentCount, notes, caller
    );
    state.subPerformance.add(record);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #subPerformance(record), caller));
    record
  };

  /// Get performance history for a subcontractor.
  public shared query ({ caller }) func getSubPerformanceHistory(
    tenantId : Nat,
    subId    : Text
  ) : async [ProcTypes.SubPerformanceRecord] {
    ignore caller;
    var results : [ProcTypes.SubPerformanceRecord] = [];
    for (r in state.subPerformance.values()) {
      if (r.tenantId == tenantId and r.subId == subId) { results := results.concat([r]) };
    };
    results
  };

  /// Issue a back-charge to a subcontractor.
  public shared ({ caller }) func issueBackCharge(
    tenantId     : Nat,
    subId        : Text,
    projectId    : Text,
    description  : Text,
    amount       : Nat,
    csiDivision  : Text,
    incidentDate : Int
  ) : async ProcTypes.BackCharge {
    ignore caller;
    let bc = Procurement.issueBackCharge(
      subId, projectId, tenantId, description, amount, csiDivision, incidentDate
    );
    state.backCharges.add(bc);
    state.workResults.add(Procurement.wrapWorkResult(tenantId, projectId, #backCharge(bc), caller));
    bc
  };

  /// Get all open back-charges for a project.
  public shared query ({ caller }) func getBackCharges(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.BackCharge] {
    ignore caller;
    var results : [ProcTypes.BackCharge] = [];
    for (bc in state.backCharges.values()) {
      if (bc.tenantId == tenantId and bc.projectId == projectId) { results := results.concat([bc]) };
    };
    results
  };

  /// Resolve a back-charge.
  public shared ({ caller }) func resolveBackCharge(
    tenantId     : Nat,
    backChargeId : Text,
    resolution   : { #settled; #disputed; #written_off }
  ) : async ProcTypes.BackCharge {
    ignore (caller, tenantId);
    switch (state.backCharges.values().find(
      func(bc : ProcTypes.BackCharge) : Bool { bc.backChargeId == backChargeId }
    )) {
      case null { Runtime.trap("Back-charge not found: " # backChargeId) };
      case (?existing) {
        let updated : ProcTypes.BackCharge = { existing with status = resolution; resolvedAt = ?Time.now() };
        state.backCharges.mapInPlace(func(bc : ProcTypes.BackCharge) : ProcTypes.BackCharge {
          if (bc.backChargeId == backChargeId) { updated } else { bc }
        });
        updated
      };
    }
  };

  /// Record a sub payment for a pay period.
  public shared ({ caller }) func recordSubPayment(
    tenantId       : Nat,
    subId          : Text,
    projectId      : Text,
    payAppNo       : Nat,
    periodEnd      : Int,
    contractValue  : Nat,
    previousBilled : Nat,
    currentBilling : Nat,
    retainagePct   : Nat,
    lienWaiverType : Text
  ) : async ProcTypes.SubPaymentRecord {
    ignore caller;
    let record = Procurement.recordSubPayment(
      subId, projectId, tenantId, payAppNo, periodEnd,
      contractValue, previousBilled, currentBilling, retainagePct, lienWaiverType
    );
    state.subPayments.add(record);
    record
  };

  /// Mark a sub payment as paid.
  public shared ({ caller }) func markSubPaymentPaid(
    tenantId  : Nat,
    paymentId : Text
  ) : async ProcTypes.SubPaymentRecord {
    ignore (caller, tenantId);
    switch (state.subPayments.values().find(
      func(p : ProcTypes.SubPaymentRecord) : Bool { p.paymentId == paymentId }
    )) {
      case null { Runtime.trap("Sub payment not found: " # paymentId) };
      case (?existing) {
        let updated : ProcTypes.SubPaymentRecord = { existing with status = #paid; paidAt = ?Time.now() };
        state.subPayments.mapInPlace(func(p : ProcTypes.SubPaymentRecord) : ProcTypes.SubPaymentRecord {
          if (p.paymentId == paymentId) { updated } else { p }
        });
        updated
      };
    }
  };

  /// Get payment history for a subcontractor on a project.
  public shared query ({ caller }) func getSubPaymentHistory(
    tenantId  : Nat,
    subId     : Text,
    projectId : Text
  ) : async [ProcTypes.SubPaymentRecord] {
    ignore caller;
    var results : [ProcTypes.SubPaymentRecord] = [];
    for (p in state.subPayments.values()) {
      if (p.tenantId == tenantId and p.subId == subId and p.projectId == projectId) {
        results := results.concat([p])
      };
    };
    results
  };

  /// Register a closeout document for a subcontractor.
  public shared ({ caller }) func registerSubCloseoutDoc(
    tenantId    : Nat,
    subId       : Text,
    projectId   : Text,
    docType     : Text,
    description : Text
  ) : async ProcTypes.SubCloseoutDoc {
    ignore caller;
    let doc = Procurement.createCloseoutDoc(subId, projectId, tenantId, docType, description);
    state.subCloseoutDocs.add(doc);
    doc
  };

  /// Mark a closeout document as received.
  public shared ({ caller }) func markCloseoutDocReceived(
    tenantId : Nat,
    docId    : Text
  ) : async ProcTypes.SubCloseoutDoc {
    ignore (caller, tenantId);
    switch (state.subCloseoutDocs.values().find(
      func(d : ProcTypes.SubCloseoutDoc) : Bool { d.docId == docId }
    )) {
      case null { Runtime.trap("Closeout doc not found: " # docId) };
      case (?existing) {
        let updated : ProcTypes.SubCloseoutDoc = { existing with received = true; receivedAt = ?Time.now() };
        state.subCloseoutDocs.mapInPlace(func(d : ProcTypes.SubCloseoutDoc) : ProcTypes.SubCloseoutDoc {
          if (d.docId == docId) { updated } else { d }
        });
        updated
      };
    }
  };

  /// Get subcontractor closeout checklist for a project.
  public shared query ({ caller }) func getSubCloseoutChecklist(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.SubCloseoutDoc] {
    ignore caller;
    var results : [ProcTypes.SubCloseoutDoc] = [];
    for (d in state.subCloseoutDocs.values()) {
      if (d.tenantId == tenantId and d.projectId == projectId) { results := results.concat([d]) };
    };
    results
  };

  // ─── Procurement History ─────────────────────────────────────────────────

  /// Get full procurement history for a project.
  public shared query ({ caller }) func getProcurementHistory(
    tenantId  : Nat,
    projectId : Text
  ) : async [ProcTypes.ProcurementWorkResult] {
    ignore caller;
    var results : [ProcTypes.ProcurementWorkResult] = [];
    for (wr in state.workResults.values()) {
      if (wr.tenantId == tenantId and wr.projectId == projectId) { results := results.concat([wr]) };
    };
    results
  };
};

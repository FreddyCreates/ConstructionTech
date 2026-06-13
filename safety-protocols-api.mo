// mixins/psie-api.mo — PSIE Public API Mixin
// Exposes PSIE (Provisio Supplica Intelligentia Engine) endpoints via actor mixin.
import Time "mo:core/Time";
import List "mo:core/List";
import PSIE "../lib/psie";
import PSIETypes "../types/psie";

mixin (
  suppliers   : List.List<PSIETypes.SupplierRecord>,
  leadTimes   : List.List<PSIETypes.LeadTimeRecord>,
  rfqs        : List.List<PSIETypes.RfqRecord>,
  quotes      : List.List<PSIETypes.SupplierQuote>,
  alerts      : List.List<PSIETypes.EscalationAlert>,
  psieResults : List.List<PSIETypes.PSIEWorkResult>
) {

  // ─── Lead Times ──────────────────────────────────────────────────────────

  /// Record or update lead time for a supplier + material category.
  public shared ({ caller }) func upsertLeadTime(
    tenantId     : Nat,
    supplierId   : Text,
    category     : PSIETypes.MaterialCategory,
    materialName : Text,
    currentLeadDays : Nat,
    region       : Text
  ) : async PSIETypes.LeadTimeRecord {
    ignore caller;
    let record = PSIE.upsertLeadTime(
      supplierId, tenantId, category, materialName, currentLeadDays, region
    );
    leadTimes.add(record);
    let wr = PSIE.wrapWorkResult(
      "PSIE-LT-" # record.leadTimeId, tenantId, supplierId, #leadTime(record),
      "CPL-PSIE-" # caller.toText() # "-" # Time.now().toText(),
      { engineId = "PSIE"; perceptionType = "procurement"; findings = []; riskScore = 0; confidenceScore = 85;
        anomalyFlags = []; recommendations = [] }
    );
    psieResults.add(wr);
    record
  };

  /// Get lead times for a category and region, ordered by supplier score.
  public shared query ({ caller }) func getLeadTimesByCategory(
    tenantId : Nat,
    category : PSIETypes.MaterialCategory,
    region   : Text
  ) : async [PSIETypes.LeadTimeRecord] {
    ignore caller;
    var results : [PSIETypes.LeadTimeRecord] = [];
    for (lt in leadTimes.values()) {
      if (lt.tenantId == tenantId and lt.category == category and lt.region == region) {
        results := results.concat([lt]);
      };
    };
    results
  };

  // ─── Supplier Management ─────────────────────────────────────────────────

  /// Create or update a supplier record with performance metrics.
  public shared ({ caller }) func upsertSupplier(
    tenantId           : Nat,
    supplierId         : Text,
    name               : Text,
    contactEmail       : Text,
    contactPhone       : Text,
    region             : Text,
    categories         : [PSIETypes.MaterialCategory],
    onTimeRate         : Nat,
    qualityDefectRate  : Nat,
    priceVariancePct   : Int,
    responsivenessScore: Nat
  ) : async PSIETypes.SupplierRecord {
    ignore caller;
    let record = PSIE.upsertSupplier(
      supplierId, tenantId, name, contactEmail, contactPhone,
      region, categories, onTimeRate, qualityDefectRate,
      priceVariancePct, responsivenessScore
    );
    suppliers.add(record);
    let wr = PSIE.wrapWorkResult(
      "PSIE-SUP-" # supplierId, tenantId, supplierId, #supplierScore(record),
      "CPL-PSIE-" # caller.toText() # "-" # Time.now().toText(),
      { engineId = "PSIE"; perceptionType = "procurement"; findings = []; riskScore = 0; confidenceScore = 85;
        anomalyFlags = []; recommendations = [] }
    );
    psieResults.add(wr);
    record
  };

  /// Get all suppliers for a tenant, ranked by overall score.
  public shared query ({ caller }) func getSuppliers(
    tenantId : Nat,
    category : ?PSIETypes.MaterialCategory
  ) : async [PSIETypes.SupplierRecord] {
    ignore caller;
    var results : [PSIETypes.SupplierRecord] = [];
    for (s in suppliers.values()) {
      if (s.tenantId == tenantId) {
        let matches = switch (category) {
          case null { true };
          case (?cat) {
            s.categories.find(func(c : PSIETypes.MaterialCategory) : Bool { c == cat }) != null
          };
        };
        if (matches) { results := results.concat([s]) };
      };
    };
    results
  };

  /// Get a single supplier's full profile and score.
  public shared query ({ caller }) func getSupplier(
    tenantId   : Nat,
    supplierId : Text
  ) : async ?PSIETypes.SupplierRecord {
    ignore caller;
    suppliers.values().find(
      func(s : PSIETypes.SupplierRecord) : Bool {
        s.tenantId == tenantId and s.supplierId == supplierId
      }
    )
  };

  // ─── RFQ Generation ───────────────────────────────────────────────────────

  /// Auto-generate an RFQ from a scope and CSI codes.
  public shared ({ caller }) func generateRfq(
    tenantId  : Nat,
    projectId : Text,
    title     : Text,
    csiCodes  : [Text],
    dueDate   : Int
  ) : async PSIETypes.RfqRecord {
    ignore caller;
    var h : Nat = 5381;
    let raw = projectId # title # Time.now().toText();
    for (c in raw.chars()) { h := ((h * 33) + c.toNat32().toNat()) % 4294967296 };
    let rfqId = "RFQ-" # h.toText();
    let record = PSIE.generateRfq(rfqId, projectId, tenantId, title, csiCodes, dueDate);
    rfqs.add(record);
    let wr = PSIE.wrapWorkResult(
      "PSIE-RFQ-" # rfqId, tenantId, projectId, #rfq(record),
      "CPL-PSIE-" # caller.toText() # "-" # Time.now().toText(),
      { engineId = "PSIE"; perceptionType = "procurement"; findings = []; riskScore = 0; confidenceScore = 85;
        anomalyFlags = []; recommendations = [] }
    );
    psieResults.add(wr);
    record
  };

  /// Invite suppliers to an RFQ.
  public shared ({ caller }) func inviteSuppliers(
    tenantId    : Nat,
    rfqId       : Text,
    supplierIds : [Text]
  ) : async PSIETypes.RfqRecord {
    ignore (caller, tenantId);
    switch (rfqs.values().find(func(r : PSIETypes.RfqRecord) : Bool { r.rfqId == rfqId })) {
      case null { Runtime.trap("RFQ not found: " # rfqId) };
      case (?existing) {
        let updated = PSIE.inviteSuppliers(existing, supplierIds);
        // Replace in list by rebuilding
        rfqs.mapInPlace(func(r : PSIETypes.RfqRecord) : PSIETypes.RfqRecord {
          if (r.rfqId == rfqId) { updated } else { r }
        });
        updated
      };
    }
  };

  /// Get all RFQs for a project.
  public shared query ({ caller }) func getRfqs(
    tenantId  : Nat,
    projectId : Text
  ) : async [PSIETypes.RfqRecord] {
    ignore caller;
    var results : [PSIETypes.RfqRecord] = [];
    for (r in rfqs.values()) {
      if (r.tenantId == tenantId and r.projectId == projectId) {
        results := results.concat([r]);
      };
    };
    results
  };

  // ─── Quote Comparison ────────────────────────────────────────────────────

  /// Submit a supplier quote for an RFQ.
  public shared ({ caller }) func submitQuote(
    tenantId    : Nat,
    rfqId       : Text,
    supplierId  : Text,
    lineItems   : [PSIETypes.QuoteLineItem],
    totalAmount : Nat,
    validThrough: Int
  ) : async PSIETypes.SupplierQuote {
    ignore (caller, tenantId);
    let now = Time.now();
    var h : Nat = 5381;
    let raw = rfqId # supplierId # now.toText();
    for (c in raw.chars()) { h := ((h * 33) + c.toNat32().toNat()) % 4294967296 };
    let quoteId = "QT-" # h.toText();
    let q : PSIETypes.SupplierQuote = {
      quoteId; rfqId; supplierId; tenantId;
      lineItems; totalAmount; validThrough; receivedAt = now;
    };
    quotes.add(q);
    q
  };

  /// Compare all quotes for an RFQ and return ranked analysis.
  public shared ({ caller }) func compareQuotes(
    tenantId : Nat,
    rfqId    : Text
  ) : async PSIETypes.QuoteComparison {
    ignore caller;
    let rfqOpt = rfqs.values().find(func(r : PSIETypes.RfqRecord) : Bool { r.rfqId == rfqId });
    let rfq = switch (rfqOpt) {
      case (?r) { r };
      case null {
        Runtime.trap("RFQ not found: " # rfqId)
      };
    };
    var rfqQuotes : [PSIETypes.SupplierQuote] = [];
    for (q in quotes.values()) {
      if (q.rfqId == rfqId and q.tenantId == tenantId) {
        rfqQuotes := rfqQuotes.concat([q]);
      };
    };
    var supplierList : [PSIETypes.SupplierRecord] = [];
    for (s in suppliers.values()) {
      if (s.tenantId == tenantId) { supplierList := supplierList.concat([s]) };
    };
    let comparison = PSIE.compareQuotes(rfq, rfqQuotes, supplierList);
    let wr = PSIE.wrapWorkResult(
      "PSIE-QC-" # rfqId, tenantId, rfq.projectId, #quoteComparison(comparison),
      "CPL-PSIE-" # caller.toText() # "-" # Time.now().toText(),
      { engineId = "PSIE"; perceptionType = "procurement"; findings = []; riskScore = 0; confidenceScore = 85;
        anomalyFlags = []; recommendations = [] }
    );
    psieResults.add(wr);
    comparison
  };

  // ─── Escalation Alerts ───────────────────────────────────────────────────

  /// Check for price escalation in a material category and region.
  public shared ({ caller }) func checkEscalation(
    tenantId      : Nat,
    category      : PSIETypes.MaterialCategory,
    materialName  : Text,
    region        : Text,
    currentPrice  : Nat,
    previousPrice : Nat
  ) : async ?PSIETypes.EscalationAlert {
    ignore caller;
    let alertOpt = PSIE.detectEscalation(
      tenantId, category, materialName, region,
      currentPrice, previousPrice, 300 // 3% threshold in bps
    );
    switch (alertOpt) {
      case (?alert) {
        alerts.add(alert);
        let wr = PSIE.wrapWorkResult(
          "PSIE-EA-" # alert.alertId, tenantId, region, #escalationAlert(alert),
           "CPL-PSIE-" # caller.toText() # "-" # Time.now().toText(),
          { engineId = "PSIE"; perceptionType = "procurement"; findings = []; riskScore = 0; confidenceScore = 85;
            anomalyFlags = []; recommendations = [] }
        );
        psieResults.add(wr);
      };
      case null {};
    };
    alertOpt
  };

  /// Get all active escalation alerts for a tenant.
  public shared query ({ caller }) func getActiveAlerts(
    tenantId : Nat
  ) : async [PSIETypes.EscalationAlert] {
    ignore caller;
    var results : [PSIETypes.EscalationAlert] = [];
    for (a in alerts.values()) {
      if (a.tenantId == tenantId) { results := results.concat([a]) };
    };
    results
  };

  // ─── Substitution Recommendations ────────────────────────────────────────

  /// Get substitution recommendations for an unavailable material.
  public shared ({ caller }) func recommendSubstitutions(
    tenantId        : Nat,
    primaryMaterial : Text,
    category        : PSIETypes.MaterialCategory,
    reason          : Text
  ) : async PSIETypes.SubstitutionReport {
    ignore caller;
    var h : Nat = 5381;
    let raw = tenantId.toText() # primaryMaterial # Time.now().toText();
    for (c in raw.chars()) { h := ((h * 33) + c.toNat32().toNat()) % 4294967296 };
    let reportId = "SR-" # h.toText();
    let report = PSIE.recommendSubstitutions(reportId, tenantId, primaryMaterial, category, reason);
    let wr = PSIE.wrapWorkResult(
      "PSIE-SR-" # reportId, tenantId, primaryMaterial, #substitution(report),
      "CPL-PSIE-" # caller.toText() # "-" # Time.now().toText(),
      { engineId = "PSIE"; perceptionType = "procurement"; findings = []; riskScore = 0; confidenceScore = 85;
        anomalyFlags = []; recommendations = [] }
    );
    psieResults.add(wr);
    report
  };

  // ─── Davis-Bacon Compliance ───────────────────────────────────────────────

  /// Run prevailing wage compliance check for all trades on a project.
  public shared ({ caller }) func checkWageCompliance(
    tenantId   : Nat,
    projectId  : Text,
    trades     : [(Text, Text, Nat)]   // [(tradeName, region, postedRateCents)]
  ) : async PSIETypes.WageComplianceReport {
    ignore caller;
    var h : Nat = 5381;
    let raw = tenantId.toText() # projectId # Time.now().toText();
    for (c in raw.chars()) { h := ((h * 33) + c.toNat32().toNat()) % 4294967296 };
    let reportId = "WC-" # h.toText();
    let report = PSIE.checkWageCompliance(reportId, projectId, tenantId, trades);
    let wr = PSIE.wrapWorkResult(
      "PSIE-WC-" # reportId, tenantId, projectId, #wageCompliance(report),
      "CPL-PSIE-" # caller.toText() # "-" # Time.now().toText(),
      { engineId = "PSIE"; perceptionType = "procurement"; findings = []; riskScore = 0; confidenceScore = 85;
        anomalyFlags = []; recommendations = [] }
    );
    psieResults.add(wr);
    report
  };

  // ─── PSIE History ────────────────────────────────────────────────────────

  /// Get all PSIE work results for a project.
  public shared query ({ caller }) func getPSIEHistory(
    tenantId  : Nat,
    projectId : Text
  ) : async [PSIETypes.PSIEWorkResult] {
    ignore caller;
    var results : [PSIETypes.PSIEWorkResult] = [];
    for (wr in psieResults.values()) {
      if (wr.tenantId == tenantId and wr.projectId == projectId) {
        results := results.concat([wr]);
      };
    };
    results
  };
};

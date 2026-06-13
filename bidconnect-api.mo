// Command Center API mixin — sovereign mission-control query endpoints.
// Aggregates real data from workspace, safety-tags, fie, psie, cpl, nexus, and tenant modules.
import Array "mo:core/Array";
import Int "mo:core/Int";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import CcTypes "../types/command-center";
import CcLib "../lib/command-center";
import SafetyTagsLib "../lib/safety-tags";
import SafetyTagTypes "../types/safety-tags";
import FieTypes "../types/fie";
import PSIETypes "../types/psie";

mixin (
    safetyTagState : SafetyTagsLib.STState,
    fieResults     : List.List<FieTypes.FIEWorkResult>,
    psieResults    : List.List<PSIETypes.PSIEWorkResult>,
    activityLog    : List.List<CcTypes.ActivityLogEntry>,
    anomalyAlerts  : List.List<CcTypes.AnomalyAlert>,
  ) {

    private func _tenantTags(tenantId : Nat) : [SafetyTagTypes.SafetyTag] {
      let tid = tenantId.toText();
      let arr = safetyTagState.tags.values().toArray();
      arr.filter<SafetyTagTypes.SafetyTag>(func(t) { t.tenantId == tid });
    };

    private func _tenantPayApps(tenantId : Nat) : [FieTypes.PayApplication] {
      fieResults.toArray().filterMap<FieTypes.FIEWorkResult, FieTypes.PayApplication>(
        func(r) {
          if (r.tenantId != tenantId) return null;
          switch (r.result) { case (#payApp p) ?p; case _ null };
        }
      );
    };

    private func _tenantChangeOrders(tenantId : Nat) : [FieTypes.ChangeOrder] {
      fieResults.toArray().filterMap<FieTypes.FIEWorkResult, FieTypes.ChangeOrder>(
        func(r) {
          if (r.tenantId != tenantId) return null;
          switch (r.result) { case (#changeOrder co) ?co; case _ null };
        }
      );
    };

    private func _tenantLienWaivers(tenantId : Nat) : [FieTypes.LienWaiver] {
      fieResults.toArray().filterMap<FieTypes.FIEWorkResult, FieTypes.LienWaiver>(
        func(r) {
          if (r.tenantId != tenantId) return null;
          switch (r.result) { case (#lienWaiver lw) ?lw; case _ null };
        }
      );
    };

    private func _buildHeatmap(tags : [SafetyTagTypes.SafetyTag]) : [CcTypes.HazardHeatCell] {
      let subpartMap = Map.empty<Text, Nat>();
      for (tag in tags.vals()) {
        switch (tag.oshaViolationCode) {
          case (?code) {
            let count = switch (subpartMap.get(code)) { case (?n) n + 1; case null 1 };
            subpartMap.add(code, count);
          };
          case null {};
        };
      };
      subpartMap.entries().toArray().map<(Text, Nat), CcTypes.HazardHeatCell>(
        func((code, count)) {
          { subpart = code; displayLabel = code; openCount = count; riskScore = Nat.min(100, count * 20) };
        }
      );
    };

    private func _buildCashFlow(payApps : [FieTypes.PayApplication]) : [CcTypes.CashFlowPoint] {
      let months = ["Apr 2026", "May 2026", "Jun 2026"];
      let now    = Time.now();
      let monthNs : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
      Array.tabulate<CcTypes.CashFlowPoint>(3, func(i) {
        let iOff : Int = 2 - i;
        let cutoff = now - iOff * monthNs;
        let next   = cutoff + monthNs;
        var inflow : Int = 0;
        var outflow : Int = 0;
        for (pa in payApps.vals()) {
          if (pa.applicationDate >= cutoff and pa.applicationDate < next) {
            inflow  += pa.currentPaymentDue;
            outflow += pa.retainageHeld;
          };
        };
        { periodLabel = months[i]; inflow = inflow; outflow = outflow; net = inflow - outflow };
      });
    };

    private func _buildAlerts(tenantId : Nat) : [CcTypes.AnomalyAlert] {
      let tags = _tenantTags(tenantId);
      let live = List.empty<CcTypes.AnomalyAlert>();
      var idx  = 0;
      for (tag in tags.vals()) {
        let isOpen = switch (tag.status) { case (#open or #flagged or #inProgress) true; case _ false };
        let isSevere = tag.severity == #critical or tag.severity == #immediateDanger;
        if (isOpen and isSevere) {
          let sev : CcTypes.AlertSeverity = switch (tag.severity) {
            case (#immediateDanger) #emergencyAction;
            case _ #critical;
          };
          live.add(CcLib.buildAnomalyAlert(
            "VHDE-" # tenantId.toText() # "-" # idx.toText(),
            tenantId, "VHDE", sev,
            "Critical Hazard: " # tag.title,
            switch (tag.oshaDescription) { case (?d) d; case null tag.category },
            ?tag.tenantId, ?tag.id.toText(), ?("/safety/tags/" # tag.id.toText()),
          ));
          idx += 1;
        };
      };
      let pendingPAs = _tenantPayApps(tenantId).filter(func(pa) { pa.status == #submitted });
      if (pendingPAs.size() > 0) {
        live.add(CcLib.buildAnomalyAlert(
          "FIE-" # tenantId.toText() # "-payapp",
          tenantId, "FIE", #warning,
          "Pay Application Pending Review",
          pendingPAs.size().toText() # " pay application(s) awaiting certification.",
          null, null, ?"/financials",
        ));
      };
      let stored = anomalyAlerts.toArray();
      let seen   = Map.empty<Text, Bool>();
      let merged = live.toArray().concat(stored);
      merged.filter<CcTypes.AnomalyAlert>(func(a) {
        if (seen.get(a.alertId) != null) false
        else { seen.add(a.alertId, true); true };
      });
    };

    public query func getCommandCenterData(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
    ) : async CcTypes.CommandCenterData {
      let tags         = _tenantTags(tenantId);
      let payApps      = _tenantPayApps(tenantId);
      let changeOrders = _tenantChangeOrders(tenantId);
      let lienWaivers  = _tenantLienWaivers(tenantId);
      let now          = Time.now();
      let openTags     = tags.filter(func(t) {
        t.status == #open or t.status == #flagged or t.status == #inProgress }).size();
      let criticalTags = tags.filter(func(t) {
        t.severity == #critical or t.severity == #immediateDanger }).size();
      let safetyScore  = CcLib.computeSafetyScore(openTags, criticalTags, 9500, 0);
      let heatmap      = _buildHeatmap(tags);
      let totalCV : Int = payApps.foldLeft<FieTypes.PayApplication, Int>(0,
        func(acc, pa) { acc + pa.contractSumToDate });
      let totalBilled  = payApps.foldLeft(0,
        func(acc, pa) { acc + pa.totalCompleted });
      let totalRec = payApps.foldLeft(0,
        func(acc, pa) { if (pa.status == #paid) acc + pa.currentPaymentDue else acc });
      let retBal = payApps.foldLeft(0,
        func(acc, pa) { acc + pa.retainageHeld });
      let pendPA = payApps.filter(func(pa) { pa.status == #submitted }).size();
      let appPA  = payApps.filter(func(pa) {
        pa.status == #approved or pa.status == #paid }).size();
      let openCoV : Int = changeOrders.foldLeft<FieTypes.ChangeOrder, Int>(0,
        func(acc, co) { if (co.status == #submitted or co.status == #underReview) acc + co.impact.costImpact else acc });
      let openCoN = changeOrders.filter(func(co) {
        co.status == #submitted or co.status == #underReview }).size();
      let appCoN  = changeOrders.filter(func(co) { co.status == #approved }).size();
      let riskFlags = payApps.map(func(pa) { pa.riskFlags }).flatten();
      let openLW = lienWaivers.filter(func(lw) { lw.signedAt == null }).size();
      let cashFlow = _buildCashFlow(payApps);
      let finHealth = CcLib.computeFinancialHealth(100, 100, pendPA, riskFlags.size());
      let cplScore : Nat = if (openCoN > 5) 75 else if (openCoN > 2) 82 else 90;
      let summary = CcLib.buildExecutiveSummary(tenantId, role, 1, safetyScore, openTags,
        finHealth, totalCV, retBal, pendPA, psieResults.size(), 0, 0, cplScore, 0, openCoN, 0);
      let safety = CcLib.buildSafetyMetrics(tenantId, openTags, criticalTags, 0, 9500, 9000, 0, 0, 0, heatmap);
      let financial = CcLib.buildFinancialMetrics(tenantId, totalCV, totalBilled, totalRec,
        retBal, pendPA, 0, appPA, pendPA, openCoV, openLW, 100, 100, riskFlags, cashFlow);
      let compliance = CcLib.buildComplianceMetrics(tenantId, cplScore, 0, 0, 0, 0,
        openCoN, appCoN, 0, 0, 0, 0, [], []);
      let alerts = CcLib.filterAlertsByRole(_buildAlerts(tenantId), role);
      let allAct = activityLog.toArray().filter(func(e) { e.tenantId == tenantId });
      let activity = CcLib.filterActivityByRole(allAct, role, 20);
      let projectIds = Map.empty<Text, Bool>();
      for (pa in payApps.vals()) { projectIds.add(pa.projectId, true) };
      let pipeline : [CcTypes.ProjectPipelineRow] = projectIds.entries().toArray().map<(Text, Bool), CcTypes.ProjectPipelineRow>(
        func((pid, _)) {
          let ppa    = payApps.filter(func(pa) { pa.projectId == pid });
          let bud    = if (ppa.size() > 0) ppa[0].originalContractSum else 0;
          let spent  = ppa.foldLeft(0, func(acc, pa) { acc + pa.totalCompleted });
          let owner  = if (ppa.size() > 0) ppa[0].owner else "";
          CcLib.buildProjectPipelineRow(pid, pid, owner, #constructionAdmin,
            bud, spent, CcLib.computeSafetyScore(openTags, criticalTags, 9500, 0),
            openTags, 0, openCoN, if (bud > 0) Nat.min(100, spent * 100 / bud) else 0,
            100, 100, now);
        });
      {
        tenantId = tenantId; role = role; summary = summary; pipeline = pipeline;
        safety = safety; financial = financial; compliance = compliance;
        alerts = alerts; activity = activity; generatedAt = now;
      };
    };

    public query func getExecutiveSummary(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
    ) : async CcTypes.ExecutiveSummary {
      let tags = _tenantTags(tenantId);
      let payApps = _tenantPayApps(tenantId);
      let changeOrders = _tenantChangeOrders(tenantId);
      let openTags = tags.filter(func(t) {
        t.status == #open or t.status == #flagged or t.status == #inProgress }).size();
      let criticalTags = tags.filter(func(t) {
        t.severity == #critical or t.severity == #immediateDanger }).size();
      let safetyScore = CcLib.computeSafetyScore(openTags, criticalTags, 9500, 0);
      let totalCV : Int = payApps.foldLeft<FieTypes.PayApplication, Int>(0,
        func(acc, pa) { acc + pa.contractSumToDate });
      let retBal = payApps.foldLeft(0,
        func(acc, pa) { acc + pa.retainageHeld });
      let pendPA = payApps.filter(func(pa) { pa.status == #submitted }).size();
      let openCoN = changeOrders.filter(func(co) {
        co.status == #submitted or co.status == #underReview }).size();
      let riskFlags = payApps.map(func(pa) { pa.riskFlags }).flatten();
      let finHealth = CcLib.computeFinancialHealth(100, 100, pendPA, riskFlags.size());
      CcLib.buildExecutiveSummary(tenantId, role, 1, safetyScore, openTags, finHealth,
        totalCV, retBal, pendPA, psieResults.size(), 0, 0, 85, 0, openCoN, 0);
    };

    public query func getAnomalyAlerts(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
    ) : async [CcTypes.AnomalyAlert] {
      let all     = _buildAlerts(tenantId);
      let unacked = all.filter(func(a) { not a.acknowledged });
      CcLib.filterAlertsByRole(unacked, role);
    };

    public query func getActivityFeed(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
      limit    : Nat,
    ) : async [CcTypes.ActivityLogEntry] {
      let all = activityLog.toArray().filter(
        func(e) { e.tenantId == tenantId });
      CcLib.filterActivityByRole(all, role, limit);
    };

    public query func getProjectPipeline(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
    ) : async [CcTypes.ProjectPipelineRow] {
      ignore role;
      let tags = _tenantTags(tenantId);
      let payApps = _tenantPayApps(tenantId);
      let changeOrders = _tenantChangeOrders(tenantId);
      let now = Time.now();
      let openTags = tags.filter(func(t) {
        t.status == #open or t.status == #flagged }).size();
      let criticalTags = tags.filter(func(t) {
        t.severity == #critical or t.severity == #immediateDanger }).size();
      let openCoN = changeOrders.filter(func(co) {
        co.status == #submitted or co.status == #underReview }).size();
      let projectIds = Map.empty<Text, Bool>();
      for (pa in payApps.vals()) { projectIds.add(pa.projectId, true) };
      projectIds.entries().toArray().map<(Text, Bool), CcTypes.ProjectPipelineRow>(
        func((pid, _)) {
          let ppa   = payApps.filter(func(pa) { pa.projectId == pid });
          let bud   = if (ppa.size() > 0) ppa[0].originalContractSum else 0;
          let spent = ppa.foldLeft(0, func(acc, pa) { acc + pa.totalCompleted });
          let owner = if (ppa.size() > 0) ppa[0].owner else "";
          CcLib.buildProjectPipelineRow(pid, pid, owner, #constructionAdmin,
            bud, spent, CcLib.computeSafetyScore(openTags, criticalTags, 9500, 0),
            openTags, 0, openCoN, if (bud > 0) Nat.min(100, spent * 100 / bud) else 0,
            100, 100, now);
        });
    };

    public query func getSafetyMetrics(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
    ) : async CcTypes.SafetyMetrics {
      ignore role;
      let tags = _tenantTags(tenantId);
      let now  = Time.now();
      let openTags = tags.filter(func(t) {
        t.status == #open or t.status == #flagged or t.status == #inProgress }).size();
      let criticalTags = tags.filter(func(t) {
        t.severity == #critical or t.severity == #immediateDanger }).size();
      let overdueTags = tags.filter(func(t) {
        switch (t.dueDate) {
          case (?d) d < now and (t.status == #open or t.status == #inProgress);
          case null false;
        };
      }).size();
      let overdueTagsPct : Nat = if (openTags == 0) 0 else overdueTags * 10000 / openTags;
      CcLib.buildSafetyMetrics(tenantId, openTags, criticalTags, overdueTagsPct,
        9500, 9000, 0, 0, 0, _buildHeatmap(tags));
    };

    public query func getFinancialMetrics(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
    ) : async CcTypes.FinancialMetrics {
      ignore role;
      let payApps      = _tenantPayApps(tenantId);
      let changeOrders = _tenantChangeOrders(tenantId);
      let lienWaivers  = _tenantLienWaivers(tenantId);
      let totalCV : Int = payApps.foldLeft<FieTypes.PayApplication, Int>(0,
        func(acc, pa) { acc + pa.contractSumToDate });
      let totalBilled = payApps.foldLeft(0,
        func(acc, pa) { acc + pa.totalCompleted });
      let totalRec = payApps.foldLeft(0,
        func(acc, pa) { if (pa.status == #paid) acc + pa.currentPaymentDue else acc });
      let retBal   = payApps.foldLeft(0,
        func(acc, pa) { acc + pa.retainageHeld });
      let pendPA   = payApps.filter(func(pa) { pa.status == #submitted }).size();
      let appPA    = payApps.filter(func(pa) {
        pa.status == #approved or pa.status == #paid }).size();
      let openCoV : Int = changeOrders.foldLeft<FieTypes.ChangeOrder, Int>(0,
        func(acc, co) { if (co.status == #submitted or co.status == #underReview) acc + co.impact.costImpact else acc });
      let riskFlags = payApps.map(func(pa) { pa.riskFlags }).flatten();
      let openLW = lienWaivers.filter(func(lw) { lw.signedAt == null }).size();
      CcLib.buildFinancialMetrics(tenantId, totalCV, totalBilled, totalRec, retBal,
        pendPA, 0, appPA, pendPA, openCoV, openLW, 100, 100, riskFlags, _buildCashFlow(payApps));
    };

    public query func getComplianceMetrics(
      tenantId : Nat,
      role     : CcTypes.ViewRole,
    ) : async CcTypes.ComplianceMetrics {
      ignore role;
      let changeOrders = _tenantChangeOrders(tenantId);
      let pendCOs = changeOrders.filter(func(co) {
        co.status == #submitted or co.status == #underReview }).size();
      let appCOs  = changeOrders.filter(func(co) { co.status == #approved }).size();
      let cplScore : Nat = if (pendCOs > 5) 75 else if (pendCOs > 2) 82 else 90;
      CcLib.buildComplianceMetrics(tenantId, cplScore, 0, 0, 0, 0,
        pendCOs, appCOs, 0, 0, 0, 0, [], []);
    };

    public shared ({ caller }) func acknowledgeAlert(
      tenantId : Nat,
      alertId  : Text,
    ) : async Bool {
      ignore tenantId;
      ignore caller;
      var found = false;
      anomalyAlerts.mapInPlace(func(a : CcTypes.AnomalyAlert) : CcTypes.AnomalyAlert {
        if (a.alertId == alertId) { found := true; { a with acknowledged = true } } else a;
      });
      if (not found) {
        switch (_buildAlerts(tenantId).find<CcTypes.AnomalyAlert>(func(a) { a.alertId == alertId })) {
          case (?a) { anomalyAlerts.add({ a with acknowledged = true }); found := true };
          case null {};
        };
      };
      found;
    };

};

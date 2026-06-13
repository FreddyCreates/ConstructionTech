import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import TrackerLib "../lib/jsa-daily-tracker";
import TrackerTypes "../types/jsa-daily-tracker";

mixin (
  _trackerState : TrackerLib.TrackerState,
) {

  func _trackerAuthorityCheck(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("CPL-001: Anonymous callers are not authorized to access JSA compliance data.");
    };
  };

  // ─── Update Functions ─────────────────────────────────────────────────────

  public shared ({ caller }) func recordDailyJSA(
    input : TrackerTypes.JSADailyInput,
  ) : async TrackerTypes.JSADailyRecord {
    _trackerAuthorityCheck(caller);
    TrackerLib.recordDailyJSA(_trackerState, input);
  };

  public shared ({ caller }) func recordJSACompletion(
    crewId      : Text,
    jsaId       : Text,
    date        : Text,
  ) : async TrackerTypes.JSADailyRecord {
    _trackerAuthorityCheck(caller);
    TrackerLib.recordJSACompletion(_trackerState, crewId, jsaId, date, caller.toText());
  };

  // ─── Query Functions ──────────────────────────────────────────────────────

  public shared query ({ caller }) func getComplianceByProject(
    projectId : Text,
    date      : Text,
  ) : async [TrackerTypes.JSADailyRecord] {
    _trackerAuthorityCheck(caller);
    TrackerLib.getComplianceByProject(_trackerState, projectId, date);
  };

  public shared query ({ caller }) func getComplianceSummary(
    tenantId  : Text,
    startDate : Text,
    endDate   : Text,
  ) : async TrackerTypes.ComplianceSummary {
    _trackerAuthorityCheck(caller);
    TrackerLib.getComplianceSummary(_trackerState, tenantId, startDate, endDate);
  };

  public shared query ({ caller }) func getOverdueCrews(
    tenantId : Text,
  ) : async [TrackerTypes.JSADailyRecord] {
    _trackerAuthorityCheck(caller);
    TrackerLib.getOverdueCrews(_trackerState, tenantId);
  };

};

import List "mo:core/List";
import Time "mo:core/Time";
import OL "../types/osha-library";
import OSHALib "../lib/osha-library";
import FocusFourLib "../lib/focus-four";
import RecordkeepingLib "../lib/osha-recordkeeping";
import SafetyProgramsLib "../lib/written-safety-programs";
import HOCLib "../lib/hierarchy-of-controls";

/// Public actor API mixin for the OSHA Library domain.
/// State: OSHA 300/300A/301 recordkeeping log (injected from main.mo)
mixin (recordkeeping : RecordkeepingLib.RecordkeepingState) {

  // ── Subpart Library ─────────────────────────────────────────────────────────

  public query func listOSHASubparts() : async [OL.OSHASubpart] {
    OSHALib.subparts
  };

  public query func getOSHASubpart(subpart : Text) : async ?OL.OSHASubpart {
    OSHALib.getSubpart(subpart)
  };

  public query func searchOSHASubparts(keyword : Text) : async [OL.OSHASubpart] {
    OSHALib.searchSubparts(keyword)
  };

  public query func getSubpartsForFocusFour(cat : OL.FocusFourCategory) : async [OL.OSHASubpart] {
    OSHALib.subpartsForFocusFour(cat)
  };

  // ── Focus Four ───────────────────────────────────────────────────────────────

  public query func listFocusFourHazards() : async [OL.FocusFourHazard] {
    FocusFourLib.hazards
  };

  public query func getFocusFourHazard(cat : OL.FocusFourCategory) : async ?OL.FocusFourHazard {
    FocusFourLib.getHazard(cat)
  };

  /// Score a list of activity descriptions for Focus Four exposure (0–100).
  public query func scoreFocusFourRisk(activities : [Text]) : async Nat {
    FocusFourLib.scoreActivities(activities)
  };

  /// Detect which Focus Four hazards fire for the given activities.
  public query func detectFocusFourHazards(activities : [Text]) : async [(OL.FocusFourCategory, OL.DetectionRule)] {
    FocusFourLib.detectHazards(activities)
  };

  // ── OSHA Recordkeeping ───────────────────────────────────────────────────────

  public shared ({ caller = _ }) func addOSHA300Entry(entry : OL.OSHA300Entry) : async OL.OSHA300Entry {
    RecordkeepingLib.addEntry300(recordkeeping, entry)
  };

  public query func getOSHA300Log() : async [OL.OSHA300Entry] {
    RecordkeepingLib.getEntries300(recordkeeping)
  };

  public query func getOSHA300ByYear(year : Nat) : async [OL.OSHA300Entry] {
    RecordkeepingLib.getEntries300ByYear(recordkeeping, year)
  };

  public shared ({ caller = _ }) func addOSHA300AEntry(entry : OL.OSHA300AEntry) : async () {
    RecordkeepingLib.addEntry300A(recordkeeping, entry)
  };

  public query func getOSHA300ASummaries() : async [OL.OSHA300AEntry] {
    RecordkeepingLib.getEntries300A(recordkeeping)
  };

  /// Auto-compute 300A summary from the 300 log for the given year.
  public query func computeOSHA300ASummary(
    year : Nat,
    establishmentName : Text,
    city : Text,
    stateCode : Text,
    naicsCode : Text,
    avgEmployees : Nat,
    totalHours : Nat,
    sigTitle : Text
  ) : async OL.OSHA300AEntry {
    RecordkeepingLib.computeSummary(
      recordkeeping, year, establishmentName,
      city, stateCode, naicsCode, avgEmployees, totalHours, sigTitle
    )
  };

  public shared ({ caller = _ }) func addOSHA301Entry(entry : OL.OSHA301Entry) : async OL.OSHA301Entry {
    RecordkeepingLib.addEntry301(recordkeeping, entry)
  };

  public query func getOSHA301Log() : async [OL.OSHA301Entry] {
    RecordkeepingLib.getEntries301(recordkeeping)
  };

  public query func getOSHA301ByCaseNo(caseNo : Nat) : async ?OL.OSHA301Entry {
    RecordkeepingLib.getEntry301ByCaseNo(recordkeeping, caseNo)
  };

  public query func getRecordkeepingStats(year : Nat, hoursWorked : Nat) : async OL.RecordkeepingStats {
    RecordkeepingLib.computeStats(recordkeeping, year, hoursWorked)
  };

  // ── Written Safety Programs ──────────────────────────────────────────────────

  public query func listWrittenSafetyPrograms() : async [OL.WrittenSafetyProgram] {
    SafetyProgramsLib.listAll()
  };

  public query func getWrittenSafetyProgram(shortCode : Text) : async ?OL.WrittenSafetyProgram {
    SafetyProgramsLib.getProgram(shortCode)
  };

  public query func getWrittenSafetyProgramById(id : Nat) : async ?OL.WrittenSafetyProgram {
    SafetyProgramsLib.getProgramById(id)
  };

  // ── Hierarchy of Controls ────────────────────────────────────────────────────

  public query func listHierarchyOfControls() : async [OL.ControlOption] {
    HOCLib.controlLevels
  };

  public query func getControlByLevel(level : OL.ControlLevel) : async ?OL.ControlOption {
    HOCLib.getControl(level)
  };

  public query func getMitigationPlan(
    hazardDescription : Text,
    feasibleLevels : [OL.ControlLevel],
    cfr : Text
  ) : async OL.HazardMitigationResult {
    HOCLib.mitigate(hazardDescription, feasibleLevels, cfr)
  };

  public query func getControlsForFocusFour(cat : OL.FocusFourCategory) : async [OL.ControlOption] {
    HOCLib.controlsForFocusFour(cat)
  };

}

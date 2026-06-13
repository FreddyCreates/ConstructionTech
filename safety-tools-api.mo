// mixins/safety-protocols-api.mo — Safety Protocols API Mixin
// Exposes OSHA protocol intelligence, TRIR/DART/EMR, sub intake,
// SSSP, OSHA 300/301, incident escalation, hierarchy of controls.
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import SafetyProtocols "../lib/safety-protocols";

mixin (
  emrState     : SafetyProtocols.EMRState,
  intakeState  : SafetyProtocols.IntakeState,
  ssspState    : SafetyProtocols.SSSPState,
  osha300State : SafetyProtocols.Osha300State,
  osha301State : SafetyProtocols.Osha301State
) {

  // ─── Hierarchy of Controls ───────────────────────────────────────────────

  public query func getHierarchyOfControls() : async [SafetyProtocols.ControlLevel] {
    SafetyProtocols.getHierarchyOfControls()
  };

  public query func rankJSAControls(proposedControls : [Text]) : async SafetyProtocols.JSAControlRanking {
    SafetyProtocols.rankJSAControls(proposedControls)
  };

  public query func rankControlForHazard(hazardDescription : Text, existingControlLevel : Nat) : async SafetyProtocols.ControlLevel {
    SafetyProtocols.rankControlForHazard(hazardDescription, existingControlLevel)
  };

  // ─── OSHA Focus Four ───────────────────────────────────────────────────

  public query func getAllFocusFour() : async [SafetyProtocols.FocusFourHazard] {
    SafetyProtocols.getAllFocusFour()
  };

  // ─── TRIR / DART / Near-Miss Ratio ─────────────────────────────────────

  public query func calculateTRIR(recordables : Nat, totalHours : Nat) : async SafetyProtocols.TRIRResult {
    SafetyProtocols.calculateTRIR(recordables, totalHours)
  };

  public query func calculateDART(dartCases : Nat, totalHours : Nat) : async SafetyProtocols.DARTResult {
    SafetyProtocols.calculateDART(dartCases, totalHours)
  };

  public query func checkNearMissRatio(nearMisses : Nat, recordables : Nat) : async SafetyProtocols.NearMissHealthResult {
    SafetyProtocols.checkNearMissRatio(nearMisses, recordables)
  };

  // ─── EMR ─────────────────────────────────────────────────────────────────

  public shared ({ caller }) func recordEMR(
    tenantId   : Text,
    subName    : Text,
    emr        : Float,
    ratingYear : Nat
  ) : async SafetyProtocols.EMRRecord {
    ignore caller;
    SafetyProtocols.recordEMR(emrState, subName, tenantId, emr, ratingYear)
  };

  public query func getEMRRecord(tenantId : Text, subName : Text) : async ?SafetyProtocols.EMRRecord {
    SafetyProtocols.getEMRRecord(emrState, subName, tenantId)
  };

  public query func getAllEMRRecords(tenantId : Text) : async [SafetyProtocols.EMRRecord] {
    SafetyProtocols.getAllEMRRecords(emrState, tenantId)
  };

  // ─── Sub Safety Intake ──────────────────────────────────────────────────────

  public shared ({ caller }) func submitSubSafetyIntake(
    intake : SafetyProtocols.SubSafetyIntakeRecord
  ) : async SafetyProtocols.IntakeResult {
    ignore caller;
    SafetyProtocols.submitSubSafetyIntake(intakeState, intake)
  };

  public query func getSubIntakeResult(tenantId : Text, subName : Text) : async ?SafetyProtocols.IntakeResult {
    SafetyProtocols.getIntakeResult(intakeState, subName, tenantId)
  };

  public query func getAllSubIntakeResults(tenantId : Text) : async [SafetyProtocols.IntakeResult] {
    SafetyProtocols.getAllIntakeResults(intakeState, tenantId)
  };

  // ─── SSSP ─────────────────────────────────────────────────────────────────

  public shared ({ caller }) func submitSSSP(
    sssp : SafetyProtocols.SSSPRecord
  ) : async SafetyProtocols.SSSPResult {
    ignore caller;
    SafetyProtocols.submitSSSP(ssspState, sssp)
  };

  public query func getSSSP(ssspId : Text) : async ?SafetyProtocols.SSSPRecord {
    SafetyProtocols.getSSSP(ssspState, ssspId)
  };

  public query func getSSSPResult(ssspId : Text) : async ?SafetyProtocols.SSSPResult {
    SafetyProtocols.getSSSPResult(ssspState, ssspId)
  };

  // ─── OSHA 300 Log ─────────────────────────────────────────────────────────

  public shared ({ caller }) func addOsha300Entry(
    tenantId       : Text,
    employeeName   : Text,
    jobTitle       : Text,
    dateOfIncident : Int,
    location       : Text,
    description    : Text,
    incidentType   : SafetyProtocols.IncidentType,
    daysAway       : Nat,
    daysRestricted : Nat,
    injuryType     : Text,
    bodyPart       : Text
  ) : async SafetyProtocols.Osha300Record {
    ignore caller;
    SafetyProtocols.addOsha300Entry(
      osha300State, tenantId, employeeName, jobTitle, dateOfIncident,
      location, description, incidentType, daysAway, daysRestricted, injuryType, bodyPart
    )
  };

  public query func getOsha300Log(tenantId : Text) : async [SafetyProtocols.Osha300Record] {
    SafetyProtocols.getOsha300Log(osha300State, tenantId)
  };

  public query func exportOsha300A(
    tenantId           : Text,
    calendarYear       : Nat,
    totalHoursWorked   : Nat,
    annualAvgEmployees : Nat,
    certifiedBy        : Text
  ) : async SafetyProtocols.Osha300ARecord {
    SafetyProtocols.exportOsha300A(
      osha300State, tenantId, calendarYear, totalHoursWorked, annualAvgEmployees, certifiedBy
    )
  };

  // ─── OSHA 301 Incident Report ─────────────────────────────────────────────

  public shared ({ caller }) func submitOsha301(
    record : SafetyProtocols.Osha301Record
  ) : async SafetyProtocols.Osha301Record {
    ignore caller;
    SafetyProtocols.submitOsha301(osha301State, record)
  };

  public query func getOsha301Record(caseNo : Text) : async ?SafetyProtocols.Osha301Record {
    SafetyProtocols.getOsha301Record(osha301State, caseNo)
  };

  public query func getOsha301Log(tenantId : Text) : async [SafetyProtocols.Osha301Record] {
    SafetyProtocols.getOsha301Log(osha301State, tenantId)
  };

  // ─── Incident Escalation ──────────────────────────────────────────────────

  public query func checkEscalationRequired(
    severity : SafetyProtocols.Osha301Severity
  ) : async SafetyProtocols.EscalationFlag {
    SafetyProtocols.checkEscalationRequired(severity)
  };

  // ─── Stop Work Authority ───────────────────────────────────────────────

  public query func stopWorkAuthorityCheck(hazards : [Text]) : async Bool {
    SafetyProtocols.stopWorkAuthorityCheck(hazards)
  };

  public query func generateStopWorkAuthority(
    hazardDescription : Text,
    location          : Text
  ) : async SafetyProtocols.StopWorkRecord {
    SafetyProtocols.generateStopWorkAuthority(hazardDescription, location)
  };

  // ─── Training ────────────────────────────────────────────────────────────────

  public query func validateStartTraining(
    tradeType      : Text,
    certifications : [Text]
  ) : async { valid : Bool; missing : [Text] } {
    SafetyProtocols.validateStartTraining(tradeType, certifications)
  };

  // ─── SCEW / SULU ───────────────────────────────────────────────────────

  public query func calculateScewScore(
    weeklyObservations : Nat,
    correctiveActions  : Nat,
    nearMisses         : Nat
  ) : async { score : Float; trend : Text; risk : Text } {
    SafetyProtocols.calculateScewScore(weeklyObservations, correctiveActions, nearMisses)
  };

  public query func calculateSuluScore(
    siteVisits          : Nat,
    toolboxTalks        : Nat,
    hazardConversations : Nat
  ) : async { score : Float; trend : Text; leadership : Text } {
    SafetyProtocols.calculateSuluScore(siteVisits, toolboxTalks, hazardConversations)
  };

  // ─── Free Tools ────────────────────────────────────────────────────────────────

  public query func generateFreeJSA(
    task              : Text,
    trade             : Text,
    additionalHazards : [Text]
  ) : async { content : Text; hazards : [Text]; controls : [Text]; ppe : [Text] } {
    SafetyProtocols.generateFreeJSA(task, trade, additionalHazards)
  };

  public query func getFreeHazardLibrary(keyword : Text) : async [SafetyProtocols.HazardEntry] {
    SafetyProtocols.getFreeHazardLibrary(keyword)
  };

  public query func calculateFreeSafetyRisk(
    tasks : [Text],
    trade : Text
  ) : async { overallRisk : Text; hazards : [SafetyProtocols.HazardRisk]; stopWorkRequired : Bool; recommendations : [Text] } {
    SafetyProtocols.calculateFreeSafetyRisk(tasks, trade)
  };

  public query func calculateFreeCostEstimate(
    scopeItems : [Text],
    trade      : Text,
    laborHours : Float
  ) : async { totalCost : Float; laborCost : Float; materialCost : Float } {
    let r = SafetyProtocols.calculateFreeCostEstimate(scopeItems, trade, laborHours);
    { totalCost = r.totalCost; laborCost = r.laborCost; materialCost = r.materialCost }
  };

};

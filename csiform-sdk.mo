import Time "mo:core/Time";

module {

  // ── Shared enumerations ──────────────────────────────────────────────────────

  public type ControlLevel = {
    #Elimination;
    #Substitution;
    #Engineering;
    #Administrative;
    #PPE;
  };

  public type HazardSeverity = {
    #Critical;   // Fatality likely
    #Serious;    // Hospitalization probable
    #Moderate;   // Lost-time injury possible
    #Minor;      // First-aid only
  };

  public type FocusFourCategory = {
    #Falls;
    #StruckBy;
    #Electrocution;
    #CaughtIn;
  };

  // ── OSHA 1926 Subpart record ─────────────────────────────────────────────────

  public type SubpartSection = {
    cfr : Text;           // e.g. "29 CFR 1926.502"
    title : Text;
    summary : Text;
    keyRequirements : [Text];
  };

  public type OSHASubpart = {
    subpart : Text;       // e.g. "M"
    title : Text;         // e.g. "Fall Protection"
    cfrRange : Text;      // e.g. "1926.500–1926.503"
    description : Text;
    sections : [SubpartSection];
    hazardCategories : [FocusFourCategory];
    ppeRequirements : [Text];
    controlMeasures : [Text];
    citationReference : Text;
    penaltyPerViolation : Nat; // USD — OSHA 2024 max serious
  };

  // ── Focus Four ───────────────────────────────────────────────────────────────

  public type DetectionRule = {
    id : Nat;
    ruleText : Text;
    triggerKeywords : [Text];
    severity : HazardSeverity;
    cfr : Text;
  };

  public type FocusFourHazard = {
    category : FocusFourCategory;
    title : Text;
    description : Text;
    annualFatalities : Nat;  // BLS 2022 construction fatalities
    percentOfConstructionFatalities : Nat; // integer percent
    detectionRules : [DetectionRule];
    preventionProtocols : [Text];
    requiredTraining : [Text];
    cfr : Text;
    penaltyPerViolation : Nat;
  };

  // ── OSHA Recordkeeping ───────────────────────────────────────────────────────

  public type InjuryType = {
    #Death;
    #DaysAway;
    #JobTransfer;
    #OtherRecordable;
    #FirstAidOnly;
  };

  public type BodyPart = {
    #Head; #Eye; #Neck; #Back; #Chest; #Arm; #Hand; #Finger;
    #Leg; #Knee; #Foot; #Toe; #MultipleBodyParts; #Other;
  };

  public type EventType = {
    #ContactWithObject;
    #Falls;
    #OverexertionBodily;
    #ExposureHarmSubstance;
    #TransportationIncident;
    #Fires;
    #ViolenceOtherInjury;
  };

  public type OSHA300Entry = {
    caseNo : Nat;
    employeeName : Text;
    jobTitle : Text;
    dateOfInjury : Int;    // Time.now() nanoseconds
    location : Text;
    descriptionOfInjury : Text;
    injuryType : InjuryType;
    bodyPart : BodyPart;
    daysAway : Nat;
    daysRestricted : Nat;
    recordableInjury : Bool;
    privacy : Bool;        // 1904.29(b)(7) privacy cases
  };

  public type OSHA300AEntry = {
    year : Nat;
    establishmentName : Text;
    city : Text;
    state : Text;
    naicsCode : Text;
    annualAvgEmployees : Nat;
    totalHoursWorked : Nat;
    totalDeaths : Nat;
    totalDaysAway : Nat;
    totalJobTransfer : Nat;
    totalOtherRecordable : Nat;
    totalInjuries : Nat;
    totalSkinDisorder : Nat;
    totalRespiratory : Nat;
    totalPoisoning : Nat;
    totalHearing : Nat;
    totalAllOtherIllness : Nat;
    signatureTitle : Text;
    signatureDate : Int;
  };

  public type OSHA301Entry = {
    caseNo : Nat;
    employeeName : Text;
    streetAddress : Text;
    city : Text;
    state : Text;
    zip : Text;
    dob : Text;
    gender : Text;
    dateHired : Text;
    namePhysician : Text;
    facilityTreated : Text;
    emergencyRoom : Bool;
    hospitalized : Bool;
    dateOfInjury : Int;
    timeOfEvent : Text;
    whatEmployeeDoing : Text;
    howInjuryOccurred : Text;
    objectSubstance : Text;
    injuryIllnessDescription : Text;
    injuryType : InjuryType;
    daysAway : Nat;
    daysRestricted : Nat;
    completedBy : Text;
    completionDate : Int;
  };

  // ── Written Safety Program templates ─────────────────────────────────────────

  public type ProgramSection = {
    sectionNumber : Text;
    title : Text;
    requiredContent : [Text];
    sampleLanguage : Text;
  };

  public type WrittenSafetyProgram = {
    programId : Nat;
    name : Text;
    shortCode : Text;    // e.g. "JSA", "FPP", "CSE"
    oshaCfr : Text;      // primary citation
    purpose : Text;
    scope : Text;
    sections : [ProgramSection];
    reviewFrequency : Text;  // "Annual" | "Before each task" etc.
    responsibleParty : Text;
    trainingRequired : [Text];
  };

  // ── Hierarchy of Controls ────────────────────────────────────────────────────

  public type ControlOption = {
    level : ControlLevel;
    title : Text;
    description : Text;
    examples : [Text];
    effectiveness : Nat;  // 0-100 relative effectiveness score
    costRelative : Text;  // "Low" | "Medium" | "High"
  };

  public type HazardMitigationResult = {
    hazardDescription : Text;
    recommendedControls : [ControlOption];
    minimumAcceptableLevel : ControlLevel;
    residualRisk : HazardSeverity;
    cfr : Text;
  };

  // ── Compound query/result types (API boundary — all shared) ─────────────────

  public type OSHALibraryQuery = {
    subpart : ?Text;
    keyword : ?Text;
    focusFour : ?FocusFourCategory;
  };

  public type RecordkeepingStats = {
    totalRecordable : Nat;
    totalDaysAway : Nat;
    totalDaysRestricted : Nat;
    totalDeaths : Nat;
    dartRate : Nat;   // x10000 for integer math
    trir : Nat;       // x10000 for integer math
  };

}

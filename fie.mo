// OSHADOC-SDK — OSHA Documentum SDK Types
// OSHA 300/300A/301 recordkeeping forms + all Written Safety Programs.
// Auto-populated from incident reports and project data.
// Routes through BHX colony pipeline with CPL governance.
import Principal "mo:core/Principal";

module {

  // ─── Common Safety Project Context ───────────────────────────────────────────
  public type SafetyProjectContext = {
    companyName       : Text;
    companyAddress    : Text;
    naicsCode         : Text;
    sicCode           : Text;
    projectName       : Text;
    projectAddress    : Text;
    superintendentName: Text;
    safetyOfficerName : Text;
    safetyOfficerCert : Text;
    tenantId          : Text;
    projectId         : Text;
    year              : Text;
  };

  // ─── OSHA 301 — Injury and Illness Incident Report ───────────────────────────
  public type OSHA301Input = {
    context           : SafetyProjectContext;
    caseNo            : Text;
    employeeName      : Text;
    jobTitle          : Text;
    dateOfBirth       : Text;
    dateHired         : Text;
    gender            : Text;
    dateOfInjury      : Text;
    timeOfEvent       : Text;
    timeEmployeeBegan : Text;
    whatWasEmployeeDoing: Text;
    whatHappened      : Text;
    injuryIllnessType : Text;
    objectSubstance   : Text;
    bodyPartAffected  : Text;
    physicianName     : Text;
    facilityName      : Text;
    facilityAddress   : Text;
    emergencyRoom     : Bool;
    hospitalized      : Bool;
    daysAway          : Nat;
    daysRestricted    : Nat;
    caseOutcome       : OSHA301Outcome;
    completedBy       : Text;
    completedDate     : Text;
  };

  public type OSHA301Outcome = {
    #DaysAway;
    #RestrictedTransfer;
    #OtherRecordable;
    #Fatality;
    #Hospitalized;
    #NoOutcome;
  };

  // ─── OSHA 300 — Log of Work-Related Injuries and Illnesses ───────────────────
  public type OSHA300Entry = {
    caseNo            : Text;
    employeeName      : Text;
    jobTitle          : Text;
    dateOfInjury      : Text;
    whereOccurred     : Text;
    descriptionOfInjury: Text;
    classify          : OSHA300Classification;
    daysAway          : Nat;
    daysRestricted    : Nat;
    injuryType        : OSHA300InjuryType;
  };

  public type OSHA300Classification = {
    #Injury;
    #SkinDisorder;
    #RespiratoryCondition;
    #PoisoningHearingLoss;
    #AllOtherIllness;
  };

  public type OSHA300InjuryType = {
    #DaysAwayFromWork;
    #JobTransferOrRestriction;
    #OtherRecordable;
    #Fatality;
  };

  public type OSHA300Input = {
    context          : SafetyProjectContext;
    calendarYear     : Text;
    establishmentName: Text;
    entries          : [OSHA300Entry];
    preparedBy       : Text;
    preparedDate     : Text;
  };

  // ─── OSHA 300A — Summary of Work-Related Injuries and Illnesses ───────────────
  public type OSHA300AInput = {
    context            : SafetyProjectContext;
    calendarYear       : Text;
    totalHoursWorked   : Nat;
    avgEmployees       : Nat;
    totalDeaths        : Nat;
    totalDaysAway      : Nat;
    totalJobTransfer   : Nat;
    totalOtherRecordable: Nat;
    totalDaysAwayCases : Nat;
    totalDaysRestricted: Nat;
    totalInjuries      : Nat;
    totalSkinDisorders : Nat;
    totalRespiratoryConditions: Nat;
    totalPoisoningHearing: Nat;
    totalAllOtherIllnesses: Nat;
    postingDateFrom    : Text;
    postingDateTo      : Text;
    certifiedBy        : Text;
    certifiedTitle     : Text;
    certifiedDate      : Text;
    companyExecutive   : Text;
  };

  // ─── Written Safety Programs ──────────────────────────────────────────────────

  /// Job Safety Analysis
  public type JSAHazardStep = {
    stepNo     : Nat;
    jobStep    : Text;
    hazards    : [Text];
    controls   : [Text];
    oshaSubpart: Text;
  };

  public type JSAInput = {
    context       : SafetyProjectContext;
    jobTitle      : Text;
    taskDescription: Text;
    location      : Text;
    date          : Text;
    preparedBy    : Text;
    reviewedBy    : Text;
    approvedBy    : Text;
    requiredPPE   : [Text];
    toolsEquipment: [Text];
    steps         : [JSAHazardStep];
    emergencyProcedure: Text;
    signatures    : [Text];
  };

  /// Fall Protection Plan
  public type FallProtectionPlanInput = {
    context          : SafetyProjectContext;
    scopeOfWork      : Text;
    workAreas        : [Text];
    heightsInvolved  : [Text];
    fallHazards      : [Text];
    protectionSystems: [Text];
    anchorageDetails : Text;
    lanyardSpecs     : Text;
    rescueProcedure  : Text;
    trainingRequired : [Text];
    inspectionSchedule: Text;
    preparedBy       : Text;
    date             : Text;
  };

  /// Confined Space Entry Program
  public type ConfinedSpaceInput = {
    context           : SafetyProjectContext;
    spaceIdentification: Text;
    spaceLocation     : Text;
    permitRequired    : Bool;
    atmosphericHazards: [Text];
    physicalHazards   : [Text];
    entryProcedures   : [Text];
    testingEquipment  : [Text];
    ventilationMethod : Text;
    entrantRequirements: [Text];
    attendantDuties   : [Text];
    entrySupervision  : Text;
    rescueProcedure   : Text;
    emergencyContacts : [Text];
    preparedBy        : Text;
    date              : Text;
  };

  /// Lockout/Tagout Program
  public type LOTOInput = {
    context          : SafetyProjectContext;
    equipmentName    : Text;
    equipmentLocation: Text;
    energyTypes      : [Text]; // electrical, pneumatic, hydraulic, thermal, gravity
    lockoutProcedures: [Text];
    energyIsolationPoints: [Text];
    verificationSteps: [Text];
    releaseProcedures: [Text];
    affectedEmployees: [Text];
    authorizedEmployees: [Text];
    annualAuditDate  : Text;
    preparedBy       : Text;
    date             : Text;
  };

  /// Crane Safety Plan
  public type CraneSafetyInput = {
    context          : SafetyProjectContext;
    craneType        : Text;
    craneCapacity    : Text;
    operatorName     : Text;
    operatorCertNo   : Text;
    riggingForeman   : Text;
    liftType         : Text; // routine / critical / pre-engineered
    loadDescription  : Text;
    loadWeight       : Float;
    radiusRequired   : Float;
    pickPoints       : [Text];
    exclusionZone    : Text;
    groundConditions : Text;
    inspectionItems  : [Text];
    communicationPlan: Text;
    emergencyProcedure: Text;
    preparedBy       : Text;
    date             : Text;
  };

  /// Emergency Action Plan
  public type EmergencyActionPlanInput = {
    context             : SafetyProjectContext;
    siteDescription     : Text;
    emergencyContacts   : [EmergencyContact];
    evacuationRoutes    : [Text];
    assemblyPoints      : [Text];
    fireExtinguisherLocations: [Text];
    firstAidLocations   : [Text];
    emergencyTypes      : [EmergencyType];
    medicalEmergencyProcedure: Text;
    fireProcedure       : Text;
    hazmatProcedure     : Text;
    severeWeatherProcedure: Text;
    accountabilityMethod: Text;
    communicationSystem : Text;
    drillSchedule       : Text;
    preparedBy          : Text;
    date                : Text;
  };

  public type EmergencyContact = {
    role    : Text;
    name    : Text;
    phone   : Text;
    backup  : Text;
  };

  public type EmergencyType = {
    eventType : Text;
    response  : Text;
    responsible: Text;
  };

  /// Site-Specific Safety Plan
  public type SiteSpecificSafetyPlanInput = {
    context              : SafetyProjectContext;
    projectType          : Text; // commercial, multifamily, MEP, industrial, etc.
    projectDescription   : Text;
    projectDuration      : Text;
    contractorHierarchy  : [Text];
    subcontractors       : [Text];
    siteRules            : [Text];
    orientationRequirements: [Text];
    ppeRequirements      : [Text];
    tradeHazards         : [TradeHazardEntry];
    hotWorkProcedure     : Text;
    excavationProcedure  : Text;
    confinedSpaceProcedure: Text;
    fallProtectionPlan   : Text;
    emergencyActionPlan  : Text;
    incidentReportingProcess: Text;
    weeklyInspectionSchedule: Text;
    meetingSchedule      : Text;
    preparedBy           : Text;
    date                 : Text;
  };

  public type TradeHazardEntry = {
    trade    : Text;
    hazards  : [Text];
    controls : [Text];
  };

  // ─── Generic OSHA Doc Dispatch ────────────────────────────────────────────────
  public type OSHADocType = {
    #OSHA300;
    #OSHA300A;
    #OSHA301;
    #JSA;
    #FallProtectionPlan;
    #ConfinedSpaceProgram;
    #LOTOProgram;
    #CraneSafetyPlan;
    #EmergencyActionPlan;
    #SiteSpecificSafetyPlan;
  };

  public type OSHADocInput = {
    tenantId  : Text;
    projectId : Text;
    docType   : OSHADocType;
    formData  : Text; // JSON-serialized doc-specific input
  };

  public type OSHADocRecord = {
    id          : Text;
    tenantId    : Text;
    projectId   : Text;
    docType     : OSHADocType;
    formData    : Text;
    generatedBy : Principal;
    timestamp   : Int;
    status      : OSHADocStatus;
    deliverables: [Text];
    cplAuditHash: Text;
  };

  public type OSHADocStatus = {
    #Draft;
    #Active;
    #Distributed;
    #Filed;
    #Archived;
  };

  public type OSHADocResponse = {
    record         : OSHADocRecord;
    documentContent: Text;   // Structured JSON for pdf-lib rendering
    deliverables   : [Text];
    bhxTaskId      : Text;
    cplAuditHash   : Text;
  };

};

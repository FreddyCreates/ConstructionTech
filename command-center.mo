// CSIFORM-SDK — CSI Forma SDK Types
// All 44 CSI standard construction project administration forms.
// Routes through BHX colony pipeline with CPL governance.
import Principal "mo:core/Principal";

module {

  // ─── Common Project Context ───────────────────────────────────────────────────
  public type CSIProjectContext = {
    projectName   : Text;
    projectNumber : Text;
    ownerName     : Text;
    gcName        : Text;
    architectName : Text;
    siteAddress   : Text;
    contractDate  : Text;
    tenantId      : Text;
    projectId     : Text;
  };

  // ─── Meeting Minutes (CSI Form 01 31 23) ─────────────────────────────────────
  public type MeetingAttendee = {
    name    : Text;
    company : Text;
    role    : Text;
    email   : Text;
  };

  public type MeetingActionItem = {
    item       : Text;
    responsible: Text;
    dueDate    : Text;
    status     : Text;
  };

  public type MeetingMinutesInput = {
    context         : CSIProjectContext;
    meetingNo       : Text;
    meetingDate     : Text;
    meetingTime     : Text;
    location        : Text;
    chairperson     : Text;
    attendees       : [MeetingAttendee];
    agenda          : [Text];
    discussions     : [Text];
    decisions       : [Text];
    actionItems     : [MeetingActionItem];
    nextMeetingDate : Text;
    nextMeetingLocation: Text;
  };

  // ─── Daily Field Report (CSI Form 01 32 00) ───────────────────────────────────
  public type DailyWeather = {
    morning   : Text;
    afternoon : Text;
    tempHigh  : Text;
    tempLow   : Text;
    windSpeed : Text;
  };

  public type DailyCrewEntry = {
    trade      : Text;
    company    : Text;
    headcount  : Nat;
    hours      : Float;
    supervisor : Text;
  };

  public type DailyEquipmentEntry = {
    equipment  : Text;
    quantity   : Nat;
    hours      : Float;
    operator   : Text;
  };

  public type DailyFieldReportInput = {
    context      : CSIProjectContext;
    reportNo     : Text;
    reportDate   : Text;
    reportedBy   : Text;
    weather      : DailyWeather;
    crewOnSite   : [DailyCrewEntry];
    equipment    : [DailyEquipmentEntry];
    workPerformed: [Text];
    materials    : [Text];
    visitors     : [Text];
    safetyIncidents: [Text];
    delays       : [Text];
    photos       : [Text]; // references
    notes        : Text;
  };

  // ─── Submittal Log (CSI Form 01 33 00) ───────────────────────────────────────
  public type SubmittalStatus = {
    #NotSubmitted;
    #SubmittedToArchitect;
    #ApprovedAsSubmitted;
    #ApprovedAsNoted;
    #RejectedResubmit;
    #Revise;
    #ForInformation;
  };

  public type SubmittalEntry = {
    submittalNo   : Text;
    specSection   : Text;
    description   : Text;
    subcontractor : Text;
    submittedDate : Text;
    returnedDate  : Text;
    status        : SubmittalStatus;
    copies        : Nat;
    remarks       : Text;
  };

  public type SubmittalLogInput = {
    context  : CSIProjectContext;
    submittals: [SubmittalEntry];
    preparedBy: Text;
    date      : Text;
  };

  // ─── RFI Log (CSI Form 01 31 24) ─────────────────────────────────────────────
  public type RFIStatus = {
    #Open;
    #AnsweredByArchitect;
    #Closed;
    #Disputed;
  };

  public type RFIEntry = {
    rfiNo          : Text;
    dateSubmitted  : Text;
    dateAnswered   : Text;
    specSection    : Text;
    description    : Text;
    submittedBy    : Text;
    answeredBy     : Text;
    status         : RFIStatus;
    costImpact     : Bool;
    scheduleImpact : Bool;
    changeOrderNo  : Text;
  };

  public type RFILogInput = {
    context   : CSIProjectContext;
    rfiEntries: [RFIEntry];
    preparedBy: Text;
    date      : Text;
  };

  // ─── Change Order Log (CSI Form 00 63 13) ────────────────────────────────────
  public type ChangeOrderLogEntry = {
    coNo           : Text;
    title          : Text;
    initiationDate : Text;
    approvedDate   : Text;
    amount         : Float;
    daysAdded      : Int;
    status         : Text;
    description    : Text;
  };

  public type ChangeOrderLogInput = {
    context       : CSIProjectContext;
    originalContractSum : Float;
    changeOrders  : [ChangeOrderLogEntry];
    revisedContractSum  : Float;
    preparedBy    : Text;
    date          : Text;
  };

  // ─── Punch List (CSI Form 01 77 00) ──────────────────────────────────────────
  public type PunchListItem = {
    itemNo        : Text;
    location      : Text;
    specSection   : Text;
    description   : Text;
    responsibleParty: Text;
    dueDate       : Text;
    completedDate : Text;
    inspectedBy   : Text;
    status        : Text;
  };

  public type PunchListInput = {
    context    : CSIProjectContext;
    inspectionDate: Text;
    inspectedBy: Text;
    items      : [PunchListItem];
    walkthroughNotes: Text;
  };

  // ─── Substitution Request (CSI Form 01 63 00) ────────────────────────────────
  public type SubstitutionRequestInput = {
    context           : CSIProjectContext;
    requestNo         : Text;
    requestDate       : Text;
    specifiedProduct  : Text;
    specifiedManufacturer: Text;
    proposedProduct   : Text;
    proposedManufacturer: Text;
    reasonForSubstitution: Text;
    costDifference    : Float;
    scheduleDifference: Text;
    requestedBy       : Text;
    supportingData    : [Text];
    approvalStatus    : Text;
  };

  // ─── Notice to Proceed (CSI Form 00 55 00) ───────────────────────────────────
  public type NoticeToProceedInput = {
    context          : CSIProjectContext;
    ntpDate          : Text;
    commencementDate : Text;
    substantialCompletionDate: Text;
    finalCompletionDate: Text;
    issuedBy         : Text;
    acknowledgedBy   : Text;
    specialConditions: [Text];
  };

  // ─── Stored Material Summary (CSI Form 01 29 83) ─────────────────────────────
  public type StoredMaterialEntry = {
    description     : Text;
    specSection     : Text;
    location        : Text;
    unit            : Text;
    quantity        : Float;
    unitCost        : Float;
    totalValue      : Float;
    invoiceNo       : Text;
    dateReceived    : Text;
    installedDate   : Text;
    status          : Text;
  };

  public type StoredMaterialSummaryInput = {
    context  : CSIProjectContext;
    periodTo : Text;
    materials: [StoredMaterialEntry];
    totalStoredValue: Float;
    preparedBy: Text;
  };

  // ─── Payment Request Log (CSI Form 01 29 00) ─────────────────────────────────
  public type PaymentRequestEntry = {
    applicationNo   : Text;
    periodTo        : Text;
    submittedDate   : Text;
    certifiedDate   : Text;
    paidDate        : Text;
    amountRequested : Float;
    amountCertified : Float;
    amountPaid      : Float;
    retainageHeld   : Float;
    cumulativePaid  : Float;
    status          : Text;
  };

  public type PaymentRequestLogInput = {
    context         : CSIProjectContext;
    originalContract: Float;
    approvedCOs     : Float;
    revisedContract : Float;
    requests        : [PaymentRequestEntry];
    preparedBy      : Text;
  };

  // ─── Additional CSI Form Types (forms 11-44) ──────────────────────────────────
  // Generic extensible form for remaining 34 CSI standard forms
  public type CSIFormType = {
    #MeetingMinutes;          // 01
    #DailyFieldReport;        // 02
    #SubmittalLog;            // 03
    #RFILog;                  // 04
    #ChangeOrderLog;          // 05
    #PunchList;               // 06
    #SubstitutionRequest;     // 07
    #NoticeToProceed;         // 08
    #StoredMaterialSummary;   // 09
    #PaymentRequestLog;       // 10
    #Transmittal;             // 11
    #RequestForProposal;      // 12
    #ProposalRequest;         // 13
    #FieldOrder;              // 14
    #WorkDirective;           // 15
    #InspectionReport;        // 16
    #TestReport;              // 17
    #NonconformanceReport;    // 18
    #MaterialCertification;   // 19
    #SafetyObservationReport; // 20
    #EquipmentLog;            // 21
    #ShopDrawingLog;          // 22
    #SampleSubmittal;         // 23
    #MockupRequest;           // 24
    #AtticStockLog;           // 25
    #WarrantyLog;             // 26
    #OperationMaintenanceLog; // 27
    #AsBuiltDrawingLog;       // 28
    #StartupChecklistLog;     // 29
    #CommissioningReport;     // 30
    #SubstantialCompletionChecklist; // 31
    #FinalInspectionReport;   // 32
    #CloseoutDocumentChecklist; // 33
    #LiensReleasedLog;        // 34
    #ProjectPhotoLog;         // 35
    #BudgetTracking;          // 36
    #ContingencyLog;          // 37
    #BudgetReconciliation;    // 38
    #ProcurementLog;          // 39
    #LeadTimeTracker;         // 40
    #SubcontractorPrequalLog; // 41
    #InsuranceCertificateLog; // 42
    #BondStatusLog;           // 43
    #ProjectCloseoutSummary;  // 44
  };

  // ─── Generic CSI Form Input ───────────────────────────────────────────────────
  public type CSIFormInput = {
    tenantId  : Text;
    projectId : Text;
    formType  : CSIFormType;
    formData  : Text; // JSON-serialized form-specific input
  };

  public type CSIFormRecord = {
    id          : Text;
    tenantId    : Text;
    projectId   : Text;
    formType    : CSIFormType;
    formData    : Text;
    generatedBy : Principal;
    timestamp   : Int;
    status      : CSIFormStatus;
    deliverables: [Text];
  };

  public type CSIFormStatus = {
    #Draft;
    #Active;
    #Closed;
    #Archived;
  };

  public type CSIFormResponse = {
    record         : CSIFormRecord;
    documentContent: Text;   // Structured JSON for pdf-lib rendering
    deliverables   : [Text];
    bhxTaskId      : Text;
    cplAuditHash   : Text;
  };

};

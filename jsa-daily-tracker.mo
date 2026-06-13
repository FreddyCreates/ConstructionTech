// AIADOC-SDK — AIA Documentum SDK Types
// All official AIA G-Series and A-Series form types for the OIS platform.
// Routes through BHX colony pipeline with CPL governance.
import Principal "mo:core/Principal";

module {

  // ─── Shared Project Header (zero double entry) ────────────────────────────────
  /// Common project metadata that auto-fills every AIA form
  public type ProjectHeader = {
    projectName      : Text;
    projectNumber    : Text;
    ownerName        : Text;
    ownerAddress     : Text;
    architectName    : Text;
    architectAddress : Text;
    contractorName   : Text;
    contractorAddress: Text;
    contractDate     : Text;
    contractAmount   : Text;
    projectAddress   : Text;
    tenantId         : Text;
    projectId        : Text;
  };

  // ─── G702 — Application and Certificate for Payment ─────────────────────────
  public type G702LineItem = {
    itemNo           : Text;
    description      : Text;
    scheduledValue   : Float;
    fromPreviousApps : Float;
    thisperiod       : Float;
    materialStored   : Float;
    totalCompleted   : Float;
    percentComplete  : Float;
    balanceToFinish  : Float;
    retainage        : Float;
  };

  public type G702Input = {
    header           : ProjectHeader;
    applicationNo    : Text;
    periodTo         : Text;
    distributionTo   : Text;
    contractSum      : Float;
    netChangeByChangeOrders : Float;
    contractSumToDate : Float;
    totalCompletedStored : Float;
    retainagePercent : Float;
    lessRetainage    : Float;
    totalEarnedLess  : Float;
    lessPayments     : Float;
    currentPaymentDue: Float;
    balanceToFinish  : Float;
    continuationSheet: [G702LineItem];
  };

  // ─── G703 — Continuation Sheet ────────────────────────────────────────────────
  public type G703Input = {
    header       : ProjectHeader;
    applicationNo: Text;
    periodTo     : Text;
    lineItems    : [G702LineItem];
  };

  // ─── G701 — Change Order ──────────────────────────────────────────────────────
  public type G701Input = {
    header         : ProjectHeader;
    changeOrderNo  : Text;
    initiationDate : Text;
    description    : Text;
    reasonForChange: Text;
    amountOfChange : Float;
    newContractSum : Float;
    newCompletionDate: Text;
  };

  // ─── G714 — Construction Change Directive ────────────────────────────────────
  public type G714Input = {
    header         : ProjectHeader;
    directiveNo    : Text;
    issuedDate     : Text;
    description    : Text;
    attachments    : [Text];
    methodAdjustment: Text; // Lump sum / unit price / time & material / TBD
    proposedAmount : Float;
  };

  // ─── G704 — Certificate of Substantial Completion ────────────────────────────
  public type G704Input = {
    header              : ProjectHeader;
    projectDescription  : Text;
    completionDate      : Text;
    punchListItems      : [Text];
    ownerOccupancyDate  : ?Text;
    warrantyStartDate   : Text;
    contractorWarrantyPeriod : Text;
  };

  // ─── G716 — Request for Information ──────────────────────────────────────────
  public type G716Input = {
    header         : ProjectHeader;
    rfiNumber      : Text;
    dateSubmitted  : Text;
    subjectRef     : Text;
    question       : Text;
    drawingSheets  : [Text];
    specSections   : [Text];
    requestedBy    : Text;
    responseNeededBy: Text;
  };

  // ─── G901-G904 — Lien Waivers ────────────────────────────────────────────────
  public type LienWaiverType = {
    #ConditionalPartial;   // G901
    #UnconditionalPartial; // G902
    #ConditionalFinal;     // G903
    #UnconditionalFinal;   // G904
  };

  public type LienWaiverState = {
    #TX; #CA; #FL; #GA; #NV; #AZ; #Generic;
  };

  public type LienWaiverInput = {
    header         : ProjectHeader;
    waiverType     : LienWaiverType;
    stateVariant   : LienWaiverState;
    claimantName   : Text;
    customerName   : Text;
    throughDate    : Text;
    paymentAmount  : Float;
    claimantSignature: Text;
    signatureDate  : Text;
    notaryBlock    : Bool;
  };

  // ─── A101 — Standard Form of Agreement ───────────────────────────────────────
  public type A101Input = {
    header         : ProjectHeader;
    agreementDate  : Text;
    scopeOfWork    : Text;
    projectType    : Text;
    completionDate : Text;
    stipulatedSum  : Float;
    paymentSchedule: Text;
    retainagePercent: Float;
  };

  // ─── A401 — Contractor-Subcontractor Agreement ───────────────────────────────
  public type A401Input = {
    header           : ProjectHeader;
    subcontractorName: Text;
    subcontractorAddress: Text;
    subcontractScope : Text;
    subcontractSum   : Float;
    agreementDate    : Text;
    completionDate   : Text;
    retainagePercent : Float;
    paymentDays      : Nat;
  };

  // ─── A305 — Contractor Qualification Statement ───────────────────────────────
  public type A305Input = {
    header           : ProjectHeader;
    contractorLicenseNo: Text;
    yearsInBusiness  : Nat;
    annualRevenue    : Float;
    bondingCapacity  : Float;
    keyPersonnel     : [Text];
    recentProjects   : [Text];
    safetyRecord     : Text;
    emrRate          : Float; // Experience Modification Rate
    insuranceLimits  : Text;
  };

  // ─── A310 — Bid Bond ─────────────────────────────────────────────────────────
  public type A310Input = {
    header       : ProjectHeader;
    bidAmount    : Float;
    penalSum     : Float;
    obligeeOwner : Text;
    bidDate      : Text;
    bondNo       : Text;
    suretyName   : Text;
    suretyAddress: Text;
  };

  // ─── Generic AIA Form Input (for dispatch routing) ───────────────────────────
  public type AIAFormType = {
    #G702; #G703; #G701; #G714; #G704; #G716;
    #G901; #G902; #G903; #G904;
    #A101; #A401; #A305; #A310;
  };

  public type AIADocInput = {
    tenantId  : Text;
    projectId : Text;
    formType  : AIAFormType;
    formData  : Text; // JSON-serialized form-specific input
  };

  public type AIADocRecord = {
    id          : Text;
    tenantId    : Text;
    projectId   : Text;
    formType    : AIAFormType;
    formData    : Text;
    generatedBy : Principal;
    timestamp   : Int;
    status      : AIADocStatus;
    pdfPayload  : Text; // Base64-encoded PDF or structured template for frontend rendering
    deliverables: [Text];
  };

  public type AIADocStatus = {
    #Draft;
    #Generated;
    #Signed;
    #Distributed;
    #Archived;
  };

  public type AIADocResponse = {
    record      : AIADocRecord;
    documentContent: Text;   // Structured JSON for pdf-lib rendering
    deliverables: [Text];
    bhxTaskId   : Text;
    cplAuditHash: Text;
  };

};

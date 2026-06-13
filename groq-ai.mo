import Result "mo:core/Result";

module {

  // ─── Report Template ─────────────────────────────────────────────────────
  // A named, reusable report template that combines multiple document types.
  public type DocumentType = {
    #jsa;
    #toolboxTalk;
    #inspectionForm;
    #incidentReport;
    #preTaskPlan;
    #safetyBriefing;
    #emergencyResponse;
    #safetyAudit;
    #hazardAssessment;
    #complianceCertificate;
    #oshaForm300;
    #oshaForm300A;
    #oshaForm301;
    #aiaG702;
    #aiaG703;
    #aiaG701;
    #aiaG704;
    #csiMeetingMinutes;
    #csiDailyReport;
    #csiPunchList;
    #customSection;
  };

  public type LayerType = {
    #executiveSummary;  // Boardroom-ready, condensed, risk scorecard
    #fieldDetail;       // Full step-by-step, job-site ready
    #perSubBreakdown;   // Per-subcontractor filtered view
    #fullPackage;       // Both executive + field layers
  };

  public type ReportSection = {
    order       : Nat;
    docType     : DocumentType;
    title       : Text;
    isRequired  : Bool;
    pageBreak   : Bool;  // force page break before this section
    customContent : ?Text; // optional freeform text injection
  };

  public type ReportTemplate = {
    id          : Text;
    tenantId    : Text;
    name        : Text;
    description : Text;
    sections    : [ReportSection];
    layer       : LayerType;
    isPreset    : Bool;   // platform-provided vs user-created
    createdBy   : Principal;
    createdAt   : Int;
    updatedAt   : Int;
    isArchived  : Bool;
    usageCount  : Nat;
    tags        : [Text];  // e.g. "weekly", "safety", "executive"
  };

  // ─── Report Assembly ─────────────────────────────────────────────────────
  // Assembled report ready for generation, with cover page and TOC.
  public type CoverPageConfig = {
    companyName    : Text;
    projectName    : Text;
    projectAddress : Text;
    reportTitle    : Text;
    reportDate     : Int;
    preparedBy     : Text;
    preparedByRole : Text;
    logoAssetId    : ?Text;
    confidential   : Bool;
  };

  public type TableOfContentsEntry = {
    sectionTitle : Text;
    pageNumber   : Nat;
    docType      : DocumentType;
  };

  public type ReportAssembly = {
    id           : Text;
    tenantId     : Text;
    templateId   : ?Text;   // nil if ad-hoc assembly
    name         : Text;
    coverPage    : CoverPageConfig;
    toc          : [TableOfContentsEntry];  // auto-generated
    sections     : [ReportSection];         // ordered section list
    layer        : LayerType;
    sourceProjectIds  : [Text];  // multi-project aggregation
    sourceTagIds      : [Nat];
    sourceSessionIds  : [Text];
    includePerception : Bool;    // embed 7-engine Neural Perception panel
    includeCplAudit   : Bool;    // embed CPL audit trail footer
    totalPages        : ?Nat;
    assetId           : ?Text;   // generated PDF asset ID
    assemblyStatus    : Text;    // "draft" | "generating" | "ready" | "error"
    bhxTaskId         : ?Text;   // BHX Worker task that generated this
    createdBy         : Principal;
    createdAt         : Int;
    completedAt       : ?Int;
  };

  // ─── Report Distribution ───────────────────────────────────────────────────
  // Recipient list, role-filtered content, one-click send, delivery tracking.
  public type RecipientRole = {
    #gc;
    #safetyDirector;
    #pm;
    #owner;
    #sub;
    #foreman;
    #exec;
    #inspector;
    #custom;
  };

  public type ReportRecipientEntry = {
    contactId   : ?Text;     // from contact-directory; nil for ad-hoc
    name        : Text;
    email       : Text;
    role        : RecipientRole;
    layer       : LayerType;  // which layer this recipient sees
    filterToProjects : [Text]; // empty = all projects in assembly
    deliveryMethod : Text;   // "email" | "link" | "inApp"
    shareLink    : ?Text;    // generated shareable link
  };

  public type DeliveryStatus = {
    #pending;
    #sent;
    #delivered;
    #opened;
    #failed;
    #bounced;
  };

  public type RecipientDelivery = {
    recipientEmail : Text;
    status         : DeliveryStatus;
    sentAt         : ?Int;
    deliveredAt    : ?Int;
    openedAt       : ?Int;
    errorMessage   : ?Text;
    retryCount     : Nat;
  };

  public type ReportDistribution = {
    id           : Text;
    assemblyId   : Text;
    tenantId     : Text;
    recipients   : [ReportRecipientEntry];
    deliveries   : [RecipientDelivery];
    sentBy       : Principal;
    sentAt       : Int;
    subject      : Text;
    bodyPreview  : Text;
    bhxTaskId    : ?Text;  // MessagingEngine BHX task
    status       : Text;   // "pending" | "sending" | "complete" | "partial_failure"
  };

  // ─── Report Schedule ─────────────────────────────────────────────────────
  // Recurring report generation with automatic distribution.
  public type Cadence = {
    #daily;
    #weekly;
    #biweekly;
    #monthly;
    #custom;  // customIntervalDays field applies
  };

  public type ReportSchedule = {
    id                 : Text;
    tenantId           : Text;
    name               : Text;
    templateId         : Text;
    sourceProjectIds   : [Text];
    recipients         : [ReportRecipientEntry];
    cadence            : Cadence;
    customIntervalDays : ?Nat;  // used when cadence = #custom
    dayOfWeek          : ?Nat;  // 0=Sun..6=Sat, used when cadence = #weekly
    dayOfMonth         : ?Nat;  // 1-31, used when cadence = #monthly
    timeOfDayUtcHour   : Nat;   // 0-23
    nextRunAt          : Int;   // next scheduled generation timestamp
    lastRunAt          : ?Int;
    lastRunAssemblyId  : ?Text;
    isActive           : Bool;
    createdBy          : Principal;
    createdAt          : Int;
    runCount           : Nat;
    failureCount       : Nat;
    layer              : LayerType;
    includePerception  : Bool;
    includeCplAudit    : Bool;
  };

  // ─── Shared result type ───────────────────────────────────────────────────
  public type RBResult<T> = Result.Result<T, Text>;
}

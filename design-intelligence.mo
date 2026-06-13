// types/documents.mo — Documents Domain Types
// Extends DGE with e-signature, Excel export, evidence alignment, multi-industry templates.
import Map "mo:core/Map";

module {

  // ─── E-Signature ──────────────────────────────────────────────────────────
  public type SignatureStatus = {
    #pending;
    #signed;
    #declined;
    #expired;
  };

  public type SignatureRecord = {
    signerPrincipal : Text;
    signerName      : Text;
    signerTitle     : Text;
    signerEmail     : Text;
    signedAt        : Int;
    ipAddress       : Text;
    status          : SignatureStatus;
    certificate     : Text;
  };

  public type ESignatureEnvelope = {
    envelopeId  : Text;
    documentId  : Text;
    tenantId    : Text;
    createdAt   : Int;
    expiresAt   : Int;
    signers     : [SignatureRecord];
    auditTrail  : [Text];
    finalHash   : Text;
    isComplete  : Bool;
  };

  // ─── Excel Export ─────────────────────────────────────────────────────────
  public type ExcelColumn = {
    header  : Text;
    key     : Text;
    width   : Nat;
    formula : ?Text;
  };

  public type ExcelSheet = {
    sheetName : Text;
    columns   : [ExcelColumn];
    rows      : [[Text]];
    hasTotals : Bool;
    pivotHint : ?Text;
  };

  public type ExcelPackage = {
    packageId   : Text;
    documentId  : Text;
    tenantId    : Text;
    filename    : Text;
    sheets      : [ExcelSheet];
    generatedAt : Int;
  };

  // ─── Evidence / Alignment ─────────────────────────────────────────────────
  public type EvidenceCitation = {
    source    : Text;
    excerpt   : Text;
    alignScore: Nat;
    compliant : Bool;
  };

  public type AlignmentReport = {
    documentId  : Text;
    overallScore: Nat;
    citations   : [EvidenceCitation];
    gaps        : [Text];
    generatedAt : Int;
  };

  // ─── Extended Industry Template Metadata ─────────────────────────────────
  public type IndustryVertical = {
    #construction_commercial;
    #construction_healthcare;
    #construction_civil;
    #construction_stadium;
    #construction_environmental;
    #safety_general;
    #safety_osha;
    #financial_aia;
    #procurement;
    #closeout;
  };

  public type ExtendedTemplateMeta = {
    templateId      : Text;
    vertical        : IndustryVertical;
    nameEs          : Text;
    descriptionEs   : Text;
    regulatoryRefs  : [Text];
    requiredForms   : [Text];
    signaturesNeeded: Nat;
    hasExcelExport  : Bool;
    minPages        : Nat;
    maxPages        : Nat;
    industryNotes   : Text;
    industryNotesEs : Text;
  };

  // ─── Document Send/Share ──────────────────────────────────────────────────
  public type SendTarget = {
    recipientName    : Text;
    recipientEmail   : Text;
    recipientRole    : Text;
    requiresSignature: Bool;
  };

  public type DocumentSendRecord = {
    sendId      : Text;
    documentId  : Text;
    tenantId    : Text;
    sentAt      : Int;
    sentBy      : Text;
    targets     : [SendTarget];
    message     : Text;
    messageEs   : Text;
    envelopeId  : ?Text;
  };

  // ─── Domain State ─────────────────────────────────────────────────────────
  public type DocumentsState = {
    envelopes        : Map.Map<Text, ESignatureEnvelope>;
    excelPackages    : Map.Map<Text, ExcelPackage>;
    alignmentReports : Map.Map<Text, AlignmentReport>;
    extendedMeta     : Map.Map<Text, ExtendedTemplateMeta>;
    sendRecords      : Map.Map<Text, DocumentSendRecord>;
  };
};

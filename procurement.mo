// DGE — Documentum Generatio Engine Types
// Document Generation Engine: professional document packages for construction, healthcare, and business.
// Generates AIA G-Series, CSI, OSHA, presentation packets, proposals — any professional templated document.
import Map "mo:core/Map";
module {

  // ─── Field Definitions ────────────────────────────────────────────────────
  public type FieldType = {
    #text;
    #number;
    #date;
    #currency;  // stored as Nat (cents)
    #checkbox;
    #signature;
    #textarea;
    #select;    // enumerated choices
    #multiselect;
    #address;
    #email;
    #phone;
  };

  public type DocumentField = {
    fieldId     : Text;
    fieldName   : Text;
    fieldType   : FieldType;
    required    : Bool;
    autoFillKey : ?Text;   // key in CompanyProfile / ProjectData to auto-fill
    defaultValue: ?Text;   // fallback if autoFill key not present
    placeholder : Text;
    helpText    : ?Text;
    choices     : ?[Text]; // for #select / #multiselect
  };

  // ─── Section Definitions ──────────────────────────────────────────────────
  public type DocumentSection = {
    sectionId   : Text;
    sectionName : Text;
    order       : Nat;
    fields      : [DocumentField];
    isPageBreak : Bool;    // true = start a new page in PDF output
    description : ?Text;
  };

  // ─── Template ─────────────────────────────────────────────────────────────
  public type IndustryCategory = {
    #construction;
    #healthcare;
    #business;
    #legal;
    #finance;
    #education;
    #government;
  };

  public type DocumentCategory = {
    // Construction
    #aiaGSeries;     // AIA G-Series official forms
    #aiaASeries;     // AIA A-Series contract/agreement forms
    #csiForms;       // CSI 44 standard project administration forms
    #oshaForms;      // OSHA 300-series injury/illness recordkeeping
    #safetyPrograms; // Written safety programs: JSA, LOTO, FPPSP, etc.
    #packageTemplates; // Multi-document packages: bid, closeout, pay app
    #projectReports; // Executive summaries, status reports, delay analysis
    #subForms;       // Subcontractor prequalification, NTP, change orders
    // Healthcare
    #healthcareForms;
    // Business
    #businessDocuments;
    #presentationPackets;
  };

  public type DocumentTemplate = {
    templateId    : Text;
    name          : Text;
    description   : Text;
    industry      : IndustryCategory;
    category      : DocumentCategory;
    officialForm  : ?Text;    // e.g. "AIA G702", "OSHA 300", "CSI Section 01 10 00"
    sections      : [DocumentSection];
    estimatedPages: Nat;      // typical page count for this form
    requiredRole  : ?Text;    // null = anyone; "safety_director" etc.
    isPackage     : Bool;     // true = aggregates multiple sub-templates
    subTemplates  : [Text];   // templateIds for package members
    version       : Text;
    lastUpdated   : Text;     // ISO date string
    tags          : [Text];
  };

  // ─── Metadata ─────────────────────────────────────────────────────────────
  public type ConfidentialityLevel = {
    #public_;
    #internal;
    #confidential;
    #restricted;
  };

  public type DocumentMetadata = {
    industry        : IndustryCategory;
    category        : DocumentCategory;
    documentType    : Text;
    projectRef      : ?Text;
    companyName     : Text;
    projectName     : Text;
    author          : Text;
    revision        : Text;
    confidentiality : ConfidentialityLevel;
    tags            : [Text];
  };

  // ─── Generation Params ────────────────────────────────────────────────────
  public type DocumentGenerationParams = {
    templateId     : Text;
    tenantId       : Text;    // principal as text — multi-tenant isolation
    projectId      : ?Text;
    companyName    : Text;
    projectName    : Text;
    fieldOverrides : [(Text, Text)];  // (fieldId, value) overrides
    requestedBy    : Principal;
  };

  // ─── Draft ────────────────────────────────────────────────────────────────
  public type DraftStatus = {
    #inProgress;
    #complete;
    #archived;
  };

  public type DocumentDraft = {
    id          : Text;
    templateId  : Text;
    tenantId    : Text;
    createdAt   : Int;
    updatedAt   : Int;
    fieldValues : [(Text, Text)];  // (fieldId, value) pairs
    status      : DraftStatus;
    name        : Text;            // user-assigned name for this draft
  };

  // ─── Result ───────────────────────────────────────────────────────────────
  public type DocumentStatus = {
    #generated;
    #signed;
    #distributed;
    #archived;
  };

  public type DocumentResult = {
    id             : Text;
    templateId     : Text;
    templateName   : Text;
    generatedAt    : Int;
    tenantId       : Text;
    sections       : [DocumentSection];  // sections with filled field values
    metadata       : DocumentMetadata;
    generationHash : Text;  // CPL audit hash: tenantId#templateId#timestamp
    pageCount      : Nat;
    fieldsFilled   : Nat;
    fieldsTotal    : Nat;
    status         : DocumentStatus;
  };

  // ─── DGE State ────────────────────────────────────────────────────────────
  public type DGEState = {
    templates    : Map.Map<Text, DocumentTemplate>;
    drafts       : Map.Map<Text, DocumentDraft>;
    results      : Map.Map<Text, DocumentResult>;
    usageByTenant: Map.Map<Text, Nat>;
    monthlyReset : Int;    // timestamp of last monthly reset
  };
};

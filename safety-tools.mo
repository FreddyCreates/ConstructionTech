// types/workspace-library.mo — Workspace Library domain types
// Authoritative type definitions for all WL data: Davis-Bacon wages,
// CSI MasterFormat 2026 (all 50 divisions), AIA form structures,
// JSA task templates, and document template layouts.
module {

  // ── Davis-Bacon Prevailing Wage ──────────────────────────────────────────────

  /// Federal Davis-Bacon prevailing wage determination record.
  /// Source: U.S. Department of Labor Wage and Hour Division determinations.
  /// Applicable to federally-funded construction projects.
  public type DavisBaconWage = {
    tradeClassification : Text;   // e.g. "CARPENTER", "ELECTRICIAN", "IRONWORKER"
    wdNumber            : Text;   // DOL WD number e.g. "WD-2024-0001"
    state               : Text;   // 2-letter state code e.g. "CA", "TX", "NY"
    county              : Text;   // county or "Statewide"
    basicHourlyRate     : Float;  // base hourly wage (USD)
    fringesBenefits     : Float;  // fringe benefits per hour (health, pension, etc.)
    totalPackage        : Float;  // basicHourlyRate + fringesBenefits
    overtimeRate        : Float;  // 1.5x base for OT hours
    effectiveDate       : Text;   // e.g. "2024-01-01"
    decisionType        : Text;   // "General" | "Residential" | "Heavy" | "Highway"
    cfr                 : Text;   // "29 CFR Part 5"
    source              : Text;   // "DOL WHD 2024"
  };

  /// Union scale wage record — trade union contract rates.
  /// Sources: IBEW, UA, BAC, UBC, LIUNA, SMART collective bargaining agreements.
  public type UnionWageRate = {
    tradeUnion      : Text;   // e.g. "IBEW Local 3", "UA Local 638"
    tradeCategory   : Text;   // e.g. "Electrician", "Plumber", "Ironworker"
    market          : Text;   // city/metro e.g. "New York City", "Los Angeles"
    journeymanRate  : Float;  // journeyman base rate (USD/hr)
    apprenticeRate  : Float;  // first-year apprentice rate (USD/hr)
    fringes         : Float;  // total fringe benefit cost per hour
    annualizedCost  : Float;  // fully-burdened annualized cost (40-hr week, 52 weeks)
    contractYear    : Nat;    // contract year e.g. 2024
    source          : Text;
  };

  // ── CSI MasterFormat 2026 ────────────────────────────────────────────────────

  /// CSI MasterFormat 2026 division record — all 50 divisions.
  /// Source: Construction Specifications Institute MasterFormat 2026.
  public type CsiMasterFormatDivision = {
    number          : Text;   // e.g. "01", "09", "22" (zero-padded)
    title           : Text;   // official division title
    scope           : Text;   // division scope description
    typicalSections : [Text]; // 3-5 representative section numbers and titles
    broadcastSections : [Text]; // the most-used sections in commercial construction
    relatedDivisions : [Text]; // related/interfacing divisions by number
    notes           : Text;   // OIS platform implementation notes
  };

  // ── AIA Document Field Structures ───────────────────────────────────────────

  /// Individual field in an AIA form.
  public type AIAFormField = {
    fieldId     : Text;   // unique field identifier
    label       : Text;   // official AIA label text
    dataType    : Text;   // "text" | "number" | "currency" | "date" | "percent" | "signature" | "checkbox"
    required    : Bool;
    autoFill    : Bool;   // can be auto-populated from platform data
    autoFillSource : Text; // e.g. "project.name", "sov.contractSum", "tenant.companyName"
    sampleValue : Text;   // realistic sample value for this field
    description : Text;   // what this field captures
  };

  /// AIA form definition with all fields and instructions.
  public type AIAFormDefinition = {
    formNumber  : Text;   // e.g. "G702", "G701", "A101"
    title       : Text;   // official AIA form title
    series      : Text;   // "G-Series" | "A-Series" | "B-Series" | "C-Series"
    purpose     : Text;   // what this form is used for
    parties     : [Text]; // parties to this document e.g. ["Owner", "Contractor", "Architect"]
    fields      : [AIAFormField]; // all form fields in order
    notes       : Text;   // usage notes and common requirements
    edition     : Text;   // form edition e.g. "2017"
    cfr         : Text;   // relevant contract provision references
  };

  // ── JSA Task Templates ───────────────────────────────────────────────────────

  /// A single step in a JSA task breakdown.
  public type JSATaskStep = {
    stepNumber  : Nat;
    description : Text;   // what the worker is doing in this step
    hazards     : [Text]; // specific hazards at this step
    controls    : [Text]; // specific controls (hierarchy of controls)
    ppe         : [Text]; // PPE required for this step
    cfr         : Text;   // OSHA CFR reference if applicable
  };

  /// Complete JSA template for a specific work activity.
  /// Pre-populated with real construction-specific hazards and controls.
  public type JSATemplate = {
    templateId    : Nat;
    workActivity  : Text;    // e.g. "Structural Steel Erection", "Electrical Panel Work"
    tradeCategory : Text;    // e.g. "Ironworker", "Electrician", "Carpenter"
    csiDivision   : Text;    // primary CSI division e.g. "05"
    oshaSubparts  : [Text];  // applicable OSHA 1926 subparts
    focusFourRisk : [Text];  // Focus Four categories that apply
    riskLevel     : Text;    // "Critical" | "High" | "Medium"
    prerequisites : [Text];  // required training, permits, inspections before start
    steps         : [JSATaskStep]; // sequential task breakdown with hazards and controls
    emergencyProcedures : [Text]; // task-specific emergency response
    reviewFrequency : Text;  // "Before each task" | "Daily" | "Weekly"
  };

  // ── Document Template Structures ─────────────────────────────────────────────

  /// A page/section layout for a document template.
  public type DocumentSection = {
    sectionId   : Text;
    title       : Text;
    pageRange   : Text;   // e.g. "Page 1" | "Pages 2-3"
    content     : [Text]; // required content items for this section
    autoFillSources : [Text]; // platform data sources to auto-fill this section
  };

  /// Full document template definition.
  public type DocumentTemplate = {
    templateId    : Text;
    name          : Text;
    category      : Text;   // "AIA" | "CSI" | "OSHA" | "Safety" | "Financial" | "Project" | "Healthcare"
    subcategory   : Text;   // e.g. "Pay Application", "Lien Waiver", "Incident Report"
    description   : Text;
    pageCount     : Text;   // e.g. "1" | "2-3" | "5-10" | "10-35"
    sections      : [DocumentSection];
    dataSources   : [Text]; // platform modules that feed this template
    outputFormats : [Text]; // "PDF" | "CSV" | "Email" | "ShareableLink" | "OnChain"
    requiredInputs : [Text]; // what the user must provide
    autoFilledFields : Nat; // number of fields auto-populated from platform data
    notes         : Text;
  };

}

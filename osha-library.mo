// OIS Integration Types — 7 native integrations
// Three.js, pdf-lib, web-ifc, Native Agent Intelligence, OSHA API, BLS/Davis-Bacon, Internet Identity
import Time "mo:core/Time";

module {

  // ─── 1. THREE.JS LIVE DATA SERVING ────────────────────────────────────────

  /// Full model data for Three.js GLB/GLTF rendering in ModelLibraryPage.
  public type FurnitureModel3D = {
    id            : Text;
    name          : Text;
    brand         : Text;
    category      : Text;        // maps to FurnitureCategory variant text
    csiDivision   : Text;        // e.g. "12 35 00 - Residential Casework"
    dimensions    : Dimensions3D;
    materialIds   : [Text];      // references Material3D.id list
    thumbnailUrl  : Text;        // HTTPS URL or on-chain asset path
    geometryUrl   : Text;        // GLB/GLTF asset URL for Three.js loader
    cost          : Float;       // USD mid-point from Workspace Library
    finishOptions : [Text];      // e.g. ["Walnut", "White Oak", "Ebony"]
  };

  public type Dimensions3D = {
    widthIn  : Float;   // inches
    depthIn  : Float;   // inches
    heightIn : Float;   // inches
  };

  /// Material properties consumed by Three.js MeshStandardMaterial.
  public type Material3D = {
    id          : Text;
    name        : Text;
    category    : Text;     // "Wood" | "Metal" | "Fabric" | "Stone" etc.
    colorHex    : Text;     // e.g. "#a87c52"
    roughness   : Float;    // 0.0–1.0
    metalness   : Float;    // 0.0–1.0
    textureUrl  : Text;     // PBR texture map URL (empty = flat color)
    costPerUnit : Float;    // USD per sqft
  };

  // ─── 2. PDF-LIB SHARED UTILITY ────────────────────────────────────────────

  /// Template metadata returned to the frontend pdfExport.ts utility.
  public type PDFTemplate = {
    toolName        : Text;
    headerImageUrl  : Text;    // OIS logo URL
    footerText      : Text;    // CPL audit trail text
    pageSize        : Text;    // "A4" | "Letter" | "Legal"
    orientation     : Text;    // "portrait" | "landscape"
    brandingColors  : [Text];  // [primaryHex, accentHex]
  };

  /// Audit log record for PDF generation events.
  public type PDFAuditRecord = {
    toolName   : Text;
    principal  : Principal;
    timestamp  : Nat64;
  };

  // ─── 3. WEB-IFC PARSING SUPPORT ───────────────────────────────────────────

  /// Metadata extracted from a parsed IFC file stored on-chain.
  public type IFCMetadata = {
    projectId       : Text;
    fileName        : Text;
    uploadTimestamp : Nat64;
    elementCount    : Nat;
    elementTypes    : [Text];  // e.g. ["IfcWall", "IfcDoor", "IfcSlab"]
    totalArea       : Float;   // sqft
    totalVolume     : Float;   // cubic ft
    principal       : Principal;
  };

  /// A single IFC element extracted for auto-population of tool inputs.
  public type IFCElement = {
    id          : Text;
    elementType : Text;   // e.g. "IfcWall"
    name        : Text;
    description : Text;
    area        : Float;  // sqft
    volume      : Float;  // cubic ft
    length      : Float;  // linear ft
    material    : Text;
    level       : Text;   // e.g. "Level 1"
  };

  // ─── 4. NATIVE AGENT INTELLIGENCE ──────────────────────────────────────────

  /// Response from the native OIS Nexus intelligence engine.
  public type AgentResponse = {
    message   : Text;
    confidence : Float;    // 0.0–1.0 Nexus-scored confidence
    source    : Text;      // "nexus_native" | "user"
    timestamp : Nat64;
    agentId   : Text;
  };

  /// A single message in an agent conversation thread.
  public type ChatMessage = {
    role      : Text;     // "user" | "agent"
    content   : Text;
    timestamp : Nat64;
    source    : Text;     // "nexus_native" | "user"
  };

  // ─── 5. OSHA PUBLIC API HTTP OUTCALLS ─────────────────────────────────────

  /// A cached OSHA inspection record from data.dol.gov.
  public type OSHAInspection = {
    inspectionId      : Text;
    establishmentName : Text;
    naicsCode         : Text;
    state             : Text;
    openDate          : Text;   // ISO date string
    closeDate         : Text;   // ISO date string
    severity          : Text;   // "Serious" | "Willful" | "Repeat" | "Other"
    violationCount    : Nat;
  };

  /// A cached OSHA violation record.
  public type OSHAViolation = {
    violationId    : Text;
    inspectionId   : Text;
    standard       : Text;   // e.g. "1926.501(b)(1)"
    description    : Text;
    gravity        : Text;   // "High" | "Medium" | "Low"
    penaltyAmount  : Float;  // USD
    abatementDate  : Text;   // ISO date string
  };

  /// Result returned by the admin refreshOSHAData function.
  public type OSHARefreshResult = {
    inspectionsAdded : Nat;
    violationsAdded  : Nat;
    timestamp        : Nat64;
    errors           : [Text];
  };

  /// OSHA cache status.
  public type OSHADataStatus = {
    lastRefresh  : Nat64;
    recordCount  : Nat;
    source       : Text;
  };

  // ─── 6. BLS / DAVIS-BACON WAGE DATA ───────────────────────────────────────

  /// BLS Occupational Employment Statistics wage record.
  public type BLSWageRecord = {
    trade        : Text;   // e.g. "Carpenter"
    state        : Text;   // two-letter abbreviation
    year         : Nat;
    meanWage     : Float;  // USD/hour
    medianWage   : Float;  // USD/hour
    percentile10 : Float;
    percentile90 : Float;
    source       : Text;   // "BLS_OES" | "DavisBacon"
  };

  /// Davis-Bacon Act prevailing wage determination record.
  public type DavisBaconRecord = {
    county          : Text;
    state           : Text;
    trade           : Text;
    wageRate        : Float;   // USD/hour
    fringeBenefits  : Float;   // USD/hour
    effectiveDate   : Text;    // ISO date string
    determinationId : Text;    // DOL determination number
  };

  /// Result returned by the admin refreshBLSWageData function.
  public type BLSRefreshResult = {
    recordsAdded   : Nat;
    tradesUpdated  : Nat;
    timestamp      : Nat64;
    errors         : [Text];
  };

  /// BLS cache status.
  public type BLSDataStatus = {
    lastRefresh : Nat64;
    tradeCount  : Nat;
    source      : Text;
  };

  // ─── 7. INTERNET IDENTITY AUDIT ───────────────────────────────────────────

  /// Principal authentication and authority status.
  public type PrincipalAuthStatus = {
    authenticated  : Bool;
    authorityLevel : Nat;    // CPL authority level 1–5
    lastActivity   : Nat64;
  };

  /// A route that requires Internet Identity authentication.
  public type ProtectedRoute = {
    path          : Text;
    requiredLevel : Nat;   // minimum CPL authority level
    description   : Text;
  };

  /// A tool result record scoped to a principal.
  public type ToolResultRecord = {
    toolName  : Text;
    result    : Text;      // JSON result payload
    timestamp : Nat64;
    projectId : Text;
    principal : Principal;
  };

}

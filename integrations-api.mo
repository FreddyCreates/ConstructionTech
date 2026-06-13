// PROTOCOLS-API — Public endpoints for OIS construction protocol intelligence
// Exposes CSI MasterFormat 2026, AIA contract families, NCS, and project
// lifecycle data through the CPL-governed BHX colony pipeline.
import Types "../types/protocols";
import Lib "../lib/protocols";

mixin () {

  // ─── CSI MasterFormat 2026 ────────────────────────────────────────────────

  /// Return all 50 CSI MasterFormat 2026 divisions
  public query func getAllCSIDivisions() : async [Types.CSIDivision] {
    Lib.csiDivisions
  };

  /// Get a single CSI division by number (e.g. "09" for Finishes)
  public query func getCSIDivision(number : Text) : async ?Types.CSIDivision {
    Lib.getDivision(number)
  };

  /// Search CSI divisions by keyword
  public query func searchCSIDivisions(keyword : Text) : async [Types.CSIDivision] {
    Lib.searchDivisions(keyword)
  };

  /// Get all CSI divisions active in a project phase
  public query func getCSIDivisionsForPhase(phase : Types.ProjectPhase) : async [Types.CSIDivision] {
    Lib.divisionsForPhase(phase)
  };

  // ─── AIA Contract Document Families ──────────────────────────────────────

  /// Return all AIA contract document families with full document lists
  public query func getAllAIAFamilies() : async [Types.AIAContractFamilyRecord] {
    Lib.aiaFamilies
  };

  /// Get a specific AIA contract family (Conventional, DesignBuild, CMa, CMc, IPD, Interiors, Modular)
  public query func getAIAFamily(family : Types.AIAContractFamily) : async ?Types.AIAContractFamilyRecord {
    Lib.getAIAFamily(family)
  };

  /// Get a specific AIA document by number (e.g. "A201", "B101", "G702")
  public query func getAIADocument(docNumber : Text) : async ?Types.AIADocumentRef {
    Lib.getAIADoc(docNumber)
  };

  // ─── Project Lifecycle Phases ─────────────────────────────────────────────

  /// Return all 7 AIA/CMAA standard project lifecycle phases
  public query func getAllLifecyclePhases() : async [Types.ProjectLifecyclePhase] {
    Lib.lifecyclePhases
  };

  /// Get a specific project lifecycle phase
  public query func getLifecyclePhase(phase : Types.ProjectPhase) : async ?Types.ProjectLifecyclePhase {
    Lib.getPhase(phase)
  };

  /// Get AIA forms triggered in a specific project phase
  public query func getAIAFormsForPhase(phase : Types.ProjectPhase) : async [Text] {
    Lib.aiaFormsForPhase(phase)
  };

  // ─── National CAD Standard (NCS) ─────────────────────────────────────────

  /// Return all NCS sheet organization records (A through L series)
  public query func getAllNCSSheetOrganizations() : async [Types.NCSSheetOrganization] {
    Lib.ncsSheetOrganizations
  };

  /// Get NCS sheet organization for a discipline series code (e.g. "A", "S", "M")
  public query func getNCSSheetBySeries(seriesCode : Text) : async ?Types.NCSSheetOrganization {
    Lib.getNCSSheetBySeries(seriesCode)
  };

  /// Get NCS layer rules for a discipline (e.g. "A" for Architectural, "M" for Mechanical)
  public query func getNCSLayersByDiscipline(discipline : Text) : async [Types.NCSLayerRule] {
    Lib.getLayersByDiscipline(discipline)
  };

  // ─── Communication Paths ─────────────────────────────────────────────────

  /// Return all standard construction communication paths (RFI, Submittal, ChangeOrder, PayApp)
  public query func getAllCommPaths() : async [Types.CommPath] {
    Lib.communicationPaths
  };

  /// Get the communication path and routing for a document type
  public query func getCommPath(docType : Text) : async ?Types.CommPath {
    Lib.getCommPath(docType)
  };

  // ─── Protocol Summary ─────────────────────────────────────────────────────

  /// Return counts of all protocol data loaded in the platform
  public query func getProtocolSummary() : async Types.ProtocolSummary {
    Lib.getSummary()
  };

}

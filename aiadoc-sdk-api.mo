// mixins/dge-api.mo — DGE Public API Mixin
// Exposes DGE (Documentum Generatio Engine) endpoints via actor mixin.
// Follows fie-api.mo pattern exactly.
import Time "mo:core/Time";
import DGE "../lib/dge";
import DGETypes "../types/dge";

mixin (
  _dgeState : DGETypes.DGEState
) {

  // ─── Template Library ─────────────────────────────────────────────────────

  /// Return all templates in the DGE library.
  public query func getTemplateLibrary() : async [DGETypes.DocumentTemplate] {
    DGE.getTemplateLibrary(_dgeState)
  };

  /// Return a single template by templateId.
  public query func getTemplateById(templateId : Text) : async ?DGETypes.DocumentTemplate {
    DGE.getTemplateById(_dgeState, templateId)
  };

  /// Return all templates for a given category string.
  /// Valid categories: aiaGSeries, aiaASeries, csiForms, oshaForms, safetyPrograms,
  ///   packageTemplates, projectReports, subForms, healthcareForms, businessDocuments, presentationPackets
  public query func getTemplatesByCategory(category : Text) : async [DGETypes.DocumentTemplate] {
    DGE.getTemplatesByCategory(_dgeState, category)
  };

  /// Return all templates for a given industry string.
  /// Valid industries: construction, healthcare, business, legal, finance, education, government
  public query func getTemplatesByIndustry(industry : Text) : async [DGETypes.DocumentTemplate] {
    DGE.getTemplatesByIndustry(_dgeState, industry)
  };

  /// Full-text search across template names, descriptions, and tags.
  public query func searchTemplates(searchTerm : Text) : async [DGETypes.DocumentTemplate] {
    DGE.searchTemplates(_dgeState, searchTerm)
  };

  // ─── Document Generation ──────────────────────────────────────────────────

  /// Generate a document from a template, applying company/project auto-fill and overrides.
  /// Increments tenant usage counter. Returns DocumentResult with CPL audit hash.
  public shared ({ caller }) func generateDocument(
    templateId     : Text,
    tenantId       : Text,
    projectId      : ?Text,
    companyName    : Text,
    projectName    : Text,
    fieldOverrides : [(Text, Text)],
    companyProfile : [(Text, Text)],
    projectData    : [(Text, Text)]
  ) : async DGETypes.DocumentResult {
    let params : DGETypes.DocumentGenerationParams = {
      templateId;
      tenantId;
      projectId;
      companyName;
      projectName;
      fieldOverrides;
      requestedBy = caller;
    };
    DGE.generateDocument(_dgeState, params, companyProfile, projectData)
  };

  // ─── Drafts ───────────────────────────────────────────────────────────────

  /// Save or update a document draft. Returns the draft ID.
  public shared ({ caller }) func saveDocumentDraft(
    draftId    : Text,
    templateId : Text,
    tenantId   : Text,
    name       : Text,
    fieldValues: [(Text, Text)]
  ) : async Text {
    ignore caller;
    let draft : DGETypes.DocumentDraft = {
      id         = draftId;
      templateId;
      tenantId;
      createdAt  = Time.now();
      updatedAt  = Time.now();
      fieldValues;
      status     = #inProgress;
      name;
    };
    DGE.saveDocumentDraft(_dgeState, draft)
  };

  /// Retrieve a document draft by ID. Returns null if not found or wrong tenant.
  public shared query ({ caller }) func getDocumentDraft(
    draftId  : Text,
    tenantId : Text
  ) : async ?DGETypes.DocumentDraft {
    ignore caller;
    DGE.getDocumentDraft(_dgeState, draftId, tenantId)
  };

  // ─── Results ──────────────────────────────────────────────────────────────

  /// Return the 20 most recent generated documents for a tenant.
  public shared query ({ caller }) func getRecentDocuments(
    tenantId : Text
  ) : async [DGETypes.DocumentResult] {
    ignore caller;
    DGE.getRecentDocuments(_dgeState, tenantId)
  };

  /// Return the monthly document generation count for a tenant.
  public shared query ({ caller }) func getDocumentCount(
    tenantId : Text
  ) : async Nat {
    ignore caller;
    switch (_dgeState.usageByTenant.get(tenantId)) {
      case (?n) n;
      case null 0;
    }
  };

};

// mixins/documents-api.mo — Documents Domain Public API
// E-signature, Excel export, evidence alignment, extended template meta, document send.
import DocsLib "../lib/documents";
import DocTypes "../types/documents";

mixin (
  _docsState : DocTypes.DocumentsState
) {

  // ─── Extended Template Metadata ─────────────────────────────────────────

  /// Return all extended template metadata (100+ templates, all verticals).
  public query func getAllDocumentMeta() : async [DocTypes.ExtendedTemplateMeta] {
    DocsLib.getAllExtendedMeta(_docsState)
  };

  /// Return extended metadata for a single template.
  public query func getDocumentMeta(templateId : Text) : async ?DocTypes.ExtendedTemplateMeta {
    DocsLib.getExtendedMeta(_docsState, templateId)
  };

  /// Return all templates for a given industry vertical.
  /// Verticals: construction_commercial, construction_healthcare, construction_civil,
  /// construction_stadium, construction_environmental, safety_general, safety_osha,
  /// financial_aia, procurement, closeout
  public query func getDocumentMetaByVertical(vertical : Text) : async [DocTypes.ExtendedTemplateMeta] {
    DocsLib.getMetaByVertical(_docsState, vertical)
  };

  // ─── E-Signature ──────────────────────────────────────────────────────────

  /// Create an e-signature envelope for a document.
  /// signers: [(principalText, name, title, email)]
  /// expiresAt: nanoseconds timestamp, 0 = no expiry
  public shared ({ caller }) func createSignatureEnvelope(
    documentId : Text,
    tenantId   : Text,
    signers    : [(Text, Text, Text, Text)],
    expiresAt  : Int
  ) : async DocTypes.ESignatureEnvelope {
    ignore caller;
    DocsLib.createEnvelope(_docsState, documentId, tenantId, signers, expiresAt)
  };

  /// Record a signature on an envelope. Caller's principal is the signer.
  public shared ({ caller }) func signDocumentAdvanced(
    envelopeId : Text,
    ipAddress  : Text
  ) : async ?DocTypes.ESignatureEnvelope {
    DocsLib.recordSignature(_docsState, envelopeId, caller.toText(), ipAddress)
  };

  /// Get a signature envelope by ID.
  public query func getSignatureEnvelope(envelopeId : Text) : async ?DocTypes.ESignatureEnvelope {
    DocsLib.getEnvelope(_docsState, envelopeId)
  };

  /// Get all signature envelopes for a tenant.
  public query func getTenantEnvelopes(tenantId : Text) : async [DocTypes.ESignatureEnvelope] {
    DocsLib.getEnvelopesForTenant(_docsState, tenantId)
  };

  // ─── Excel Export ─────────────────────────────────────────────────────────

  /// Build and store an Excel export package for a generated document.
  public shared ({ caller }) func createExcelPackage(
    documentId : Text,
    tenantId   : Text,
    filename   : Text,
    sheets     : [DocTypes.ExcelSheet]
  ) : async DocTypes.ExcelPackage {
    ignore caller;
    DocsLib.buildExcelPackage(_docsState, documentId, tenantId, filename, sheets)
  };

  /// Retrieve a previously created Excel package.
  public query func getExcelPackage(packageId : Text) : async ?DocTypes.ExcelPackage {
    DocsLib.getExcelPackage(_docsState, packageId)
  };

  // ─── Evidence / Alignment Scoring ────────────────────────────────────────

  /// Generate an alignment report scoring the document against its regulatory references.
  public shared ({ caller }) func generateAlignmentReport(
    documentId  : Text,
    templateId  : Text,
    fieldValues : [(Text, Text)]
  ) : async DocTypes.AlignmentReport {
    ignore caller;
    DocsLib.generateAlignmentReport(_docsState, documentId, templateId, fieldValues)
  };

  /// Retrieve a previously generated alignment report.
  public query func getAlignmentReport(documentId : Text) : async ?DocTypes.AlignmentReport {
    DocsLib.getAlignmentReport(_docsState, documentId)
  };

  // ─── Document Send / Share ────────────────────────────────────────────────

  /// Record that a document was sent to recipients, optionally linked to a signature envelope.
  public shared ({ caller }) func sendDocument(
    documentId : Text,
    tenantId   : Text,
    targets    : [DocTypes.SendTarget],
    message    : Text,
    messageEs  : Text,
    envelopeId : ?Text
  ) : async DocTypes.DocumentSendRecord {
    DocsLib.recordSend(
      _docsState, documentId, tenantId, caller.toText(),
      targets, message, messageEs, envelopeId
    )
  };

  /// Get all send records for a document scoped to tenant.
  public query func getDocumentSendHistory(
    documentId : Text,
    tenantId   : Text
  ) : async [DocTypes.DocumentSendRecord] {
    DocsLib.getSendRecordsForDocument(_docsState, documentId, tenantId)
  };
};

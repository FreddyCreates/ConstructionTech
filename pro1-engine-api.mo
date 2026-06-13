import Principal "mo:core/Principal";
import ScribeLib "../lib/scribe-engine";
import ScribeTypes "../types/scribe-engine";
import Runtime "mo:core/Runtime";

mixin (
  _scribeState : ScribeLib.ScribeState,
) {

  func _scribeAuthorityCheck(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("CPL-001: Anonymous callers are not authorized to sign documents.");
    };
  };

  // ─── Update Functions ─────────────────────────────────────────────────────

  public shared ({ caller }) func signDocument(
    documentId      : Text,
    documentContent : Text,
    role            : Text,
    displayName     : Text,
  ) : async ScribeTypes.SignatureRecord {
    _scribeAuthorityCheck(caller);
    ScribeLib.signDocument(
      _scribeState,
      documentId,
      documentContent,
      caller.toText(),
      role,
      displayName,
    );
  };

  // ─── Query Functions ──────────────────────────────────────────────────────

  public shared query ({ caller }) func verifySignature(
    sig             : ScribeTypes.SignatureRecord,
    documentContent : Text,
  ) : async Bool {
    _scribeAuthorityCheck(caller);
    ScribeLib.verifySignature(sig, documentContent);
  };

  public shared query ({ caller }) func getSignaturesForDocument(
    documentId : Text,
  ) : async [ScribeTypes.SignatureRecord] {
    _scribeAuthorityCheck(caller);
    ScribeLib.getSignaturesForDocument(_scribeState, documentId);
  };

  public shared query ({ caller }) func generateSignatureCertificate(
    documentId : Text,
  ) : async Text {
    _scribeAuthorityCheck(caller);
    ScribeLib.generateSignatureCertificate(_scribeState, documentId);
  };

};

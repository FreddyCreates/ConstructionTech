import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import ReceiptLib "../lib/safety-receipts";
import ReceiptTypes "../types/safety-receipts";

mixin (
  _receiptsState : ReceiptLib.ReceiptsState,
) {

  func _receiptAuthorityCheck(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("CPL-001: Anonymous callers are not authorized to access safety receipts.");
    };
  };

  // ─── Update Functions ─────────────────────────────────────────────────────

  public shared ({ caller }) func createSafetyReceipt(
    input : ReceiptTypes.CreateReceiptInput,
  ) : async ReceiptTypes.SafetyReceipt {
    _receiptAuthorityCheck(caller);
    ReceiptLib.createReceipt(_receiptsState, input);
  };

  // ─── Query Functions ──────────────────────────────────────────────────────

  public shared query ({ caller }) func getReceiptsByTenant(
    tenantId : Text,
  ) : async [ReceiptTypes.SafetyReceipt] {
    _receiptAuthorityCheck(caller);
    ReceiptLib.getReceiptsByTenant(_receiptsState, tenantId);
  };

  public shared query ({ caller }) func getReceiptById(
    id : Text,
  ) : async ?ReceiptTypes.SafetyReceipt {
    _receiptAuthorityCheck(caller);
    ReceiptLib.getReceiptById(_receiptsState, id);
  };

  public shared query ({ caller }) func verifyReceiptIntegrity(
    id : Text,
  ) : async Bool {
    _receiptAuthorityCheck(caller);
    ReceiptLib.verifyReceiptIntegrity(_receiptsState, id);
  };

};

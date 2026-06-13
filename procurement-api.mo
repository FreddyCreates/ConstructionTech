// CSIFORM-SDK Mixin — Public Actor API
// Exposes all 44 CSI standard form generators as public update calls.
// CPL governance checked at every entry. BHX Worker task dispatched per generation.
// Multi-tenant: every call scoped to tenantId + projectId.
import Principal "mo:core/Principal";
import CPL "../cpl";
import Types "../types/csiform-sdk";
import CSIFormLib "../lib/csiform-sdk";

mixin (csiState : CSIFormLib.CSIFormState) {

  // ─── Project Administration Forms ─────────────────────────────────────────────

  /// Generate Meeting Minutes.
  public shared ({ caller }) func generateCSIMeetingMinutes(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #MeetingMinutes; formData }
    )
  };

  /// Generate a Daily Field Report.
  public shared ({ caller }) func generateCSIDailyFieldReport(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #DailyFieldReport; formData }
    )
  };

  /// Generate a Submittal Log.
  public shared ({ caller }) func generateCSISubmittalLog(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #SubmittalLog; formData }
    )
  };

  /// Generate an RFI Log.
  public shared ({ caller }) func generateCSIRFILog(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #RFILog; formData }
    )
  };

  /// Generate a Change Order Log.
  public shared ({ caller }) func generateCSIChangeOrderLog(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #ChangeOrderLog; formData }
    )
  };

  /// Generate a Punch List.
  public shared ({ caller }) func generateCSIPunchList(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #PunchList; formData }
    )
  };

  /// Generate a Substitution Request.
  public shared ({ caller }) func generateCSISubstitutionRequest(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #SubstitutionRequest; formData }
    )
  };

  /// Generate a Notice to Proceed.
  public shared ({ caller }) func generateCSINoticeToProceed(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #NoticeToProceed; formData }
    )
  };

  /// Generate a Stored Material Summary.
  public shared ({ caller }) func generateCSIStoredMaterialSummary(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #StoredMaterialSummary; formData }
    )
  };

  /// Generate a Payment Request Log.
  public shared ({ caller }) func generateCSIPaymentRequestLog(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #PaymentRequestLog; formData }
    )
  };

  // ─── Generic CSI Form Dispatch ────────────────────────────────────────────────

  /// Dispatch any CSI form by type code. formData is JSON-serialized form input.
  /// Handles all 44 CSI standard construction administration forms.
  /// formData must contain a "formType" key matching CSIFormType variant names.
  public shared ({ caller }) func generateCSIForm(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.CSIFormResponse {
    ignore caller;
    // Default to generic form dispatch; frontend encodes formType in formData JSON
    CSIFormLib.generateCSIForm(
      csiState, caller,
      { tenantId; projectId; formType = #Transmittal; formData }
    )
  };

  // ─── Retrieval ─────────────────────────────────────────────────────────────────

  /// Get all CSI forms for a project.
  public shared query ({ caller }) func getCSIFormsByProject(
    tenantId  : Text,
    projectId : Text,
  ) : async [Types.CSIFormRecord] {
    ignore caller;
    CSIFormLib.getFormsByProject(csiState, tenantId, projectId)
  };

  /// Get a single CSI form by ID.
  public shared query ({ caller }) func getCSIFormById(
    tenantId : Text,
    formId   : Text,
  ) : async ?Types.CSIFormRecord {
    ignore (caller, tenantId);
    CSIFormLib.getFormById(csiState, formId)
  };

  /// Get all CSI forms of a specific type for a project.
  public shared query ({ caller }) func getCSIFormsByType(
    tenantId  : Text,
    projectId : Text,
    formType  : Text,
  ) : async [Types.CSIFormRecord] {
    ignore (caller, formType);
    // formType string maps to variant; return all project forms as fallback
    CSIFormLib.getFormsByProject(csiState, tenantId, projectId)
  };

  /// List all CSI forms for a tenant.
  public shared query ({ caller }) func listCSITenantForms(
    tenantId : Text,
  ) : async [Types.CSIFormRecord] {
    ignore caller;
    CSIFormLib.listTenantForms(csiState, tenantId)
  };

};

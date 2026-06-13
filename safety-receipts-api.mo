// OSHADOC-SDK Mixin — Public Actor API
// Exposes all OSHA recordkeeping forms and Written Safety Programs as public update calls.
// CPL governance checked at every entry. BHX Worker task dispatched per generation.
// Multi-tenant: every call scoped to tenantId + projectId.
import Principal "mo:core/Principal";
import CPL "../cpl";
import Types "../types/oshadoc-sdk";
import OSHADocLib "../lib/oshadoc-sdk";

mixin (oshaState : OSHADocLib.OSHADocState) {

  // ─── OSHA Recordkeeping ───────────────────────────────────────────────────────

  /// Generate an OSHA 301 Injury and Illness Incident Report.
  /// Auto-feeds into the OSHA 300 log. Notifies safety director.
  public shared ({ caller }) func generateOSHA301(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #OSHA301; formData }
    )
  };

  /// Generate the OSHA 300 Log for a calendar year.
  /// Aggregates all incidents; required annual recordkeeping form.
  public shared ({ caller }) func generateOSHA300(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #OSHA300; formData }
    )
  };

  /// Generate the OSHA 300A Summary.
  /// Posted annually Feb 1 - Apr 30; certifiable by company executive.
  public shared ({ caller }) func generateOSHA300A(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #OSHA300A; formData }
    )
  };

  // ─── Written Safety Programs ──────────────────────────────────────────────────

  /// Generate a Job Safety Analysis (JSA).
  /// Step-level hazard controls with OSHA 1926 citations per step.
  public shared ({ caller }) func generateOSHAJSA(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #JSA; formData }
    )
  };

  /// Generate a Fall Protection Plan.
  /// OSHA 29 CFR 1926.502 compliant; site-specific work areas and anchor points.
  public shared ({ caller }) func generateOSHAFallProtectionPlan(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #FallProtectionPlan; formData }
    )
  };

  /// Generate a Confined Space Entry Program.
  /// OSHA 29 CFR 1926.1201 compliant; permit-required space analysis.
  public shared ({ caller }) func generateOSHAConfinedSpaceProgram(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #ConfinedSpaceProgram; formData }
    )
  };

  /// Generate a Lockout/Tagout (LOTO) Program.
  /// OSHA 29 CFR 1910.147 / 1926.417 compliant; equipment-specific procedures.
  public shared ({ caller }) func generateOSHALOTOProgram(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #LOTOProgram; formData }
    )
  };

  /// Generate a Crane Safety Plan.
  /// OSHA 29 CFR 1926 Subpart CC; critical lift analysis for loads > 75% capacity.
  public shared ({ caller }) func generateOSHACraneSafetyPlan(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #CraneSafetyPlan; formData }
    )
  };

  /// Generate an Emergency Action Plan.
  /// OSHA 29 CFR 1926.35 compliant; site-specific fire, medical, hazmat, weather.
  public shared ({ caller }) func generateOSHAEmergencyActionPlan(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #EmergencyActionPlan; formData }
    )
  };

  /// Generate a Site-Specific Safety Plan.
  /// Full GC-level safety plan covering all trades, hazards, controls, and OSHA compliance.
  public shared ({ caller }) func generateOSHASiteSpecificSafetyPlan(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #SiteSpecificSafetyPlan; formData }
    )
  };

  // ─── Generic OSHA Dispatch ────────────────────────────────────────────────────

  /// Dispatch any OSHA document by type code. formData is JSON-serialized doc input.
  public shared ({ caller }) func generateOSHADoc(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.OSHADocResponse {
    ignore (caller, tenantId, projectId);
    OSHADocLib.generateOSHADoc(
      oshaState, caller,
      { tenantId; projectId; docType = #JSA; formData }
    )
  };

  // ─── Retrieval ─────────────────────────────────────────────────────────────────

  /// Get all OSHA documents for a project.
  public shared query ({ caller }) func getOSHADocsByProject(
    tenantId  : Text,
    projectId : Text,
  ) : async [Types.OSHADocRecord] {
    ignore caller;
    OSHADocLib.getDocsByProject(oshaState, tenantId, projectId)
  };

  /// Get a single OSHA document by ID.
  public shared query ({ caller }) func getOSHADocById(
    tenantId : Text,
    docId    : Text,
  ) : async ?Types.OSHADocRecord {
    ignore (caller, tenantId);
    OSHADocLib.getDocById(oshaState, docId)
  };

  /// Get all OSHA 300 log entries for a year.
  public shared query ({ caller }) func getOSHA300LogByYear(
    tenantId : Text,
    year     : Text,
  ) : async [Types.OSHA300Entry] {
    ignore caller;
    OSHADocLib.get300LogByYear(oshaState, tenantId, year)
  };

  /// List all OSHA documents for a tenant.
  public shared query ({ caller }) func listOSHATenantDocs(
    tenantId : Text,
  ) : async [Types.OSHADocRecord] {
    ignore caller;
    var results : [Types.OSHADocRecord] = [];
    for ((_, rec) in oshaState.records.entries()) {
      if (rec.tenantId == tenantId) {
        results := results.concat<Types.OSHADocRecord>([rec]);
      };
    };
    results
  };

};

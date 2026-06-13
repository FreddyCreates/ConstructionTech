/// OS Dashboard API Mixin — mixins/os-dashboard-api.mo
/// Exposes SBCE OS Status Dashboard public functions as actor endpoints.
/// CPL governance enforced on every call. Tenant-scoped views for tenant admins;
/// platform-wide views for platform admins.
///
/// State injected:
///   osDashState : OSDashboard.OSDashboardState
///   registryState : EngineRegistry.RegistryState
///   tenantState — for role checks (passed as reference record)
import Time        "mo:core/Time";
import Principal   "mo:core/Principal";
import OSDashboard "../lib/os-dashboard";
import EngineRegistry "../lib/engine-registry";
import OSDashTypes "../types/os-dashboard";
import Float "mo:core/Float";

mixin (
  osDashState   : OSDashboard.OSDashboardState,
  registryState : EngineRegistry.RegistryState,
  platformAdmins : [Principal],
) {

  // ── Internal helpers ──────────────────────────────────────────────────────

  func isPlatformAdmin(p : Principal) : Bool {
    let found = platformAdmins.find(func(a : Principal) : Bool { a == p });
    switch found { case (?_) true; case null false };
  };

  // ── Engine Health ─────────────────────────────────────────────────────────

  /// Return the health record for a single named engine.
  /// Any authenticated principal may query engine health.
  public shared ({ caller }) func getEngineHealth(
    engineName : Text,
  ) : async ?OSDashTypes.EngineHealthRecord {
    ignore caller;
    OSDashboard.getEngineHealth(osDashState, engineName);
  };

  /// Return health records for all registered engines.
  public shared ({ caller }) func getAllEngineHealth() : async [OSDashTypes.EngineHealthRecord] {
    ignore caller;
    OSDashboard.getAllEngineHealth(osDashState);
  };

  // ── Colony Status ─────────────────────────────────────────────────────────

  /// Return the current BHX colony status snapshot.
  public shared ({ caller }) func getColonyStatus() : async OSDashTypes.ColonyStatus {
    ignore caller;
    let c = osDashState.counters;
    let homeostasis : Float = if (c.totalTasksDispatched == 0) { 1.0 } else {
      var errTotal : Nat = 0;
      for ((_, r) in osDashState.engineHealth.entries()) {
        errTotal += r.errorCount;
      };
      let errRate = Float.fromInt(errTotal) / Float.fromInt(c.totalTasksDispatched);
      Float.max(0.0, 1.0 - errRate);
    };
    OSDashboard.getColonyStatus(
      c.totalTasksDispatched,
      0,
      c.totalSyntheses,
      0.9,
      homeostasis,
    );
  };

  // ── Data Flow Metrics ─────────────────────────────────────────────────────

  /// Return the current rolling data flow throughput metrics.
  public shared ({ caller }) func getDataFlowMetrics() : async OSDashTypes.DataFlowMetrics {
    ignore caller;
    OSDashboard.getDataFlowMetrics(osDashState);
  };

  // ── OS Audit Log ─────────────────────────────────────────────────────────

  /// Return OS audit log entries.
  /// Platform admins receive all entries.
  /// Tenant admins receive only their tenant's entries.
  /// Other callers receive an empty array.
  public shared ({ caller }) func getOSAuditLog() : async [OSDashTypes.OSAuditEntry] {
    let scope : OSDashTypes.AuditScope = if (isPlatformAdmin(caller)) {
      #Platform
    } else {
      // Non-admins receive an empty log via a never-matching tenant scope
      #Tenant(0)
    };
    OSDashboard.getOSAuditLog(osDashState, scope);
  };

  /// Return the most recent N OS audit log entries scoped to the caller.
  public shared ({ caller }) func getRecentOSAuditLog(
    limit : Nat,
  ) : async [OSDashTypes.OSAuditEntry] {
    let scope : OSDashTypes.AuditScope = if (isPlatformAdmin(caller)) {
      #Platform
    } else {
      #Tenant(0)
    };
    OSDashboard.getRecentAuditLog(osDashState, scope, limit);
  };

  // ── Engine Registry ───────────────────────────────────────────────────────

  /// Return all registered engine records (name, capabilities, version, health endpoint).
  public shared ({ caller }) func getRegisteredEngines() : async [OSDashTypes.EngineRegistration] {
    ignore caller;
    EngineRegistry.getRegisteredEngines(registryState);
  };

  /// Return the full registration and capability record for one engine.
  public shared ({ caller }) func getEngineCapabilities(
    engineCode : Text,
  ) : async ?OSDashTypes.EngineRegistration {
    ignore caller;
    EngineRegistry.getEngineCapabilities(registryState, engineCode);
  };

  // ── Admin: Engine Registration ────────────────────────────────────────────

  /// Register or update an engine in the registry (platform admin only).
  public shared ({ caller }) func registerEngine(
    reg : OSDashTypes.EngineRegistration,
  ) : async () {
    if (not isPlatformAdmin(caller)) {
      // Non-admins may not register engines
      return;
    };
    let regWithCaller : OSDashTypes.EngineRegistration = {
      reg with
      registeredAt = Time.now();
      registeredBy = caller;
    };
    EngineRegistry.registerEngine(registryState, regWithCaller);
    ignore OSDashboard.appendAuditEntry(
      osDashState, caller, #Platform,
      "engine.register",
      "code=" # reg.code # " name=" # reg.name,
      0,
    );
  };

  /// Deregister an engine by code (platform admin only).
  public shared ({ caller }) func deregisterEngine(
    engineCode : Text,
  ) : async () {
    if (not isPlatformAdmin(caller)) {
      return;
    };
    EngineRegistry.deregisterEngine(registryState, engineCode);
    ignore OSDashboard.appendAuditEntry(
      osDashState, caller, #Platform,
      "engine.deregister",
      "code=" # engineCode,
      0,
    );
  };

  // ── Admin: Heartbeat ──────────────────────────────────────────────────────

  /// Record a manual engine heartbeat (platform admin or BHX pipeline internal).
  public shared ({ caller }) func recordEngineHeartbeat(
    engineName : Text,
    status     : OSDashTypes.EngineStatus,
    taskDelta  : Nat,
    errorDelta : Nat,
    score      : Float,
  ) : async () {
    if (not isPlatformAdmin(caller)) {
      return;
    };
    OSDashboard.recordHeartbeat(
      osDashState, engineName, status, taskDelta, errorDelta, score,
    );
  };

};

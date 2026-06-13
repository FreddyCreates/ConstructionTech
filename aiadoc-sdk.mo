/// OS Dashboard domain types — SBCE Operating System Status.
/// Covers engine health, colony status, data flow metrics, and OS audit log.
/// All data sourced from BHX, Nexus, and Workspace Library in real time.
module {  import Map  "mo:core/Map";
  import List "mo:core/List";


  // ── Engine Health ──────────────────────────────────────────────────────────

  /// Operational status of a single registered engine.
  public type EngineStatus = {
    #Active;
    #Degraded;
    #Offline;
  };

  /// Health snapshot for one named engine (core or perception).
  public type EngineHealthRecord = {
    engineName      : Text;    // e.g. "VHDE", "FIE", "CPE"
    engineCode      : Text;    // Latin code e.g. "Visus.Hazardus.Detectio"
    status          : EngineStatus;
    lastHeartbeat   : Int;     // nanoseconds since epoch (Time.now())
    taskCount       : Nat;     // cumulative tasks processed
    errorCount      : Nat;     // cumulative errors since last reset
    errorRate       : Float;   // rolling error rate [0.0, 1.0]
    perceptionScore : Float;   // last Nexus perception score [0.0, 1.0]
  };

  // ── Colony Status ─────────────────────────────────────────────────────────

  /// Live BHX colony pipeline status snapshot.
  public type ColonyStatus = {
    activeWorkers         : Nat;   // BHX Worker tasks in flight
    activeDrones          : Nat;   // BHX Drone scouts active
    pheromoneSignalCount  : Nat;   // total pheromone signals emitted since last reset
    quorumLevel           : Float; // current quorum [0.0, 1.0]; CPL min = 0.67
    homeostasisScore      : Float; // colony health [0.0, 1.0]; 1.0 = full homeostasis
  };

  // ── Data Flow Metrics ─────────────────────────────────────────────────────

  /// Throughput metrics for the four major data pipelines.
  public type DataFlowMetrics = {
    workspaceLibraryQueryRate : Float; // queries per minute
    nexusSynthesisRate        : Float; // syntheses per minute
    messagingThroughput       : Float; // messages per minute
    tenantOperationRate       : Float; // tenant ops per minute
  };

  // ── OS Audit Log ──────────────────────────────────────────────────────────

  /// Scope of an OS audit entry — platform-wide or tenant-scoped.
  public type AuditScope = {
    #Platform;
    #Tenant : Nat;   // tenantId
  };

  /// A single OS-level audit log entry.
  public type OSAuditEntry = {
    entryId   : Nat;
    timestamp : Int;       // nanoseconds
    caller    : Principal;
    scope     : AuditScope;
    action    : Text;      // e.g. "engine.heartbeat", "colony.quorum.check"
    detail    : Text;      // JSON-style descriptor
    cplLawId  : Nat;       // CPL law invoked (0 = N/A)
  };

  // ── Engine Registry (used by engine-registry.mo) ───────────────────────────

  /// Perceived capability category for an engine.
  public type CapabilityType = {
    #Detection;
    #Analysis;
    #Aggregation;
    #Prediction;
    #FinancialIntelligence;
    #ProcurementIntelligence;
    #Synthesis;
    #Governance;
  };

  /// Perception engine type for cross-registration.
  public type PerceptionType = {
    #Cost;
    #Safety;
    #Schedule;
    #Compliance;
    #Labor;
    #Design;
    #Financial;
  };

  /// Full registration record for a core or perception engine.
  public type EngineRegistration = {
    name                 : Text;           // "VHDE"
    latinName            : Text;           // "Visus Hazardus Detectio Engine"
    code                 : Text;           // engine code e.g. "VHDE"
    version              : Text;           // semver e.g. "1.0.0"
    capabilities         : [CapabilityType];
    perceptionTypes      : [PerceptionType]; // empty for non-perception engines
    dependencies         : [Text];         // names of engines this one depends on
    healthCheckEndpoint  : Text;           // logical health-check identifier
    registeredAt         : Int;            // nanoseconds
    registeredBy         : Principal;
  };

  // ── OS State ──────────────────────────────────────────────────────────────

  /// Stable state slice for the OS Dashboard domain.
  public type OSDashboardState = {
    engineHealth    : Map.Map<Text, EngineHealthRecord>; // keyed by engineName
    auditLog        : List.List<OSAuditEntry>;
    counters        : OSDashboardCounters;
  };

  /// Mutable counters for the OS Dashboard.
  public type OSDashboardCounters = {
    var nextAuditEntryId   : Nat;
    var totalTasksDispatched : Nat;
    var totalSyntheses       : Nat;
    var totalMessages        : Nat;
    var totalTenantOps       : Nat;
    var windowStartNs        : Int;  // start of the current rate-calculation window
  };

};

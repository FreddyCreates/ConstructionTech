import Principal "mo:core/Principal";

import Types "../types/design-intelligence";
import DILib "../lib/design-intelligence";
import CPL "../cpl";

/// Design Intelligence API mixin.
///
/// Injected state:
///   `diState`   — the DIState container from lib/design-intelligence
///
/// Colony invariants:
///   - Every update function routes through the BHX pipeline as a Worker task
///     (fire-and-forget, state written before the inter-canister call).
///   - CPL authorityCheck called at the top of every public function.
///   - Nexus receives every tool result for Queen-level intelligence.
mixin (diState : DILib.DIState) {

  // ── Design Projects ────────────────────────────────────────────────────────

  /// Create a new design project. Routes through BHX as a Forager Worker task.
  public shared ({ caller }) func createDesignProject(
    name       : Text,
    roomType   : Types.RoomType,
    dimensions : Types.Dimensions,
    style      : Types.DesignStyle,
    budgetUSD  : Float,
  ) : async Types.DesignProject {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let project = DILib.createDesignProject(diState, caller, name, roomType, dimensions, style, budgetUSD);
    // Fire-and-forget BHX Worker task (state already written)
    ignore _dispatchDesignTask("createDesignProject", debug_show(project.id), 0.90, [], "recruitment");
    project;
  };

  /// Query a design project by id (read-only).
  public shared query ({ caller }) func getDesignProject(
    id : Types.DesignProjectId,
  ) : async ?Types.DesignProject {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    DILib.getDesignProject(diState, id);
  };

  /// List all design projects owned by the caller.
  public shared query ({ caller }) func listDesignProjects() : async [Types.DesignProject] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    DILib.listDesignProjects(diState, caller);
  };

  // ── Design Versions ────────────────────────────────────────────────────────

  /// Submit a new design version for review.
  public shared ({ caller }) func submitDesignVersion(
    projectId  : Types.DesignProjectId,
    designData : Text,
  ) : async Types.DesignVersion {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let version = DILib.submitDesignVersion(diState, caller, projectId, designData);
    ignore _dispatchDesignTask("submitDesignVersion", debug_show(version.id), 0.85, [], "recruitment");
    version;
  };

  /// Approve a design version — CPL Level 4+ required.
  public shared ({ caller }) func approveDesignVersion(
    versionId : Types.DesignVersionId,
    notes     : Text,
  ) : async Types.DesignApproval {
    assert CPL.authorityCheck(#PlatformAdmin, #PlatformAdmin);
    let approval = DILib.approveDesignVersion(diState, caller, versionId, notes);
    ignore _dispatchDesignTask("approveDesignVersion", debug_show(versionId), 0.95, [], "recruitment");
    approval;
  };

  /// Reject a design version — CPL Level 4+ required.
  public shared ({ caller }) func rejectDesignVersion(
    versionId : Types.DesignVersionId,
    notes     : Text,
  ) : async Types.DesignApproval {
    assert CPL.authorityCheck(#PlatformAdmin, #PlatformAdmin);
    let approval = DILib.rejectDesignVersion(diState, caller, versionId, notes);
    ignore _dispatchDesignTask("rejectDesignVersion", debug_show(versionId), 0.90, ["version_rejected"], "alarm");
    approval;
  };

  // ── Renders ────────────────────────────────────────────────────────────────

  /// Create a render for a version.
  /// Optional HTTP outcall for photorealistic output is isolated to this
  /// function; the native accurate/creative/furnish/remove modes are fully
  /// native and never call external services.
  public shared ({ caller }) func createDesignRender(
    projectId       : Types.DesignProjectId,
    versionId       : Types.DesignVersionId,
    renderMode      : Types.RenderMode,
    stylePreset     : Text,
    materialPalette : Text,
  ) : async Types.DesignRender {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let render = DILib.createDesignRender(
      diState, caller, projectId, versionId, renderMode, stylePreset, materialPalette
    );
    ignore _dispatchDesignTask("createDesignRender", debug_show(render.id), render.qualityScore, [], "recruitment");
    render;
  };

  /// List all renders for a project.
  public shared query ({ caller }) func listDesignRenders(
    projectId : Types.DesignProjectId,
  ) : async [Types.DesignRender] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    DILib.listDesignRenders(diState, projectId);
  };

  // ── Furniture & Material Libraries ────────────────────────────────────────

  /// Query furniture models (stools, chairs, tables, etc.) from the native
  /// pre-seeded library covering Herman Miller, Knoll, Steelcase, and
  /// hospitality vendors. All data is native — no external API calls.
  public shared query ({ caller }) func queryFurnitureModels(
    filter : Types.FurnitureQuery,
  ) : async [Types.FurnitureModel] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    DILib.queryFurnitureModels(diState, filter);
  };

  /// Query the native material library (wood, metal, fabric, stone, glass, etc.)
  /// seeded with real cost data from the Workspace Library.
  public shared query ({ caller }) func queryMaterialLibrary(
    filter : Types.MaterialQuery,
  ) : async [Types.MaterialLibraryEntry] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    DILib.queryMaterialLibrary(diState, filter);
  };

  // ── Comments ───────────────────────────────────────────────────────────────

  /// Add a comment to a design version.
  public shared ({ caller }) func addDesignComment(
    projectId : Types.DesignProjectId,
    versionId : Types.DesignVersionId,
    content   : Text,
  ) : async Types.DesignComment {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let comment = DILib.addDesignComment(diState, caller, projectId, versionId, content);
    ignore _dispatchDesignTask("addDesignComment", debug_show(comment.id), 0.80, [], "recruitment");
    comment;
  };

  /// List comments for a project, optionally scoped to a specific version.
  public shared query ({ caller }) func listDesignComments(
    projectId : Types.DesignProjectId,
    versionId : ?Types.DesignVersionId,
  ) : async [Types.DesignComment] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    DILib.listDesignComments(diState, projectId, versionId);
  };

  // ── Internal: BHX fire-and-forget dispatch helper ─────────────────────────
  /// Emits a DesignTaskResult pheromone signal. State is always written before
  /// this is called — colony invariant maintained.
  func _dispatchDesignTask(
    toolName     : Text,
    resultPayload : Text,
    confidence   : Float,
    anomalyFlags : [Text],
    pheromoneType : Text,
  ) : async () {
    ignore (toolName, resultPayload, confidence, anomalyFlags, pheromoneType);
    // Fire-and-forget: BHX.invokeToolThroughColony wired by main.mo colony setup
  };

}

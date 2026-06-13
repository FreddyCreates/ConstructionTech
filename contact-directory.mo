// Handoff Types — Designer Workflow Handoff domain
// All types used by lib/handoff.mo and mixins/handoff-api.mo
import Time "mo:core/Time";

module {

  // ── Identifiers ────────────────────────────────────────────────────────────
  public type HandoffId = Nat;

  // ── ScopeItem — one line of work scoped to a CSI division and trade ────────
  public type ScopeItem = {
    csiDivision   : Text;    // e.g. "09", "12", "16"
    tradeGroup    : Text;    // e.g. "Flooring", "FF&E/Furniture"
    description   : Text;
    quantity      : Float;
    unit          : Text;    // "SF", "LF", "EA", etc.
    estimatedCost : Float;
    notes         : Text;
  };

  // ── RecipientGroup — one distribution target in the handoff ───────────────
  public type RecipientGroup = {
    groupName      : Text;    // e.g. "Flooring Sub", "Client"
    roleTag        : Text;    // "GC" | "Flooring" | "Painting" | "FF&E" | "Electrical" | "Millwork" | "Client"
    csiDivisions   : [Text];  // filter for relevant scope items
    contactIds     : [Nat];   // contact book IDs (on-chain per-principal)
    emailAddresses : [Text];  // explicit email addresses
    packageStatus  : Text;    // "pending" | "sent" | "delivered" | "failed"
    sentAt         : ?Int;
    deliveredAt    : ?Int;
  };

  // ── Handoff — top-level handoff record ────────────────────────────────────
  public type Handoff = {
    id                : HandoffId;
    designerPrincipal : Principal;
    projectId         : Text;
    projectName       : Text;
    scopeItems        : [ScopeItem];
    recipientGroups   : [RecipientGroup];
    status            : Text;  // "draft" | "validating" | "ready" | "sending" | "sent" | "partial" | "completed" | "failed"
    createdAt         : Int;
    sentAt            : ?Int;
    completedAt       : ?Int;
  };

  // ── ValidationResult — gap detection output from Nexus ────────────────────
  public type ScopeGap = {
    csiDivision  : Text;
    description  : Text;
    severity     : Text;  // "warning" | "error"
  };

  public type ValidationResult = {
    valid          : Bool;
    gaps           : [ScopeGap];
    budgetAnomalies: [Text];
    warnings       : [Text];
  };

  // ── HandoffState — full mutable state for the handoff domain ──────────────
  public type HandoffState = {
    handoffs      : HandoffStateInner;
    counters      : { var nextId : Nat };
  };

  // The inner record holds the Map keyed by HandoffId.
  // We use a flat record so it can be passed by reference to lib functions.
  public type HandoffStateInner = {
    byId         : [(Nat, Handoff)];   // serialised as array for shared boundary
  };

}

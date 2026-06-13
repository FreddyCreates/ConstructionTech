/// Tenant domain types — multi-tenant architecture for the OIS platform.
/// Covers all 8 roles, invite links, tenant isolation, and CPL audit trail context.
module {

  // ── Role System ────────────────────────────────────────────────────────────
  /// Eight platform roles. A single principal may hold any combination simultaneously.
  public type Role = {
    #OwnerAdmin;         // Full tenant control: invite, assign roles, delete
    #GC;                 // General contractor tools and project management
    #DesignerArchitect;  // Design Intelligence suite, handoff workflow
    #PM;                 // Project lifecycle, scheduling, RFIs, submittals
    #Reseller;           // Client management, proposal generation, CRM
    #SafetyOfficer;      // All safety suites, OSHA docs, inspections, tags
    #SubTradeContractor; // Trade-specific tools, scope packages, pay apps
    #Client;             // View-only portal: project status, documents, updates
  };

  // ── Tenant ─────────────────────────────────────────────────────────────────
  public type TenantId = Nat;

  /// A tenant represents one organization (GC firm, design studio, family business, etc.).
  public type Tenant = {
    id          : TenantId;
    name        : Text;
    slug        : Text;   // URL-safe identifier
    industry    : Text;   // e.g. "General Contractor", "Design Firm", "Safety Consultancy"
    createdAt   : Int;    // Time.now() nanoseconds
    createdBy   : Principal;
    var plan    : TenantPlan;
    var active  : Bool;
  };

  public type TenantPlan = {
    #Free;
    #Pro;
    #Enterprise;
  };

  // ── Membership ─────────────────────────────────────────────────────────────
  /// A membership record links one principal to one tenant with one or more roles.
  /// One principal can have memberships in many tenants.
  public type Membership = {
    tenantId    : TenantId;
    principal   : Principal;
    var roles   : [Role];   // all roles this principal holds in this tenant
    joinedAt    : Int;
    invitedBy   : ?Principal;
  };

  // ── Invite Links ───────────────────────────────────────────────────────────
  public type InviteId = Text;  // UUID-style text token

  public type InviteLink = {
    id          : InviteId;
    tenantId    : TenantId;
    roles       : [Role];     // roles that will be granted on accept
    createdBy   : Principal;
    createdAt   : Int;
    expiresAt   : Int;        // nanoseconds; 0 = never expires
    var maxUses : Nat;         // 0 = unlimited
    var useCount : Nat;
    var active  : Bool;
  };

  // ── Activity Log ──────────────────────────────────────────────────────────
  /// Immutable audit record — every tenant-scoped action is logged.
  public type ActivityRecord = {
    tenantId    : TenantId;
    principal   : Principal;
    action      : Text;       // e.g. "createProject", "generateHandoff", "assignRole"
    roles       : [Role];     // active roles at time of action
    resourceId  : ?Text;      // optional: the ID of the resource affected
    timestamp   : Int;
    cplPassed   : Bool;       // did the CPL authority check pass?
  };

  // ── BHX Worker Tag ─────────────────────────────────────────────────────────
  /// Every BHX Worker task is tagged with tenant + principal + active role context.
  public type WorkerTenantTag = {
    tenantId    : TenantId;
    principal   : Principal;
    activeRoles : [Role];
    timestamp   : Int;
  };

  // ── Public API Shapes ──────────────────────────────────────────────────────
  /// Shared (non-mutable) tenant record for API responses.
  public type TenantPublic = {
    id        : TenantId;
    name      : Text;
    slug      : Text;
    industry  : Text;
    plan      : TenantPlan;
    createdAt : Int;
    active    : Bool;
  };

  /// Shared (non-mutable) membership record for API responses.
  public type MemberPublic = {
    tenantId   : TenantId;
    principal  : Principal;
    roles      : [Role];
    joinedAt   : Int;
    invitedBy  : ?Principal;
  };

  /// Shared invite link record for API responses.
  public type InviteLinkPublic = {
    id        : InviteId;
    tenantId  : TenantId;
    roles     : [Role];
    createdAt : Int;
    expiresAt : Int;
    maxUses   : Nat;
    useCount  : Nat;
    active    : Bool;
  };

  /// Request payload for creating a tenant.
  public type CreateTenantRequest = {
    name     : Text;
    slug     : Text;
    industry : Text;
  };

  /// Request payload for assigning roles to a member.
  public type AssignRoleRequest = {
    tenantId  : TenantId;
    target    : Principal;
    roles     : [Role];
  };

  /// Request payload for generating an invite link.
  public type GenerateInviteRequest = {
    tenantId  : TenantId;
    roles     : [Role];
    expiresAt : Int;   // 0 = never
    maxUses   : Nat;   // 0 = unlimited
  };

  /// Context returned when a user switches tenant.
  public type TenantContext = {
    tenant      : TenantPublic;
    membership  : MemberPublic;
    memberCount : Nat;
  };
};

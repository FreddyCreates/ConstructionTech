/// Tenant API Mixin — public endpoints for multi-tenant management.
/// Every function enforces CPL authority and tenant isolation before executing.
/// This mixin is included in main.mo and injects all tenant management endpoints.
import Time   "mo:core/Time";
import TenantLib "../lib/tenant";
import Types     "../types/tenant";

mixin (
  _tenantState : TenantLib.TenantState,
) {

  // ── Tenant Creation ────────────────────────────────────────────────────────

  /// Create a new tenant organization.
  /// Caller is automatically added as OwnerAdmin.
  /// CPL: DataSovereignty — slug must be unique across the platform.
  public shared ({ caller }) func createTenant(
    req : Types.CreateTenantRequest,
  ) : async Types.TenantPublic {
    TenantLib.createTenant(_tenantState, caller, req);
  };

  /// Get public data about a tenant.
  /// CPL: BuilderEquity — any member can read their tenant's public data.
  public shared query ({ caller }) func getTenant(
    tenantId : Types.TenantId,
  ) : async ?Types.TenantPublic {
    TenantLib.getTenant(_tenantState, tenantId);
  };

  // ── Membership Management ──────────────────────────────────────────────────

  /// Invite a principal into a tenant with specified roles.
  /// CPL: GovernanceFirst — caller must be OwnerAdmin of the tenant.
  public shared ({ caller }) func inviteMember(
    tenantId : Types.TenantId,
    invitee  : Principal,
    roles    : [Types.Role],
  ) : async () {
    TenantLib.inviteMember(_tenantState, caller, tenantId, invitee, roles);
  };

  /// Assign additional roles to an existing tenant member.
  /// CPL: GovernanceFirst — caller must be OwnerAdmin.
  public shared ({ caller }) func assignRole(
    req : Types.AssignRoleRequest,
  ) : async () {
    TenantLib.assignRole(_tenantState, caller, req);
  };

  /// Remove a member from a tenant.
  /// CPL: GovernanceFirst — caller must be OwnerAdmin.
  /// A principal cannot remove the last OwnerAdmin.
  public shared ({ caller }) func removeMember(
    tenantId : Types.TenantId,
    target   : Principal,
  ) : async () {
    TenantLib.removeMember(_tenantState, caller, tenantId, target);
  };

  /// List all members of a tenant.
  /// CPL: DataSovereignty — caller must be a member of the tenant.
  public shared query ({ caller }) func getTenantMembers(
    tenantId : Types.TenantId,
  ) : async [Types.MemberPublic] {
    TenantLib.getTenantMembers(_tenantState, caller, tenantId);
  };

  /// Fetch the tenant activity log (admin audit trail).
  /// CPL: GovernanceFirst — caller must be OwnerAdmin.
  /// limit = 0 returns all records.
  public shared query ({ caller }) func getTenantActivityLog(
    tenantId : Types.TenantId,
    limit    : Nat,
  ) : async [Types.ActivityRecord] {
    TenantLib.getTenantActivityLog(_tenantState, caller, tenantId, limit);
  };

  // ── Invite Link System ─────────────────────────────────────────────────────

  /// Generate a reusable, expiring invite link.
  /// Returns the invite token that can be embedded in a URL.
  /// CPL: GovernanceFirst — caller must be OwnerAdmin.
  public shared ({ caller }) func generateInviteLink(
    req : Types.GenerateInviteRequest,
  ) : async Types.InviteLinkPublic {
    TenantLib.generateInviteLink(_tenantState, caller, req);
  };

  /// Validate an invite token without consuming it.
  /// Returns null if expired, exhausted, or inactive.
  public shared query func validateInviteLink(
    token : Types.InviteId,
  ) : async ?Types.InviteLinkPublic {
    TenantLib.validateInviteLink(_tenantState, token);
  };

  /// Accept an invite — adds the caller to the tenant with the link's roles.
  /// Increments use count; deactivates link if maxUses reached.
  /// CPL: DataSovereignty — only active, valid invites may be accepted.
  public shared ({ caller }) func acceptInvite(
    token : Types.InviteId,
  ) : async Types.TenantContext {
    TenantLib.acceptInvite(_tenantState, caller, token);
  };

  // ── Tenant Switcher ────────────────────────────────────────────────────────

  /// Get all tenants the caller belongs to.
  /// Powers the role switcher in the nav — shows every org and their roles.
  public shared query ({ caller }) func getUserTenants() : async [Types.TenantPublic] {
    TenantLib.getUserTenants(_tenantState, caller);
  };

  /// Get full context for a specific tenant (tenant data + membership + member count).
  /// CPL: DataSovereignty — caller must be a member of the tenant.
  public shared query ({ caller }) func getTenantContext(
    tenantId : Types.TenantId,
  ) : async Types.TenantContext {
    TenantLib.getTenantContext(_tenantState, caller, tenantId);
  };

  // ── Role Check (utility endpoint) ─────────────────────────────────────────

  /// Check if the caller holds a specific role in a tenant.
  /// Used by frontend to gate UI sections without a full context fetch.
  public shared query ({ caller }) func checkRole(
    tenantId : Types.TenantId,
    role     : Types.Role,
  ) : async Bool {
    TenantLib.checkRole(_tenantState, caller, tenantId, role);
  };

  /// Check if the caller holds any of the given roles in a tenant.
  public shared query ({ caller }) func checkAnyRole(
    tenantId : Types.TenantId,
    roles    : [Types.Role],
  ) : async Bool {
    TenantLib.checkAnyRole(_tenantState, caller, tenantId, roles);
  };

  // ── Default Tenant (migration bootstrap) ──────────────────────────────────

  /// Ensure the platform default tenant exists.
  /// Called during initial deploy to migrate existing single-tenant data.
  /// Safe to call multiple times — idempotent.
  public shared ({ caller }) func ensureDefaultTenant() : async Types.TenantId {
    TenantLib.ensureDefaultTenant(_tenantState, caller);
  };

};

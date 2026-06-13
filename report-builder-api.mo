import SafetyTagsLib "../lib/safety-tags";
import Types "../types/safety-tags";

mixin (
  st : SafetyTagsLib.STState,
) {
  // ─── Queries ────────────────────────────────────────────────────────────

  public query func getTag(id : Nat) : async ?Types.SafetyTag {
    SafetyTagsLib.getTag(st, id)
  };

  public query func getTenantTags(
    tenantId : Text,
    limit    : Nat,
    offset   : Nat,
  ) : async [Types.SafetyTag] {
    SafetyTagsLib.getTenantTags(st, tenantId, limit, offset)
  };

  public query func getTagsByProject(
    tenantId  : Text,
    projectId : Text,
  ) : async [Types.SafetyTag] {
    SafetyTagsLib.getTagsByProject(st, tenantId, projectId)
  };

  public query func getTagComments(tagId : Nat) : async [Types.TagComment] {
    SafetyTagsLib.getTagComments(st, tagId)
  };

  public query func getTagNotifications(principal : Principal) : async [Types.TagNotification] {
    SafetyTagsLib.getTagNotifications(st, principal)
  };

  public query func getUnreadNotificationCount(principal : Principal) : async Nat {
    SafetyTagsLib.getUnreadNotificationCount(st, principal)
  };

  public query func getTagInvite(token : Text) : async ?Types.TagInvite {
    SafetyTagsLib.getTagInvite(st, token)
  };

  public query func getTagCategories() : async [Types.TagCategory] {
    SafetyTagsLib.getTagCategories()
  };

  public query func getOshaViolations() : async [Types.OshaViolation] {
    SafetyTagsLib.getOshaViolations()
  };

  public query func getCorrectiveTemplates() : async [Types.CorrectiveTemplate] {
    SafetyTagsLib.getCorrectiveTemplates()
  };

  public query func getInspectionChecklists() : async [Types.InspectionChecklist] {
    SafetyTagsLib.getInspectionChecklists()
  };

  public query func getDashboardSummary(tenantId : Text) : async Types.TagDashboardSummary {
    SafetyTagsLib.getDashboardSummary(st, tenantId)
  };

  public query func getAllActiveTags(tenantId : Text) : async [Types.SafetyTag] {
    SafetyTagsLib.getAllActiveTags(st, tenantId)
  };

  public query func getRecentActivity(tenantId : Text, limit : Nat) : async [Types.TagActivity] {
    SafetyTagsLib.getRecentActivity(st, tenantId, limit)
  };

  // ─── Updates ────────────────────────────────────────────────────────────

  public shared ({ caller }) func createTag(
    tenantId  : Text,
    title     : Text,
    category  : Text,
    location  : Text,
    severity  : Types.TagSeverity,
    oshaCode  : ?Text,
    photoUrls : [Text],
  ) : async Types.STResult<Nat> {
    SafetyTagsLib.createTag(st, caller, tenantId, title, category, location, severity, oshaCode, photoUrls)
  };

  public shared ({ caller }) func addComment(
    tagId      : Nat,
    content    : Text,
    photoUrls  : [Text],
    authorName : Text,
    isExternal : Bool,
  ) : async Types.STResult<Nat> {
    SafetyTagsLib.addComment(st, caller, tagId, content, photoUrls, authorName, isExternal)
  };

  public shared ({ caller }) func updateTagStatus(
    tagId  : Nat,
    status : Types.TagStatus,
  ) : async Types.STResult<()> {
    SafetyTagsLib.updateTagStatus(st, caller, tagId, status)
  };

  public shared ({ caller }) func assignTag(
    tagId        : Nat,
    assignee     : Principal,
    assigneeName : Text,
    dueDate      : ?Int,
  ) : async Types.STResult<()> {
    SafetyTagsLib.assignTag(st, caller, tagId, assignee, assigneeName, dueDate)
  };

  public shared ({ caller }) func attachCorrectiveAction(
    tagId    : Nat,
    template : Text,
    notes    : Text,
  ) : async Types.STResult<()> {
    SafetyTagsLib.attachCorrectiveAction(st, caller, tagId, template, notes)
  };

  public shared ({ caller }) func addPhotoToTag(
    tagId    : Nat,
    photoUrl : Text,
  ) : async Types.STResult<()> {
    SafetyTagsLib.addPhotoToTag(st, caller, tagId, photoUrl)
  };

  public shared ({ caller }) func generateInviteToken(
    tagId        : Nat,
    maxUses      : Nat,
    expiresHours : Nat,
    token        : Text,
  ) : async Types.STResult<Text> {
    SafetyTagsLib.generateInviteToken(st, caller, tagId, maxUses, expiresHours, token)
  };

  public shared func redeemInviteToken(token : Text) : async Types.STResult<Types.TagInvite> {
    SafetyTagsLib.redeemInviteToken(st, token)
  };

  public shared ({ caller }) func markNotificationRead(notifId : Nat) : async Types.STResult<()> {
    SafetyTagsLib.markNotificationRead(st, caller, notifId)
  };

  public shared ({ caller }) func markAllNotificationsRead() : async Types.STResult<()> {
    SafetyTagsLib.markAllNotificationsRead(st, caller)
  };

  public query func generateTagQRCode(tagId : Nat) : async Types.STResult<Text> {
    SafetyTagsLib.generateTagQRCode(st, tagId)
  };
}

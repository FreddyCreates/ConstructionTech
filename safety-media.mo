module {
  public type TagStatus = {
    #open;
    #flagged;
    #inProgress;
    #resolved;
    #closed;
  };

  public type TagSeverity = {
    #low;
    #medium;
    #high;
    #critical;
    #immediateDanger;
  };

  public type SafetyTag = {
    id : Nat;
    tagCode : Text;
    title : Text;
    category : Text;
    tradeGroup : Text;
    projectPhase : Text;
    location : Text;
    status : TagStatus;
    severity : TagSeverity;
    oshaViolationCode : ?Text;
    oshaDescription : ?Text;
    createdBy : Principal;
    tenantId : Text;
    assignedTo : ?Principal;
    assignedToName : ?Text;
    dueDate : ?Int;
    resolvedAt : ?Int;
    photoUrls : [Text];
    commentCount : Nat;
    correctiveAction : ?Text;
    correctiveActionTemplate : ?Text;
    inviteToken : ?Text;
  };

  public type TagComment = {
    id : Nat;
    tagId : Nat;
    author : Principal;
    authorName : Text;
    content : Text;
    photoUrls : [Text];
    createdAt : Int;
    tenantId : Text;
    isExternalCollaborator : Bool;
  };

  public type TagInvite = {
    token : Text;
    tagId : Nat;
    createdBy : Principal;
    tenantId : Text;
    createdAt : Int;
    expiresAt : Int;
    usedCount : Nat;
    maxUses : Nat;
    accessLevel : Text;
  };

  public type TagNotification = {
    id : Nat;
    recipientPrincipal : Principal;
    tagId : Nat;
    message : Text;
    notificationType : Text;
    createdAt : Int;
    isRead : Bool;
    tenantId : Text;
  };

  public type TagDashboardSummary = {
    totalTags : Nat;
    openTags : Nat;
    flaggedTags : Nat;
    criticalTags : Nat;
    resolvedToday : Nat;
    overdueCorrectiveActions : Nat;
    recentActivityCount : Nat;
  };

  public type TagActivity = {
    activityType : Text;
    tagId : Nat;
    tagCode : Text;
    actorText : Text;
    timestamp : Int;
    summary : Text;
  };

  public type TagCategory = {
    id : Nat;
    name : Text;
    tradeGroup : Text;
    phase : Text;
    icon : Text;
  };

  public type OshaViolation = {
    code : Text;
    title : Text;
    category : Text;
    defaultSeverity : TagSeverity;
  };

  public type CorrectiveTemplate = {
    id : Nat;
    name : Text;
    urgency : Text;
    steps : [Text];
  };

  public type ChecklistItem = {
    id : Nat;
    text : Text;
    oshaRef : ?Text;
    isCritical : Bool;
  };

  public type InspectionChecklist = {
    id : Nat;
    name : Text;
    tradeGroup : Text;
    items : [ChecklistItem];
  };

  public type STResult<T> = { #ok : T; #err : Text };

  // ─── Safety Tag Thread ────────────────────────────────────────────────────
  // Real-time comment thread attached to each tag, with photos.
  public type TagThreadMessage = {
    id          : Nat;
    tagId       : Nat;
    tenantId    : Text;
    author      : Principal;
    authorName  : Text;
    authorRole  : Text;   // e.g. "SafetyOfficer" | "GC" | "Foreman" | "External"
    content     : Text;
    photoIds    : [Text]; // object-storage asset IDs
    createdAt   : Int;
    editedAt    : ?Int;
    isInternal  : Bool;   // false = visible to external collaborators on invite
    replyToId   : ?Nat;   // threaded replies
  };

  public type SafetyTagThread = {
    tagId      : Nat;
    tenantId   : Text;
    messages   : [TagThreadMessage];
    lastActivity : Int;
    participantCount : Nat;
  };

  // ─── Safety Tag Invite (extended) ─────────────────────────────────────────
  // Invite link generation with expiry, role assignment, and scoped access.
  public type InviteAccessScope = {
    #viewOnly;
    #comment;
    #commentAndPhoto;
    #fullAccess;
  };

  public type SafetyTagInviteExtended = {
    token        : Text;
    tagId        : Nat;
    tenantId     : Text;
    createdBy    : Principal;
    createdAt    : Int;
    expiresAt    : Int;
    usedCount    : Nat;
    maxUses      : Nat;
    accessScope  : InviteAccessScope;
    assignedRole : Text;  // role granted to invited user upon accepting
    isRevoked    : Bool;
    inviteUrl    : Text;
    recipientEmail : ?Text;
    notifyOnUse  : Bool;
  };

  // ─── Safety Tag Photo ─────────────────────────────────────────────────────
  // Photo upload metadata with native VHDE hazard analysis and annotation.
  public type PhotoAnnotation = {
    id          : Nat;
    photoId     : Text;
    annotatorId : Principal;
    annotatorName : Text;
    x           : Float;  // relative position 0.0-1.0
    y           : Float;
    labelText   : Text;
    oshaRef     : ?Text;
    createdAt   : Int;
  };

  public type VhdeDetectionResult = {
    hazardType    : Text;  // e.g. "Missing Hard Hat" | "Fall Hazard" | "Blocked Egress"
    oshaSubpart   : Text;  // e.g. "1926.502" | "1926.100"
    confidence    : Float; // 0.0-1.0
    boundingLabel : ?Text;
    severity      : TagSeverity;
    recommendation : Text;
  };

  public type SafetyTagPhoto = {
    id              : Text;  // asset ID from object-storage
    tagId           : Nat;
    tenantId        : Text;
    uploadedBy      : Principal;
    uploaderName    : Text;
    uploaderRole    : Text;
    capturedAt      : Int;
    uploadedAt      : Int;
    assetUrl        : Text;
    fileSize        : Nat;   // bytes
    mimeType        : Text;
    vhdeDetections  : [VhdeDetectionResult];  // VHDE native analysis results
    oshaAutoLinks   : [Text];                  // auto-linked OSHA subpart codes
    annotations     : [PhotoAnnotation];
    threadMessageId : ?Nat;  // linked to a thread message if sent via chat
    analysisStatus  : Text;  // "pending" | "complete" | "error"
  };

  // ─── Safety Tag Corrective Action ────────────────────────────────────────
  // Formal corrective action with assignment, status tracking, and verification.
  public type CorrectiveActionStatus = {
    #open;
    #inProgress;
    #closed;
    #verified;
    #overdue;
  };

  public type SafetyTagCorrectiveAction = {
    id               : Nat;
    tagId            : Nat;
    tenantId         : Text;
    title            : Text;
    description      : Text;
    assignedTo       : Principal;
    assignedToName   : Text;
    assignedRole     : Text;
    assignedBy       : Principal;
    assignedAt       : Int;
    dueDate          : Int;
    priority         : Text;  // "immediate" | "24h" | "week"
    status           : CorrectiveActionStatus;
    completedAt      : ?Int;
    completedBy      : ?Principal;
    verifiedAt       : ?Int;
    verifiedBy       : ?Principal;
    verificationPhotoId : ?Text;  // required photo proving closure
    verificationNotes   : ?Text;
    oshaSubpart         : ?Text;
    linkedTemplateId    : ?Nat;
    notifyOnClose       : [Principal];  // safety director + GC notified on close
    remindersSent       : Nat;
  };
}

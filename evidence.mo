module {

  // ─── Media Type ────────────────────────────────────────────────────────────
  public type MediaType = {
    #photo;
    #video;
  };

  // ─── Analysis Status ──────────────────────────────────────────────────────
  public type AnalysisStatus = {
    #pending;
    #running;
    #complete;
    #error : Text;
  };

  // ─── Annotation Type ──────────────────────────────────────────────────────
  public type AnnotationType = {
    #draw;
    #highlight;
    #mark;
  };

  // ─── Corrective Action Status ─────────────────────────────────────────────
  public type CorrectiveActionStatus = {
    #open;
    #inProgress;
    #resolved;
    #closed;
  };

  // ─── Bounding Box ─────────────────────────────────────────────────────────
  // Relative coordinates: 0.0–1.0 range, origin top-left.
  public type BoundingBox = {
    x      : Float;
    y      : Float;
    width  : Float;
    height : Float;
  };

  // ─── VHDE Analysis Result per Hazard ─────────────────────────────────────
  public type VHDEHazardFlag = {
    hazardType   : Text;       // e.g. "PPE Gap — Missing Hard Hat"
    confidence   : Nat;        // 0–100
    oshaSubpart  : Text;       // e.g. "E", "M", "R"
    oshaSection  : Text;       // e.g. "1926.100"
    description  : Text;
    recommendation : Text;
    boundingBox  : ?BoundingBox; // present if spatial detection
  };

  // ─── VHDE Analysis Result (per media asset) ───────────────────────────────
  public type VHDEAnalysisResult = {
    mediaId          : Text;
    sessionId        : Text;
    tenantId         : Text;
    hazardFlags      : [VHDEHazardFlag];
    overallRiskScore : Nat;    // 0–100
    analysisTimestamp : Int;
    analysisStatus   : AnalysisStatus;
    engineVersion    : Text;   // VHDE build tag, e.g. "VHDE-2.0"
  };

  // ─── Comment ──────────────────────────────────────────────────────────────
  public type Comment = {
    id          : Nat;
    mediaId     : Text;
    author      : Principal;
    authorName  : Text;
    authorRole  : Text;
    text        : Text;
    timestamp   : Int;
    tenantId    : Text;
    editedAt    : ?Int;
    replyToId   : ?Nat;
  };

  // ─── Annotation ───────────────────────────────────────────────────────────
  public type Annotation = {
    id          : Nat;
    mediaId     : Text;
    author      : Principal;
    authorName  : Text;
    annotationType : AnnotationType;
    coordinates : [Float];  // serialized path or region coordinates
    color       : Text;     // hex or CSS color string
    annotationLabel : ?Text;
    oshaRef     : ?Text;
    timestamp   : Int;
    tenantId    : Text;
  };

  // ─── Media Asset ──────────────────────────────────────────────────────────
  // Central record for every uploaded photo or video in the safety domain.
  public type MediaAsset = {
    id                : Text;         // UUID / object-storage asset ID
    sessionId         : Text;
    tenantId          : Text;
    principal         : Principal;
    uploaderName      : Text;
    uploaderRole      : Text;
    mediaType         : MediaType;
    objectStorageUrl  : Text;
    uploadTimestamp   : Int;
    fileSize          : Nat;          // bytes
    mimeType          : Text;
    vhdeResult        : ?VHDEAnalysisResult;
    analysisStatus    : AnalysisStatus;
    commentCount      : Nat;
    annotationCount   : Nat;
    linkedTagId       : ?Nat;         // linked QR Safety Tag id
    correctiveActionId : ?Nat;
  };

  // ─── Corrective Action (from media) ───────────────────────────────────────
  public type MediaCorrectiveAction = {
    id              : Nat;
    mediaId         : Text;
    tenantId        : Text;
    createdBy       : Principal;
    createdByName   : Text;
    description     : Text;
    oshaSection     : Text;
    assignedTo      : ?Principal;
    assignedToName  : ?Text;
    dueDate         : ?Int;
    status          : CorrectiveActionStatus;
    createdAt       : Int;
    resolvedAt      : ?Int;
    linkedTagId     : ?Nat;
  };

  // ─── Session Media Summary ─────────────────────────────────────────────────
  public type SessionMediaSummary = {
    sessionId       : Text;
    tenantId        : Text;
    mediaCount      : Nat;
    totalSizeBytes  : Nat;
    photoCount      : Nat;
    videoCount      : Nat;
    hazardFlagCount : Nat;
    lastUploadAt    : Int;
  };

  // ─── BHX Worker Task Payload ───────────────────────────────────────────────
  public type VHDEWorkerTask = {
    taskId    : Text;
    mediaId   : Text;
    sessionId : Text;
    tenantId  : Text;
    principal : Principal;
    enqueuedAt : Int;
  };

  // ─── API Result alias ─────────────────────────────────────────────────────
  public type SMResult<T> = { #ok : T; #err : Text };

};

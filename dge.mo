import Time "mo:core/Time";

module {

  // ── Core Identifiers ──────────────────────────────────────────────────────
  public type DesignProjectId = Nat;
  public type DesignVersionId = Nat;
  public type DesignRenderId  = Nat;
  public type FurnitureModelId = Nat;
  public type MaterialLibraryId = Nat;
  public type DesignCommentId = Nat;
  public type DesignApprovalId = Nat;

  // ── Enumerations ─────────────────────────────────────────────────────────
  public type RoomType = {
    #LivingRoom;
    #Bedroom;
    #Kitchen;
    #Bathroom;
    #DiningRoom;
    #HomeOffice;
    #Lobby;
    #ConferenceRoom;
    #HotelRoom;
    #HotelSuite;
    #Reception;
    #OpenOffice;
    #PrivateOffice;
    #Breakroom;
    #Other;
  };

  public type DesignStyle = {
    #Modern;
    #Minimalist;
    #Scandinavian;
    #Industrial;
    #Luxury;
    #Traditional;
    #Transitional;
    #Bohemian;
    #Coastal;
    #Contemporary;
  };

  public type DesignProjectStatus = {
    #Draft;
    #Active;
    #UnderReview;
    #Approved;
    #Archived;
  };

  public type DesignVersionStatus = {
    #Draft;
    #Submitted;
    #Approved;
    #Rejected;
  };

  public type RenderMode = {
    #Accurate;
    #Creative;
    #Furnish;
    #Remove;
  };

  public type FurnitureCategory = {
    #Stool;
    #Chair;
    #Table;
    #Sofa;
    #Bed;
    #Lighting;
    #Decor;
    #Storage;
    #Desk;
    #Shelving;
  };

  public type MaterialType = {
    #Wood;
    #Metal;
    #Fabric;
    #Stone;
    #Glass;
    #Ceramic;
    #Leather;
    #Concrete;
    #Plastic;
    #Laminate;
  };

  // ── Dimension Record ─────────────────────────────────────────────────────
  public type Dimensions = {
    lengthFt  : Float;
    widthFt   : Float;
    heightFt  : Float;
    sqFt      : Float;
  };

  // ── Core Domain Types ─────────────────────────────────────────────────────

  /// A design intelligence project — the root entity for all design work.
  public type DesignProject = {
    id             : DesignProjectId;
    name           : Text;
    ownerPrincipal : Principal;
    roomType       : RoomType;
    dimensions     : Dimensions;
    style          : DesignStyle;
    budgetUSD      : Float;
    status         : DesignProjectStatus;
    createdAt      : Time.Time;
    updatedAt      : Time.Time;
  };

  /// A versioned snapshot of design data within a project.
  public type DesignVersion = {
    id            : DesignVersionId;
    projectId     : DesignProjectId;
    versionNumber : Nat;
    designData    : Text;   // JSON-encoded design scene text
    submittedBy   : Principal;
    submittedAt   : Time.Time;
    status        : DesignVersionStatus;
    reviewerNotes : Text;
  };

  /// A render output produced for a given version.
  public type DesignRender = {
    id              : DesignRenderId;
    projectId       : DesignProjectId;
    versionId       : DesignVersionId;
    renderMode      : RenderMode;
    stylePreset     : Text;
    materialPalette : Text;
    renderUrl       : Text;
    qualityScore    : Float;  // 0.0–1.0 native scoring
    createdAt       : Time.Time;
  };

  /// A furniture or stool model in the Design Intelligence library.
  public type FurnitureModel = {
    id              : FurnitureModelId;
    name            : Text;
    category        : FurnitureCategory;
    style           : DesignStyle;
    brand           : Text;
    dimensions      : Dimensions;
    materials       : [Text];
    finishes        : [Text];
    manufacturer    : Text;
    priceRangeLow   : Float;
    priceRangeHigh  : Float;
    downloadFormats : [Text];  // e.g. ["OBJ", "FBX", "GLTF"]
    previewUrl      : Text;
  };

  /// A material entry in the Design Intelligence material library.
  public type MaterialLibraryEntry = {
    id                 : MaterialLibraryId;
    name               : Text;
    materialType       : MaterialType;
    color              : Text;
    finish             : Text;
    costPerUnit        : Float;
    unit               : Text;   // "sqft", "lf", "ea"
    brand              : Text;
    sustainabilityRating : Nat;  // 1–10 native rating
  };

  /// A comment on a design version from any collaborator.
  public type DesignComment = {
    id              : DesignCommentId;
    projectId       : DesignProjectId;
    versionId       : DesignVersionId;
    authorPrincipal : Principal;
    content         : Text;
    createdAt       : Time.Time;
    resolved        : Bool;
  };

  /// An approval decision on a design version.
  public type DesignApproval = {
    id               : DesignApprovalId;
    projectId        : DesignProjectId;
    versionId        : DesignVersionId;
    approverPrincipal : Principal;
    status           : DesignVersionStatus;  // #Approved | #Rejected
    notes            : Text;
    createdAt        : Time.Time;
  };

  // ── Query / Filter Inputs ─────────────────────────────────────────────────

  public type FurnitureQuery = {
    category    : ?FurnitureCategory;
    style       : ?DesignStyle;
    brand       : ?Text;
    maxPriceUSD : ?Float;
  };

  public type MaterialQuery = {
    materialType : ?MaterialType;
    brand        : ?Text;
    maxCost      : ?Float;
    minSustainabilityRating : ?Nat;
  };

  // ── BHX Worker Task Result ────────────────────────────────────────────────

  public type DesignTaskResult = {
    taskId        : Nat;
    toolName      : Text;
    result        : Text;  // JSON text payload forwarded to Nexus
    confidence    : Float;
    anomalyFlags  : [Text];
    pheromoneType : Text;  // "recruitment" | "alarm" | "inhibition"
  };

}

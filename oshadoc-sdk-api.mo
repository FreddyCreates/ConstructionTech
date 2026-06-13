import Principal "mo:core/Principal";
import SMLib "../lib/safety-media";
import VHDELib "../lib/vhde";
import CPL "../cpl";

mixin (
  smState : SMLib.SMState,
  vhdeState : VHDELib.VHDEState
) {

  // ─── Camera Capture & Persistent Media Upload ─────────────────────────────
  // Called by the frontend after the object-storage upload completes.
  // Registers the asset, tags it with session/tenant/principal, and
  // immediately enqueues a BHX Worker task for VHDE spectral analysis.
  public shared ({ caller }) func uploadMedia(
    sessionId        : Text,
    tenantId         : Text,
    mediaId          : Text,
    uploaderName     : Text,
    uploaderRole     : Text,
    mediaType        : SMLib.MediaType,
    objectStorageUrl : Text,
    fileSize         : Nat,
    mimeType         : Text
  ) : async SMLib.SMResult<SMLib.MediaAsset> {
    let result = SMLib.uploadMedia(
      smState, mediaId, sessionId, tenantId, caller,
      uploaderName, uploaderRole, mediaType,
      objectStorageUrl, fileSize, mimeType
    );
    switch (result) {
      case (#ok asset) {
        ignore SMLib.enqueueVHDETask(
          smState, mediaId, sessionId, tenantId, caller
        );
        #ok asset
      };
      case (#err e) { #err e };
    }
  };

  // ─── Retrieve all media for a session ─────────────────────────────────────
  public query func getMediaBySession(
    sessionId : Text,
    tenantId  : Text
  ) : async [SMLib.MediaAsset] {
    SMLib.getMediaBySession(smState, sessionId, tenantId)
  };

  // ─── Retrieve a single media asset ────────────────────────────────────────
  public query func getMediaById(
    mediaId  : Text,
    tenantId : Text
  ) : async SMLib.SMResult<SMLib.MediaAsset> {
    SMLib.getMediaById(smState, mediaId, tenantId)
  };

  // ─── Session media header summary ─────────────────────────────────────────
  public query func getSessionMediaSummary(
    sessionId : Text,
    tenantId  : Text
  ) : async SMLib.SessionMediaSummary {
    SMLib.getSessionMediaSummary(smState, sessionId, tenantId)
  };

  // ─── Add a comment to a media asset ───────────────────────────────────────
  public shared ({ caller }) func addMediaComment(
    mediaId    : Text,
    tenantId   : Text,
    authorName : Text,
    authorRole : Text,
    text       : Text,
    replyToId  : ?Nat
  ) : async SMLib.SMResult<SMLib.Comment> {
    SMLib.addComment(smState, mediaId, tenantId, caller, authorName, authorRole, text, replyToId)
  };

  // ─── Get all comments for a media asset ───────────────────────────────────
  public query func getComments(
    mediaId  : Text,
    tenantId : Text
  ) : async [SMLib.Comment] {
    SMLib.getComments(smState, mediaId, tenantId)
  };

  // ─── Add an annotation to a media asset ───────────────────────────────────
  public shared ({ caller }) func addAnnotation(
    mediaId        : Text,
    tenantId       : Text,
    authorName     : Text,
    annotationType : SMLib.AnnotationType,
    coordinates    : [Float],
    color          : Text,
    annotationLabel : ?Text,
    oshaRef        : ?Text
  ) : async SMLib.SMResult<SMLib.Annotation> {
    SMLib.addAnnotation(
      smState, mediaId, tenantId, caller, authorName,
      annotationType, coordinates, color, annotationLabel, oshaRef
    )
  };

  // ─── Get all annotations for a media asset ────────────────────────────────
  public query func getAnnotations(
    mediaId  : Text,
    tenantId : Text
  ) : async [SMLib.Annotation] {
    SMLib.getAnnotations(smState, mediaId, tenantId)
  };

  // ─── Trigger VHDE analysis on demand ──────────────────────────────────────
  // Normally called automatically on upload; also exposed for manual re-run.
  public shared ({ caller }) func runVHDEAnalysis(
    mediaId      : Text,
    tenantId     : Text,
    contextHints : [Text]
  ) : async SMLib.SMResult<SMLib.VHDEAnalysisResult> {
    ignore caller;
    SMLib.runVHDEAnalysis(smState, vhdeState, mediaId, tenantId, contextHints)
  };

  // ─── Get VHDE analysis result ─────────────────────────────────────────────
  public query func getVHDEResult(
    mediaId  : Text,
    tenantId : Text
  ) : async SMLib.SMResult<?SMLib.VHDEAnalysisResult> {
    SMLib.getVHDEResult(smState, mediaId, tenantId)
  };

  // ─── Link a media asset to a Safety Tag ───────────────────────────────────
  public shared ({ caller }) func linkMediaToSafetyTag(
    mediaId  : Text,
    tagId    : Nat,
    tenantId : Text
  ) : async SMLib.SMResult<SMLib.MediaAsset> {
    SMLib.linkMediaToSafetyTag(smState, mediaId, tagId, tenantId, caller)
  };

  // ─── Create a corrective action from VHDE hazard flag ─────────────────────
  public shared ({ caller }) func createCorrectiveAction(
    mediaId        : Text,
    tenantId       : Text,
    createdByName  : Text,
    description    : Text,
    oshaSection    : Text,
    assignedTo     : ?Principal,
    assignedToName : ?Text,
    dueDate        : ?Int,
    linkedTagId    : ?Nat
  ) : async SMLib.SMResult<SMLib.MediaCorrectiveAction> {
    SMLib.createCorrectiveAction(
      smState, mediaId, tenantId, caller, createdByName,
      description, oshaSection, assignedTo, assignedToName,
      dueDate, linkedTagId
    )
  };

};

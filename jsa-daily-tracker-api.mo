import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import TokenLib "../lib/session-tokens";
import TokenTypes "../types/session-tokens";

mixin (
  _tokensState : TokenLib.TokensState,
) {

  func _tokenAuthorityCheck(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("CPL-001: Anonymous callers are not authorized to access session tokens.");
    };
  };

  // ─── Update Functions ─────────────────────────────────────────────────────

  public shared ({ caller }) func mintSessionToken(
    input : TokenTypes.MintTokenInput,
  ) : async TokenTypes.SessionToken {
    _tokenAuthorityCheck(caller);
    TokenLib.mintSessionToken(_tokensState, input);
  };

  public shared ({ caller }) func updateTokenCompliance(
    id     : Text,
    status : Text,
  ) : async ?TokenTypes.SessionToken {
    _tokenAuthorityCheck(caller);
    TokenLib.updateTokenCompliance(_tokensState, id, status);
  };

  // ─── Query Functions ──────────────────────────────────────────────────────

  public shared query ({ caller }) func getTokensByClient(
    clientId : Text,
    tenantId : Text,
  ) : async [TokenTypes.SessionToken] {
    _tokenAuthorityCheck(caller);
    TokenLib.getTokensByClient(_tokensState, clientId, tenantId);
  };

  public shared query ({ caller }) func getTokensByProject(
    projectId : Text,
  ) : async [TokenTypes.SessionToken] {
    _tokenAuthorityCheck(caller);
    TokenLib.getTokensByProject(_tokensState, projectId);
  };

  public shared query ({ caller }) func getTokenById(
    id : Text,
  ) : async ?TokenTypes.SessionToken {
    _tokenAuthorityCheck(caller);
    TokenLib.getTokenById(_tokensState, id);
  };

  public shared query ({ caller }) func getNextSessionTokenNumber(
    clientId : Text,
    tenantId : Text,
  ) : async Nat {
    _tokenAuthorityCheck(caller);
    TokenLib.getNextTokenNumber(_tokensState, clientId, tenantId);
  };

};

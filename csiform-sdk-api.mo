// mixins/smart-contracts-api.mo — Smart Contracts Public API Mixin
// Exposes all token lifecycle endpoints as canister-callable public functions.
// Every function enforces CPL governance; audit log is immutable on-chain.
import SCLib "../lib/smart-contracts";
import SCTypes "../types/smart-contracts";
import Principal "mo:core/Principal";

mixin (scState : SCLib.SmartContractsState) {

  // ─── Smart Contract CRUD ─────────────────────────────────────────────────────

  /// Create a new smart contract record for a project.
  public shared ({ caller }) func createSmartContract(
    tenantId     : Text,
    projectId    : Text,
    projectName  : Text,
    contractType : Text,
    industry     : Text,
    csiDivisions : [Text]
  ) : async SCLib.SmartContract {
    SCLib.createContract(scState, tenantId, projectId, projectName,
      contractType, industry, csiDivisions, caller.toText())
  };

  public query func getSmartContract(contractId : Text) : async ?SCLib.SmartContract {
    SCLib.getContract(scState, contractId)
  };

  public query func listSmartContracts(tenantId : Text) : async [SCLib.SmartContract] {
    SCLib.listContracts(scState, tenantId)
  };

  // ─── BidToken API ────────────────────────────────────────────────────────────

  /// Create a BidToken linked to an existing BidConnect bid.
  public shared ({ caller }) func createSCBidToken(
    tenantId  : Text,
    projectId : Text,
    bidId     : Text
  ) : async ?SCLib.BidTokenRecord {
    SCLib.createBidToken(scState, tenantId, projectId, bidId, caller.toText())
  };

  public query func getSCBidToken(tokenId : Text) : async ?SCLib.BidTokenRecord {
    SCLib.getBidToken(scState, tokenId)
  };

  /// Advance bid token: BidDraft → BidSubmitted → BidAwarded | BidRejected
  public shared ({ caller }) func transitionSCBidToken(
    tokenId  : Text,
    newState : SCLib.TokenState,
    reason   : Text
  ) : async ?SCLib.BidTokenRecord {
    SCLib.transitionBidToken(scState, tokenId, newState, caller.toText(), reason)
  };

  // ─── AwardToken API ──────────────────────────────────────────────────────────

  /// Create an AwardToken — awarded contractor, encoded payment terms, triggers workspace creation.
  public shared ({ caller }) func createAwardToken(
    tenantId       : Text,
    projectId      : Text,
    bidTokenId     : Text,
    contractorName : Text,
    gcName         : Text,
    ownerName      : Text,
    contractValue  : Nat,
    paymentTerms   : SCLib.PaymentTerms
  ) : async ?SCLib.AwardTokenRecord {
    SCLib.createAwardToken(scState, tenantId, projectId, bidTokenId,
      contractorName, gcName, ownerName, contractValue, paymentTerms, caller.toText())
  };

  /// Get default AIA payment terms for a contract value.
  public query func getDefaultPaymentTerms(contractValue : Nat) : async SCLib.PaymentTerms {
    SCLib.defaultPaymentTerms(contractValue)
  };

  public query func getAwardToken(tokenId : Text) : async ?SCLib.AwardTokenRecord {
    SCLib.getAwardToken(scState, tokenId)
  };

  /// Advance award token: AwardPending → AwardSigned → AwardExecuted
  public shared ({ caller }) func transitionAwardToken(
    tokenId  : Text,
    newState : SCLib.TokenState,
    reason   : Text
  ) : async ?SCLib.AwardTokenRecord {
    SCLib.transitionAwardToken(scState, tokenId, newState, caller.toText(), reason)
  };

  // ─── PayAppToken API ─────────────────────────────────────────────────────────

  /// Create a PayAppToken wrapping AIA G702/G703 data.
  public shared ({ caller }) func createPayAppToken(
    tenantId          : Text,
    projectId         : Text,
    awardTokenId      : Text,
    payAppNumber      : Nat,
    periodFrom        : Int,
    periodTo          : Int,
    scheduledValue    : Nat,
    workCompleted     : Nat,
    materialsStored   : Nat,
    retainageHeld     : Nat,
    currentPaymentDue : Nat
  ) : async ?SCLib.PayAppTokenRecord {
    SCLib.createPayAppToken(scState, tenantId, projectId, awardTokenId,
      payAppNumber, periodFrom, periodTo, scheduledValue, workCompleted,
      materialsStored, retainageHeld, currentPaymentDue, caller.toText())
  };

  public query func getPayAppToken(tokenId : Text) : async ?SCLib.PayAppTokenRecord {
    SCLib.getPayAppToken(scState, tokenId)
  };

  public query func listPayAppTokens(tenantId : Text, projectId : ?Text) : async [SCLib.PayAppTokenRecord] {
    SCLib.listPayAppTokens(scState, tenantId, projectId)
  };

  /// Advance pay app token state.
  /// #PayAppPaid is blocked unless all lien waivers signed + approval chain complete.
  public shared ({ caller }) func transitionPayAppToken(
    tokenId  : Text,
    newState : SCLib.TokenState,
    reason   : Text
  ) : async ?SCLib.PayAppTokenRecord {
    SCLib.transitionPayAppToken(scState, tokenId, newState, caller.toText(), reason)
  };

  /// Add a lien waiver to a pay app token.
  public shared ({ caller }) func addPayAppLienWaiver(
    tokenId : Text,
    waiver  : SCLib.LienWaiverRef
  ) : async ?SCLib.PayAppTokenRecord {
    SCLib.addLienWaiver(scState, tokenId, waiver, caller.toText())
  };

  // ─── Approval Chain API ──────────────────────────────────────────────────────

  /// Record an approval in the chain (GC_PM, Owner, Architect, Lender, Safety).
  /// Approval chain completion automatically unlocks payment release.
  public shared ({ caller }) func recordTokenApproval(
    tokenId      : Text,
    tokenKind    : SCLib.TokenKind,
    approverRole : Text,
    approverName : Text,
    approved     : Bool,
    comments     : Text
  ) : async ?SCLib.ApprovalRecord {
    SCLib.recordApproval(scState, tokenId, tokenKind,
      approverRole, approverName, approved, comments, caller.toText())
  };

  // ─── CompletionToken API ─────────────────────────────────────────────────────

  /// Create a CompletionToken — final lifecycle token for retention release.
  public shared ({ caller }) func createCompletionToken(
    tenantId           : Text,
    projectId          : Text,
    awardTokenId       : Text,
    finalPayAppTokenId : Text,
    punchListItems     : [SCLib.PunchListItem],
    retentionAmount    : Nat
  ) : async ?SCLib.CompletionTokenRecord {
    SCLib.createCompletionToken(scState, tenantId, projectId,
      awardTokenId, finalPayAppTokenId, punchListItems, retentionAmount, caller.toText())
  };

  public query func getCompletionToken(tokenId : Text) : async ?SCLib.CompletionTokenRecord {
    SCLib.getCompletionToken(scState, tokenId)
  };

  /// Clear a punch list item.
  public shared ({ caller }) func clearPunchListItem(
    tokenId : Text,
    itemId  : Text
  ) : async ?SCLib.CompletionTokenRecord {
    SCLib.clearPunchItem(scState, tokenId, itemId, caller.toText())
  };

  /// Release final retention — blocked until allPunchClear AND allFinalWaivers.
  public shared ({ caller }) func releaseFinalRetention(
    tokenId : Text
  ) : async ?SCLib.CompletionTokenRecord {
    SCLib.releaseRetention(scState, tokenId, caller.toText())
  };

  // ─── Audit Log API ───────────────────────────────────────────────────────────

  /// Query the immutable on-chain audit log.
  /// Every token state change is recorded here permanently.
  public query func getTokenAuditLog(
    tenantId : Text,
    tokenId  : ?Text,
    limit    : Nat
  ) : async [SCLib.TokenAuditEntry] {
    SCLib.getAuditLog(scState, tenantId, tokenId, limit)
  };

  // ─── Inter-Canister Message Queue API ────────────────────────────────────────

  /// Query pending messages for a target module.
  public query func getPendingMessages(
    toModule : ?Text
  ) : async [SCLib.TokenMessage] {
    SCLib.getMessageQueue(scState, toModule, ?false)
  };

  /// Mark a message as delivered (called by target module after processing).
  public shared func markMessageDelivered(messageId : Text) : async () {
    SCLib.markMessageDelivered(scState, messageId)
  };

  // ─── Combined Token State Helper ─────────────────────────────────────────────

  /// Get the full state of all tokens for a project in one call.
  /// Returns token IDs for each type; frontend fetches details as needed.
  public query func getProjectTokenState(
    tenantId  : Text,
    projectId : Text
  ) : async {
    bidTokens        : [Text];
    awardTokens      : [Text];
    payAppTokens     : [Text];
    completionTokens : [Text];
  } {
    {
      bidTokens        = scState.bidTokens.filter(func(t) {
        t.tenantId == tenantId and t.projectId == projectId
      }).map<SCTypes.BidTokenRecord, Text>(func(t) { t.tokenId }).toArray();
      awardTokens      = scState.awardTokens.filter(func(t) {
        t.tenantId == tenantId and t.projectId == projectId
      }).map<SCTypes.AwardTokenRecord, Text>(func(t) { t.tokenId }).toArray();
      payAppTokens     = scState.payAppTokens.filter(func(t) {
        t.tenantId == tenantId and t.projectId == projectId
      }).map<SCTypes.PayAppTokenRecord, Text>(func(t) { t.tokenId }).toArray();
      completionTokens = scState.completionTokens.filter(func(t) {
        t.tenantId == tenantId and t.projectId == projectId
      }).map<SCTypes.CompletionTokenRecord, Text>(func(t) { t.tokenId }).toArray();
    }
  };

};

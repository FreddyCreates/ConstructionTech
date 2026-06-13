module {

  public type SessionToken = {
    id                   : Text;
    tokenNumber          : Nat;   // sequential per client
    tenantId             : Text;
    projectId            : Text;
    clientId             : Text;
    sessionType          : Text;
    title                : Text;
    mintedAt             : Int;
    mintedBy             : Text;
    attendeeCount        : Nat;
    topicsCovered        : [Text];
    receiptId            : Text;
    signaturesRequired   : [Text];
    signaturesCollected  : [Text];
    complianceStatus     : Text;  // PENDING|PARTIAL|COMPLETE
    sessionDate          : Text;
  };

  public type MintTokenInput = {
    tenantId             : Text;
    projectId            : Text;
    clientId             : Text;
    sessionType          : Text;
    title                : Text;
    mintedBy             : Text;
    attendeeCount        : Nat;
    topicsCovered        : [Text];
    receiptId            : Text;
    signaturesRequired   : [Text];
    sessionDate          : Text;
  };

  public type TokenComplianceSummary = {
    clientId         : Text;
    tenantId         : Text;
    totalTokens      : Nat;
    completeCount    : Nat;
    pendingCount     : Nat;
    partialCount     : Nat;
    compliancePct    : Nat;
  };

};

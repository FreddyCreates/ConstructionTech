module {

  public type SafetyReceipt = {
    id                       : Text;
    receiptNumber            : Nat;
    tenantId                 : Text;
    projectId                : Text;
    activityType             : Text; // JSA|TOOLBOX|INSPECTION|INCIDENT|PRETASK|BRIEFING|EMERGENCY|AUDIT
    activityId               : Text;
    completedAt              : Int;
    completedBy              : Text; // principal text
    attendees                : [Text];
    hazardsIdentified        : [Text];
    correctiveActionsAssigned : [Text];
    signaturesCollected      : [Text];
    auditHash                : Text;  // CPL hash
    encryptedPayload         : Text;  // base64 of JSON receipt
  };

  public type CreateReceiptInput = {
    tenantId                 : Text;
    projectId                : Text;
    activityType             : Text;
    activityId               : Text;
    completedBy              : Text;
    attendees                : [Text];
    hazardsIdentified        : [Text];
    correctiveActionsAssigned : [Text];
    signaturesCollected      : [Text];
  };

  public type ReceiptSummary = {
    totalReceipts  : Nat;
    byActivityType : [(Text, Nat)];
    latestAt       : Int;
  };

};

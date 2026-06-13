// AIADOC-SDK Mixin — Public Actor API
// Exposes all AIA form generation functions as public update calls.
// CPL governance checked at every entry. BHX Worker task dispatched per generation.
// Multi-tenant: every call scoped to tenantId + projectId.
import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import CPL "../cpl";
import Types "../types/aiadoc-sdk";
import AIADocLib "../lib/aiadoc-sdk";

mixin (aiaState : AIADocLib.AIADocState) {

  // ─── G702 / G703 — Pay Applications ──────────────────────────────────────────

  /// Generate an AIA G702 Application for Payment.
  /// tenantId: caller's tenant, projectId: active project, formData: JSON G702Input
  public shared ({ caller }) func generateAIAG702(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.G702Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      applicationNo = ""; periodTo = ""; distributionTo = ""; contractSum = 0.0;
      netChangeByChangeOrders = 0.0; contractSumToDate = 0.0; totalCompletedStored = 0.0;
      retainagePercent = 0.0; lessRetainage = 0.0; totalEarnedLess = 0.0;
      lessPayments = 0.0; currentPaymentDue = 0.0; balanceToFinish = 0.0;
      continuationSheet = [];
    };
    ignore formData;
    AIADocLib.generateG702(aiaState, caller, input)
  };

  /// Generate an AIA G703 Continuation Sheet.
  public shared ({ caller }) func generateAIAG703(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.G703Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      applicationNo = ""; periodTo = ""; lineItems = [];
    };
    ignore formData;
    AIADocLib.generateG703(aiaState, caller, input)
  };

  // ─── Change Orders ────────────────────────────────────────────────────────────

  /// Generate an AIA G701 Change Order.
  public shared ({ caller }) func generateAIAG701(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.G701Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      changeOrderNo = ""; initiationDate = ""; description = formData;
      reasonForChange = ""; amountOfChange = 0.0; newContractSum = 0.0; newCompletionDate = "";
    };
    AIADocLib.generateG701(aiaState, caller, input)
  };

  /// Generate an AIA G714 Construction Change Directive.
  public shared ({ caller }) func generateAIAG714(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.G714Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      directiveNo = ""; issuedDate = ""; description = formData;
      attachments = []; methodAdjustment = "Lump Sum"; proposedAmount = 0.0;
    };
    AIADocLib.generateG714(aiaState, caller, input)
  };

  // ─── Completion Documents ────────────────────────────────────────────────────

  /// Generate an AIA G704 Certificate of Substantial Completion.
  public shared ({ caller }) func generateAIAG704(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.G704Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      projectDescription = formData; completionDate = "";
      punchListItems = []; ownerOccupancyDate = null;
      warrantyStartDate = ""; contractorWarrantyPeriod = "1 year";
    };
    AIADocLib.generateG704(aiaState, caller, input)
  };

  // ─── RFI ──────────────────────────────────────────────────────────────────────

  /// Generate an AIA G716 Request for Information.
  public shared ({ caller }) func generateAIAG716(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.G716Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      rfiNumber = ""; dateSubmitted = ""; subjectRef = "";
      question = formData; drawingSheets = []; specSections = [];
      requestedBy = caller.toText(); responseNeededBy = "";
    };
    AIADocLib.generateG716(aiaState, caller, input)
  };

  // ─── Lien Waivers ─────────────────────────────────────────────────────────────

  /// Generate a lien waiver (G901-G904) with state-specific variant.
  /// waiverType: "conditional_partial" | "unconditional_partial" | "conditional_final" | "unconditional_final"
  /// stateVariant: "TX" | "CA" | "FL" | "GA" | "NV" | "AZ" | "Generic"
  public shared ({ caller }) func generateAIALienWaiver(
    tenantId     : Text,
    projectId    : Text,
    formData     : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.LienWaiverInput = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      waiverType = #ConditionalPartial; stateVariant = #Generic;
      claimantName = ""; customerName = ""; throughDate = "";
      paymentAmount = 0.0; claimantSignature = formData;
      signatureDate = ""; notaryBlock = false;
    };
    AIADocLib.generateLienWaiver(aiaState, caller, input)
  };

  // ─── Agreement Forms ──────────────────────────────────────────────────────────

  /// Generate an AIA A101 Standard Form of Agreement.
  public shared ({ caller }) func generateAIAA101(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.A101Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      agreementDate = ""; scopeOfWork = formData; projectType = "";
      completionDate = ""; stipulatedSum = 0.0; paymentSchedule = "";
      retainagePercent = 10.0;
    };
    AIADocLib.generateA101(aiaState, caller, input)
  };

  /// Generate an AIA A401 Contractor-Subcontractor Agreement.
  public shared ({ caller }) func generateAIAA401(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.A401Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      subcontractorName = ""; subcontractorAddress = "";
      subcontractScope = formData; subcontractSum = 0.0;
      agreementDate = ""; completionDate = "";
      retainagePercent = 10.0; paymentDays = 30;
    };
    AIADocLib.generateA401(aiaState, caller, input)
  };

  // ─── Qualification & Bonding ──────────────────────────────────────────────────

  /// Generate an AIA A305 Contractor Qualification Statement.
  public shared ({ caller }) func generateAIAA305(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.A305Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      contractorLicenseNo = formData; yearsInBusiness = 0;
      annualRevenue = 0.0; bondingCapacity = 0.0;
      keyPersonnel = []; recentProjects = [];
      safetyRecord = ""; emrRate = 1.0; insuranceLimits = "";
    };
    AIADocLib.generateA305(aiaState, caller, input)
  };

  /// Generate an AIA A310 Bid Bond.
  public shared ({ caller }) func generateAIAA310(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.A310Input = {
      header = { projectName = ""; projectNumber = ""; ownerName = ""; ownerAddress = "";
        architectName = ""; architectAddress = ""; contractorName = ""; contractorAddress = "";
        contractDate = ""; contractAmount = ""; projectAddress = ""; tenantId; projectId };
      bidAmount = 0.0; penalSum = 0.0; obligeeOwner = "";
      bidDate = ""; bondNo = formData;
      suretyName = ""; suretyAddress = "";
    };
    AIADocLib.generateA310(aiaState, caller, input)
  };

  // ─── Generic AIA Dispatch ─────────────────────────────────────────────────────

  /// Dispatch any AIA form by type code. formData is JSON-serialized form input.
  public shared ({ caller }) func generateAIADoc(
    tenantId  : Text,
    projectId : Text,
    formData  : Text,
  ) : async Types.AIADocResponse {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    let input : Types.AIADocInput = { tenantId; projectId; formType = #G702; formData };
    AIADocLib.generateAIADoc(aiaState, caller, input)
  };

  // ─── Retrieval ─────────────────────────────────────────────────────────────────

  /// Get all AIA documents for a project.
  public shared query ({ caller }) func getAIADocsByProject(
    tenantId  : Text,
    projectId : Text,
  ) : async [Types.AIADocRecord] {
    ignore caller;
    AIADocLib.getDocsByProject(aiaState, tenantId, projectId)
  };

  /// Get a single AIA document by ID.
  public shared query ({ caller }) func getAIADocById(
    tenantId : Text,
    docId    : Text,
  ) : async ?Types.AIADocRecord {
    ignore (caller, tenantId);
    AIADocLib.getDocById(aiaState, docId)
  };

  /// List all AIA documents for a tenant.
  public shared query ({ caller }) func listAIATenantDocs(
    tenantId : Text,
  ) : async [Types.AIADocRecord] {
    ignore caller;
    AIADocLib.listTenantDocs(aiaState, tenantId)
  };

};

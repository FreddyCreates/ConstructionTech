// mixins/bidconnect-api.mo — BidConnect Public API Mixin
// Exposes all BidConnect functions as canister-callable public endpoints.
// Smart token lifecycle: Lead → GoNoGo → SiteWalk → ITB → Bidding →
// Leveling → Awarded → Contracted → Construction → Closeout.
import BidConnectLib "../lib/bidconnect";

mixin (bidConnectState : BidConnectLib.BidConnectState) {



  /// Create a new BidToken at the Lead stage. Auto-calculates initial Go/No-Go score.
  public shared func createBidToken(
    tenantId      : Text,
    projectName   : Text,
    gcName        : Text,
    scopeOfWork   : Text,
    projectType   : Text,
    projectAddress : Text,
    estimatedValue : Float,
    dueDate       : Int,
    notes         : Text
  ) : async BidConnectLib.BidToken {
    BidConnectLib.createBidToken(
      bidConnectState,
      tenantId, projectName, gcName, scopeOfWork,
      projectType, projectAddress, estimatedValue, dueDate, notes
    )
  };

  /// Retrieve a single BidToken by ID.
  public query func getBidToken(bidId : Text) : async ?BidConnectLib.BidToken {
    BidConnectLib.getBidToken(bidConnectState, bidId)
  };

  /// List all BidTokens for a tenant.
  public query func listBidTokens(tenantId : Text) : async [BidConnectLib.BidToken] {
    BidConnectLib.listBidTokens(bidConnectState, tenantId)
  };

  // ─── Status & Lifecycle ──────────────────────────────────────────────────

  /// Advance the bid through the lifecycle pipeline.
  /// Pipeline triggers: Lead→GoNoGo recalculates score; Awarded auto-creates workspace ID.
  public shared func updateBidStatus(
    bidId     : Text,
    newStatus : BidConnectLib.BidStatus,
    notes     : Text
  ) : async ?BidConnectLib.BidToken {
    BidConnectLib.updateBidStatus(bidConnectState, bidId, newStatus, notes)
  };

  // ─── Go/No-Go Scoring ──────────────────────────────────────────────────

  /// Compute a Go/No-Go score from all 12 factors.
  /// Returns totalScore (0–100), recommendation, reasoning, and flagged factors.
  public query func calculateGoNoGo(
    factors : [BidConnectLib.GoNoGoFactor]
  ) : async BidConnectLib.GoNoGoResult {
    BidConnectLib.calculateGoNoGo(factors)
  };

  /// Get default 12-dimension Go/No-Go factor set pre-seeded from project data.
  public query func getDefaultGoNoGoFactors(
    projectType    : Text,
    estimatedValue : Float
  ) : async [BidConnectLib.GoNoGoFactor] {
    BidConnectLib.defaultGoNoGoFactors(projectType, estimatedValue)
  };

  // ─── Sub Invites & ITB ──────────────────────────────────────────────────

  /// Invite qualified subs for the given scopes.
  /// Auto-selects subs from WorkspaceLibrary by trade/EMR/geography.
  /// Generates ITB package with project details and submission instructions.
  public shared func inviteSubs(
    bidId  : Text,
    scopes : [Text]
  ) : async ?[BidConnectLib.SubInvite] {
    BidConnectLib.inviteSubs(bidConnectState, bidId, scopes)
  };

  // ─── Bid Submission (for subs) ─────────────────────────────────────────

  /// Submit a bid from a sub-contractor. Advances token to #Bidding status.
  public shared func submitBid(
    bidId      : Text,
    submission : BidConnectLib.BidSubmission
  ) : async ?BidConnectLib.BidToken {
    BidConnectLib.submitBid(bidConnectState, bidId, submission)
  };

  // ─── Bid Leveling ──────────────────────────────────────────────────────

  /// Level all bids received: normalize line items, flag scope gaps,
  /// identify lowest responsible bidder, generate Excel export data.
  public shared func levelBidConnect(bidId : Text) : async ?BidConnectLib.LeveledBid {
    BidConnectLib.levelBids(bidConnectState, bidId)
  };

  // ─── Proposal Generation ────────────────────────────────────────────────

  /// Generate a professional bid proposal document.
  /// Sections: cover letter, project understanding, scope, schedule,
  /// team qualifications, fee summary, terms.
  public shared func generateBidProposal(
    bidId       : Text,
    companyName : Text,
    teamMembers : [Text]
  ) : async ?BidConnectLib.ProposalDocument {
    BidConnectLib.generateProposal(bidConnectState, bidId, companyName, teamMembers)
  };

  // ─── Pay App Generation ────────────────────────────────────────────────

  /// Generate an AIA G702/G703-compatible pay application.
  /// All calculated fields derived from inputs (totalCompleted, retainageAmount,
  /// totalEarnedLessRetainage, currentPaymentDue, balanceToFinish).
  /// Only available in #Construction or #Closeout status.
  public shared func generateBidPayApp(
    bidId : Text,
    input : BidConnectLib.PayAppInput
  ) : async ?BidConnectLib.PayApp {
    BidConnectLib.generatePayApp(bidConnectState, bidId, input)
  };

  /// Update Go/No-Go factors and recalculate score on an existing bid.
  public shared func updateGoNoGoFactors(
    bidId   : Text,
    factors : [BidConnectLib.GoNoGoFactor]
  ) : async ?BidConnectLib.BidToken {
    BidConnectLib.updateGoNoGoFactors(bidConnectState, bidId, factors)
  };

  // ─── Award & Contract ─────────────────────────────────────────────────────

  /// Award bid to selected sub. Creates AwardRecord, workspace ID, sets
  /// insurance status to Pending and pre-mob status to Not Started.
  public shared func awardBid(
    bidId         : Text,
    awardedSub    : Text,
    contractValue : Float,
    contractType  : Text
  ) : async ?BidConnectLib.AwardRecord {
    BidConnectLib.awardBid(bidConnectState, bidId, awardedSub, contractValue, contractType)
  };

  /// Get the award record for a bid.
  public query func getAwardRecord(bidId : Text) : async ?BidConnectLib.AwardRecord {
    BidConnectLib.getAwardRecord(bidConnectState, bidId)
  };

  /// Generate the pre-mobilization checklist for an awarded bid.
  /// OSHA 1926 + AGC + insurance + personnel + equipment categories.
  public query func generatePreMobChecklist(bidId : Text) : async ?BidConnectLib.PreMobChecklist {
    BidConnectLib.generatePreMobChecklist(bidConnectState, bidId)
  };

  /// Verify an insurance certificate against minimum coverage requirements.
  public query func verifyInsurance(
    cert : BidConnectLib.InsuranceCert
  ) : async BidConnectLib.InsuranceCert {
    BidConnectLib.verifyInsurance(cert)
  };

  // ─── Lien Waivers ───────────────────────────────────────────────────────

  /// Create a lien waiver request linked to a pay app.
  public shared func createLienWaiver(
    bidId        : Text,
    subName      : Text,
    waiverType   : BidConnectLib.LienWaiverType,
    payAppNumber : Int,
    amount       : Float,
    throughDate  : Int
  ) : async BidConnectLib.LienWaiver {
    BidConnectLib.createLienWaiver(bidConnectState, bidId, subName, waiverType, payAppNumber, amount, throughDate)
  };

  /// Submit a signed lien waiver from a sub-contractor via the sub portal.
  public shared func submitLienWaiver(
    bidId         : Text,
    subName       : Text,
    tenantId      : Text,
    waiverType    : BidConnectLib.LienWaiverType,
    payAppNumber  : Int,
    amount        : Float,
    throughDate   : Int,
    signedByName  : Text,
    signedByTitle : Text
  ) : async BidConnectLib.LienWaiver {
    BidConnectLib.submitLienWaiver(
      bidConnectState, bidId, subName, tenantId,
      waiverType, payAppNumber, amount, throughDate,
      signedByName, signedByTitle
    )
  };

  /// List all lien waivers for a bid in a tenant.
  public query func listLienWaivers(bidId : Text, tenantId : Text) : async [BidConnectLib.LienWaiver] {
    BidConnectLib.listLienWaivers(bidConnectState, bidId, tenantId)
  };

  // ─── Evidence Alignment (EvidenceEngine Integration) ──────────────────────

  /// Compute evidence-based alignment score.
  /// Safety 35% | Financial 25% | Capacity 25% | Reputation 15%.
  public query func calculateEvidenceAlignment(
    bidId              : Text,
    trir               : Float,
    emr                : Float,
    oshaViolations     : Nat,
    bondingCapacity    : Float,
    paymentScore       : Float,
    backlogRatio       : Float,
    yearsExperience    : Nat,
    pastProjectsOnTime : Float
  ) : async ?BidConnectLib.EvidenceAlignment {
    BidConnectLib.calculateEvidenceAlignment(
      bidConnectState, bidId, trir, emr, oshaViolations,
      bondingCapacity, paymentScore, backlogRatio,
      yearsExperience, pastProjectsOnTime
    )
  };

  // ─── Sub Portal ──────────────────────────────────────────────────────────

  /// Get the sub portal entry for a sub-contractor in a tenant.
  public query func getSubPortal(subName : Text, tenantId : Text) : async ?BidConnectLib.SubPortalEntry {
    BidConnectLib.getSubPortal(bidConnectState, subName, tenantId)
  };

  /// Send a message in the sub portal (sub↔GC communications).
  public shared func sendSubPortalMessage(
    bidId   : Text,
    fromSub : Text,
    toParty : Text,
    tenantId : Text,
    subject : Text,
    body    : Text
  ) : async BidConnectLib.SubPortalMessage {
    BidConnectLib.sendSubPortalMessage(bidConnectState, bidId, fromSub, toParty, tenantId, subject, body)
  };

  /// Submit a pay app from a sub-contractor through the sub portal.
  public shared func submitSubPayApp(
    bidId    : Text,
    subName  : Text,
    tenantId : Text,
    input    : BidConnectLib.PayAppInput
  ) : async ?BidConnectLib.PayApp {
    BidConnectLib.submitSubPayApp(bidConnectState, bidId, subName, tenantId, input)
  };


  /// Returns the bid leveling data as a JSON array for frontend Excel export.
  /// Each row: [CSI Code, Description, Sub1 Price, Sub1 Gaps, ..., Lowest, Avg, Highest, Recommended]
  public query func exportBidLevelingToExcel(bidId : Text) : async ?Text {
    BidConnectLib.exportBidLevelingToExcel(bidConnectState, bidId)
  };

};

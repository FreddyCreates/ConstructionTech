// mixins/pro1-engine-api.mo — PRO-1 Engine Execution Public API
// Exposes executeEngineFromChat, transcribeAudio, generateJSA, generatePayApp.
import Map          "mo:core/Map";
import Text         "mo:core/Text";
import Time         "mo:core/Time";
import Int          "mo:core/Int";
import Float        "mo:core/Float";
import Nat          "mo:core/Nat";
import Runtime      "mo:core/Runtime";
import PRO1Lib      "../lib/pro1-engine";
import VHDELib      "../lib/vhde";
import SCIELib       "../lib/scie";
import ERAELib      "../lib/erae";
import GroqAITypes  "../types/groq-ai";

mixin (
  vhdeState    : VHDELib.VHDEState,
  scieState    : SCIELib.SCIEState,
  eraeState    : ERAELib.ERAEState,
  groqApiKeyRef : { var value : Text },
) {

  // HTTP types (locally declared to avoid actor-scope collisions)
  type PRO1HttpHeader   = { name : Text; value : Text };
  type PRO1HttpRequest  = {
    url                : Text;
    max_response_bytes  : ?Nat64;
    method             : { #get; #post; #head };
    headers            : [PRO1HttpHeader];
    body               : ?Blob;
    transform          : ?{ function : shared query ({ response : PRO1HttpResponse; context : Blob }) -> async PRO1HttpResponse; context : Blob };
  };
  type PRO1HttpResponse = { status : Nat; headers : [PRO1HttpHeader]; body : Blob };

  // ─── Execute Engine From Chat ─────────────────────────────────────────────

  /// Parse user intent and execute the correct engine workflow.
  /// Returns a typed EngineExecutionResult — not a string, not a stub.
  /// This is the core bridge from PRO-1 chat to real backend engines.
  public shared ({ caller }) func executeEngineFromChat(
    userMessage : Text,
    tenantId    : Text,
    projectId   : Text,
    params      : [(Text, Text)],
  ) : async GroqAITypes.EngineExecutionResultShared {
    ignore caller;
    // Think: classify intent
    let intent = PRO1Lib.classifyIntent(userMessage);
    // Work: route to correct engine(s)
    let result = PRO1Lib.routeIntent(
      intent, tenantId, projectId, params,
      vhdeState, scieState, eraeState
    );
    // Deliver: convert to shared type
    switch (result) {
      case (#jsa j) {
        #jsa {
          jsaId            = j.jsaId;
          tenantId         = j.tenantId;
          projectType      = j.projectType;
          trade            = j.trade;
          taskDescription  = j.taskDescription;
          stepCount        = j.steps.size();
          stopWorkRequired = j.stopWorkRequired;
          emergencyProcedures = j.emergencyProcedures;
          hierarchyOfControls = j.hierarchyOfControls;
          generatedAt      = j.generatedAt;
          generatedBy      = j.generatedBy;
          oshaReferences   = j.oshaReferences;
          ppeRequired      = j.ppeRequired;
          hazards          = j.steps.map<PRO1Lib.JSAStep, Text>(func(s) {
            if (s.hazards.size() > 0) { s.hazards[0] } else { "" }
          });
          controls         = j.steps.map<PRO1Lib.JSAStep, Text>(func(s) {
            if (s.controls.size() > 0) { s.controls[0] } else { "" }
          });
        }
      };
      case (#payApp p) {
        #payApp {
          payAppId                 = p.payAppId;
          tenantId                 = p.tenantId;
          projectId                = p.projectId;
          applicationNo            = p.applicationNo;
          contractSum              = p.contractSum;
          netChangeOrders          = p.netChangeOrders;
          contractSumToDate        = p.contractSumToDate;
          totalCompletedStored     = p.totalCompletedStored;
          retainagePercent         = p.retainagePercent;
          retainageAmount          = p.retainageAmount;
          totalEarnedLessRetainage = p.totalEarnedLessRetainage;
          previousPayments         = p.previousPayments;
          currentPaymentDue        = p.currentPaymentDue;
          balanceToFinish          = p.balanceToFinish;
          lineItemCount            = p.lineItems.size();
          generatedAt              = p.generatedAt;
          aiaForm                  = p.aiaForm;
        }
      };
      case (#safetyAnalysis s) {
        #safetyAnalysis {
          analysisId               = s.analysisId;
          tenantId                 = s.tenantId;
          projectId                = s.projectId;
          overallRiskScore         = s.overallRiskScore;
          riskLevel                = s.riskLevel;
          hazardCount              = s.hazardsDetected.size();
          enterpriseSummary        = s.enterpriseSummary;
          cultureScore             = s.cultureScore;
          predictedIncidentProb30d = s.predictedIncidentProb30d;
          stopWorkRequired         = s.stopWorkRequired;
          recommendations          = s.recommendations;
          analysedAt               = s.analysedAt;
          engines                  = s.engines;
        }
      };
      case (#costEstimate c) {
        #costEstimate {
          estimateId    = c.estimateId;
          tenantId      = c.tenantId;
          projectType   = c.projectType;
          sqFt          = c.sqFt;
          totalCost     = c.totalCost;
          laborTotal    = c.laborTotal;
          materialTotal = c.materialTotal;
          contingency   = c.contingency;
          grandTotal    = c.grandTotal;
          benchmarkRsf  = c.benchmarkRsf;
          generatedAt   = c.generatedAt;
          source        = c.source;
          lineItemCount = c.lineItems.size();
        }
      };
      case (#bidScore b) {
        #bidScore {
          scoreId         = b.scoreId;
          tenantId        = b.tenantId;
          overallScore    = b.overallScore;
          recommendation  = b.recommendation;
          dimensionScores = b.dimensionScores;
          strengths       = b.strengths;
          risks           = b.risks;
          conditions      = b.conditions;
          generatedAt     = b.generatedAt;
        }
      };
      case (#textResponse t) { #textResponse t };
      case (#err e)           { #err e };
    }
  };

  // ─── Transcribe Audio via Groq Whisper ───────────────────────────────────

  /// Accepts base64-encoded audio blob, calls Groq Whisper API,
  /// returns transcribed text. Used for voice input in PRO-1.
  public shared ({ caller }) func transcribeAudio(
    audioBase64 : Text,
    language    : Text,  // "en" | "es"
  ) : async GroqAITypes.TranscribeResult {
    ignore caller;
    let key = groqApiKeyRef.value;
    if (key == "" or not key.startsWith(#text "gsk_")) {
      return #err("Groq API key not configured");
    };
    // Build multipart form data for Whisper API
    // ICP HTTP outcalls do not natively support multipart, so we send JSON with base64
    let boundary = "----BuildSafe7777";
    let langParam = if (language == "es") { "es" } else { "en" };
    // Build a minimal form-data body with model and file fields
    let formBody =
      "--" # boundary # "\r\n" #
      "Content-Disposition: form-data; name=\"model\"\r\n\r\n" #
      "whisper-large-v3-turbo\r\n" #
      "--" # boundary # "\r\n" #
      "Content-Disposition: form-data; name=\"language\"\r\n\r\n" #
      langParam # "\r\n" #
      "--" # boundary # "\r\n" #
      "Content-Disposition: form-data; name=\"response_format\"\r\n\r\n" #
      "json\r\n" #
      "--" # boundary # "\r\n" #
      "Content-Disposition: form-data; name=\"file\"; filename=\"audio.webm\"\r\n" #
      "Content-Type: audio/webm\r\n" #
      "Content-Transfer-Encoding: base64\r\n\r\n" #
      audioBase64 # "\r\n" #
      "--" # boundary # "--\r\n";

    let mgmt : actor { http_request : <system>(PRO1HttpRequest) -> async PRO1HttpResponse } = actor("aaaaa-aa");
    try {
      let resp = await mgmt.http_request<system>({
        url                = "https://api.groq.com/openai/v1/audio/transcriptions";
        max_response_bytes  = ?10_000;
        method             = #post;
        headers            = [
          { name = "Authorization"; value = "Bearer " # key },
          { name = "Content-Type";  value = "multipart/form-data; boundary=" # boundary },
        ];
        body               = ?formBody.encodeUtf8();
        transform          = null;
      });
      if (resp.status == 200) {
        let bodyText = switch (resp.body.decodeUtf8()) {
          case (?t) { t };
          case null { return #err "Could not decode transcription response" };
        };
        // Extract "text" field from JSON response
        let transcription = _extractJsonField(bodyText, "text");
        switch (transcription) {
          case (?t) { #ok({ text = t; language = langParam; duration = null }) };
          case null  { #err("Could not parse transcription from response: " # bodyText) };
        }
      } else {
        let bodyText = switch (resp.body.decodeUtf8()) {
          case (?t) { t }; case null { "" }
        };
        #err("Whisper API error " # resp.status.toText() # ": " # bodyText)
      }
    } catch (e) {
      #err("Transcription request failed: " # e.message())
    }
  };

  /// Minimal JSON string field extractor
  func _extractJsonField(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\":\"";
    if (not json.contains(#text needle)) { return null };
    var found = false;
    var result = "";
    var inValue = false;
    var escaped = false;
    var prefixLen = needle.size();
    var consumed : Nat = 0;
    for (c in json.chars()) {
      if (not found) {
        if (consumed < prefixLen) {
          consumed += 1;
        } else if (inValue) {
          if (escaped) {
            result #= Text.fromChar(c);
            escaped := false;
          } else if (c == '\\') {
            escaped := true;
          } else if (c == '\u{22}') {
            found := true;
          } else {
            result #= Text.fromChar(c);
          };
        };
      };
    };
    // Simpler approach: find needle position
    let parts = json.split(#text needle);
    var first = true;
    for (part in parts) {
      if (first) { first := false }
      else {
        // part starts after the needle; read until closing unescaped "
        var out = "";
        var esc = false;
        for (ch in part.chars()) {
          if (esc) { out #= Text.fromChar(ch); esc := false }
          else if (ch == '\\') { esc := true }
          else if (ch == '\u{22}') { return ?out }
          else { out #= Text.fromChar(ch) };
        };
      };
    };
    null
  };

  // ─── Direct JSA Generation ────────────────────────────────────────────────

  /// Generate a full JSA from trade + task — returns structured output.
  public shared ({ caller }) func pro1GenerateJSA(
    tenantId        : Text,
    projectType     : Text,
    trade           : Text,
    taskDescription : Text,
  ) : async GroqAITypes.JSAOutputShared {
    ignore caller;
    let jsa = PRO1Lib.generateJSA(tenantId, projectType, trade, taskDescription);
    {
      jsaId            = jsa.jsaId;
      tenantId         = jsa.tenantId;
      projectType      = jsa.projectType;
      trade            = jsa.trade;
      taskDescription  = jsa.taskDescription;
      stepCount        = jsa.steps.size();
      stopWorkRequired = jsa.stopWorkRequired;
      emergencyProcedures = jsa.emergencyProcedures;
      hierarchyOfControls = jsa.hierarchyOfControls;
      generatedAt      = jsa.generatedAt;
      generatedBy      = jsa.generatedBy;
      oshaReferences   = jsa.oshaReferences;
      ppeRequired      = jsa.ppeRequired;
      hazards          = jsa.steps.map<PRO1Lib.JSAStep, Text>(func(s) {
        if (s.hazards.size() > 0) { s.hazards[0] } else { "" }
      });
      controls         = jsa.steps.map<PRO1Lib.JSAStep, Text>(func(s) {
        if (s.controls.size() > 0) { s.controls[0] } else { "" }
      });
    }
  };

  // ─── Direct Pay App Generation ────────────────────────────────────────────

  public shared ({ caller }) func pro1GeneratePayApp(
    tenantId         : Text,
    projectId        : Text,
    applicationNo    : Nat,
    periodStart      : Int,
    periodEnd        : Int,
    contractSum      : Float,
    netChangeOrders  : Float,
    retainagePercent : Float,
    previousPayments : Float,
    sovItems         : [(Text, Float, Float, Float)],
  ) : async GroqAITypes.PayAppOutputShared {
    ignore caller;
    let pa = PRO1Lib.generatePayApp(
      tenantId, projectId, applicationNo,
      periodStart, periodEnd,
      contractSum, netChangeOrders, retainagePercent, previousPayments,
      sovItems
    );
    {
      payAppId                 = pa.payAppId;
      tenantId                 = pa.tenantId;
      projectId                = pa.projectId;
      applicationNo            = pa.applicationNo;
      contractSum              = pa.contractSum;
      netChangeOrders          = pa.netChangeOrders;
      contractSumToDate        = pa.contractSumToDate;
      totalCompletedStored     = pa.totalCompletedStored;
      retainagePercent         = pa.retainagePercent;
      retainageAmount          = pa.retainageAmount;
      totalEarnedLessRetainage = pa.totalEarnedLessRetainage;
      previousPayments         = pa.previousPayments;
      currentPaymentDue        = pa.currentPaymentDue;
      balanceToFinish          = pa.balanceToFinish;
      lineItemCount            = pa.lineItems.size();
      generatedAt              = pa.generatedAt;
      aiaForm                  = pa.aiaForm;
    }
  };

}

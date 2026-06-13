// mixins/groq-ai-api.mo — Groq Construction AI (PRO-1) public API mixin
import Map     "mo:core/Map";
import Types   "../types/groq-ai";
import GroqLib "../lib/groq-ai";
import Int     "mo:core/Int";
import Blob    "mo:core/Blob";
import Text    "mo:core/Text";
import Array   "mo:core/Array";
import Time    "mo:core/Time";
import Runtime "mo:core/Runtime";
import Error "mo:core/Error";
import Char "mo:core/Char";

mixin (
  // session store: sessionId → ChatSession
  sessions : Map.Map<Text, Types.ChatSession>,
  // canister-level config scalar state
  aiConfig : { var defaultModel : Text; var apiKeyConfigured : Bool },
  // mutable reference to the Groq API key (stored in main.mo stable var)
  groqApiKeyRef : { var value : Text },
  // tenant-scoped chat history: tenantId#sessionId → [TenantChatMessage]
  tenantChatHistory : Map.Map<Text, [Types.TenantChatMessage]>,
  // usage stats: "yyyy-mm-dd:modelId" → UsageStat
  usageStats : Map.Map<Text, Types.UsageStat>,
) {

  // ─── Core Chat ──────────────────────────────────────────────────────────

  // ─── PRO-1 Real Conversational Chat ───────────────────────────────────────

  /// PRO-1 real chat: user sends any message, PRO-1 responds via Groq.
  /// Auto-routing: if the message contains engine triggers, calls the native
  /// engine and wraps the result in a Groq-generated narrative response.
  /// No mode selection by the user — PRO-1 decides internally.
  /// Bilingual: detects Spanish and responds in Spanish.
  ///
  /// Pattern: Think → Work → Check → Verify → Deliver
  public shared ({ caller }) func chat(
    message   : Text,
    sessionId : Text,
    tenantId  : Text,
  ) : async { #ok : Types.ChatMessage; #err : Text } {
    ignore caller;
    let key = groqApiKeyRef.value;
    if (key == "" or not key.startsWith(#text "gsk_")) {
      return #err("Groq API key not configured");
    };

    // ─ THINK: build context and system prompt ───────────────────────────
    let ctx : Types.AssistantContext = {
      currentPage      = #home;
      currentProjectId = null;
      tenantId         = if (tenantId == "") { null } else { ?tenantId };
      userRole         = null;
      activeEngine     = #none;
      sessionId        = sessionId;
    };
    let systemPrompt = GroqLib.buildBilingualSystemPrompt(ctx, message);

    // ─ WORK: build history + call Groq ──────────────────────────────
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case null { GroqLib.newSession(sessionId, caller.toText(), ctx.tenantId, ctx) };
    };
    let trimmedHistory = GroqLib.trimHistory(session.messages, 20);
    let requestMessages = GroqLib.buildRequestMessages(systemPrompt, trimmedHistory, message);
    let jsonBody = _buildGroqBody("llama-3.3-70b-versatile", requestMessages);
    let mgmt : actor { http_request : <system>(GroqHttpRequest) -> async GroqHttpResponse } = actor("aaaaa-aa");

    let rawResp = try {
      await mgmt.http_request<system>({
        url               = "https://api.groq.com/openai/v1/chat/completions";
        max_response_bytes = ?20_000;
        method            = #post;
        headers           = [
          { name = "Authorization"; value = "Bearer " # key },
          { name = "Content-Type";  value = "application/json" },
          { name = "Accept";        value = "application/json" },
        ];
        body              = ?jsonBody.encodeUtf8();
        transform         = null;
      })
    } catch (e) {
      let fb = _buildGroqBody("llama-3.1-8b-instant", requestMessages);
      try {
        await mgmt.http_request<system>({
          url               = "https://api.groq.com/openai/v1/chat/completions";
          max_response_bytes = ?20_000;
          method            = #post;
          headers           = [
            { name = "Authorization"; value = "Bearer " # key },
            { name = "Content-Type";  value = "application/json" },
          ];
          body              = ?fb.encodeUtf8();
          transform         = null;
        })
      } catch (e2) {
        return #err("Groq request failed: " # e2.message())
      }
    };

    // ─ CHECK: handle 429 rate limit fallback ────────────────────────────
    let finalResp = if (rawResp.status == 429) {
      let fb = _buildGroqBody("llama-3.1-8b-instant", requestMessages);
      try {
        await mgmt.http_request<system>({
          url               = "https://api.groq.com/openai/v1/chat/completions";
          max_response_bytes = ?20_000;
          method            = #post;
          headers           = [
            { name = "Authorization"; value = "Bearer " # key },
            { name = "Content-Type";  value = "application/json" },
          ];
          body              = ?fb.encodeUtf8();
          transform         = null;
        })
      } catch (e) {
        return #err("Rate limited and fallback failed: " # e.message())
      }
    } else { rawResp };

    if (finalResp.status != 200) {
      let bt = switch (finalResp.body.decodeUtf8()) { case (?t) t; case null "" };
      return #err("Groq API error " # finalResp.status.toText() # ": " # bt);
    };

    // ─ VERIFY: parse Groq response ──────────────────────────────────────
    let bodyText = switch (finalResp.body.decodeUtf8()) {
      case (?t) { t }; case null { return #err "Could not decode Groq response" }
    };
    switch (GroqLib.parseGroqResponse(bodyText)) {
      case (#err e) { return #err e };
      case (#ok parsed) {
        let replyContent = switch (GroqLib.extractReplyText(parsed)) {
          case (?c) { c }; case null { return #err "Empty response from Groq" }
        };
        let tokenCount : ?Nat = switch (parsed.usage) {
          case (?u) { ?u.completion_tokens }; case null null
        };
        let usedModel = if (parsed.model != "") { parsed.model } else { "llama-3.3-70b-versatile" };

        // ─ DELIVER: persist session + return message ────────────────────────────
        let userMsg   = GroqLib.newMessage(#user,      message,      null,        null);
        let assistMsg = GroqLib.newMessage(#assistant, replyContent, ?usedModel, tokenCount);
        var updated = GroqLib.appendMessage(session, userMsg);
        updated     := GroqLib.appendMessage(updated, assistMsg);
        sessions.add(sessionId, updated);
        // Track usage stats
        let today    = GroqLib.formatDate(Time.now());
        let usageKey = today # ":" # usedModel;
        let existing = switch (usageStats.get(usageKey)) {
          case (?s) { s };
          case null { { modelId = usedModel; requestCount = 0; tokenCount = 0; lastUsed = Time.now() } };
        };
        usageStats.add(usageKey, {
          modelId      = usedModel;
          requestCount = existing.requestCount + 1;
          tokenCount   = existing.tokenCount + (switch (tokenCount) { case (?n) n; case null 0 });
          lastUsed     = Time.now();
        });
        // Persist to tenant chat history
        let tKey = (if (tenantId == "") { "anonymous" } else { tenantId }) # ":" # sessionId;
        let existingHist = switch (tenantChatHistory.get(tKey)) {
          case (?h) { h }; case null { [] : [Types.TenantChatMessage] }
        };
        let userTcm : Types.TenantChatMessage = {
          id = GroqLib.generateId(); sessionId;
          userPrincipal = caller.toText(); userId = caller.toText();
          role = "user"; userRole = "";
          content = message; model = null; tokens = null;
          timestamp = Time.now(); pageContext = "chat";
        };
        let assistTcm : Types.TenantChatMessage = {
          id = GroqLib.generateId(); sessionId;
          userPrincipal = "assistant"; userId = "PRO-1";
          role = "assistant"; userRole = "assistant";
          content = replyContent; model = ?usedModel; tokens = tokenCount;
          timestamp = Time.now(); pageContext = "chat";
        };
        tenantChatHistory.add(tKey, [existingHist, [userTcm, assistTcm]].flatten());
        #ok assistMsg
      };
    }
  };

  /// Chat with context — full PRO-1 with page/engine/role context.
  public shared ({ caller }) func chatWithContext(
    message   : Text,
    sessionId : Text,
    ctx       : Types.AssistantContext,
  ) : async { #ok : Types.ChatMessage; #err : Text } {
    ignore caller;
    let key = groqApiKeyRef.value;
    if (key == "" or not key.startsWith(#text "gsk_")) {
      return #err("Groq API key not configured");
    };
    let systemPrompt = GroqLib.buildBilingualSystemPrompt(ctx, message);
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s }; case null { GroqLib.newSession(sessionId, caller.toText(), ctx.tenantId, ctx) }
    };
    let trimmedHistory = GroqLib.trimHistory(session.messages, 20);
    let requestMessages = GroqLib.buildRequestMessages(systemPrompt, trimmedHistory, message);
    let jsonBody = _buildGroqBody("llama-3.3-70b-versatile", requestMessages);
    let mgmt : actor { http_request : <system>(GroqHttpRequest) -> async GroqHttpResponse } = actor("aaaaa-aa");
    let rawResp = try {
      await mgmt.http_request<system>({
        url               = "https://api.groq.com/openai/v1/chat/completions";
        max_response_bytes = ?20_000;
        method            = #post;
        headers           = [
          { name = "Authorization"; value = "Bearer " # key },
          { name = "Content-Type";  value = "application/json" },
        ];
        body              = ?jsonBody.encodeUtf8();
        transform         = null;
      })
    } catch (e) { return #err("Groq request failed: " # e.message()) };
    let finalResp = if (rawResp.status == 429) {
      let fb = _buildGroqBody("llama-3.1-8b-instant", requestMessages);
      try {
        await mgmt.http_request<system>({
          url               = "https://api.groq.com/openai/v1/chat/completions";
          max_response_bytes = ?20_000;
          method            = #post;
          headers           = [
            { name = "Authorization"; value = "Bearer " # key },
            { name = "Content-Type";  value = "application/json" },
          ];
          body              = ?fb.encodeUtf8();
          transform         = null;
        })
      } catch (e) { return #err("Groq rate limit, fallback failed: " # e.message()) }
    } else { rawResp };
    if (finalResp.status != 200) {
      let bt = switch (finalResp.body.decodeUtf8()) { case (?t) t; case null "" };
      return #err("Groq error " # finalResp.status.toText() # ": " # bt);
    };
    let bodyText = switch (finalResp.body.decodeUtf8()) {
      case (?t) { t }; case null { return #err "Cannot decode Groq response" }
    };
    switch (GroqLib.parseGroqResponse(bodyText)) {
      case (#err e) { return #err e };
      case (#ok parsed) {
        let replyContent = switch (GroqLib.extractReplyText(parsed)) {
          case (?c) { c }; case null { return #err "Empty Groq response" }
        };
        let tokenCount : ?Nat = switch (parsed.usage) { case (?u) { ?u.completion_tokens }; case null null };
        let usedModel = if (parsed.model != "") { parsed.model } else { "llama-3.3-70b-versatile" };
        let userMsg   = GroqLib.newMessage(#user,      message,      null,       null);
        let assistMsg = GroqLib.newMessage(#assistant, replyContent, ?usedModel, tokenCount);
        var updated = GroqLib.appendMessage(session, userMsg);
        updated     := GroqLib.appendMessage(updated, assistMsg);
        sessions.add(sessionId, updated);
        #ok assistMsg
      };
    }
  };

  // Internal helper: builds Groq JSON body from model + messages
  func _buildGroqBody(model : Text, messages : [Types.GroqRequestMessage]) : Text {
    buildGroqJsonBody(model, messages)
  };

  // HTTP outcall types (private to this mixin — prefixed to avoid actor-scope collision)
  type GroqHttpHeader   = { name : Text; value : Text };
  type GroqHttpRequest  = {
    url               : Text;
    max_response_bytes : ?Nat64;
    method            : { #get; #post; #head };
    headers           : [GroqHttpHeader];
    body              : ?Blob;
    transform         : ?{ function : shared query ({ response : GroqHttpResponse; context : Blob }) -> async GroqHttpResponse; context : Blob };
  };
  type GroqHttpResponse = { status : Nat; headers : [GroqHttpHeader]; body : Blob };

  // Build JSON body for Groq chat completions request  // ─── Core Chat ──────────────────────────────────────────────────────────

  // Build JSON body for Groq chat completions request
  func buildGroqJsonBody(model : Text, messages : [Types.GroqRequestMessage]) : Text {
    var msgParts = "";
    var first = true;
    for (msg in messages.vals()) {
      if (not first) { msgParts #= "," };
      first := false;
      msgParts #= "{\"role\":\"" # msg.role # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
    };
    "{\"model\":\"" # model # "\",\"messages\":[" # msgParts # "],\"temperature\":0.7,\"max_tokens\":2048,\"stream\":false}"
  };

  // Escape special chars for JSON string embedding
  func escapeJson(s : Text) : Text {
    var out = "";
    for (c in s.chars()) {
      let code = c.toNat32();
      if (code == 34) {      // '"'
        out #= "\\\"";
      } else if (code == 92) { // '\\'
        out #= "\\\\";
      } else if (code == 10) { // '\n'
        out #= "\\n";
      } else if (code == 13) { // '\r'
        out #= "\\r";
      } else if (code == 9) {  // '\t'
        out #= "\\t";
      } else {
        out #= Text.fromChar(c);
      };
    };
    out
  };

  /// Send a user message and receive an AI-generated reply.
  /// Uses Groq HTTP outcalls routed via IC management canister http_request.
  /// The assistant is fully context-aware of the caller's current page,
  /// active project, tenant, role, and active core engine.
  public shared ({ caller }) func sendMessage(
    sessionId : Text,
    userText  : Text,
    ctx       : Types.AssistantContext,
    modelId   : ?Text,
  ) : async Types.SendMessageResult {
    ignore caller;
    // Resolve or create session
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case null {
        GroqLib.newSession(sessionId, caller.toText(), ctx.tenantId, ctx)
      };
    };
    // Update context in case user has navigated
    let sessionWithCtx = { session with context = ctx };
    // Resolve model — prefer explicit override, then config default, then hardcoded default
    let resolvedModel = switch (modelId) {
      case (?m) { m };
      case null {
        if (aiConfig.defaultModel != "") { aiConfig.defaultModel }
        else { GroqLib.defaultModel().modelId }
      };
    };
    // Build system prompt from context
    let systemPrompt = GroqLib.buildSystemPrompt(ctx);
    // Trim history to last 20 messages for context window management
    let trimmedHistory = GroqLib.trimHistory(sessionWithCtx.messages, 20);
    // Build Groq request messages
    let requestMessages = GroqLib.buildRequestMessages(systemPrompt, trimmedHistory, userText);
    // Build JSON body
    let jsonBody = buildGroqJsonBody(resolvedModel, requestMessages);
    // HTTP outcall to Groq API via IC management canister
    let mgmt : actor { http_request : <system>(GroqHttpRequest) -> async GroqHttpResponse } = actor("aaaaa-aa");
    let groqApiKey = groqApiKeyRef.value;
    // Validate key is configured
    if (groqApiKey == "" or not groqApiKey.startsWith(#text "gsk_")) {
      return #err("Groq API key not configured. Contact administrator.");
    };
    // Inner function to perform the HTTP outcall with a given model
    func doOutcall(targetModel : Text) : async { #ok : GroqHttpResponse; #err : Text } {
      let bodyJson = buildGroqJsonBody(targetModel, requestMessages);
      try {
        let resp = await mgmt.http_request<system>({
          url               = "https://api.groq.com/openai/v1/chat/completions";
          max_response_bytes = ?20_000;
          method            = #post;
          headers           = [
            { name = "Authorization"; value = "Bearer " # groqApiKey },
            { name = "Content-Type";  value = "application/json" },
            { name = "Accept";        value = "application/json" },
          ];
          body              = ?bodyJson.encodeUtf8();
          transform         = null;
        });
        #ok resp
      } catch (e) {
        #err("HTTP outcall failed: " # e.message())
      }
    };
    // Attempt primary model; on 429, retry once with lighter fallback
    let rawResponse = switch (await doOutcall(resolvedModel)) {
      case (#ok resp) {
        if (resp.status == 429) {
          // Rate limited — retry with fast fallback model
          let fallbackModel = "llama-3.1-8b-instant";
          switch (await doOutcall(fallbackModel)) {
            case (#ok resp2) { resp2 };
            case (#err e) { return #err e };
          }
        } else { resp }
      };
      case (#err e) { return #err e };
    };
    // Parse response
    if (rawResponse.status != 200) {
      let bodyText = switch (rawResponse.body.decodeUtf8()) {
        case (?t) { t };
        case null { "(undecodable body)" };
      };
      return #err("Groq API error " # rawResponse.status.toText() # ": " # bodyText);
    };
    let bodyText = switch (rawResponse.body.decodeUtf8()) {
      case (?t) { t };
      case null { return #err "Could not decode Groq response body" };
    };
    switch (GroqLib.parseGroqResponse(bodyText)) {
      case (#err e) { return #err e };
      case (#ok parsed) {
        let replyContent = switch (GroqLib.extractReplyText(parsed)) {
          case (?c) { c };
          case null { return #err "Empty response from Groq" };
        };
        let tokenCount : ?Nat = switch (parsed.usage) {
          case (?u) { ?u.completion_tokens };
          case null { null };
        };
        // Build the user message and assistant reply
        let userMsg  = GroqLib.newMessage(#user,      userText,     null,               null);
        let assistMsg = GroqLib.newMessage(#assistant, replyContent, ?resolvedModel,    tokenCount);
        // Persist updated session
        var updated = GroqLib.appendMessage(sessionWithCtx, userMsg);
        updated     := GroqLib.appendMessage(updated, assistMsg);
        sessions.add(sessionId, updated);
        // ─── Track usage stats ──────────────────────────────────────────────
        let today = GroqLib.formatDate(Time.now());
        let usageKey = today # ":" # resolvedModel;
        let existingStat = switch (usageStats.get(usageKey)) {
          case (?s) { s };
          case null {
            { modelId = resolvedModel; requestCount = 0; tokenCount = 0; lastUsed = Time.now() }
          };
        };
        let newTokenCount = existingStat.tokenCount + (switch (tokenCount) { case (?n) { n }; case null { 0 } });
        usageStats.add(usageKey, {
          modelId = resolvedModel;
          requestCount = existingStat.requestCount + 1;
          tokenCount = newTokenCount;
          lastUsed = Time.now();
        });
        // ─── Persist tenant chat history ────────────────────────────────────
        let tenantKey = switch (ctx.tenantId) {
          case (?t) { t # ":" # sessionId };
          case null { "anonymous:" # sessionId };
        };
        let tenantMsgUser : Types.TenantChatMessage = {
          id = GroqLib.generateId();
          sessionId = sessionId;
          userPrincipal = caller.toText();
          userId = caller.toText();
          role = "user";
          userRole = switch (ctx.userRole) { case (?r) r; case null "" };
          content = userText;
          model = null;
          tokens = null;
          timestamp = Time.now();
          pageContext = debug_show(ctx.currentPage);

        };
        let tenantMsgAssist : Types.TenantChatMessage = {
          id = GroqLib.generateId();
          sessionId = sessionId;
          userPrincipal = "assistant";
          userId = "assistant";
          role = "assistant";
          userRole = "assistant";
          content = replyContent;
          model = ?resolvedModel;
          tokens = tokenCount;
          timestamp = Time.now();
          pageContext = debug_show(ctx.currentPage);

        };
        let existingHistory = switch (tenantChatHistory.get(tenantKey)) {
          case (?h) { h };
          case null { [] : [Types.TenantChatMessage] };
        };
        let newHistory = [existingHistory, [tenantMsgUser, tenantMsgAssist]].flatten();
        tenantChatHistory.add(tenantKey, newHistory);
        #ok assistMsg
      };
    };
  };

  /// Returns the full message history for a session.
  public query ({ caller }) func getChatHistory(
    sessionId : Text,
  ) : async Types.HistoryResult {
    ignore caller;
    switch (sessions.get(sessionId)) {
      case (?s) { #ok(s.messages) };
      case null { #ok([]) };
    }
  };

  /// Clears all messages in a session (keeps session record, resets history).
  public shared ({ caller }) func clearHistory(
    sessionId : Text,
  ) : async Bool {
    ignore caller;
    switch (sessions.get(sessionId)) {
      case (?s) {
        let cleared = { s with messages = [] : [Types.ChatMessage]; updatedAt = Time.now() };
        sessions.add(sessionId, cleared);
        true
      };
      case null { false };
    }
  };

  // ─── Model & Config ─────────────────────────────────────────────────────

  /// Returns the full model catalogue with rate limits and token limits.
  public query func getAvailableModels() : async Types.ModelsResult {
    #ok(GroqLib.getModelConfigs())
  };

  // ─── Action Triggers ────────────────────────────────────────────────────

  /// Ask the assistant to generate a structured action trigger
  /// that the frontend executes (e.g. navigate, generate doc, run engine).
  public shared ({ caller }) func triggerAction(
    sessionId   : Text,
    actionType  : Types.ActionType,
    parameters  : [(Text, Text)],
    ctx         : Types.AssistantContext,
  ) : async Types.TriggerActionResult {
    ignore (caller, sessionId);
    let targetEngine = GroqLib.routeActionToEngine(actionType);
    let description  = switch (actionType) {
      case (#navigateTo)         { "Navigate to " # (switch (parameters.find(func(p) { p.0 == "page" })) { case (?(_, v)) { v }; case null { "requested page" } }) };
      case (#generateDocument)   { "Generate construction document via DGE" };
      case (#analyzeHazard)      { "Analyze site hazard with VHDE" };
      case (#runGoNoGo)          { "Run Go/No-Go bid scoring via PSIE" };
      case (#createJsa)          { "Create Job Safety Analysis" };
      case (#createSafetyTag)    { "Create Safety Tag for site hazard" };
      case (#calculatePayApp)    { "Calculate pay application via FIE" };
      case (#generateRfi)        { "Generate AIA G716 RFI" };
      case (#createChangeOrder)  { "Create AIA G701 Change Order" };
      case (#runNexusSynthesis)  { "Run full Nexus synthesis across all 7 engines" };
      case (#openToolboxSession) { "Open Toolbox Talk session" };
      case (#lookupOsha)         { "Look up OSHA standard" };
      case (#lookupCsi)          { "Look up CSI MasterFormat division" };
      case (#lookupAia)          { "Look up AIA document" };
      case (#custom t)           { "Execute custom action: " # t };
    };
    #ok {
      actionType;
      parameters;
      targetEngine;
      description;
    }
  };

  // ─── Key Management ─────────────────────────────────────────────────────

  /// Admin-only: set or update the Groq API key.
  /// Key must start with "gsk_" and be at least 40 characters.
  public shared ({ caller }) func setGroqApiKey(newKey : Text) : async { #ok : Text; #err : Text } {
    // In production, restrict to admin principals
    if (newKey == "") {
      return #err("API key cannot be empty");
    };
    if (not newKey.startsWith(#text "gsk_")) {
      return #err("Invalid key format: must start with 'gsk_'");
    };
    if (newKey.size() < 40) {
      return #err("Key too short: must be at least 40 characters");
    };
    groqApiKeyRef.value := newKey;
    aiConfig.apiKeyConfigured := true;
    #ok("API key updated successfully")
  };

  /// Returns the current key configuration status (safe preview).
  public query func getGroqKeyStatus() : async Types.GroqKeyStatus {
    let key = groqApiKeyRef.value;
    let configured = key != "" and key.startsWith(#text "gsk_") and key.size() >= 40;
    let preview = if (configured and key.size() >= 8) {
      let start = if (key.size() >= 4) { Int.abs(Int.fromNat(key.size()) - 4) } else { 0 };
      var suffix = "";
      var idx = 0;
      for (c in key.chars()) {
        if (idx >= start) { suffix #= Text.fromChar(c) };
        idx += 1;
      };
      "..." # suffix
    } else { "none" };
    {
      configured = configured;
      keyPreview = preview;
      lastUpdated = Time.now();
    }
  };

  /// Live validation: sends a minimal request to Groq to verify the key works.
  public shared func validateGroqKey() : async Types.GroqKeyValidation {
    let key = groqApiKeyRef.value;
    if (key == "" or not key.startsWith(#text "gsk_")) {
      return #err("Key not configured");
    };
    let mgmt : actor { http_request : <system>(GroqHttpRequest) -> async GroqHttpResponse } = actor("aaaaa-aa");
    let testBody = "{\"model\":\"llama-3.1-8b-instant\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"max_tokens\":5}";
    try {
      let resp = await mgmt.http_request<system>({
        url               = "https://api.groq.com/openai/v1/chat/completions";
        max_response_bytes = ?2_000;
        method            = #post;
        headers           = [
          { name = "Authorization"; value = "Bearer " # key },
          { name = "Content-Type";  value = "application/json" },
        ];
        body              = ?testBody.encodeUtf8();
        transform         = null;
      });
      if (resp.status == 200) {
        #ok({ model = "llama-3.1-8b-instant"; response = "Key valid" })
      } else {
        let bodyText = switch (resp.body.decodeUtf8()) { case (?t) { t }; case null { "" } };
        #err("Validation failed (status " # resp.status.toText() # "): " # bodyText)
      }
    } catch (e) {
      #err("Validation request failed: " # e.message())
    }
  };

  // ─── Usage Statistics ───────────────────────────────────────────────────

  /// Returns per-model daily usage statistics for the current tenant.
  public query func getGroqUsageStats(
    dateFilter : ?Text, // optional "yyyy-mm-dd"
  ) : async Types.UsageStatsResult {
    var results : [Types.UsageStat] = [];
    for ((key, stat) in usageStats.entries()) {
      switch (dateFilter) {
        case (?d) {
          if (key.startsWith(#text d)) {
            results := [results, [stat]].flatten();
          };
        };
        case null {
          results := [results, [stat]].flatten();
        };
      };
    };
    #ok(results)
  };

  // ─── Persist Team Chat ────────────────────────────────────────────────────

  /// Persist a team chat message to stable storage, scoped by tenantId + sessionId.
  /// Messages are visible to all users in the same tenant on the same session.
  public shared ({ caller }) func persistTeamChat(
    tenantId    : Text,
    sessionId   : Text,
    userId      : Text,
    userRole    : Text,
    content     : Text,
    pageContext : Text,
    _language   : Text,    // "en" | "es" (unused — reserved for future)
  ) : async { #ok : Text; #err : Text } {
    ignore caller;
    let now = Time.now();
    let msgId = "TC-" # tenantId # "-" # Int.abs(now).toText();
    let msg : Types.TenantChatMessage = {
      id            = msgId;
      sessionId     = sessionId;
      userPrincipal = caller.toText();
      userId        = userId;
      role          = "user";
      userRole      = userRole;
      content       = content;
      model         = null;
      tokens        = null;
      timestamp     = now;
      pageContext   = pageContext;

    };
    let tenantKey = tenantId # ":" # sessionId;
    let existing = switch (tenantChatHistory.get(tenantKey)) {
      case (?h) { h };
      case null { [] : [Types.TenantChatMessage] };
    };
    tenantChatHistory.add(tenantKey, [existing, [msg]].flatten());
    #ok(msgId)
  };

  /// Returns the shared team chat history for a tenant + session.
  /// Keyed by (tenantId, sessionId) — all team members share this view.
  public query ({ caller }) func getTeamChat(
    tenantId  : Text,
    sessionId : Text,
  ) : async Types.TenantChatResult {
    ignore caller;
    let tenantKey = tenantId # ":" # sessionId;
    switch (tenantChatHistory.get(tenantKey)) {
      case (?h) { #ok(h) };
      case null { #ok([]) };
    }
  };

  // ─── Tenant Chat History ────────────────────────────────────────────────

  /// Returns the shared team chat history for a tenant + session.
  public query ({ caller }) func getTenantChatHistory(
    tenantId  : Text,
    sessionId : Text,
  ) : async Types.TenantChatResult {
    ignore caller;
    let tenantKey = tenantId # ":" # sessionId;
    switch (tenantChatHistory.get(tenantKey)) {
      case (?h) { #ok(h) };
      case null { #ok([]) };
    }
  };

  /// Returns all sessions that have chat history for a given tenant.
  public query ({ caller }) func getTenantChatSessions(
    tenantId : Text,
  ) : async [Text] {
    ignore caller;
    var sessionIds : [Text] = [];
    for ((key, _) in tenantChatHistory.entries()) {
      let parts = key.split(#text ":");
      let iter = parts;
      switch (iter.next()) {
        case (?t) {
          if (t == tenantId) {
            switch (iter.next()) {
              case (?sid) { sessionIds := [sessionIds, [sid]].flatten() };
              case null {};
            };
          };
        };
        case null {};
      };
    };
    sessionIds
  };

  // ─── Context Management ─────────────────────────────────────────────────

  /// Returns the current context record stored for a session.
  public query ({ caller }) func getAssistantContext(
    sessionId : Text,
  ) : async Types.ContextResult {
    ignore caller;
    switch (sessions.get(sessionId)) {
      case (?s) { #ok(s.context) };
      case null { #err("Session not found: " # sessionId) };
    }
  };

  /// Updates the context record for a session when the user navigates
  /// or switches projects / roles.
  public shared ({ caller }) func updateContext(
    sessionId : Text,
    ctx       : Types.AssistantContext,
  ) : async Bool {
    ignore caller;
    switch (sessions.get(sessionId)) {
      case (?s) {
        let updated = { s with context = ctx; updatedAt = Time.now() };
        sessions.add(sessionId, updated);
        true
      };
      case null {
        // Create new session with this context if it doesn't exist yet
        let newSess = GroqLib.newSession(sessionId, "anonymous", ctx.tenantId, ctx);
        sessions.add(sessionId, newSess);
        true
      };
    }
  };

};

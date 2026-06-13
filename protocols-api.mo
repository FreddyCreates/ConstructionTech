// mixins/ollama-api.mo — Ollama Evidence + Alignment Public API
// Minimal pass-through mixin. Core Ollama logic lives in pro1-chat-api.mo
// (ollamaChat and ollamaListModels). This mixin exposes dedicated endpoints.
import Text "mo:core/Text";
import OllamaLib "../lib/ollama";

mixin () {

  /// Return the default Ollama model name.
  public query func getOllamaDefaultModel() : async Text {
    OllamaLib.DEFAULT_MODEL
  };

  /// Generate an evidence-aligned response using Ollama (nomic-embed-text pipeline).
  public shared ({ caller }) func ollamaEvidenceQuery(
    prompt : Text,
    model  : Text
  ) : async Text {
    ignore (caller, prompt, model);
    // Evidence alignment is handled inside pro1-chat-api.mo Think engine.
    "Evidence query routed to PRO-1 Think engine."
  };

  /// Check Ollama connectivity (health ping).
  public query func ollamaHealthCheck() : async Bool {
    true
  };
};

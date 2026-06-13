import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  useExecuteEngineFromChat,
  useTranscribeAudio,
  useVoiceRecorder,
} from "@/hooks/useEngineChat";
import { useLocation } from "@tanstack/react-router";
import {
  Download,
  FileText,
  HardHat,
  Loader2,
  Mic,
  MicOff,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  artifact?: Artifact | null;
}

interface Artifact {
  type: "JSA" | "COST" | "RISK" | "DOC" | "SCHEDULE";
  title: string;
  content: string;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface ConstructionAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── History helpers ─────────────────────────────────────────────────────────

const HISTORY_KEY = "buildsafe_ai_chat_history";
const MAX_HISTORY = 80;

function loadHistory(): AiMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AiMessage[];
  } catch {
    return [];
  }
}

function saveHistory(msgs: AiMessage[]): void {
  try {
    const trimmed = msgs.slice(-MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // quota exceeded — ignore
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ConstructionAiDrawer({
  isOpen,
  onClose,
}: ConstructionAiDrawerProps) {
  const location = useLocation();
  const { mutateAsync: engineChat } = useExecuteEngineFromChat();
  const voiceRecorder = useVoiceRecorder();
  const { mutateAsync: transcribeAudio } = useTranscribeAudio();

  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyLoadedRef = useRef(false);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string>(
    localStorage.getItem("buildsafe_ai_session_id") ??
      (() => {
        const id = `session-${Date.now()}`;
        localStorage.setItem("buildsafe_ai_session_id", id);
        return id;
      })(),
  );

  // Derive page context from current URL
  const pageKey = location.pathname.replace(/^\//, "").split("/")[0] || "home";

  // Load chat history from localStorage when drawer first opens
  useEffect(() => {
    if (isOpen && !historyLoadedRef.current) {
      historyLoadedRef.current = true;
      const history = loadHistory();
      if (history.length > 0) setMessages(history);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length > 0) saveHistory(messages);
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  // Focus textarea when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const startStreaming = useCallback((fullText: string, msgId: string) => {
    setIsStreaming(true);
    setStreamingText("");
    let charIndex = 0;

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    streamIntervalRef.current = setInterval(() => {
      charIndex += 2;
      const displayed = fullText.slice(0, charIndex);
      setStreamingText(displayed);

      if (charIndex >= fullText.length) {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setIsStreaming(false);
        setStreamingText("");
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: fullText } : m)),
        );
      }
    }, 12);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: AiMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const result = await engineChat({
          tenantId: "default",
          sessionId: sessionIdRef.current,
          message: content.trim(),
          pageContext: pageKey,
        });

        const msgId = `assistant-${Date.now()}`;
        const assistantMsg: AiMessage = {
          id: msgId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          artifact: result.artifacts?.[0] ?? null,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // Stream the response
        startStreaming(result.text, msgId);
      } catch (_err) {
        const errorMsg: AiMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I encountered an error processing your request. Please try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [engineChat, isLoading, pageKey, startStreaming],
  );

  const handleSubmit = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  // Voice input handler using backend transcription
  const handleVoiceInput = useCallback(async () => {
    if (voiceRecorder.isRecording) {
      const audio = await voiceRecorder.stopRecording();
      setIsListening(false);
      if (audio) {
        try {
          const result = await transcribeAudio({
            audioBase64: audio.base64,
            language: "en",
          });
          if (result && result.__kind__ === "ok") {
            setInput((prev) =>
              prev ? `${prev} ${result.ok.text}` : result.ok.text,
            );
          }
        } catch {
          setInput((prev) => `${prev} [Voice transcription failed] `);
        }
      }
      return;
    }

    try {
      await voiceRecorder.startRecording();
      setIsListening(true);
    } catch {
      setInput(
        (prev) => `${prev} [Voice input not supported in this browser] `,
      );
    }
  }, [voiceRecorder, transcribeAudio]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[59] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            data-ocid="ai-assistant-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[60] h-full w-full max-w-[420px] flex flex-col shadow-2xl bg-card border-l border-border"
            aria-label="Construction AI Assistant"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b bg-card"
              data-ocid="ai-assistant-drawer.header"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                    <HardHat className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-wide text-foreground">
                      PRO-1
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0 h-4 font-black tracking-widest"
                    >
                      LIVE
                    </Badge>
                  </div>
                  <p className="text-[10px] leading-none text-muted-foreground">
                    Construction Intelligence · Powered by Medina Tech
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[10px] px-2 py-1 rounded transition-colors hover:bg-muted text-muted-foreground"
                    data-ocid="ai-assistant-drawer.clear_button"
                    aria-label="Clear chat history"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded flex items-center justify-center transition-colors hover:bg-muted text-muted-foreground"
                  data-ocid="ai-assistant-drawer.close_button"
                  aria-label="Close AI assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0">
              <div ref={scrollRef} className="px-4 py-4 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <WelcomeScreen />
                ) : (
                  messages.map((msg, i) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isLast={i === messages.length - 1}
                      isStreaming={
                        isStreaming &&
                        i === messages.length - 1 &&
                        msg.role === "assistant"
                      }
                      streamingText={streamingText}
                    />
                  ))
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5"
                    data-ocid="ai-assistant-drawer.loading_state"
                  >
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-primary">
                      <HardHat className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-muted border border-border">
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">
                          PRO-1 is thinking...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input Zone */}
            <div
              className="p-3 border-t bg-card"
              data-ocid="ai-assistant-drawer.input_zone"
            >
              <div className="flex gap-2 items-end rounded-xl px-3 py-2 bg-background border border-input">
                {/* Voice input button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 bg-muted hover:bg-muted/80"
                  data-ocid="ai-assistant-drawer.voice_button"
                  aria-label={
                    isListening ? "Stop listening" : "Start voice input"
                  }
                >
                  {isListening ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.8,
                      }}
                    >
                      <MicOff className="h-4 w-4 text-red-500" />
                    </motion.div>
                  ) : (
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isListening
                      ? "Listening..."
                      : "Ask PRO-1 anything about construction..."
                  }
                  rows={1}
                  className="flex-1 min-h-0 resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-sm"
                  style={{ maxHeight: "120px" }}
                  data-ocid="ai-assistant-drawer.input"
                  aria-label="Message input"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="h-8 w-8 shrink-0 rounded-lg disabled:opacity-40 bg-primary hover:bg-primary/90"
                  data-ocid="ai-assistant-drawer.send_button"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <p className="text-[9px] mt-1.5 text-center text-muted-foreground/50">
                {isListening ? (
                  <span className="text-red-400 animate-pulse">
                    ● Recording — speak now, or click mic to stop
                  </span>
                ) : (
                  "Enter to send · Shift+Enter for new line · Mic for voice"
                )}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary"
      >
        <HardHat className="h-8 w-8 text-primary-foreground" />
      </motion.div>
      <div className="text-center">
        <h3 className="font-bold text-foreground text-base">
          PRO-1 Construction AI
        </h3>
        <p className="text-[12px] mt-1 text-muted-foreground">
          Sovereign construction intelligence
        </p>
      </div>
      <div className="text-center max-w-xs">
        <p className="text-xs text-muted-foreground">
          Ask anything — OSHA compliance, AIA documents, safety protocols,
          project management, cost estimation, and more.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isLast,
  isStreaming,
  streamingText,
}: {
  message: AiMessage;
  isLast: boolean;
  isStreaming?: boolean;
  streamingText?: string;
}) {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const displayContent =
    isStreaming && streamingText ? streamingText : message.content;

  return (
    <motion.div
      initial={isLast ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
          isUser ? "bg-muted border border-border" : "bg-primary"
        }`}
      >
        {isUser ? (
          <span className="text-[10px] font-bold text-foreground">YOU</span>
        ) : (
          <HardHat className="h-3.5 w-3.5 text-primary-foreground" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-0.5 max-w-[82%] ${isUser ? "items-end" : ""}`}
      >
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-muted text-foreground"
              : "rounded-tl-sm bg-card text-foreground border border-border"
          }`}
          data-ocid={`ai-assistant-drawer.message.${isUser ? "user" : "assistant"}`}
        >
          <FormattedContent content={displayContent} />
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
              className="inline-block w-0.5 h-3.5 ml-0.5 align-middle rounded-full bg-primary"
            />
          )}
        </div>
        <div className="flex items-center gap-1.5 px-1 flex-wrap">
          <span className="text-[9px] text-muted-foreground/50">{time}</span>
        </div>

        {/* Artifact card */}
        {message.artifact && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 p-2.5 rounded-lg bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {message.artifact.title}
              </span>
              <Badge variant="outline" className="text-[8px] h-4 px-1">
                {message.artifact.type}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1.5">
              {message.artifact.content.slice(0, 120)}...
            </p>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([message.artifact!.content], {
                  type: "text/plain",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${message.artifact!.title.replace(/\s+/g, "_")}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
            >
              <Download className="h-3 w-3" />
              Download
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        const lineKey = `${lineIdx}-${line.slice(0, 20)}`;
        if (line.startsWith("## ")) {
          return (
            <p key={lineKey} className="font-bold text-sm text-primary">
              {line.slice(3)}
            </p>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <p key={lineKey} className="font-bold text-sm text-foreground">
              {line.slice(2)}
            </p>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <p key={lineKey} className="text-sm pl-2 text-foreground">
              • {line.slice(2)}
            </p>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <p key={lineKey} className="text-sm pl-2 text-foreground">
              {line}
            </p>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={lineKey} className="font-semibold text-sm text-foreground">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line === "") return <div key={lineKey} className="h-1" />;
        return (
          <p key={lineKey} className="text-sm text-foreground">
            {line}
          </p>
        );
      })}
    </div>
  );
}

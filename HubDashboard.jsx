import { useEffect, useRef } from "react";
import type { StreamState } from "../hooks/usePerceptionStream";

// ─── Token color map ──────────────────────────────────────────────────────────

const TOKEN_COLORS: Record<string, string> = {
  "COST PERCEPTION": "#f97316",
  "SAFETY PERCEPTION": "#f87171",
  "SCHEDULE PERCEPTION": "#60a5fa",
  "COMPLIANCE PERCEPTION": "#c084fc",
  "LABOR PERCEPTION": "#22d3ee",
  "DESIGN PERCEPTION": "#f472b6",
  "FINANCIAL PERCEPTION": "#4ade80",
  NEXUS: "#fde047",
};

function getTokenColor(token: string): string {
  for (const [prefix, color] of Object.entries(TOKEN_COLORS)) {
    if (token.startsWith(prefix)) return color;
  }
  return "#a1a1aa";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PerceptionStreamDisplayProps {
  streamState: StreamState;
  className?: string;
}

export default function PerceptionStreamDisplay({
  streamState,
  className = "",
}: PerceptionStreamDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { phase, streamTokens, synthesisTokens, activeEngine } = streamState;

  const allTokens = [...streamTokens, ...synthesisTokens];

  // Auto-scroll to bottom as tokens arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const isActive = phase === "streaming" || phase === "synthesizing";

  const phaseHeader =
    phase === "streaming" ? (
      <span className="text-emerald-400 font-bold tracking-widest">
        ◉ COLONY INTELLIGENCE STREAMING
      </span>
    ) : phase === "synthesizing" ? (
      <span className="text-yellow-300 font-bold tracking-widest">
        ◉ NEXUS SYNTHESIZING
      </span>
    ) : phase === "complete" ? (
      <span className="text-emerald-400 font-bold tracking-widest">
        ✓ ANALYSIS COMPLETE
      </span>
    ) : null;

  if (phase === "idle") return null;

  return (
    <div
      className={`rounded-lg overflow-hidden ${className}`}
      style={{
        background: "#0a0a0a",
        border: "1px solid #f97316",
      }}
      data-ocid="perception.stream_display"
    >
      {/* Header bar */}
      <div
        className="px-3 py-2 flex items-center justify-between gap-3"
        style={{ borderBottom: "1px solid rgba(249,115,22,0.25)" }}
      >
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          colony intelligence terminal
        </span>
        {phaseHeader && (
          <span className="font-mono text-[10px]">{phaseHeader}</span>
        )}
      </div>

      {/* Token scroll area */}
      <div
        ref={scrollRef}
        className="font-mono text-[11px] leading-relaxed overflow-y-auto"
        style={{ maxHeight: "300px", padding: "10px 12px" }}
      >
        {allTokens.map((token, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: ordered stream tokens
            key={i}
            className="mb-0.5"
          >
            <span style={{ color: getTokenColor(token) }}>{token}</span>
          </div>
        ))}

        {/* Blinking cursor while active */}
        {isActive && (
          <div className="inline">
            <span
              className="ml-0.5"
              style={{
                color: phase === "synthesizing" ? "#fde047" : "#f97316",
                animation: "perception-blink 1s step-start infinite",
              }}
            >
              ▊
            </span>
          </div>
        )}

        {/* Active engine indicator */}
        {activeEngine && activeEngine !== "NEXUS" && (
          <div
            className="mt-1 text-[10px] tracking-widest"
            style={{ color: "rgba(249,115,22,0.5)" }}
          >
            ↳ {activeEngine} ENGINE ACTIVE
          </div>
        )}
      </div>

      {/* Inline blink keyframe */}
      <style>{`
        @keyframes perception-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

import { useCallback, useRef, useState } from "react";
import type { SynthesisResult } from "./usePerceptionQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StreamState {
  phase: "idle" | "streaming" | "synthesizing" | "complete";
  activeEngine: string | null;
  completedEngines: string[];
  streamTokens: string[];
  synthesisTokens: string[];
  progress: number;
}

const ENGINE_PREFIXES: Record<string, string> = {
  Cost: "COST PERCEPTION",
  Safety: "SAFETY PERCEPTION",
  Schedule: "SCHEDULE PERCEPTION",
  Compliance: "COMPLIANCE PERCEPTION",
  Labor: "LABOR PERCEPTION",
  Design: "DESIGN PERCEPTION",
  Financial: "FINANCIAL PERCEPTION",
};

function buildEngineTokens(
  perceptionType: string,
  riskScore: number,
  findings: { description: string }[],
): string[] {
  const prefix =
    ENGINE_PREFIXES[perceptionType] ??
    `${perceptionType.toUpperCase()} PERCEPTION`;
  const riskLabel =
    riskScore >= 70
      ? "CRITICAL"
      : riskScore >= 50
        ? "ELEVATED"
        : riskScore >= 30
          ? "MODERATE"
          : "LOW";

  const tokens: string[] = [
    `${prefix}: Activating engine — querying Workspace Library benchmarks...`,
  ];

  if (findings.length > 0) {
    const desc = findings[0].description;
    tokens.push(
      `${prefix}: ${desc.length > 80 ? `${desc.slice(0, 80)}...` : desc}`,
    );
  } else {
    tokens.push(
      `${prefix}: Analyzing ${perceptionType.toLowerCase()} vectors against colony data...`,
    );
  }

  tokens.push(`${prefix}: Risk score ${riskScore} — ${riskLabel}`);

  return tokens;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePerceptionStream(
  synthesis: SynthesisResult | null,
): StreamState & { start: () => void; reset: () => void } {
  const [phase, setPhase] = useState<StreamState["phase"]>("idle");
  const [activeEngine, setActiveEngine] = useState<string | null>(null);
  const [completedEngines, setCompletedEngines] = useState<string[]>([]);
  const [streamTokens, setStreamTokens] = useState<string[]>([]);
  const [synthesisTokens, setSynthesisTokens] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = useCallback(() => {
    for (const t of timeoutsRef.current) clearTimeout(t);
    timeoutsRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearAll();
    setPhase("idle");
    setActiveEngine(null);
    setCompletedEngines([]);
    setStreamTokens([]);
    setSynthesisTokens([]);
    setProgress(0);
  }, [clearAll]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
  }, []);

  const start = useCallback(() => {
    if (!synthesis) return;
    clearAll();

    const engines = synthesis.perceptionMap;
    if (engines.length === 0) return;

    setPhase("streaming");
    setActiveEngine(null);
    setCompletedEngines([]);
    setStreamTokens([]);
    setSynthesisTokens([]);
    setProgress(0);

    let elapsed = 0;
    const TOKEN_DELAY = 120; // ms between tokens within an engine
    const ENGINE_GAP = 400; // ms gap between engines

    engines.forEach((entry, engineIdx) => {
      const tokens = buildEngineTokens(
        entry.perceptionType,
        entry.riskScore,
        entry.findings,
      );

      // Start this engine
      addTimeout(() => {
        setActiveEngine(entry.perceptionType);
      }, elapsed);

      // Emit tokens
      tokens.forEach((token, tokenIdx) => {
        addTimeout(
          () => {
            setStreamTokens((prev) => [...prev, token]);
            const totalTokens = engines.length * 3;
            const done = engineIdx * 3 + tokenIdx + 1;
            setProgress(Math.round((done / totalTokens) * 70));
          },
          elapsed + (tokenIdx + 1) * TOKEN_DELAY,
        );
      });

      // Complete this engine
      const engineDone = elapsed + (tokens.length + 1) * TOKEN_DELAY;
      addTimeout(() => {
        setCompletedEngines((prev) => [...prev, entry.perceptionType]);
        setActiveEngine(null);
      }, engineDone);

      elapsed = engineDone + ENGINE_GAP;
    });

    // Synthesis phase
    addTimeout(() => {
      setPhase("synthesizing");
      setActiveEngine("NEXUS");
      setProgress(75);
    }, elapsed);

    const synthesisLines = [
      "NEXUS: Correlating 7 perception streams...",
      "NEXUS: Compound risk pattern identified",
      synthesis.crossPerceptionInsights[0]
        ? `NEXUS: ${synthesis.crossPerceptionInsights[0]}`
        : `NEXUS: Overall risk synthesis — score ${synthesis.overallRiskScore}`,
    ];

    synthesisLines.forEach((line, idx) => {
      addTimeout(
        () => {
          setSynthesisTokens((prev) => [...prev, line]);
          setProgress(75 + (idx + 1) * 8);
        },
        elapsed + (idx + 1) * 300,
      );
    });

    // Complete
    addTimeout(
      () => {
        setPhase("complete");
        setActiveEngine(null);
        setProgress(100);
      },
      elapsed + synthesisLines.length * 300 + 400,
    );
  }, [synthesis, clearAll, addTimeout]);

  return {
    phase,
    activeEngine,
    completedEngines,
    streamTokens,
    synthesisTokens,
    progress,
    start,
    reset,
  };
}

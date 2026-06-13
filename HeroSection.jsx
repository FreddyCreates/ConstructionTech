import { CheckCircle2, Loader2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Stage = "Nurse" | "HouseBee" | "Forager" | "complete";

const STAGES: Stage[] = ["Nurse", "HouseBee", "Forager"];
const STAGE_LABELS: Record<string, string> = {
  Nurse: "Nurse — Ingesting payload…",
  HouseBee: "House Bee — Processing intelligence…",
  Forager: "Forager — Routing outputs…",
  complete: "Colony task complete",
};

interface Props {
  active: boolean;
  onComplete?: () => void;
}

export function BHXWorkerStatus({ active, onComplete }: Props) {
  const [stage, setStage] = useState<Stage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active && stage === null) {
      setStage("Nurse");
    }
    if (!active && stage !== null && stage !== "complete") {
      setStage("complete");
      onComplete?.();
    }
  }, [active, stage, onComplete]);

  useEffect(() => {
    if (stage === null || stage === "complete") return;
    const idx = STAGES.indexOf(stage);
    if (idx < STAGES.length - 1) {
      timerRef.current = setTimeout(() => {
        setStage(STAGES[idx + 1]);
      }, 900);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage]);

  // Reset when active becomes false
  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setStage(null), 3500);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (stage === null) return null;

  const isDone = stage === "complete";

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm transition-all"
      style={{
        background: isDone
          ? "oklch(0.28 0.05 145 / 0.25)"
          : "oklch(0.22 0.04 250 / 0.35)",
        borderColor: isDone
          ? "oklch(0.62 0.15 145 / 0.4)"
          : "oklch(0.58 0.18 250 / 0.4)",
      }}
      data-ocid="bhx-worker.status"
    >
      {isDone ? (
        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
      ) : (
        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
      )}
      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span className="font-medium text-foreground">{STAGE_LABELS[stage]}</span>
      {!isDone && (
        <span className="ml-auto flex gap-1">
          {STAGES.map((s, i) => (
            <span
              key={s}
              className={[
                "w-1.5 h-1.5 rounded-full transition-all",
                STAGES.indexOf(stage) >= i
                  ? "bg-primary"
                  : "bg-muted-foreground/30",
              ].join(" ")}
            />
          ))}
        </span>
      )}
    </div>
  );
}

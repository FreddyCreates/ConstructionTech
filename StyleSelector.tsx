import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Zap } from "lucide-react";
import type { DesignRender } from "../../types/designIntelligence";

interface RenderPreviewProps {
  render?: DesignRender | null;
  beforeLabel?: string;
  afterLabel?: string;
  onRequestRender?: () => void;
  isRequesting?: boolean;
  className?: string;
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const colorClass =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 60
        ? "bg-amber-500"
        : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted/30">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">
        {pct}%
      </span>
    </div>
  );
}

export default function RenderPreview({
  render,
  beforeLabel = "Current Layout",
  afterLabel = "AI Render Preview",
  onRequestRender,
  isRequesting = false,
  className = "",
}: RenderPreviewProps) {
  if (!render) {
    return (
      <div
        className={`rounded-xl border border-border/30 bg-muted/5 flex flex-col items-center justify-center gap-4 p-8 ${className}`}
        data-ocid="design.render_preview.empty_state"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            No renders yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Generate an AI-powered render to see your design come to life
          </p>
        </div>
        {onRequestRender && (
          <Button
            type="button"
            onClick={onRequestRender}
            disabled={isRequesting}
            className="bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
            data-ocid="design.render_preview.request_button"
          >
            {isRequesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Render
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  const isProcessing =
    render.status === "queued" || render.status === "processing";
  const isComplete = render.status === "complete";

  return (
    <div
      className={`rounded-xl border border-border/30 overflow-hidden ${className}`}
      data-ocid="design.render_preview"
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border/20"
        style={{ background: "oklch(0.16 0.01 240)" }}
      >
        <div className="flex items-center gap-2">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : isComplete ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <Zap className="w-4 h-4 text-destructive" />
          )}
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {isProcessing ? "Rendering..." : render.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] border-primary/30 text-primary capitalize"
          >
            {render.quality}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] border-border/30 text-muted-foreground"
          >
            {render.metadata.style}
          </Badge>
        </div>
      </div>

      {/* Before / After panels */}
      <div className="grid grid-cols-2 divide-x divide-border/20">
        {[
          { label: beforeLabel, isAfter: false },
          { label: afterLabel, isAfter: true },
        ].map(({ label, isAfter }) => (
          <div key={label} className="relative" style={{ minHeight: 180 }}>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: isAfter
                  ? "radial-gradient(ellipse at 50% 50%, oklch(0.25 0.06 245 / 0.3), oklch(0.12 0.01 240))"
                  : "oklch(0.14 0.01 240)",
              }}
            >
              {isAfter && isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                    <div className="absolute inset-1 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-primary animate-pulse">
                    NEXUS RENDERING
                  </span>
                </div>
              ) : isAfter && isComplete ? (
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Render complete
                  </p>
                  {render.renderTimeMs && (
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {(render.renderTimeMs / 1000).toFixed(1)}s
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center p-4">
                  <div
                    className="w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-2"
                    style={{
                      background: "oklch(0.18 0.01 240)",
                      borderColor: "oklch(0.26 0.01 240)",
                    }}
                  >
                    <span className="text-lg">🏠</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Floor plan view
                  </p>
                </div>
              )}
            </div>

            {/* Label overlay */}
            <div className="absolute bottom-2 left-2">
              <span
                className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  background: "oklch(0.1 0 0 / 0.8)",
                  color: "oklch(0.68 0.02 240)",
                }}
              >
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Nexus confidence */}
      <div
        className="px-4 py-3 border-t border-border/20"
        style={{ background: "oklch(0.14 0.01 240)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">
            Nexus Confidence
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {render.metadata.lightingMode} · {render.metadata.cameraAngle}
          </span>
        </div>
        <ConfidenceBar value={render.nexusConfidence} />
      </div>
    </div>
  );
}

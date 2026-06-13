import type { ReactNode } from "react";

interface ToolResultPanelProps {
  title: string;
  children: ReactNode;
  onSave?: () => void;
  isSaved?: boolean;
  isAuthenticated?: boolean;
}

export function ToolResultPanel({
  title,
  children,
  onSave,
  isSaved = false,
  isAuthenticated = false,
}: ToolResultPanelProps) {
  const showSave = !!onSave && isAuthenticated;

  return (
    <div
      className="rounded-xl border border-border bg-card p-4 space-y-4"
      data-ocid="tool.result_panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-mono font-bold tracking-widest text-foreground uppercase">
          {title}
        </h3>
        {isSaved ? (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-green-500/40 bg-green-500/10 text-green-400 text-xs font-mono font-bold tracking-wide"
            data-ocid="tool.saved_badge"
          >
            ✓ SAVED TO DASHBOARD
          </span>
        ) : showSave ? (
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-accent/50 bg-accent/10 text-accent text-xs font-mono font-bold tracking-wide hover:bg-accent/20 transition-colors duration-200"
            data-ocid="tool.save_button"
          >
            SAVE RESULT
          </button>
        ) : null}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}

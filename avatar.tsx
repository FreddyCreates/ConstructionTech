import type { ScopeItem } from "@/backend";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

type GapFlag = {
  severity: "critical" | "warning" | "info";
  message: string;
  division?: string;
};

function analyzeScope(items: ScopeItem[]): GapFlag[] {
  const flags: GapFlag[] = [];
  if (items.length === 0) {
    flags.push({
      severity: "critical",
      message: "No scope items — handoff package cannot be generated",
    });
    return flags;
  }
  const divs = new Set(items.map((i) => i.csiDivision?.slice(0, 2) ?? ""));
  const emptyDesc = items.filter((i) => !i.description?.trim());
  const unassigned = items.filter((i) => !i.tradeGroup?.trim());
  const total = items.reduce(
    (s, i) => s + (i.estimatedCost ?? 0) * (i.quantity ?? 1),
    0,
  );

  if (!divs.has("01"))
    flags.push({
      severity: "info",
      division: "01",
      message:
        "No General Requirements (Div 01) — consider adding closeout requirements",
    });
  if (divs.has("09") && !divs.has("03"))
    flags.push({
      severity: "warning",
      division: "03",
      message: "Finishes present but no concrete/substrate scope specified",
    });
  if (emptyDesc.length > 0)
    flags.push({
      severity: "warning",
      message: `${emptyDesc.length} item${emptyDesc.length > 1 ? "s" : ""} missing descriptions`,
    });
  if (unassigned.length > 0)
    flags.push({
      severity: "warning",
      message: `${unassigned.length} item${unassigned.length > 1 ? "s" : ""} not assigned to a trade group`,
    });
  if (total === 0)
    flags.push({
      severity: "info",
      message: "No cost estimates — budget summary will show $0",
    });
  return flags;
}

const SEVERITY = {
  critical: {
    Icon: XCircle,
    cls: "border-destructive/30 bg-destructive/5 text-destructive",
  },
  warning: {
    Icon: AlertTriangle,
    cls: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
  },
  info: { Icon: Info, cls: "border-primary/20 bg-primary/5 text-primary" },
};

export default function ScopeValidationPanel({
  scopeItems,
  className = "",
}: { scopeItems: ScopeItem[]; className?: string }) {
  const flags = analyzeScope(scopeItems);
  const hasCritical = flags.some((f) => f.severity === "critical");
  const hasWarning = flags.some((f) => f.severity === "warning");
  const total = scopeItems.reduce(
    (s, i) => s + (i.estimatedCost ?? 0) * (i.quantity ?? 1),
    0,
  );
  const divs = [
    ...new Set(
      scopeItems.map((i) => i.csiDivision?.slice(0, 2)).filter(Boolean),
    ),
  ];

  return (
    <div
      data-ocid="scope_validation.panel"
      className={`rounded-xl border bg-card overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-muted/20">
        <div className="flex items-center gap-2">
          {hasCritical ? (
            <XCircle className="size-4 text-destructive" />
          ) : hasWarning ? (
            <AlertTriangle className="size-4 text-yellow-400" />
          ) : (
            <CheckCircle2 className="size-4 text-emerald-400" />
          )}
          <span className="font-medium text-foreground text-sm">
            Scope Validation
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{scopeItems.length} items</span>
          {divs.length > 0 && <span>{divs.length} divisions</span>}
          {total > 0 && <span>${total.toLocaleString()}</span>}
        </div>
      </div>

      {scopeItems.length > 0 && (
        <div className="max-h-44 overflow-y-auto border-b border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Description
                </th>
                <th className="px-3 py-2 text-left text-muted-foreground font-medium">
                  Trade
                </th>
                <th className="px-3 py-2 text-left text-muted-foreground font-medium">
                  Div
                </th>
                <th className="px-3 py-2 text-right text-muted-foreground font-medium">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {scopeItems.map((item) => (
                <tr
                  key={`${item.description}-${item.csiDivision}`}
                  className="border-t border-border/50"
                >
                  <td className="px-4 py-2 text-foreground truncate max-w-[160px]">
                    {item.description || (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {item.tradeGroup || "—"}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {item.csiDivision?.slice(0, 2) || "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-foreground">
                    {item.estimatedCost > 0
                      ? `$${(item.estimatedCost * item.quantity).toLocaleString()}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 space-y-2">
        {flags.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Scope looks complete — ready for handoff</span>
          </div>
        ) : (
          flags.map((flag, i) => {
            const { Icon, cls } = SEVERITY[flag.severity];
            return (
              <div
                key={`${flag.severity}-${flag.division ?? "general"}-${flag.message}`}
                data-ocid={`scope_validation.flag.${i + 1}`}
                className={`flex items-start gap-2 rounded-lg border p-3 text-xs ${cls}`}
              >
                <Icon className="size-3.5 shrink-0 mt-0.5" />
                <span>
                  {flag.division ? (
                    <>
                      <strong>Div {flag.division}:</strong>{" "}
                    </>
                  ) : null}
                  {flag.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

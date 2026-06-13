import type { Handoff } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetHandoffDeliveryStatus,
  useListHandoffs,
  useResendHandoffPackage,
} from "@/hooks/useHandoffs";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MailCheck,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: {
    label: "Draft",
    cls: "border-border text-muted-foreground bg-muted/30",
  },
  ready: {
    label: "Ready",
    cls: "border-primary/30 text-primary bg-primary/10",
  },
  sent: {
    label: "Sent",
    cls: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
  delivered: {
    label: "Delivered",
    cls: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
  failed: {
    label: "Failed",
    cls: "border-destructive/30 text-destructive bg-destructive/10",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS[status] ?? STATUS.draft;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function HandoffRow({ handoff, index }: { handoff: Handoff; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const resend = useResendHandoffPackage();
  const { data: delivery } = useGetHandoffDeliveryStatus(
    expanded ? handoff.id : null,
  );
  const createdDate = new Date(
    Number(handoff.createdAt) / 1_000_000,
  ).toLocaleDateString();
  const sentDate = handoff.sentAt
    ? new Date(Number(handoff.sentAt) / 1_000_000).toLocaleDateString()
    : null;

  return (
    <div
      data-ocid={`handoff_dashboard.item.${index + 1}`}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground text-sm truncate">
              {handoff.projectName}
            </p>
            <StatusBadge status={handoff.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>ID: {handoff.projectId}</span>
            <span>Created: {createdDate}</span>
            {sentDate && <span>Sent: {sentDate}</span>}
            <span>
              {handoff.recipientGroups.length} groups ·{" "}
              {handoff.scopeItems.length} items
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="size-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-2">
          {delivery ? (
            delivery.recipientGroups.map((group, idx) => (
              <div
                key={group.groupName}
                data-ocid={`handoff_dashboard.group.${idx + 1}`}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {group.groupName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={group.packageStatus} />
                    <span className="text-xs text-muted-foreground">
                      {group.emailAddresses.length} recipient
                      {group.emailAddresses.length !== 1 ? "s" : ""}
                    </span>
                    {group.sentAt && (
                      <span className="text-xs text-muted-foreground">
                        Sent{" "}
                        {new Date(
                          Number(group.sentAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </span>
                    )}
                    {group.deliveredAt && (
                      <span className="text-xs text-emerald-400">
                        Delivered{" "}
                        {new Date(
                          Number(group.deliveredAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {(group.packageStatus === "failed" ||
                  group.packageStatus === "sent") && (
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`handoff_dashboard.resend_button.${idx + 1}`}
                    onClick={() =>
                      resend.mutate({ handoffId: handoff.id, groupIndex: idx })
                    }
                    disabled={resend.isPending}
                    className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 ml-3 shrink-0"
                  >
                    <RefreshCw className="size-3.5" />
                    Resend
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HandoffDashboard() {
  const { data: handoffs = [], isLoading } = useListHandoffs();

  return (
    <div data-ocid="handoff_dashboard.panel" className="space-y-4">
      <div>
        <h3 className="font-display font-semibold text-foreground">
          Handoff Deliveries
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {handoffs.length} handoff{handoffs.length !== 1 ? "s" : ""} across all
          projects
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : handoffs.length === 0 ? (
        <div
          data-ocid="handoff_dashboard.empty_state"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 py-14"
        >
          <MailCheck className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No handoffs sent yet</p>
          <p className="text-xs text-muted-foreground/70">
            Complete a handoff package from a design project to see delivery
            tracking here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {handoffs.map((h, i) => (
            <HandoffRow key={h.id.toString()} handoff={h} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

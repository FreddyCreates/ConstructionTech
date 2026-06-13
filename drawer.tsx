import { Badge } from "@/components/ui/badge";
import { Check, Clock, FileEdit, X } from "lucide-react";
import type { DesignVersion } from "../../types/designIntelligence";
import ApprovalBadge from "./ApprovalBadge";

interface VersionTimelineProps {
  versions: DesignVersion[];
  currentVersion?: number;
  onSelectVersion?: (version: DesignVersion) => void;
  selectedVersionId?: string;
  className?: string;
}

function VersionDot({ status }: { status: DesignVersion["approvalStatus"] }) {
  const configs = {
    draft: {
      icon: FileEdit,
      className: "bg-amber-500/20 border-amber-500/50 text-amber-400",
    },
    submitted: {
      icon: Clock,
      className: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    },
    approved: {
      icon: Check,
      className: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
    },
    rejected: {
      icon: X,
      className: "bg-destructive/20 border-destructive/50 text-destructive",
    },
  };
  const conf = configs[status];
  const Icon = conf.icon;
  return (
    <div
      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${conf.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </div>
  );
}

export default function VersionTimeline({
  versions,
  currentVersion,
  onSelectVersion,
  selectedVersionId,
  className = "",
}: VersionTimelineProps) {
  if (versions.length === 0) {
    return (
      <div
        className={`rounded-xl border border-border/30 px-5 py-8 flex flex-col items-center gap-3 ${className}`}
        style={{ background: "oklch(0.15 0.01 240)" }}
        data-ocid="design.version_timeline.empty_state"
      >
        <div className="w-10 h-10 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-center">
          <Clock className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          No versions submitted yet
        </p>
        <p className="text-xs text-muted-foreground/60 text-center">
          Submit the current design to start the approval timeline
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-border/30 overflow-hidden ${className}`}
      style={{ background: "oklch(0.15 0.01 240)" }}
      data-ocid="design.version_timeline"
    >
      <div className="px-4 py-3 border-b border-border/20">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Version History
        </p>
        {currentVersion && (
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">
            Current: v{currentVersion}
          </p>
        )}
      </div>

      <div className="divide-y divide-border/15">
        {[...versions].reverse().map((version, idx) => {
          const isSelected = version.id === selectedVersionId;
          const date = new Date(version.submittedAt);
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: version timeline ordering
              key={idx}
              onClick={() => onSelectVersion?.(version)}
              className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors ${
                isSelected ? "bg-primary/10" : "hover:bg-muted/15"
              }`}
              data-ocid={`design.version_timeline.item.${versions.length - idx}`}
            >
              <div className="mt-0.5">
                <VersionDot status={version.approvalStatus} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    v{version.versionNumber}
                  </span>
                  <ApprovalBadge status={version.approvalStatus} size="sm" />
                  <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                    {dateStr}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {version.changesSummary}
                </p>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-muted-foreground/70">
                    by {version.submittedBy}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] border-border/30 text-muted-foreground/60 px-1 h-4"
                  >
                    Nexus {Math.round(version.nexusScore * 100)}%
                  </Badge>
                  {version.approvedBy && (
                    <span className="text-[10px] text-emerald-400">
                      ✓ {version.approvedBy}
                    </span>
                  )}
                  {version.rejectionReason && (
                    <span className="text-[10px] text-destructive truncate max-w-[140px]">
                      × {version.rejectionReason}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector line to next */}
              {idx < versions.length - 1 && (
                <div
                  className="absolute left-8 mt-8 w-px h-6"
                  style={{ background: "oklch(0.26 0.01 240)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

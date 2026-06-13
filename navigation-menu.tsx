import { Badge } from "@/components/ui/badge";
import { Check, Clock, FileEdit, X } from "lucide-react";
import type { DesignApprovalStatus } from "../../types/designIntelligence";

interface ApprovalBadgeProps {
  status: DesignApprovalStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  DesignApprovalStatus,
  { label: string; icon: typeof Check; tokenClass: string; badgeClass: string }
> = {
  draft: {
    label: "Draft",
    icon: FileEdit,
    tokenClass: "--approval-state-draft",
    badgeClass: "bg-amber-500/10 border-amber-500/40 text-amber-400",
  },
  submitted: {
    label: "Pending Review",
    icon: Clock,
    tokenClass: "--approval-state-pending",
    badgeClass: "bg-blue-500/10 border-blue-500/40 text-blue-400",
  },
  approved: {
    label: "Approved",
    icon: Check,
    tokenClass: "--approval-state-approved",
    badgeClass: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: X,
    tokenClass: "--approval-state-rejected",
    badgeClass: "bg-destructive/10 border-destructive/40 text-destructive",
  },
};

export default function ApprovalBadge({
  status,
  size = "md",
  showIcon = true,
  className = "",
}: ApprovalBadgeProps) {
  const conf = STATUS_CONFIG[status];
  const Icon = conf.icon;

  const sizeClasses = {
    sm: "text-[9px] px-1.5 h-4",
    md: "text-[11px] px-2 h-5",
    lg: "text-xs px-2.5 h-6",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  };

  return (
    <Badge
      variant="outline"
      className={`font-semibold gap-1 flex-shrink-0 ${conf.badgeClass} ${sizeClasses[size]} ${className}`}
      data-ocid={`design.approval_badge.${status}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {conf.label}
    </Badge>
  );
}

/**
 * Full-width approval status card for form/panel headers.
 */
export function ApprovalStatusCard({
  status,
  lastUpdated,
  approvedBy,
  rejectionReason,
}: {
  status: DesignApprovalStatus;
  lastUpdated?: number;
  approvedBy?: string;
  rejectionReason?: string;
}) {
  const conf = STATUS_CONFIG[status];
  const Icon = conf.icon;
  const dateStr = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`rounded-xl border px-4 py-3.5 flex items-center gap-3 ${conf.badgeClass}`}
      data-ocid={`design.approval_status_card.${status}`}
    >
      <div
        className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${conf.badgeClass}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{conf.label}</p>
        {dateStr && <p className="text-[11px] opacity-70 mt-0.5">{dateStr}</p>}
        {approvedBy && status === "approved" && (
          <p className="text-[11px] opacity-70">Approved by {approvedBy}</p>
        )}
        {rejectionReason && status === "rejected" && (
          <p className="text-[11px] opacity-70 truncate">
            Reason: {rejectionReason}
          </p>
        )}
      </div>
    </div>
  );
}

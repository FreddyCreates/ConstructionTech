import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const STEPS = [
  { label: "Scope", path: "/ai-tools/scope-estimator" },
  { label: "Cost", path: "/ai-tools/cost-estimator" },
  { label: "Labor", path: "/ai-tools/labor-hours" },
  { label: "Schedule", path: "/ai-tools/schedule-builder" },
  { label: "Change Order", path: "/ai-tools/change-order" },
];

interface Props {
  currentPath: string;
}

export function ToolWorkflowBreadcrumb({ currentPath }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.path === currentPath);

  return (
    <nav
      className="flex items-center gap-1 flex-wrap text-xs mb-6 p-3 rounded-lg bg-card border border-border/60"
      aria-label="Workflow steps"
      data-ocid="tool-workflow.breadcrumb"
    >
      {STEPS.map((step, i) => {
        const isActive = i === currentIdx;
        const isPast = i < currentIdx;
        return (
          <span key={step.path} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
            )}
            <Link
              to={step.path}
              data-ocid={`tool-workflow.step.${i + 1}`}
              className={[
                "px-2.5 py-1 rounded-md font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isPast
                    ? "text-accent hover:text-accent/80"
                    : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {step.label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}

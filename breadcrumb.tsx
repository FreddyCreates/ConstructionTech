/**
 * @fileoverview BuildSafe unified workspace sidebar — 6-hub navigation
 * @description Left sidebar with hub icons, active state, and PRO-1 trigger
 */

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Boxes,
  Building2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Hexagon,
  Palette,
  ShieldCheck,
} from "lucide-react";

/** @type {Array<{id: string, label: string, icon: React.ElementType, color: string, dataOcid: string}>} */
const HUBS = [
  {
    id: "safety",
    label: "Safety",
    icon: ShieldCheck,
    color: "text-emerald-400",
    dataOcid: "sidebar.safety_tab",
  },
  {
    id: "projects",
    label: "Projects",
    icon: Building2,
    color: "text-cyan-400",
    dataOcid: "sidebar.projects_tab",
  },
  {
    id: "financials",
    label: "Financials",
    icon: DollarSign,
    color: "text-yellow-400",
    dataOcid: "sidebar.financials_tab",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    color: "text-violet-400",
    dataOcid: "sidebar.documents_tab",
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    color: "text-pink-400",
    dataOcid: "sidebar.design_tab",
  },
  {
    id: "bidconnect",
    label: "BidConnect",
    icon: BarChart3,
    color: "text-orange-400",
    dataOcid: "sidebar.bidconnect_tab",
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: Boxes,
    color: "text-blue-400",
    dataOcid: "sidebar.workspace_tab",
  },
  {
    id: "colony",
    label: "Colony",
    icon: Hexagon,
    color: "text-indigo-400",
    dataOcid: "sidebar.colony_tab",
  },
];

/**
 * @param {{ activeHub: string, onHubChange: (hub: string) => void, collapsed: boolean, onToggle: () => void }} props
 */
export default function Sidebar({
  activeHub,
  onHubChange,
  collapsed,
  onToggle,
}) {
  return (
    <aside
      data-ocid="app.sidebar"
      className={cn(
        "relative flex flex-col border-r border-border transition-all duration-300 ease-in-out",
        "bg-card",
        collapsed ? "w-16" : "w-56",
      )}
    >
      {/* Logo zone */}
      <div
        className={cn(
          "flex items-center border-b border-border h-14",
          collapsed ? "justify-center px-0" : "px-4 gap-3",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <ShieldCheck className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display text-sm font-bold tracking-tight text-foreground">
            BuildSafe
          </span>
        )}
      </div>

      {/* Hub navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {HUBS.map((hub) => {
          const Icon = hub.icon;
          const isActive = activeHub === hub.id;
          return (
            <button
              key={hub.id}
              type="button"
              data-ocid={hub.dataOcid}
              onClick={() => onHubChange(hub.id)}
              title={hub.label}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/15 text-primary shadow-inner"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : hub.color,
                )}
              />
              {!collapsed && (
                <span className="truncate text-xs tracking-wide">
                  {hub.label}
                </span>
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-3 hidden rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg group-hover:block z-50 whitespace-nowrap border border-border">
                  {hub.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          type="button"
          data-ocid="sidebar.collapse_toggle"
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}

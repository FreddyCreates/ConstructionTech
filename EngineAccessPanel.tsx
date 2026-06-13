/**
 * @fileoverview BuildSafe hub dashboards — per-hub KPI cards, activity feeds, quick actions
 * @description Renders the correct dashboard for the selected hub
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Box,
  Building2,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  FileCheck,
  FileText,
  Gavel,
  HardHat,
  Layers,
  Palette,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

/**
 * @param {{ label: string, value: string|number, delta?: string, trend?: 'up'|'down'|'neutral', icon: React.ElementType, color: string, ocid: string }} props
 */
function KpiCard({ label, value, delta, trend, icon: Icon, color, ocid }) {
  return (
    <Card
      data-ocid={ocid}
      className="relative overflow-hidden border-border bg-card"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold font-display text-foreground">
              {value}
            </p>
            {delta && (
              <p
                className={cn(
                  "mt-1 flex items-center gap-1 text-xs font-medium",
                  trend === "up"
                    ? "text-emerald-400"
                    : trend === "down"
                      ? "text-red-400"
                      : "text-muted-foreground",
                )}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : trend === "down" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                {delta}
              </p>
            )}
          </div>
          <div className={cn("rounded-lg p-2", color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </CardContent>
    </Card>
  );
}

/**
 * @param {{ items: Array<{id: string, text: string, time: string, type: 'info'|'warning'|'success'|'action'}> }} props
 */
function ActivityFeed({ items }) {
  const typeConfig = {
    info: { color: "bg-cyan-400", icon: Bell },
    warning: { color: "bg-yellow-400", icon: AlertTriangle },
    success: { color: "bg-emerald-400", icon: CheckCircle2 },
    action: { color: "bg-primary", icon: Zap },
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const cfg = typeConfig[item.type] ?? typeConfig.info;
        const Icon = cfg.icon;
        return (
          <div
            key={item.id}
            data-ocid={`activity.item.${i + 1}`}
            className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/30 transition-colors"
          >
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                cfg.color,
                "bg-opacity-20",
              )}
            >
              <Icon
                className={cn("h-3 w-3", cfg.color.replace("bg-", "text-"))}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground leading-snug">
                {item.text}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {item.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {{ actions: Array<{label: string, icon: React.ElementType, href?: string, onClick?: () => void, ocid: string, variant?: string}> }} props
 */
function QuickActions({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.label}
            data-ocid={action.ocid}
            variant={action.variant ?? "outline"}
            size="sm"
            className="justify-start gap-2 h-9 text-xs"
            onClick={action.onClick}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hub definitions
// ---------------------------------------------------------------------------

/** @returns {JSX.Element} */
function SafetyHub() {
  const kpis = [
    {
      label: "JSAs Completed Today",
      value: 14,
      delta: "+3 vs yesterday",
      trend: "up",
      icon: ClipboardList,
      color: "bg-emerald-400/10 text-emerald-400",
      ocid: "safety.kpi.jsa_count",
    },
    {
      label: "Open Hazards",
      value: 3,
      delta: "2 high priority",
      trend: "down",
      icon: AlertTriangle,
      color: "bg-red-400/10 text-red-400",
      ocid: "safety.kpi.open_hazards",
    },
    {
      label: "Incident Reports (MTD)",
      value: 0,
      delta: "42-day streak",
      trend: "up",
      icon: FileCheck,
      color: "bg-cyan-400/10 text-cyan-400",
      ocid: "safety.kpi.incidents",
    },
    {
      label: "Safety Score",
      value: "94.2",
      delta: "+1.8 pts this week",
      trend: "up",
      icon: ShieldCheck,
      color: "bg-primary/10 text-primary",
      ocid: "safety.kpi.score",
    },
  ];
  const activities = [
    {
      id: "a1",
      text: "JSA #TK-0847 completed by M. Torres — Steel Erection, Level 4",
      time: "8 min ago",
      type: "success",
    },
    {
      id: "a2",
      text: "Hazard flagged: Fall risk at Grid Line C-4, corrective action assigned",
      time: "22 min ago",
      type: "warning",
    },
    {
      id: "a3",
      text: "Toolbox Talk session recorded — 23 attendees, OSHA 1926.503",
      time: "1 hr ago",
      type: "action",
    },
    {
      id: "a4",
      text: "Safety audit passed: Metro Commercial Builders Subcontractor Verification",
      time: "2 hrs ago",
      type: "success",
    },
    {
      id: "a5",
      text: "OSHA compliance cert issued for scaffold inspection",
      time: "3 hrs ago",
      type: "info",
    },
  ];
  const actions = [
    {
      label: "Generate JSA",
      icon: ClipboardList,
      href: "/safety/jsa-generator",
      ocid: "safety.action.generate_jsa",
    },
    {
      label: "Log Hazard",
      icon: AlertTriangle,
      href: "/safety/hazard-assessment",
      ocid: "safety.action.log_hazard",
    },
    {
      label: "Toolbox Talk",
      icon: HardHat,
      href: "/safety/toolbox-session",
      ocid: "safety.action.toolbox_talk",
    },
    {
      label: "Safety Report",
      icon: FileText,
      href: "/safety/report-builder",
      ocid: "safety.action.safety_report",
    },
  ];
  return (
    <HubLayout
      kpis={kpis}
      activities={activities}
      actions={actions}
      hubColor="text-emerald-400"
      hubLabel="Safety Suite"
      hubIcon={ShieldCheck}
    />
  );
}

/** @returns {JSX.Element} */
function ProjectsHub() {
  const kpis = [
    {
      label: "Active Projects",
      value: 7,
      delta: "3 in preconstruction",
      trend: "neutral",
      icon: Building2,
      color: "bg-cyan-400/10 text-cyan-400",
      ocid: "projects.kpi.active",
    },
    {
      label: "RFIs Open",
      value: 12,
      delta: "4 critical, need response",
      trend: "down",
      icon: RefreshCw,
      color: "bg-yellow-400/10 text-yellow-400",
      ocid: "projects.kpi.rfis",
    },
    {
      label: "Change Orders",
      value: 8,
      delta: "$284K total pending",
      trend: "neutral",
      icon: FileCheck,
      color: "bg-orange-400/10 text-orange-400",
      ocid: "projects.kpi.change_orders",
    },
    {
      label: "Schedule Health",
      value: "87%",
      delta: "+2% this sprint",
      trend: "up",
      icon: BarChart3,
      color: "bg-primary/10 text-primary",
      ocid: "projects.kpi.schedule",
    },
  ];
  const activities = [
    {
      id: "p1",
      text: "RFI #0091 closed — JE Dunn HQ Expansion, Structural Steel",
      time: "14 min ago",
      type: "success",
    },
    {
      id: "p2",
      text: "Change Order CO-027 submitted: $42,800 MEP scope addition",
      time: "1 hr ago",
      type: "action",
    },
    {
      id: "p3",
      text: "Daily log uploaded — Nunn St. Francis Med Center, Day 47",
      time: "2 hrs ago",
      type: "info",
    },
    {
      id: "p4",
      text: "Punch list updated — 14 items closed, 3 new items added",
      time: "3 hrs ago",
      type: "info",
    },
    {
      id: "p5",
      text: "Schedule alert: Mechanical framing 3 days behind critical path",
      time: "4 hrs ago",
      type: "warning",
    },
  ];
  const actions = [
    { label: "New RFI", icon: RefreshCw, ocid: "projects.action.new_rfi" },
    {
      label: "Daily Log",
      icon: ClipboardList,
      ocid: "projects.action.daily_log",
    },
    {
      label: "Change Order",
      icon: FileText,
      ocid: "projects.action.change_order",
    },
    {
      label: "Punch List",
      icon: CheckCircle2,
      ocid: "projects.action.punch_list",
    },
  ];
  return (
    <HubLayout
      kpis={kpis}
      activities={activities}
      actions={actions}
      hubColor="text-cyan-400"
      hubLabel="Project Workspace"
      hubIcon={Building2}
    />
  );
}

/** @returns {JSX.Element} */
function FinancialsHub() {
  const kpis = [
    {
      label: "Pay Apps Pending",
      value: 4,
      delta: "$1.2M total outstanding",
      trend: "neutral",
      icon: DollarSign,
      color: "bg-yellow-400/10 text-yellow-400",
      ocid: "financials.kpi.pay_apps",
    },
    {
      label: "Cash Flow (MTD)",
      value: "$847K",
      delta: "+$112K vs forecast",
      trend: "up",
      icon: TrendingUp,
      color: "bg-emerald-400/10 text-emerald-400",
      ocid: "financials.kpi.cash_flow",
    },
    {
      label: "EAC Variance",
      value: "-1.4%",
      delta: "Within tolerance",
      trend: "up",
      icon: BarChart3,
      color: "bg-primary/10 text-primary",
      ocid: "financials.kpi.eac",
    },
    {
      label: "Lien Waivers Due",
      value: 6,
      delta: "2 conditional, 4 unconditional",
      trend: "neutral",
      icon: Gavel,
      color: "bg-orange-400/10 text-orange-400",
      ocid: "financials.kpi.liens",
    },
  ];
  const activities = [
    {
      id: "f1",
      text: "Pay App G702 #14 approved — JE Dunn Corporate Campus, $312,500",
      time: "30 min ago",
      type: "success",
    },
    {
      id: "f2",
      text: "Lien waiver request sent to 3 subs — final payment period",
      time: "2 hrs ago",
      type: "action",
    },
    {
      id: "f3",
      text: "EAC alert: Electrical scope trending $18K over budget",
      time: "3 hrs ago",
      type: "warning",
    },
    {
      id: "f4",
      text: "Cash flow projection updated — Q3 forecast revised upward",
      time: "5 hrs ago",
      type: "info",
    },
  ];
  const actions = [
    { label: "Pay App", icon: DollarSign, ocid: "financials.action.pay_app" },
    {
      label: "Lien Waiver",
      icon: Gavel,
      ocid: "financials.action.lien_waiver",
    },
    {
      label: "EAC Report",
      icon: BarChart3,
      ocid: "financials.action.eac_report",
    },
    {
      label: "Cash Flow",
      icon: TrendingUp,
      ocid: "financials.action.cash_flow",
    },
  ];
  return (
    <HubLayout
      kpis={kpis}
      activities={activities}
      actions={actions}
      hubColor="text-yellow-400"
      hubLabel="Financial Intelligence"
      hubIcon={DollarSign}
    />
  );
}

/** @returns {JSX.Element} */
function DocumentsHub() {
  const kpis = [
    {
      label: "Recent Documents",
      value: 23,
      delta: "8 generated today",
      trend: "up",
      icon: FileText,
      color: "bg-violet-400/10 text-violet-400",
      ocid: "documents.kpi.recent",
    },
    {
      label: "Templates Active",
      value: 47,
      delta: "AIA, CSI, OSHA included",
      trend: "neutral",
      icon: BookOpen,
      color: "bg-primary/10 text-primary",
      ocid: "documents.kpi.templates",
    },
    {
      label: "Generation Queue",
      value: 2,
      delta: "Processing now",
      trend: "neutral",
      icon: RefreshCw,
      color: "bg-cyan-400/10 text-cyan-400",
      ocid: "documents.kpi.queue",
    },
    {
      label: "Packages Ready",
      value: 5,
      delta: "Ready for distribution",
      trend: "up",
      icon: Box,
      color: "bg-emerald-400/10 text-emerald-400",
      ocid: "documents.kpi.packages",
    },
  ];
  const activities = [
    {
      id: "d1",
      text: "AIA G702 Pay App generated — 12-page package, Nunn Healthcare",
      time: "10 min ago",
      type: "success",
    },
    {
      id: "d2",
      text: "OSHA 300 log updated with Q2 injury/illness records",
      time: "1 hr ago",
      type: "info",
    },
    {
      id: "d3",
      text: "CSI submittal package compiled — Div 03, Concrete, 34 pages",
      time: "2 hrs ago",
      type: "action",
    },
    {
      id: "d4",
      text: "Subcontractor prequalification packet distributed to 6 vendors",
      time: "4 hrs ago",
      type: "info",
    },
  ];
  const actions = [
    {
      label: "Generate Doc",
      icon: FileText,
      ocid: "documents.action.generate",
    },
    { label: "Templates", icon: BookOpen, ocid: "documents.action.templates" },
    { label: "AIA G702", icon: DollarSign, ocid: "documents.action.aia_g702" },
    {
      label: "OSHA Form",
      icon: ShieldCheck,
      ocid: "documents.action.osha_form",
    },
  ];
  return (
    <HubLayout
      kpis={kpis}
      activities={activities}
      actions={actions}
      hubColor="text-violet-400"
      hubLabel="Document Suite"
      hubIcon={FileText}
    />
  );
}

/** @returns {JSX.Element} */
function DesignHub() {
  const kpis = [
    {
      label: "Active Designs",
      value: 5,
      delta: "2 in review",
      trend: "neutral",
      icon: Palette,
      color: "bg-pink-400/10 text-pink-400",
      ocid: "design.kpi.active",
    },
    {
      label: "3D Scenes",
      value: 12,
      delta: "3 renders queued",
      trend: "up",
      icon: Layers,
      color: "bg-primary/10 text-primary",
      ocid: "design.kpi.scenes",
    },
    {
      label: "Collaborators",
      value: 8,
      delta: "3 pending review",
      trend: "neutral",
      icon: Users,
      color: "bg-cyan-400/10 text-cyan-400",
      ocid: "design.kpi.collaborators",
    },
    {
      label: "Handoff Packages",
      value: 3,
      delta: "Ready for GC",
      trend: "up",
      icon: Box,
      color: "bg-emerald-400/10 text-emerald-400",
      ocid: "design.kpi.handoffs",
    },
  ];
  const activities = [
    {
      id: "des1",
      text: "3D render complete — JE Dunn Executive Lobby, FF&E plan v3",
      time: "25 min ago",
      type: "success",
    },
    {
      id: "des2",
      text: "Design review comment: Furniture layout conflicts with ADA path",
      time: "1 hr ago",
      type: "warning",
    },
    {
      id: "des3",
      text: "Handoff package generated — Healthcare Suite 240, 18 pages",
      time: "3 hrs ago",
      type: "action",
    },
    {
      id: "des4",
      text: "Model library updated — 14 new Steelcase pieces imported",
      time: "5 hrs ago",
      type: "info",
    },
  ];
  const actions = [
    { label: "New Scene", icon: Layers, ocid: "design.action.new_scene" },
    { label: "Model Library", icon: Box, ocid: "design.action.model_library" },
    { label: "Collaborate", icon: Users, ocid: "design.action.collaborate" },
    { label: "Handoff Pkg", icon: FileText, ocid: "design.action.handoff" },
  ];
  return (
    <HubLayout
      kpis={kpis}
      activities={activities}
      actions={actions}
      hubColor="text-pink-400"
      hubLabel="Design Intelligence"
      hubIcon={Palette}
    />
  );
}

/** @returns {JSX.Element} */
function BidConnectHub() {
  const kpis = [
    {
      label: "Active Bids",
      value: 9,
      delta: "3 due this week",
      trend: "neutral",
      icon: BarChart3,
      color: "bg-orange-400/10 text-orange-400",
      ocid: "bidconnect.kpi.active_bids",
    },
    {
      label: "RFQs Sent",
      value: 24,
      delta: "11 responses received",
      trend: "up",
      icon: RefreshCw,
      color: "bg-primary/10 text-primary",
      ocid: "bidconnect.kpi.rfqs",
    },
    {
      label: "Proposals",
      value: 5,
      delta: "$4.2M total value",
      trend: "up",
      icon: FileText,
      color: "bg-cyan-400/10 text-cyan-400",
      ocid: "bidconnect.kpi.proposals",
    },
    {
      label: "Awards (QTD)",
      value: 3,
      delta: "$1.8M awarded",
      trend: "up",
      icon: Gavel,
      color: "bg-emerald-400/10 text-emerald-400",
      ocid: "bidconnect.kpi.awards",
    },
  ];
  const activities = [
    {
      id: "b1",
      text: "Bid leveling complete — JE Dunn Shell & Core, 14 subs compared",
      time: "45 min ago",
      type: "success",
    },
    {
      id: "b2",
      text: "Go/No-Go scored 87/100 — Colorado Springs Civic Center Reno",
      time: "2 hrs ago",
      type: "action",
    },
    {
      id: "b3",
      text: "Sub invite sent to 8 qualified vendors — Electrical scope",
      time: "3 hrs ago",
      type: "info",
    },
    {
      id: "b4",
      text: "Award letter generated: Nunn Plumbing Sub — $284,000",
      time: "5 hrs ago",
      type: "success",
    },
  ];
  const actions = [
    { label: "New Bid", icon: BarChart3, ocid: "bidconnect.action.new_bid" },
    {
      label: "Go/No-Go",
      icon: CheckCircle2,
      ocid: "bidconnect.action.go_nogo",
    },
    {
      label: "Bid Leveling",
      icon: Layers,
      ocid: "bidconnect.action.bid_leveling",
    },
    { label: "Proposal", icon: FileText, ocid: "bidconnect.action.proposal" },
  ];
  return (
    <HubLayout
      kpis={kpis}
      activities={activities}
      actions={actions}
      hubColor="text-orange-400"
      hubLabel="BidConnect Suite"
      hubIcon={BarChart3}
    />
  );
}

// ---------------------------------------------------------------------------
// Hub layout wrapper
// ---------------------------------------------------------------------------

/**
 * @param {{ kpis: Array, activities: Array, actions: Array, hubColor: string, hubLabel: string, hubIcon: React.ElementType }} props
 */
function HubLayout({ kpis, activities, actions, hubLabel }) {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.ocid} {...kpi} />
        ))}
      </div>

      {/* Activity + Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Activity feed */}
        <Card
          data-ocid="hub.activity_feed"
          className="lg:col-span-2 border-border bg-card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Real-Time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={activities} />
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card data-ocid="hub.quick_actions" className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions actions={actions} />
            <div className="mt-4 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                data-ocid="hub.view_all_button"
                className="w-full justify-between text-xs text-primary hover:text-primary"
              >
                View all {hubLabel} tools
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AI status ticker
// ---------------------------------------------------------------------------

const AI_TICKS = [
  "VHDE scanning 3 active jobsites — 0 critical anomalies detected",
  "FIE: Cash flow projection updated — Q3 outlook positive",
  "DGE queue: 2 documents processing",
  "SCIE: Safety culture score trending up across all JE Dunn subs",
  "PSIE: Material lead time alert — Structural Steel +14 days",
  "Nexus synthesis complete — 7 engines in consensus",
];

/** @returns {JSX.Element} */
function AiStatusTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef(null);

  const advance = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % AI_TICKS.length);
      setVisible(true);
    }, 300);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(advance, 4000);
    return () => clearInterval(intervalRef.current);
  }, [advance]);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5">
      <div className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
      <p
        className={cn(
          "text-[11px] text-primary transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        PRO-1 · {AI_TICKS[idx]}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * @param {{ hub: string }} props
 * @returns {JSX.Element}
 */
export default function HubDashboard({ hub }) {
  const hubs = {
    safety: SafetyHub,
    projects: ProjectsHub,
    financials: FinancialsHub,
    documents: DocumentsHub,
    design: DesignHub,
    bidconnect: BidConnectHub,
  };
  const ActiveHub = hubs[hub] ?? SafetyHub;

  return (
    <div className="flex flex-col gap-4">
      <AiStatusTicker />
      <ActiveHub />
    </div>
  );
}

export { AiStatusTicker };

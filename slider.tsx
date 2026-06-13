import { useTenant } from "@/contexts/TenantContext";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  DollarSign,
  FileText,
  Folder,
  LayoutDashboard,
  Palette,
  Search,
  Settings,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Command Center",
    icon: LayoutDashboard,
    path: "/workspace/command-center",
  },
  { label: "Projects", icon: Folder, path: "/workspace/projects" },
  { label: "Safety Intelligence", icon: Shield, path: "/safety" },
  { label: "Bid Intelligence", icon: TrendingUp, path: "/bidconnect" },
  { label: "Financial Intelligence", icon: DollarSign, path: "/financials" },
  { label: "Document Center", icon: FileText, path: "/documents" },
  { label: "Design Studio", icon: Palette, path: "/design-intelligence" },
  { label: "Settings", icon: Settings, path: "/account" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { currentTenant, activeRole, switchRole, userTenants, switchTenant } =
    useTenant();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const tenantName = currentTenant?.name ?? "No Tenant";
  const roleLabel = activeRole ?? "Guest";
  const initials = getInitials(tenantName);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-[180px] border-r border-slate-800 bg-slate-900 transition-transform md:static md:translate-x-0`}
      >
        <div className="flex h-16 items-center border-b border-slate-800 px-4">
          <span className="text-sm font-bold tracking-wide text-white">
            OIS
          </span>
        </div>
        <nav className="mt-4 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-construction-primary/20 text-construction-primary"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
                data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              >
                <Icon size={20} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              setMobileOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close mobile menu"
        />
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded p-1 text-slate-400 hover:bg-slate-800 md:hidden"
              onClick={() => setMobileOpen(true)}
              data-ocid="nav.mobile_menu.button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 className="text-sm font-semibold text-white md:text-base">
              OIS Command Center
            </h1>
          </div>

          <div className="hidden items-center md:flex">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, documents, safety tags..."
                className="w-96 rounded-lg border border-slate-700 bg-slate-800 py-1.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-construction-primary focus:ring-1 focus:ring-construction-primary"
                data-ocid="global.search_input"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tenant switcher */}
            {userTenants.length > 1 && (
              <select
                value={currentTenant?.id ?? ""}
                onChange={(e) => switchTenant(e.target.value)}
                className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 outline-none"
                data-ocid="tenant.switcher.select"
              >
                {userTenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}

            {/* Role switcher */}
            <select
              value={roleLabel}
              onChange={(e) => switchRole(e.target.value as any)}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300 outline-none"
              data-ocid="role.switcher.select"
            >
              {[
                "Owner",
                "GC",
                "PM",
                "SafetyOfficer",
                "Designer",
                "Sub",
                "Client",
              ].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Notifications */}
            <button
              type="button"
              className="relative rounded p-1.5 text-slate-400 hover:bg-slate-800"
              data-ocid="notifications.open_button"
            >
              <Bell size={18} />
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-construction-primary text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-slate-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

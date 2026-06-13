import { Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import ConstructionAiDrawer from "./ConstructionAiDrawer";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header aiOpen={aiOpen} onAiToggle={() => setAiOpen((v) => !v)} />
      <div className="bg-accent text-accent-foreground">
        <div className="container py-1.5 px-4 flex items-center justify-between">
          <p className="text-xs font-medium">
            AI-Powered Tools for Construction Professionals — Try Free
          </p>
          <Link
            to="/ai-platform"
            className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            data-ocid="layout.ai_banner_link"
          >
            Explore AI Tools →
          </Link>
        </div>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ConstructionAiDrawer isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

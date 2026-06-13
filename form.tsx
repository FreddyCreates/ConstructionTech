/**
 * @fileoverview HeroSection — BuildSafe landing hero with animated tagline,
 * stats strip, and glowing blueprint background image.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      data-ocid="hero.section"
      className="relative min-h-[88vh] flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-buildsafe.dim_1600x700.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        {/* Cyan grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.75 0.22 195 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.22 195 / 1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          {/* PRO-1 badge */}
          <Badge
            data-ocid="hero.pro1_badge"
            className="mb-6 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 text-primary px-3 py-1.5 text-xs font-semibold tracking-wide uppercase"
          >
            <Zap className="h-3 w-3" />
            PRO-1 — Powered by 7 Native Engines + Groq
          </Badge>

          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            BuildSafe
            <br />
            <span
              className="text-primary"
              style={{ textShadow: "0 0 40px oklch(0.75 0.22 195 / 0.4)" }}
            >
              Construction Intelligence Platform
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Intelligence for every professional who builds. Safety scoring,
            project control, bid management, and financial intelligence — all in
            one sovereign platform that runs on real data.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              data-ocid="hero.enter_platform_button"
              className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <Link to="/app">
                Enter Platform <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              data-ocid="hero.explore_safety_button"
              className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Link to="/safety">
                <ShieldCheck className="h-4 w-4" />
                Explore Safety Suite
              </Link>
            </Button>
          </div>

          {/* Trust stats */}
          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { value: "20+", label: "Protocols Encoded" },
              { value: "7", label: "Native AI Engines" },
              { value: "Free", label: "All Tools, Always" },
            ].map((stat) => (
              <div
                key={stat.label}
                data-ocid={`hero.stat.${stat.label.toLowerCase().replace(/\s+/g, "_")}`}
              >
                <div className="font-display text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating corner accent */}
      <div className="absolute bottom-0 right-0 hidden lg:block w-72 h-72 opacity-20">
        <Building2 className="w-full h-full text-primary" strokeWidth={0.5} />
      </div>
    </section>
  );
}

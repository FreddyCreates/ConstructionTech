/**
 * @fileoverview SuiteCard — reusable card for BuildSafe suite landing sections.
 * Shows icon, title, description, free tools list, and a CTA link.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * @typedef {Object} SuiteCardProps
 * @property {import("lucide-react").LucideIcon} icon - Suite icon component
 * @property {string} title - Suite name
 * @property {string} description - Short value proposition
 * @property {string[]} freeTools - List of free tool names
 * @property {string} to - Route path
 * @property {string} [accentColor] - Tailwind color class for icon bg
 * @property {string} [dataOcid] - Data-ocid value
 * @property {boolean} [featured] - Renders with elevated glow border
 */

/**
 * @param {SuiteCardProps} props
 */
export default function SuiteCard({
  icon: Icon,
  title,
  description,
  freeTools,
  to,
  accentColor = "text-primary",
  dataOcid,
  featured = false,
}) {
  return (
    <Card
      data-ocid={dataOcid}
      className={[
        "group relative flex flex-col overflow-hidden border transition-all duration-300",
        "bg-card hover:-translate-y-1 hover:shadow-xl",
        featured
          ? "border-primary/50 shadow-lg shadow-primary/10"
          : "border-border hover:border-primary/30",
      ].join(" ")}
    >
      {featured && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div
            className={[
              "flex h-12 w-12 items-center justify-center rounded-lg",
              "bg-primary/10 transition-colors group-hover:bg-primary/20",
            ].join(" ")}
          >
            <Icon className={`h-6 w-6 ${accentColor}`} />
          </div>
          <Badge
            variant="secondary"
            className="shrink-0 bg-secondary/80 text-xs text-muted-foreground"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            Free Tools
          </Badge>
        </div>

        <div className="mt-4">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        {/* Free tools list */}
        <ul className="space-y-1.5">
          {freeTools.map((tool) => (
            <li
              key={tool}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-primary flex-shrink-0" />
              {tool}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-between px-3 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link to={to}>
              Explore Suite
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

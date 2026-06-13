import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { DESIGN_STYLES } from "../../data/designIntelligenceData";
import type { DesignStyle } from "../../types/designIntelligence";

const STYLE_META: Record<DesignStyle, { emoji: string; description: string }> =
  {
    Modern: {
      emoji: "◼",
      description: "Clean lines, minimal decoration, functional forms",
    },
    Minimalist: {
      emoji: "▫",
      description: "Less is more — neutral palette, open space, pure forms",
    },
    Scandinavian: {
      emoji: "❄",
      description: "Light woods, hygge warmth, natural textures",
    },
    Industrial: {
      emoji: "⚙",
      description: "Exposed materials, raw steel, distressed finishes",
    },
    Luxury: {
      emoji: "◆",
      description: "Premium materials, rich textures, statement pieces",
    },
    Transitional: {
      emoji: "↔",
      description: "Bridge of classic and contemporary, timeless appeal",
    },
    Contemporary: {
      emoji: "○",
      description: "Current trends, mixed materials, bold accents",
    },
    "Art Deco": {
      emoji: "✦",
      description: "Geometric glamour, brass accents, rich contrasts",
    },
    Biophilic: {
      emoji: "🌿",
      description: "Nature-inspired, living walls, organic forms",
    },
    Hospitality: {
      emoji: "🏨",
      description: "Brand-standard comfort, durable luxury finishes",
    },
  };

interface StyleSelectorProps {
  value?: DesignStyle;
  onChange: (style: DesignStyle) => void;
  label?: string;
  className?: string;
}

export default function StyleSelector({
  value,
  onChange,
  label = "Design Style",
  className = "",
}: StyleSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? STYLE_META[value] : null;

  return (
    <div className={`relative ${className}`} data-ocid="design.style_selector">
      {label && (
        <p className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
          {label}
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5 text-sm transition-colors hover:border-border/60 hover:bg-muted/20"
        data-ocid="design.style_selector.toggle"
      >
        {value && selected ? (
          <span className="flex items-center gap-2">
            <span className="text-base">{selected.emoji}</span>
            <span className="text-foreground font-medium">{value}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">Select a style…</span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 rounded-xl border border-border/40 overflow-hidden shadow-2xl"
          style={{ background: "oklch(0.16 0.01 240)" }}
        >
          {DESIGN_STYLES.map((style) => {
            const meta = STYLE_META[style];
            const isSelected = value === style;
            return (
              <button
                type="button"
                key={style}
                onClick={() => {
                  onChange(style);
                  setOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/15 border-l-2 border-primary"
                    : "hover:bg-muted/20 border-l-2 border-transparent"
                }`}
                data-ocid={`design.style_selector.option.${style.toLowerCase().replace(/\s/g, "-")}`}
              >
                <span className="text-base mt-0.5">{meta.emoji}</span>
                <div className="min-w-0">
                  <p
                    className={`font-medium leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}
                  >
                    {style}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {meta.description}
                  </p>
                </div>
                {isSelected && (
                  <Badge
                    variant="outline"
                    className="ml-auto flex-shrink-0 text-[9px] border-primary/40 text-primary"
                  >
                    Active
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

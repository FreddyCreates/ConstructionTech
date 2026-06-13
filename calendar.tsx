import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Tag } from "lucide-react";
import type { FurnitureModel } from "../../types/designIntelligence";
import ModelViewer from "./ModelViewer";

interface FurnitureCardProps {
  model: FurnitureModel;
  onSelect?: (model: FurnitureModel) => void;
  onAddToCanvas?: (model: FurnitureModel) => void;
  selected?: boolean;
  compact?: boolean;
  index?: number;
}

export default function FurnitureCard({
  model,
  onSelect,
  onAddToCanvas,
  selected = false,
  compact = false,
  index = 0,
}: FurnitureCardProps) {
  const priceLabel =
    model.priceRangeLow >= 1000
      ? `$${(model.priceRangeLow / 1000).toFixed(0)}k–$${(model.priceRangeHigh / 1000).toFixed(0)}k`
      : `$${model.priceRangeLow}–$${model.priceRangeHigh}`;

  if (compact) {
    return (
      <button
        type="button"
        className={`w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer flex items-center gap-3 ${
          selected
            ? "border-primary/60 bg-primary/10"
            : "border-border/30 bg-muted/10 hover:border-border/60 hover:bg-muted/20"
        }`}
        onClick={() => onSelect?.(model)}
        data-ocid={`design.furniture_card.item.${index + 1}`}
      >
        <div
          className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center text-lg"
          style={{
            background: `${model.thumbnailColor.replace(")", " / 0.2)").replace("oklch(", "oklch(")}`,
          }}
        >
          <div
            className="w-5 h-5 rounded"
            style={{ background: model.thumbnailColor }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">
            {model.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {model.brand} · {model.category}
          </p>
        </div>
        <span className="text-xs text-accent font-mono flex-shrink-0">
          {priceLabel}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        selected
          ? "border-primary/60 shadow-[0_0_20px_oklch(0.65_0.16_245_/_0.2)]"
          : "border-border/30 hover:border-border/60"
      }`}
      style={{ background: "oklch(0.16 0.01 240)" }}
      data-ocid={`design.furniture_card.item.${index + 1}`}
    >
      <ModelViewer model={model} height={160} />

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {model.name}
            </h3>
            {model.sustainabilityCert && (
              <Badge
                variant="outline"
                className="text-[9px] border-emerald-500/40 text-emerald-400 flex-shrink-0"
              >
                <Star className="w-2.5 h-2.5 mr-1" />
                Eco
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{model.brand}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-[10px] border-border/40 text-muted-foreground"
          >
            {model.category}
          </Badge>
          {model.style.slice(0, 2).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="text-[10px] border-primary/30 text-primary/80"
            >
              {s}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-accent">
              <Tag className="w-3 h-3" />
              <span className="text-sm font-bold font-mono">{priceLabel}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Lead: {model.leadTimeWeeks}wk · CSI {model.csiCode}
            </p>
          </div>
          <div className="flex gap-1.5">
            {onSelect && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => onSelect(model)}
                data-ocid={`design.furniture_card.select_button.${index + 1}`}
              >
                Details
              </Button>
            )}
            {onAddToCanvas && (
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs px-2.5 bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
                onClick={() => onAddToCanvas(model)}
                data-ocid={`design.furniture_card.add_button.${index + 1}`}
              >
                + Add
              </Button>
            )}
          </div>
        </div>

        {model.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap pt-1 border-t border-border/20">
            {model.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono text-muted-foreground/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

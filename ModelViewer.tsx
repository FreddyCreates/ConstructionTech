import { Button } from "@/components/ui/button";
import { Move, RotateCcw, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { FURNITURE_MODELS } from "../../data/designIntelligenceData";
import type {
  FurnitureModel,
  PlacedFurnitureItem,
} from "../../types/designIntelligence";

interface DesignCanvasProps {
  items: PlacedFurnitureItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateItem: (id: string, patch: Partial<PlacedFurnitureItem>) => void;
  onRemoveItem: (id: string) => void;
  roomWidthFt?: number;
  roomLengthFt?: number;
  className?: string;
}

const PIXELS_PER_FT = 14;

function getModel(modelId: string): FurnitureModel | undefined {
  return FURNITURE_MODELS.find((m) => m.id === modelId);
}

export default function DesignCanvas({
  items,
  selectedId,
  onSelect,
  onUpdateItem,
  onRemoveItem,
  roomWidthFt = 20,
  roomLengthFt = 16,
  className = "",
}: DesignCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const dragging = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const canvasW = roomWidthFt * PIXELS_PER_FT;
  const canvasH = roomLengthFt * PIXELS_PER_FT;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      onSelect(id);
      const item = items.find((it) => it.instanceId === id);
      if (!item) return;
      dragging.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        origX: item.x,
        origY: item.y,
      };

      const onMove = (me: MouseEvent) => {
        if (!dragging.current) return;
        const dx = (me.clientX - dragging.current.startX) / zoom;
        const dy = (me.clientY - dragging.current.startY) / zoom;
        onUpdateItem(dragging.current.id, {
          x: Math.max(0, Math.min(canvasW - 40, dragging.current.origX + dx)),
          y: Math.max(0, Math.min(canvasH - 40, dragging.current.origY + dy)),
        });
      };
      const onUp = () => {
        dragging.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [items, onSelect, onUpdateItem, zoom, canvasW, canvasH],
  );

  const rotateSelected = () => {
    if (!selectedId) return;
    const item = items.find((it) => it.instanceId === selectedId);
    if (!item) return;
    onUpdateItem(selectedId, { rotation: (item.rotation + 45) % 360 });
  };

  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
      data-ocid="design.canvas"
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/30"
        style={{ background: "oklch(0.16 0.01 240)" }}
      >
        <div className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">
            {roomWidthFt}ft × {roomLengthFt}ft · {items.length} item
            {items.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            data-ocid="design.canvas.zoom_out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
            data-ocid="design.canvas.zoom_in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          {selectedId && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 ml-1"
                onClick={rotateSelected}
                data-ocid="design.canvas.rotate_button"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => onRemoveItem(selectedId)}
                data-ocid="design.canvas.delete_button"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        className="overflow-auto rounded-xl border border-border/30"
        style={{ maxHeight: 480 }}
      >
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: canvas interaction */}
        <div
          ref={canvasRef}
          className="relative select-none"
          style={{
            width: canvasW * zoom,
            height: canvasH * zoom,
            minWidth: canvasW * zoom,
            background: `
              linear-gradient(oklch(0.22 0.01 240 / 0.5) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.22 0.01 240 / 0.5) 1px, transparent 1px),
              oklch(0.13 0.01 240)
            `,
            backgroundSize: `${PIXELS_PER_FT * zoom}px ${PIXELS_PER_FT * zoom}px`,
          }}
          onClick={() => onSelect(null)}
        >
          {/* Room boundary */}
          <div
            className="absolute inset-1 rounded-sm border"
            style={{
              borderColor: "oklch(0.65 0.16 245 / 0.25)",
              boxShadow: "inset 0 0 20px oklch(0.65 0.16 245 / 0.04)",
            }}
          />

          {/* Placed items */}
          {items.map((item) => {
            const model = getModel(item.modelId);
            const isSelected = item.instanceId === selectedId;
            const w = model
              ? (model.dimensions.widthIn / 12) *
                PIXELS_PER_FT *
                item.scale *
                zoom
              : 40 * zoom;
            const d = model
              ? (model.dimensions.depthIn / 12) *
                PIXELS_PER_FT *
                item.scale *
                zoom
              : 40 * zoom;
            const color = model?.thumbnailColor ?? "oklch(0.5 0.04 240)";

            return (
              <div
                key={item.instanceId}
                className="absolute cursor-grab active:cursor-grabbing flex items-center justify-center transition-shadow"
                style={{
                  left: item.x * zoom,
                  top: item.y * zoom,
                  width: w,
                  height: d,
                  background: `${color.replace(")", " / 0.25)").replace("oklch(", "oklch(")})`,
                  border: `${isSelected ? 2 : 1}px solid ${isSelected ? color : `${color.replace(")", " / 0.4)").replace("oklch(", "oklch(")}`}`,
                  borderRadius: 4,
                  transform: `rotate(${item.rotation}deg)`,
                  boxShadow: isSelected
                    ? `0 0 12px ${color.replace(")", " / 0.4)").replace("oklch(", "oklch(")}`
                    : "none",
                  zIndex: isSelected ? 10 : 1,
                }}
                onMouseDown={(e) => handleMouseDown(e, item.instanceId)}
                data-ocid={`design.canvas.item.${item.instanceId}`}
              >
                <span
                  className="text-[8px] font-mono text-center leading-tight px-0.5 select-none"
                  style={{
                    color,
                    maxWidth: w - 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {model?.name.split(" ")[0] ?? "?"}
                </span>
              </div>
            );
          })}

          {/* Empty state */}
          {items.length === 0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              data-ocid="design.canvas.empty_state"
            >
              <span className="text-3xl opacity-20">🩹</span>
              <p className="text-xs text-muted-foreground font-mono opacity-50">
                Drop furniture to place
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected item inspector */}
      {selectedId &&
        (() => {
          const item = items.find((it) => it.instanceId === selectedId);
          const model = item ? getModel(item.modelId) : undefined;
          if (!item || !model) return null;
          return (
            <div
              className="rounded-lg border border-border/30 px-3 py-2 flex items-center gap-3"
              style={{ background: "oklch(0.16 0.01 240)" }}
            >
              <div
                className="w-6 h-6 rounded flex-shrink-0"
                style={{ background: model.thumbnailColor }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {model.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {model.dimensions.widthIn}W × {model.dimensions.depthIn}D · ∠
                  {item.rotation}°
                </p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/60">
                x{Math.round(item.x)} y{Math.round(item.y)}
              </span>
            </div>
          );
        })()}
    </div>
  );
}

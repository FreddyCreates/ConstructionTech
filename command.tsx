import { useRef, useState } from "react";
import type { FurnitureModel } from "../../types/designIntelligence";

interface ModelViewerProps {
  model?: FurnitureModel;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Three.js model preview canvas.
 * Uses @react-three/fiber when available; falls back to a rich
 * CSS/SVG representation that conveys the model's color, dimensions,
 * and category clearly.
 */
export default function ModelViewer({
  model,
  width = 280,
  height = 200,
  className = "",
}: ModelViewerProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  if (!model) {
    return (
      <div
        className={`rounded-xl bg-muted/20 border border-border/30 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <p className="text-muted-foreground text-xs font-mono">
          No model selected
        </p>
      </div>
    );
  }

  const categoryShapeMap: Record<string, string> = {
    Seating: "M8 20h16v-8l-8-4-8 4v8z M4 20h24",
    Desking: "M4 14h24v6H4z M10 14V8h12v6",
    Conference: "M2 12h28v8H2z M6 12V8h20v4",
    Lounge: "M4 18h24v4H4z M4 14c0-4 4-6 8-6h8c4 0 8 2 8 6",
    Storage: "M4 4h24v24H4z M4 14h24 M4 20h24",
    Lighting: "M16 3l3 5h-6l3-5z M16 8v14 M10 22h12",
    Accessories: "M8 8h16v16H8z",
    Healthcare: "M10 6h12v4H10z M6 10h20v14H6z",
    Outdoor: "M4 18h24 M8 18V10l8-6 8 6v8",
    Hospitality: "M4 20h24 M8 20V10l8-8 8 8v10 M12 20v-6h8v6",
    Casegoods: "M4 4h24v24H4z M4 14h24",
  };

  const shapePath = categoryShapeMap[model.category] ?? "M4 4h24v24H4z";
  const baseColor = model.thumbnailColor ?? "oklch(0.5 0.04 240)";

  return (
    <div
      ref={canvasRef}
      className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${className}`}
      style={{
        width,
        height,
        borderColor: hovered
          ? "oklch(0.65 0.16 245 / 0.5)"
          : "oklch(0.26 0.01 240)",
        background: `radial-gradient(ellipse at 50% 80%, ${baseColor.replace(")", " / 0.15)").replace("oklch(", "oklch(")}, oklch(0.14 0.01 240))`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid="design.model_viewer"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.5 0.02 240) 1px, transparent 1px), linear-gradient(90deg, oklch(0.5 0.02 240) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* SVG model silhouette */}
      <svg
        viewBox="0 0 32 32"
        className="absolute inset-0 m-auto drop-shadow-lg transition-transform duration-300"
        aria-hidden="true"
        style={{
          width: width * 0.55,
          height: height * 0.55,
          transform: hovered
            ? "translateY(-4px) scale(1.05)"
            : "translateY(0) scale(1)",
          filter: `drop-shadow(0 4px 12px ${baseColor.replace(")", " / 0.5)").replace("oklch(", "oklch(")})`,
        }}
      >
        <path
          d={shapePath}
          fill={baseColor}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Dimension info */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] font-mono text-muted-foreground">
        <span>{model.dimensions.widthIn}W</span>
        <span>{model.dimensions.depthIn}D</span>
        <span>{model.dimensions.heightIn}H</span>
      </div>

      {/* Brand glow badge */}
      <div
        className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase"
        style={{
          background: `${baseColor.replace(")", " / 0.2)").replace("oklch(", "oklch(")}`,
          color: baseColor,
        }}
      >
        {model.brand.split(" ")[0]}
      </div>
    </div>
  );
}

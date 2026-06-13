import { Badge } from "@/components/ui/badge";
import { HardHat } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface ConstructionAiButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ConstructionAiButton({
  isOpen,
  onClick,
}: ConstructionAiButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Toggle Construction AI assistant"
      aria-expanded={isOpen}
      aria-controls="ai-assistant-drawer"
      data-ocid="header.ai_assistant_toggle"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border"
      style={{
        background: isOpen
          ? "linear-gradient(135deg, oklch(var(--ai-button-send-gradient-start)), oklch(var(--ai-button-send-gradient-end)))"
          : "oklch(var(--ai-action-chip-bg))",
        borderColor: isOpen
          ? "oklch(var(--ai-glow-accent) / 0.6)"
          : "oklch(var(--ai-action-chip-border))",
        color: isOpen ? "white" : "oklch(var(--ai-action-chip-text))",
        boxShadow: isOpen
          ? "0 0 16px oklch(var(--ai-glow-accent) / 0.35)"
          : undefined,
      }}
    >
      {/* Pulse dot when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.span
            key="pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-card"
          />
        )}
      </AnimatePresence>

      <HardHat className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden sm:inline">Construction AI</span>
      <Badge
        className="text-[8px] px-1 py-0 h-3.5 font-black tracking-widest hidden sm:inline-flex items-center"
        style={{
          background: isOpen
            ? "rgba(255,255,255,0.25)"
            : "oklch(var(--ai-glow-accent) / 0.2)",
          color: isOpen ? "white" : "oklch(var(--ai-glow-accent))",
          border: isOpen
            ? "1px solid rgba(255,255,255,0.3)"
            : "1px solid oklch(var(--ai-glow-accent) / 0.4)",
        }}
      >
        PRO-1
      </Badge>
    </motion.button>
  );
}

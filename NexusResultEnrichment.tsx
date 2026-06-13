import { MediaType } from "@/backend";
import type { VHDEHazardFlag } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useSessionMedia } from "@/hooks/useSessionMedia";
import type { AddCommentParams, MediaAsset } from "@/hooks/useSessionMedia";
import {
  AlertTriangle,
  Camera,
  ChevronDown,
  Clock,
  Image,
  MessageCircle,
  Send,
  Shield,
  SortAsc,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type { MediaAsset, VHDEHazardFlag };

type SortField = "timestamp" | "confidence" | "type";

interface MediaFeedProps {
  sessionId: string;
  tenantId: string;
  /** Optional className override on the gallery container */
  className?: string;
  /** Compact mode — smaller thumbnails, no sidebar details */
  compact?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toNumber(v: number | bigint): number {
  return typeof v === "bigint" ? Number(v) : v;
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.75) return "text-[oklch(var(--vhde-confidence-high))]";
  if (confidence >= 0.45) return "text-[oklch(var(--vhde-confidence-medium))]";
  return "text-[oklch(var(--vhde-confidence-low))]";
}

function confidenceBadgeVariant(
  confidence: number,
): "default" | "secondary" | "destructive" | "outline" {
  if (confidence >= 0.75) return "default";
  if (confidence >= 0.45) return "secondary";
  return "destructive";
}

function topConfidence(flags: VHDEHazardFlag[]): number {
  if (!flags.length) return 0;
  return Math.max(...flags.map((f) => toNumber(f.confidence)));
}

function sortAssets(assets: MediaAsset[], by: SortField): MediaAsset[] {
  return [...assets].sort((a, b) => {
    if (by === "timestamp")
      return toNumber(b.uploadTimestamp) - toNumber(a.uploadTimestamp);
    if (by === "confidence")
      return (
        topConfidence(b.vhdeResult?.hazardFlags ?? []) -
        topConfidence(a.vhdeResult?.hazardFlags ?? [])
      );
    if (by === "type")
      return String(a.mediaType).localeCompare(String(b.mediaType));
    return 0;
  });
}

function formatTimestamp(ts: number | bigint): string {
  const d = new Date(toNumber(ts));
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Sub-components ───────────────────────────────────────────────────────────

function AnalysisStatusBadge({
  status,
}: { status: MediaAsset["analysisStatus"] }) {
  const kind = String(status);
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
    running: {
      label: "Analyzing…",
      className: "bg-primary/20 text-primary animate-pulse",
    },
    complete: {
      label: "VHDE Complete",
      className:
        "bg-[oklch(var(--vhde-confidence-high)/0.15)] text-[oklch(var(--vhde-confidence-high))]",
    },
    error: {
      label: "Analysis Failed",
      className: "bg-destructive/20 text-destructive",
    },
  };
  const { label, className } = map[kind] ?? {
    label: kind,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}
    >
      <Shield className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}

function HazardBadge({ flag }: { flag: VHDEHazardFlag }) {
  const conf = toNumber(flag.confidence);
  return (
    <Badge
      variant={confidenceBadgeVariant(conf)}
      className="gap-1 text-[10px] font-semibold uppercase tracking-wide"
    >
      <AlertTriangle className="h-2.5 w-2.5" />
      {flag.hazardType}
      <span className={`ml-0.5 font-mono ${confidenceColor(conf)}`}>
        {Math.round(conf * 100)}%
      </span>
    </Badge>
  );
}

function MediaThumbnail({
  asset,
  onClick,
}: {
  asset: MediaAsset;
  onClick: () => void;
}) {
  const hasHazards = (asset.vhdeResult?.hazardFlags ?? []).length > 0;
  const maxConf = topConfidence(asset.vhdeResult?.hazardFlags ?? []);

  return (
    <button
      type="button"
      data-ocid={`media_feed.item.${asset.id}`}
      className="media-thumbnail-item group relative flex flex-col overflow-hidden rounded-lg border border-[oklch(var(--media-thumbnail-border)/0.5)] bg-[oklch(var(--media-gallery-bg))] text-left transition-all duration-200 hover:border-[oklch(var(--media-thumbnail-border-dark))] hover:shadow-lg hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onClick}
      aria-label={`View ${asset.mediaType} uploaded ${formatTimestamp(toNumber(asset.uploadTimestamp))}`}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted/40">
        {asset.objectStorageUrl ? (
          asset.mediaType === MediaType.video ? (
            <video
              src={asset.objectStorageUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={asset.objectStorageUrl}
              alt={`Safety media — ${asset.mediaType}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {asset.mediaType === MediaType.video ? (
              <Video className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Image className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        )}

        {/* Media type icon overlay */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
          {asset.mediaType === MediaType.video ? (
            <Video className="h-3 w-3 text-white" />
          ) : (
            <Camera className="h-3 w-3 text-white" />
          )}
          <span className="text-[10px] font-medium uppercase text-white">
            {asset.mediaType}
          </span>
        </div>

        {/* Hazard alert overlay */}
        {hasHazards && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-destructive/80 px-1.5 py-0.5 backdrop-blur-sm">
            <AlertTriangle className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white">
              {(asset.vhdeResult?.hazardFlags ?? []).length}
            </span>
          </div>
        )}

        {/* Confidence bar */}
        {hasHazards && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${toNumber(maxConf) * 100}%`,
                background:
                  toNumber(maxConf) >= 0.75
                    ? "oklch(var(--vhde-confidence-high))"
                    : toNumber(maxConf) >= 0.45
                      ? "oklch(var(--vhde-confidence-medium))"
                      : "oklch(var(--vhde-confidence-low))",
              }}
            />
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <AnalysisStatusBadge status={asset.analysisStatus} />
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MessageCircle className="h-2.5 w-2.5" />
            {toNumber(asset.commentCount)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">
            {formatTimestamp(asset.uploadTimestamp)}
          </span>
        </div>

        {/* Top hazard badges — show up to 2 */}
        {(asset.vhdeResult?.hazardFlags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(asset.vhdeResult?.hazardFlags ?? []).slice(0, 2).map((flag) => (
              <HazardBadge
                key={`${flag.hazardType}-${flag.oshaSubpart}`}
                flag={flag}
              />
            ))}
            {(asset.vhdeResult?.hazardFlags ?? []).length > 2 && (
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{(asset.vhdeResult?.hazardFlags ?? []).length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

// ── Detail Dialog ─────────────────────────────────────────────────────────────

function MediaDetailDialog({
  asset,
  sessionId,
  tenantId,
  open,
  onClose,
}: {
  asset: MediaAsset | null;
  sessionId: string;
  tenantId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { addComment } = useSessionMedia(sessionId, tenantId);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!asset) return null;

  async function handleAddComment() {
    if (!commentText.trim() || !asset) return;
    setSubmitting(true);
    try {
      const params: AddCommentParams = {
        mediaId: asset.id,
        authorName: "Safety Director",
        authorRole: "safety_director",
        text: commentText.trim(),
      };
      await addComment(params);
      setCommentText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="media_feed.dialog"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              {asset.mediaType === MediaType.video ? (
                <Video className="h-4 w-4 text-primary" />
              ) : (
                <Camera className="h-4 w-4 text-primary" />
              )}
              Media Detail
              <AnalysisStatusBadge status={asset.analysisStatus} />
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-ocid="media_feed.close_button"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Media preview */}
          <div className="flex w-1/2 items-center justify-center bg-[oklch(var(--media-gallery-bg))] p-4">
            {asset.objectStorageUrl ? (
              asset.mediaType === MediaType.video ? (
                <video
                  src={asset.objectStorageUrl}
                  controls
                  className="max-h-72 w-full rounded-lg object-contain"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={asset.objectStorageUrl}
                  alt="Safety media detail"
                  className="max-h-72 w-full rounded-lg object-contain"
                />
              )
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
                <Image className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Right panel: hazards + comments */}
          <div className="flex w-1/2 flex-col overflow-hidden border-l border-border">
            {/* Metadata */}
            <div className="border-b border-border px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTimestamp(asset.uploadTimestamp)}
              </p>
            </div>

            {/* VHDE Hazards */}
            {(asset.vhdeResult?.hazardFlags ?? []).length > 0 && (
              <div className="border-b border-border px-4 py-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  VHDE Hazard Flags
                </p>
                <div className="flex flex-col gap-2">
                  {(asset.vhdeResult?.hazardFlags ?? []).map((flag) => (
                    <div
                      key={`${flag.hazardType}-${flag.oshaSubpart}`}
                      className="rounded-md border border-border bg-muted/30 p-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">
                          {flag.hazardType}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold ${confidenceColor(toNumber(flag.confidence))}`}
                        >
                          {Math.round(toNumber(flag.confidence) * 100)}%
                          confidence
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        OSHA 1926 Subpart {flag.oshaSubpart}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <ScrollArea className="flex-1 px-4 py-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <MessageCircle className="h-3 w-3" />
                Comments ({toNumber(asset.commentCount)})
              </p>
              <p className="py-4 text-center text-xs text-muted-foreground">
                No comments yet.
              </p>
            </ScrollArea>

            {/* Add comment */}
            <div className="border-t border-border px-4 py-3">
              <div className="flex gap-2">
                <Textarea
                  data-ocid="media_feed.textarea"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment or safety note…"
                  rows={2}
                  className="resize-none text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      handleAddComment();
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  data-ocid="media_feed.submit_button"
                  disabled={!commentText.trim() || submitting}
                  onClick={handleAddComment}
                  className="h-16 w-10 shrink-0"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Sort Controls ─────────────────────────────────────────────────────────────

function SortControls({
  value,
  onChange,
}: {
  value: SortField;
  onChange: (f: SortField) => void;
}) {
  const options: { value: SortField; label: string }[] = [
    { value: "timestamp", label: "Newest first" },
    { value: "confidence", label: "Highest risk" },
    { value: "type", label: "Media type" },
  ];

  return (
    <div
      className="flex items-center gap-2"
      data-ocid="media_feed.sort_controls"
    >
      <SortAsc className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">Sort:</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            data-ocid={`media_feed.sort.${opt.value}`}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
              value === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {opt.label}
            {value === opt.value && <ChevronDown className="h-2.5 w-2.5" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function MediaFeed({
  sessionId,
  tenantId,
  className = "",
  compact = false,
}: MediaFeedProps) {
  const { media, summary, isLoading } = useSessionMedia(sessionId, tenantId);
  const [sortBy, setSortBy] = useState<SortField>("timestamp");
  const [selected, setSelected] = useState<MediaAsset | null>(null);

  const sorted = sortAssets(media ?? [], sortBy);

  const totalHazards = sorted.reduce(
    (acc, a) => acc + (a.vhdeResult?.hazardFlags ?? []).length,
    0,
  );
  const criticalCount = sorted.filter(
    (a) => topConfidence(a.vhdeResult?.hazardFlags ?? []) >= 0.75,
  ).length;

  return (
    <section
      className={`flex flex-col gap-4 ${className}`}
      aria-label="Safety media feed"
      data-ocid="media_feed.section"
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-foreground">Media Feed</h3>
          {!isLoading && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {sorted.length} item{sorted.length !== 1 ? "s" : ""}
              </span>
              {totalHazards > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-destructive/20 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {totalHazards} hazard{totalHazards !== 1 ? "s" : ""}
                </span>
              )}
              {criticalCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-[oklch(var(--vhde-confidence-high)/0.15)] px-2 py-0.5 text-[11px] font-semibold text-[oklch(var(--vhde-confidence-high))]">
                  <Shield className="h-2.5 w-2.5" />
                  {criticalCount} critical
                </span>
              )}
            </div>
          )}
        </div>
        <SortControls value={sortBy} onChange={setSortBy} />
      </div>

      {/* Summary row (if available) */}
      {summary && toNumber(summary.hazardFlagCount) > 0 && (
        <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {toNumber(summary.hazardFlagCount)} hazard flag
          {toNumber(summary.hazardFlagCount) !== 1 ? "s" : ""} detected across
          this session.
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div
          data-ocid="media_feed.loading_state"
          className="media-gallery-container grid gap-3"
          style={{
            gridTemplateColumns: compact
              ? "repeat(auto-fill, minmax(140px, 1fr))"
              : "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i.toString()}
              aria-hidden="true"
              className="animate-pulse rounded-lg border border-border bg-muted/40"
              style={{ aspectRatio: "16/10" }}
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          data-ocid="media_feed.empty_state"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center"
        >
          <Camera className="h-10 w-10 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-foreground">
              No media uploaded yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Photos and videos captured during this session will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div
          data-ocid="media_feed.list"
          className="media-gallery-container grid gap-3"
          style={{
            gridTemplateColumns: compact
              ? "repeat(auto-fill, minmax(140px, 1fr))"
              : "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {sorted.map((asset) => (
            <MediaThumbnail
              key={asset.id}
              asset={asset}
              onClick={() => setSelected(asset)}
            />
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <MediaDetailDialog
        asset={selected}
        sessionId={sessionId}
        tenantId={tenantId}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

export default MediaFeed;

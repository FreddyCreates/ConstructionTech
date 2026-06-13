import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import type { DesignComment } from "../../types/designIntelligence";

interface CollaborationPanelProps {
  comments: DesignComment[];
  currentUserId?: string;
  currentUserName?: string;
  onAddComment?: (content: string, type: DesignComment["type"]) => void;
  onResolve?: (commentId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const COMMENT_TYPE_CONFIG: Record<
  DesignComment["type"],
  { label: string; color: string; bg: string }
> = {
  comment: {
    label: "Comment",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
  },
  approval: {
    label: "Approval",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  rejection: {
    label: "Rejected",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
  },
  revision: {
    label: "Revision",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
};

function CommentCard({
  comment,
  onResolve,
}: { comment: DesignComment; onResolve?: (id: string) => void }) {
  const conf = COMMENT_TYPE_CONFIG[comment.type];
  const dateStr = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 ${comment.isResolved ? "opacity-40" : ""}`}
      style={{ background: "oklch(0.16 0.01 240)" }}
      data-ocid={`design.collaboration.comment.${comment.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold uppercase"
            style={{
              background: "oklch(0.65 0.16 245 / 0.2)",
              color: "oklch(0.65 0.16 245)",
            }}
          >
            {comment.authorName[0]}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              {comment.authorName}
            </p>
            <p className="text-[10px] text-muted-foreground">{dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${conf.bg} ${conf.color}`}
          >
            {conf.label}
          </span>
          {!comment.isResolved && onResolve && (
            <button
              type="button"
              onClick={() => onResolve(comment.id)}
              className="p-0.5 text-muted-foreground hover:text-emerald-400 transition-colors"
              title="Mark as resolved"
              data-ocid={`design.collaboration.resolve_button.${comment.id}`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-foreground/90 leading-relaxed pl-8">
        {comment.content}
      </p>
      {comment.isResolved && (
        <p className="text-[10px] text-muted-foreground pl-8">✓ Resolved</p>
      )}
    </div>
  );
}

export default function CollaborationPanel({
  comments,
  currentUserId: _currentUserId = "anon",
  currentUserName: _currentUserName = "Anonymous",
  onAddComment,
  onResolve,
  isLoading = false,
  className = "",
}: CollaborationPanelProps) {
  const [draft, setDraft] = useState("");
  const [commentType, setCommentType] =
    useState<DesignComment["type"]>("comment");

  const handleSubmit = () => {
    if (!draft.trim() || !onAddComment) return;
    onAddComment(draft.trim(), commentType);
    setDraft("");
  };

  const openCount = comments.filter((c) => !c.isResolved).length;

  return (
    <div
      className={`rounded-xl border border-border/30 overflow-hidden flex flex-col ${className}`}
      style={{ background: "oklch(0.14 0.01 240)" }}
      data-ocid="design.collaboration_panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border/20"
        style={{ background: "oklch(0.16 0.01 240)" }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Collaboration</p>
        </div>
        <div className="flex items-center gap-2">
          {openCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
              {openCount}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {comments.length} thread{comments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Comment list */}
      <div
        className="flex-1 overflow-y-auto space-y-2 p-3"
        style={{ maxHeight: 320 }}
      >
        {isLoading ? (
          <div
            className="flex items-center justify-center py-8"
            data-ocid="design.collaboration_panel.loading_state"
          >
            <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-8 gap-2"
            data-ocid="design.collaboration_panel.empty_state"
          >
            <MessageCircle className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">No comments yet</p>
          </div>
        ) : (
          comments.map((c) => (
            <CommentCard key={c.id} comment={c} onResolve={onResolve} />
          ))
        )}
      </div>

      {/* Compose area */}
      {onAddComment && (
        <div className="border-t border-border/20 p-3 space-y-2">
          {/* Type selector */}
          <div className="flex gap-1.5 flex-wrap">
            {(
              [
                "comment",
                "revision",
                "approval",
                "rejection",
              ] as DesignComment["type"][]
            ).map((type) => {
              const conf = COMMENT_TYPE_CONFIG[type];
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setCommentType(type)}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors ${
                    commentType === type
                      ? `${conf.bg} ${conf.color}`
                      : "border-border/30 text-muted-foreground hover:border-border/50"
                  }`}
                  data-ocid={`design.collaboration.type_button.${type}`}
                >
                  {conf.label}
                </button>
              );
            })}
          </div>

          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment, revision note, or approval…"
            rows={2}
            className="resize-none text-sm bg-muted/10 border-border/30 focus:border-primary/50"
            data-ocid="design.collaboration.comment_input"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) handleSubmit();
            }}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              disabled={!draft.trim()}
              onClick={handleSubmit}
              className="bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 h-7"
              data-ocid="design.collaboration.submit_button"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

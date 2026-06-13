import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, SendHorizonal } from "lucide-react";
import { useState } from "react";

export interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  timestamp: string;
  replyToId?: string;
}

interface MediaCommentThreadProps {
  comments: Comment[];
  onAddComment: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  currentUserName?: string;
  currentUserRole?: string;
  mediaId?: string;
}

function formatTimestamp(ts: string): string {
  try {
    const date = new Date(ts);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return ts;
  }
}

function roleBadgeVariant(
  role: string,
): "default" | "secondary" | "destructive" | "outline" {
  const r = role.toLowerCase();
  if (r.includes("safety") || r.includes("director")) return "destructive";
  if (r.includes("gc") || r.includes("general")) return "default";
  if (r.includes("pm") || r.includes("manager")) return "secondary";
  return "outline";
}

export function MediaCommentThread({
  comments,
  onAddComment,
  isLoading = false,
  currentUserName = "You",
  currentUserRole = "Field User",
}: MediaCommentThreadProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const topLevel = comments.filter((c) => !c.replyToId);
  const replies = (parentId: string) =>
    comments.filter((c) => c.replyToId === parentId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAddComment(text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="media-comment-thread flex flex-col gap-0 rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Field Comments
        </span>
        <Badge variant="secondary" className="ml-auto text-xs">
          {comments.length}
        </Badge>
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-0 max-h-80 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            Loading comments…
          </div>
        )}

        {!isLoading && topLevel.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground"
            data-ocid="media-comment-thread.empty_state"
          >
            <MessageSquare className="h-7 w-7 opacity-30" />
            <span className="text-sm">
              No comments yet. Be the first to flag an issue.
            </span>
          </div>
        )}

        {!isLoading &&
          topLevel.map((comment, idx) => (
            <div
              key={comment.id}
              className="media-comment-item flex flex-col gap-1 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="media-comment-author text-sm font-semibold text-foreground"
                  data-ocid={`media-comment-thread.item.${idx + 1}`}
                >
                  {comment.authorName}
                </span>
                <Badge
                  variant={roleBadgeVariant(comment.authorRole)}
                  className="text-xs px-1.5 py-0"
                >
                  {comment.authorRole}
                </Badge>
                <span className="media-comment-timestamp ml-auto text-xs text-muted-foreground">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {comment.text}
              </p>

              {/* Replies */}
              {replies(comment.id).length > 0 && (
                <div className="ml-4 mt-1 border-l-2 border-primary/30 pl-3 flex flex-col gap-2">
                  {replies(comment.id).map((reply, ridx) => (
                    <div
                      key={reply.id}
                      className="media-comment-item flex flex-col gap-0.5"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="media-comment-author text-xs font-semibold text-foreground"
                          data-ocid={`media-comment-thread.reply.${idx + 1}.${ridx + 1}`}
                        >
                          {reply.authorName}
                        </span>
                        <Badge
                          variant={roleBadgeVariant(reply.authorRole)}
                          className="text-xs px-1.5 py-0"
                        >
                          {reply.authorRole}
                        </Badge>
                        <span className="media-comment-timestamp ml-auto text-xs text-muted-foreground">
                          {formatTimestamp(reply.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Add comment form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 px-4 py-3 border-t border-border bg-muted/20"
        data-ocid="media-comment-thread.add_comment_form"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">
            Commenting as{" "}
            <span className="font-semibold text-foreground">
              {currentUserName}
            </span>
          </span>
          <Badge
            variant={roleBadgeVariant(currentUserRole)}
            className="text-xs px-1.5 py-0"
          >
            {currentUserRole}
          </Badge>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Flag a hazard, add a note, or request corrective action…"
          className="min-h-[64px] resize-none text-sm"
          data-ocid="media-comment-thread.textarea"
          disabled={submitting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            ⌘ + Enter to submit
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!text.trim() || submitting}
            className="gap-1.5"
            data-ocid="media-comment-thread.submit_button"
          >
            <SendHorizonal className="h-3.5 w-3.5" />
            {submitting ? "Posting…" : "Post Comment"}
          </Button>
        </div>
      </form>
    </div>
  );
}

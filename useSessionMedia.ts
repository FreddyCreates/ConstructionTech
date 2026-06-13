import { createActor } from "@/backend";
import type {
  AnalysisStatus,
  Comment,
  MediaAsset,
  SessionMediaSummary,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

// Re-export for consumers
export type { Comment, MediaAsset, SessionMediaSummary };

/** True when any asset in the list still needs VHDE processing */
function hasPendingAnalysis(media: MediaAsset[]): boolean {
  return media.some(
    (m) =>
      m.analysisStatus.__kind__ === "pending" ||
      m.analysisStatus.__kind__ === "running",
  );
}

/** Derive a simple string tag from the discriminated union for display */
export function getAnalysisStatusLabel(status: AnalysisStatus): string {
  switch (status.__kind__) {
    case "pending":
      return "pending";
    case "running":
      return "running";
    case "complete":
      return "complete";
    case "error":
      return status.error ?? "error";
    default:
      return "unknown";
  }
}

export interface AddCommentParams {
  mediaId: string;
  authorName: string;
  authorRole: string;
  text: string;
  replyToId?: bigint;
}

export interface UseSessionMediaReturn {
  media: MediaAsset[];
  summary: SessionMediaSummary | undefined;
  isLoading: boolean;
  isSummaryLoading: boolean;
  addComment: (params: AddCommentParams) => Promise<Comment>;
  refresh: () => void;
}

export function useSessionMedia(
  sessionId: string | undefined,
  tenantId: string,
): UseSessionMediaReturn {
  const { actor, isFetching: isActorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  // useMemo to keep stable references for hook deps
  const mediaQueryKey = useMemo(
    () => ["sessionMedia", sessionId, tenantId],
    [sessionId, tenantId],
  );
  const summaryQueryKey = useMemo(
    () => ["sessionMediaSummary", sessionId, tenantId],
    [sessionId, tenantId],
  );

  // Primary media list query with adaptive polling
  const mediaQuery = useQuery<MediaAsset[]>({
    queryKey: mediaQueryKey,
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      return actor.getMediaBySession(sessionId, tenantId);
    },
    enabled: !!actor && !isActorFetching && !!sessionId,
    // Refetch every 3s when VHDE analysis is pending/running
    refetchInterval: (query) => {
      const data = query.state.data as MediaAsset[] | undefined;
      if (!data) return false;
      return hasPendingAnalysis(data) ? 3000 : false;
    },
  });

  // Session-level summary (photo count, video count, hazard flag count, etc.)
  const summaryQuery = useQuery<SessionMediaSummary>({
    queryKey: summaryQueryKey,
    queryFn: async () => {
      if (!actor || !sessionId) {
        return {
          lastUploadAt: BigInt(0),
          mediaCount: BigInt(0),
          videoCount: BigInt(0),
          tenantId,
          hazardFlagCount: BigInt(0),
          totalSizeBytes: BigInt(0),
          photoCount: BigInt(0),
          sessionId: sessionId ?? "",
        } satisfies SessionMediaSummary;
      }
      return actor.getSessionMediaSummary(sessionId, tenantId);
    },
    enabled: !!actor && !isActorFetching && !!sessionId,
    // Refresh summary whenever media refreshes
    refetchInterval: (_query) => {
      const parentData = queryClient.getQueryData<MediaAsset[]>(mediaQueryKey);
      if (!parentData) return false;
      return hasPendingAnalysis(parentData) ? 3000 : false;
    },
  });

  // Mutation: add a comment to a specific media asset
  const addCommentMutation = useMutation<Comment, Error, AddCommentParams>({
    mutationFn: async ({
      mediaId,
      authorName,
      authorRole,
      text,
      replyToId,
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.addMediaComment(
        mediaId,
        tenantId,
        authorName,
        authorRole,
        text,
        replyToId ?? null,
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      // Invalidate media list so commentCount updates immediately
      queryClient.invalidateQueries({ queryKey: mediaQueryKey });
      // Also invalidate the per-media comments cache if other hooks use it
      queryClient.invalidateQueries({
        queryKey: ["mediaComments", variables.mediaId, tenantId],
      });
    },
  });

  const addComment = useCallback(
    (params: AddCommentParams): Promise<Comment> => {
      return addCommentMutation.mutateAsync(params);
    },
    [addCommentMutation],
  );

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: mediaQueryKey });
    queryClient.invalidateQueries({ queryKey: summaryQueryKey });
  }, [queryClient, mediaQueryKey, summaryQueryKey]); // stable via useMemo

  return {
    media: mediaQuery.data ?? [],
    summary: summaryQuery.data,
    isLoading:
      mediaQuery.isLoading || isActorFetching || (!actor && !mediaQuery.data),
    isSummaryLoading: summaryQuery.isLoading,
    addComment,
    refresh,
  };
}

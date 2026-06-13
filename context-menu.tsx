import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

type ActivityFeedItem = {
  id: string;
  itemType: string;
  title: string;
  description: string;
  projectId: string;
  tenantId: number;
  timestamp: bigint;
  route: string;
};

function dotColor(itemType: string): string {
  if (itemType === "safety") return "bg-red-500";
  if (itemType === "financial") return "bg-green-500";
  if (itemType === "bid") return "bg-blue-500";
  return "bg-amber-500";
}

function relativeTime(ts: bigint): string {
  try {
    const ms = Number(ts) / 1_000_000;
    const diffSec = Math.floor((Date.now() - ms) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return "";
  }
}

interface ActivityFeedProps {
  tenantId: number | string | undefined;
}

export default function ActivityFeed({ tenantId }: ActivityFeedProps) {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ActivityFeedItem[]>({
    queryKey: ["activityFeed", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTenantActivityFeed(tenantId);
    },
    refetchInterval: 8000,
    enabled: !!tenantId && !!actor && !isFetching,
  });

  return (
    <div>
      <p className="text-sm font-medium text-slate-300 mb-3">Live Activity</p>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((k) => (
            <div key={k} className="animate-pulse bg-slate-700 h-12 rounded" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-slate-500">No recent activity</p>
      ) : (
        <div className="space-y-2">
          {data.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex items-start gap-3 p-2 rounded cursor-pointer hover:bg-slate-800/50 transition-colors w-full text-left"
              onClick={() => navigate({ to: item.route as "/" })}
              data-ocid={`activity_feed.item.${item.id}`}
            >
              <span
                className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotColor(item.itemType)}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{item.title}</p>
                <p className="text-xs text-slate-400 truncate">
                  {item.description.slice(0, 80)}
                  {item.description.length > 80 ? "…" : ""}
                </p>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">
                {relativeTime(item.timestamp)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

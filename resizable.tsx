import type { RecipientGroup, ScopeItem } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAutoDetectTradeGroups } from "@/hooks/useHandoffs";
import { Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useState } from "react";

const DEFAULT_GROUPS: RecipientGroup[] = [
  {
    groupName: "General Contractor",
    roleTag: "GC",
    csiDivisions: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
    emailAddresses: [],
    contactIds: [],
    packageStatus: "pending",
    sentAt: undefined,
    deliveredAt: undefined,
  },
  {
    groupName: "FF&E / Furnishings",
    roleTag: "FFE",
    csiDivisions: ["12"],
    emailAddresses: [],
    contactIds: [],
    packageStatus: "pending",
    sentAt: undefined,
    deliveredAt: undefined,
  },
  {
    groupName: "Flooring",
    roleTag: "Flooring",
    csiDivisions: ["09"],
    emailAddresses: [],
    contactIds: [],
    packageStatus: "pending",
    sentAt: undefined,
    deliveredAt: undefined,
  },
  {
    groupName: "Painting & Finishes",
    roleTag: "Painting",
    csiDivisions: ["09", "10"],
    emailAddresses: [],
    contactIds: [],
    packageStatus: "pending",
    sentAt: undefined,
    deliveredAt: undefined,
  },
  {
    groupName: "Electrical / Lighting",
    roleTag: "Electrical",
    csiDivisions: ["16", "26"],
    emailAddresses: [],
    contactIds: [],
    packageStatus: "pending",
    sentAt: undefined,
    deliveredAt: undefined,
  },
  {
    groupName: "Client / Owner",
    roleTag: "Client",
    csiDivisions: [],
    emailAddresses: [],
    contactIds: [],
    packageStatus: "pending",
    sentAt: undefined,
    deliveredAt: undefined,
  },
];

export default function TradeGroupSelector({
  scopeItems,
  value,
  onChange,
}: {
  scopeItems: ScopeItem[];
  value: RecipientGroup[];
  onChange: (groups: RecipientGroup[]) => void;
}) {
  const autoDetect = useAutoDetectTradeGroups();
  const [newEmail, setNewEmail] = useState<Record<number, string>>({});

  async function handleAutoDetect() {
    try {
      const detected = await autoDetect.mutateAsync(scopeItems);
      onChange(detected.length > 0 ? detected : DEFAULT_GROUPS);
    } catch {
      onChange(DEFAULT_GROUPS);
    }
  }

  function addEmail(idx: number) {
    const email = (newEmail[idx] ?? "").trim();
    if (!email) return;
    onChange(
      value.map((g, i) =>
        i === idx ? { ...g, emailAddresses: [...g.emailAddresses, email] } : g,
      ),
    );
    setNewEmail((p) => ({ ...p, [idx]: "" }));
  }

  function removeEmail(groupIdx: number, email: string) {
    onChange(
      value.map((g, i) =>
        i === groupIdx
          ? {
              ...g,
              emailAddresses: g.emailAddresses.filter((e) => e !== email),
            }
          : g,
      ),
    );
  }

  return (
    <div data-ocid="trade_group_selector.panel" className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {value.length} group{value.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="trade_group_selector.auto_detect_button"
            onClick={handleAutoDetect}
            disabled={autoDetect.isPending || scopeItems.length === 0}
            className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
          >
            {autoDetect.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            Auto-Detect
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="trade_group_selector.add_group_button"
            onClick={() =>
              onChange([
                ...value,
                {
                  groupName: "New Group",
                  roleTag: "Other",
                  csiDivisions: [],
                  emailAddresses: [],
                  contactIds: [],
                  packageStatus: "pending",
                  sentAt: undefined,
                  deliveredAt: undefined,
                },
              ])
            }
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            Add Group
          </Button>
        </div>
      </div>

      {value.length === 0 ? (
        <div
          data-ocid="trade_group_selector.empty_state"
          className="rounded-xl border border-dashed border-border bg-muted/20 py-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            No trade groups — auto-detect or add manually
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((group, idx) => (
            <div
              key={group.groupName}
              data-ocid={`trade_group_selector.item.${idx + 1}`}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Input
                  value={group.groupName}
                  onChange={(e) =>
                    onChange(
                      value.map((g, i) =>
                        i === idx ? { ...g, groupName: e.target.value } : g,
                      ),
                    )
                  }
                  className="h-8 bg-background border-border text-sm font-medium flex-1"
                />
                <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {group.roleTag}
                </span>
                <button
                  type="button"
                  data-ocid={`trade_group_selector.delete_button.${idx + 1}`}
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                  aria-label="Remove group"
                  className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              {group.csiDivisions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {group.csiDivisions.map((div) => (
                    <span
                      key={div}
                      className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      Div {div}
                    </span>
                  ))}
                </div>
              )}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Recipients
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.emailAddresses.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs text-foreground"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(idx, email)}
                        aria-label={`Remove ${email}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    data-ocid={`trade_group_selector.email_input.${idx + 1}`}
                    type="email"
                    value={newEmail[idx] ?? ""}
                    onChange={(e) =>
                      setNewEmail((p) => ({ ...p, [idx]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEmail(idx);
                      }
                    }}
                    placeholder="Add email"
                    className="h-7 text-xs bg-background border-border flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addEmail(idx)}
                    data-ocid={`trade_group_selector.add_email_button.${idx + 1}`}
                    className="h-7 px-2 text-xs"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

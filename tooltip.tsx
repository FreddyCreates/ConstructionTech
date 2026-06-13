import type { RecipientGroup, ScopeItem } from "@/backend";
import { FileText, Package, Users } from "lucide-react";

function filterForGroup(
  items: ScopeItem[],
  group: RecipientGroup,
): ScopeItem[] {
  if (group.roleTag === "Client" || group.csiDivisions.length === 0)
    return items;
  return items.filter(
    (item) =>
      group.csiDivisions.includes(item.csiDivision?.slice(0, 2) ?? "") ||
      group.csiDivisions.includes(item.csiDivision ?? ""),
  );
}

function GroupCard({
  group,
  scopeItems,
  index,
}: { group: RecipientGroup; scopeItems: ScopeItem[]; index: number }) {
  const filtered = filterForGroup(scopeItems, group);
  const subtotal = filtered.reduce(
    (s, i) => s + (i.estimatedCost ?? 0) * (i.quantity ?? 1),
    0,
  );
  const recipCount = group.emailAddresses.length + group.contactIds.length;

  return (
    <div
      data-ocid={`recipient_preview.item.${index + 1}`}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/20">
        <div>
          <p className="text-sm font-medium text-foreground">
            {group.groupName}
          </p>
          <p className="text-xs text-muted-foreground">{group.roleTag}</p>
        </div>
        <div className="flex gap-1">
          {group.csiDivisions.slice(0, 4).map((div) => (
            <span
              key={div}
              className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              Div {div}
            </span>
          ))}
          {group.csiDivisions.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{group.csiDivisions.length - 4}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <FileText className="size-3.5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Items</p>
            <p className="text-sm font-semibold text-foreground">
              {filtered.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Package className="size-3.5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Value</p>
            <p className="text-sm font-semibold text-foreground">
              {subtotal > 0 ? `$${subtotal.toLocaleString()}` : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Users className="size-3.5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Recipients</p>
            <p className="text-sm font-semibold text-foreground">
              {recipCount}
            </p>
          </div>
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="divide-y divide-border/50">
          {filtered.slice(0, 5).map((item) => (
            <div
              key={`${item.description}-${item.tradeGroup}`}
              className="flex items-center justify-between px-4 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground truncate">
                  {item.description || "No description"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.tradeGroup}
                </p>
              </div>
              {item.estimatedCost > 0 && (
                <p className="text-xs font-medium text-foreground ml-3 shrink-0">
                  ${(item.estimatedCost * item.quantity).toLocaleString()}
                </p>
              )}
            </div>
          ))}
          {filtered.length > 5 && (
            <p className="px-4 py-2 text-xs text-muted-foreground">
              +{filtered.length - 5} more items
            </p>
          )}
        </div>
      ) : (
        <p className="px-4 py-4 text-xs text-muted-foreground italic text-center">
          {group.roleTag === "Client"
            ? "Full scope included"
            : "No matching items for this group's divisions"}
        </p>
      )}
      {group.emailAddresses.length > 0 && (
        <div className="border-t border-border px-4 py-2.5 bg-muted/10">
          <p className="text-xs text-muted-foreground mb-1">Sending to:</p>
          <div className="flex flex-wrap gap-1">
            {group.emailAddresses.map((email) => (
              <span
                key={email}
                className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
              >
                {email}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipientPackagePreview({
  recipientGroups,
  scopeItems,
}: { recipientGroups: RecipientGroup[]; scopeItems: ScopeItem[] }) {
  if (recipientGroups.length === 0) {
    return (
      <div
        data-ocid="recipient_preview.empty_state"
        className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 py-12"
      >
        <Package className="size-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No recipient groups configured
        </p>
      </div>
    );
  }
  return (
    <div data-ocid="recipient_preview.panel" className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {recipientGroups.length} package
        {recipientGroups.length !== 1 ? "s" : ""} ·{" "}
        {recipientGroups.reduce(
          (s, g) => s + g.emailAddresses.length + g.contactIds.length,
          0,
        )}{" "}
        recipients
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {recipientGroups.map((group, i) => (
          <GroupCard
            key={group.groupName || `gp-${i}`}
            group={group}
            scopeItems={scopeItems}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

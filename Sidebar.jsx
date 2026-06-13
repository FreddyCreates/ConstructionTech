import type { Contact } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateContact,
  useDeleteContact,
  useListContacts,
  useUpdateContact,
} from "@/hooks/useContacts";
import { Mail, Phone, Plus, Search, Trash2, UserCircle } from "lucide-react";
import { useState } from "react";

const ROLES = [
  "GC",
  "Designer",
  "PM",
  "Reseller",
  "Architect",
  "Sub",
  "Client",
  "Supplier",
];

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  primaryRole: string;
  secondaryRoles: string[];
  notes: string;
};

const blankForm = (): ContactFormData => ({
  name: "",
  email: "",
  phone: "",
  primaryRole: "GC",
  secondaryRoles: [],
  notes: "",
});

function RolePill({
  role,
  active,
  onClick,
}: { role: string; active: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted/40 text-muted-foreground border-border hover:border-primary/50"
      }`}
    >
      {role}
    </button>
  );
}

function ContactModal({
  open,
  contact,
  onClose,
}: { open: boolean; contact?: Contact; onClose: () => void }) {
  const [form, setForm] = useState<ContactFormData>(
    contact
      ? {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          primaryRole: contact.primaryRole,
          secondaryRoles: contact.secondaryRoles,
          notes: contact.notes,
        }
      : blankForm(),
  );
  const [error, setError] = useState("");
  const create = useCreateContact();
  const update = useUpdateContact();
  const loading = create.isPending || update.isPending;

  function toggleSecondary(role: string) {
    setForm((p) => ({
      ...p,
      secondaryRoles: p.secondaryRoles.includes(role)
        ? p.secondaryRoles.filter((r) => r !== role)
        : [...p.secondaryRoles, role],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (contact) await update.mutateAsync({ id: contact.id, ...form });
      else await create.mutateAsync(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {contact ? "Edit Contact" : "Add Contact"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Name
              </Label>
              <Input
                data-ocid="contact.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Full name"
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input
                data-ocid="contact.email_input"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="email@example.com"
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Phone
              </Label>
              <Input
                data-ocid="contact.phone_input"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="(555) 000-0000"
                className="bg-background border-border"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Primary Role
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((role) => (
                <RolePill
                  key={role}
                  role={role}
                  active={form.primaryRole === role}
                  onClick={() => setForm((p) => ({ ...p, primaryRole: role }))}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Also Works As
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.filter((r) => r !== form.primaryRole).map((role) => (
                <RolePill
                  key={role}
                  role={role}
                  active={form.secondaryRoles.includes(role)}
                  onClick={() => toggleSecondary(role)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Notes
            </Label>
            <Input
              data-ocid="contact.notes_input"
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Relationship context, specialties..."
              className="bg-background border-border"
            />
          </div>
          {error && (
            <p
              data-ocid="contact.error_state"
              className="text-xs text-destructive"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="contact.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              data-ocid="contact.submit_button"
            >
              {loading ? "Saving..." : contact ? "Update" : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ContactDirectory({
  onSelect,
}: { onSelect?: (c: Contact) => void }) {
  const { data: contacts = [], isLoading } = useListContacts();
  const deleteContact = useDeleteContact();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | undefined>();

  const filtered = contacts.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      roleFilter === "All" ||
      c.primaryRole === roleFilter ||
      c.secondaryRoles.includes(roleFilter);
    return matchSearch && matchRole;
  });

  return (
    <div data-ocid="contact_directory.panel" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            data-ocid="contact_directory.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="pl-9 h-8 bg-background border-border text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {["All", ...ROLES].map((r) => (
            <button
              type="button"
              key={r}
              data-ocid={`contact_directory.filter.${r.toLowerCase()}`}
              onClick={() => setRoleFilter(r)}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {r}
            </button>
          ))}
          <Button
            size="sm"
            data-ocid="contact_directory.add_button"
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
            className="gap-1 ml-1"
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="contact_directory.empty_state"
          className="flex flex-col items-center gap-3 py-12 rounded-xl border border-dashed border-border bg-muted/20"
        >
          <UserCircle className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {search || roleFilter !== "All"
              ? "No contacts match filter"
              : "No contacts yet"}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
            data-ocid="contact_directory.empty_add_button"
          >
            <Plus className="size-3.5 mr-1" />
            Add Contact
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c, i) => (
            <div
              key={c.id.toString()}
              data-ocid={`contact_directory.item.${i + 1}`}
              onClick={() => onSelect?.(c)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect?.(c);
              }}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              className={`group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/30 ${
                onSelect ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm truncate">
                  {c.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="size-3" />
                    {c.email}
                  </span>
                  {c.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {c.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {c.primaryRole}
                </span>
                {c.secondaryRoles.slice(0, 2).map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  data-ocid={`contact_directory.edit_button.${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(c);
                    setModalOpen(true);
                  }}
                  aria-label="Edit"
                  className="rounded p-1.5 hover:bg-muted text-muted-foreground"
                >
                  <Mail className="size-3.5" />
                </button>
                <button
                  type="button"
                  data-ocid={`contact_directory.delete_button.${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteContact.mutate(c.id);
                  }}
                  aria-label="Delete"
                  className="rounded p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactModal
        open={modalOpen}
        contact={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(undefined);
        }}
      />
    </div>
  );
}

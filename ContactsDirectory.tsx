import type { RecipientGroup, ScopeItem } from "@/backend";
import ContactDirectory from "@/components/ContactDirectory";
import RecipientPackagePreview from "@/components/RecipientPackagePreview";
import ScopeValidationPanel from "@/components/ScopeValidationPanel";
import TradeGroupSelector from "@/components/TradeGroupSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGenerateHandoffPackage,
  useSendHandoff,
  useSetHandoffRecipients,
} from "@/hooks/useHandoffs";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  MailCheck,
  Package,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, label: "Validate Scope", Icon: Package },
  { id: 2, label: "Recipients", Icon: Users },
  { id: 3, label: "Preview", Icon: MailCheck },
  { id: 4, label: "Send", Icon: Send },
];

export default function HandoffWizard({
  projectId,
  projectName,
  scopeItems,
  onComplete,
}: {
  projectId: string;
  projectName: string;
  scopeItems: ScopeItem[];
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [groups, setGroups] = useState<RecipientGroup[]>([]);
  const [handoffId, setHandoffId] = useState<bigint | null>(null);
  const [contactDirOpen, setContactDirOpen] = useState(false);
  const [activeGroupIdx, setActiveGroupIdx] = useState<number | null>(null);
  const [pid, setPid] = useState(projectId);
  const [pname, setPname] = useState(projectName);

  const generate = useGenerateHandoffPackage();
  const setRecipients = useSetHandoffRecipients();
  const sendHandoff = useSendHandoff();
  const loading =
    generate.isPending || setRecipients.isPending || sendHandoff.isPending;

  async function handleNext() {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      try {
        const handoff = await generate.mutateAsync({
          projectId: pid,
          projectName: pname,
          scopeItems,
        });
        const updated = await setRecipients.mutateAsync({
          handoffId: handoff.id,
          recipientGroups: groups,
        });
        setHandoffId(updated.id);
        setStep(3);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to save recipients",
        );
      }
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
    if (step === 4 && handoffId) {
      try {
        await sendHandoff.mutateAsync(handoffId);
        toast.success(`${groups.length} packages sent successfully`);
        onComplete?.();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to send handoff",
        );
      }
    }
  }

  const totalRecipients = groups.reduce(
    (s, g) => s + g.emailAddresses.length,
    0,
  );

  return (
    <div data-ocid="handoff_wizard.panel" className="flex flex-col gap-6">
      {/* Step bar */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-5 py-4">
        {STEPS.map((s, i) => {
          const done = s.id < step;
          const active = s.id === step;
          const { Icon } = s;
          return (
            <div
              key={`step-${s.id}`}
              className="flex items-center gap-1 flex-1"
            >
              <div
                className={`flex items-center gap-2 text-xs font-medium ${
                  active
                    ? "text-primary"
                    : done
                      ? "text-emerald-400"
                      : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex size-7 items-center justify-center rounded-full border-2 transition-all ${
                    active
                      ? "border-primary bg-primary/15"
                      : done
                        ? "border-emerald-400 bg-emerald-400/10"
                        : "border-border bg-muted/30"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </div>
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="size-3 text-border shrink-0 ml-auto" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div data-ocid="handoff_wizard.step_1" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Project ID
              </Label>
              <Input
                data-ocid="handoff_wizard.project_id_input"
                value={pid}
                onChange={(e) => setPid(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Project Name
              </Label>
              <Input
                data-ocid="handoff_wizard.project_name_input"
                value={pname}
                onChange={(e) => setPname(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>
          <ScopeValidationPanel scopeItems={scopeItems} />
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div data-ocid="handoff_wizard.step_2" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Configure Recipient Groups
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Each group receives only their relevant scope divisions
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="handoff_wizard.open_contacts_button"
              onClick={() => {
                setActiveGroupIdx(null);
                setContactDirOpen(true);
              }}
              className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Users className="size-3.5" />
              Contact Book
            </Button>
          </div>
          <TradeGroupSelector
            scopeItems={scopeItems}
            value={groups}
            onChange={setGroups}
          />
          {groups.map((g, idx) => (
            <button
              type="button"
              key={g.groupName || `afc-${idx}`}
              data-ocid={`handoff_wizard.add_from_contacts.${idx + 1}`}
              onClick={() => {
                setActiveGroupIdx(idx);
                setContactDirOpen(true);
              }}
              className="text-xs text-primary hover:underline"
            >
              + Add from contacts to “{g.groupName}”
            </button>
          ))}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div data-ocid="handoff_wizard.step_3">
          <RecipientPackagePreview
            recipientGroups={groups}
            scopeItems={scopeItems}
          />
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div data-ocid="handoff_wizard.step_4" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary mx-auto">
              <Send className="size-5" />
            </div>
            <h4 className="font-display font-semibold text-foreground">
              Ready to Send
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {groups.length} packages will be sent via the native
              MessagingEngine to {totalRecipients} recipient
              {totalRecipients !== 1 ? "s" : ""}.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {groups.map((g) => (
                <span
                  key={g.roleTag}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary"
                >
                  {g.groupName} · {g.emailAddresses.length}
                </span>
              ))}
            </div>
          </div>
          {sendHandoff.isSuccess && (
            <div
              data-ocid="handoff_wizard.success_state"
              className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4"
            >
              <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Packages sent successfully
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Check Handoff Dashboard for delivery tracking
                </p>
              </div>
            </div>
          )}
          {sendHandoff.isError && (
            <div
              data-ocid="handoff_wizard.error_state"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-4"
            >
              <p className="text-xs text-destructive">
                {sendHandoff.error instanceof Error
                  ? sendHandoff.error.message
                  : "Send failed"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          type="button"
          variant="ghost"
          data-ocid="handoff_wizard.back_button"
          onClick={() => setStep((p) => Math.max(1, p - 1))}
          disabled={step === 1 || loading}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button
            type="button"
            data-ocid="handoff_wizard.next_button"
            onClick={handleNext}
            disabled={loading}
            className="gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {step === 2 ? "Save & Preview" : "Continue"}
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            data-ocid="handoff_wizard.send_button"
            onClick={handleNext}
            disabled={loading || sendHandoff.isSuccess}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {sendHandoff.isSuccess ? "Sent" : "Send Packages"}
          </Button>
        )}
      </div>

      {/* Contact directory overlay */}
      {contactDirOpen && (
        <div
          data-ocid="handoff_wizard.contact_directory_dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-display font-semibold text-foreground">
                Contact Directory
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-ocid="handoff_wizard.close_contacts_button"
                onClick={() => setContactDirOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <ContactDirectory
                onSelect={(contact) => {
                  if (activeGroupIdx !== null) {
                    setGroups((prev) =>
                      prev.map((g, i) =>
                        i === activeGroupIdx &&
                        !g.emailAddresses.includes(contact.email)
                          ? {
                              ...g,
                              emailAddresses: [
                                ...g.emailAddresses,
                                contact.email,
                              ],
                              contactIds: [...g.contactIds, contact.id],
                            }
                          : g,
                      ),
                    );
                  }
                  setContactDirOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

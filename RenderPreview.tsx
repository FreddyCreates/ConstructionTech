import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { BookmarkCheck, ExternalLink, Loader2, Save } from "lucide-react";
import { useState } from "react";
import {
  useGenerateNexusInsights,
  useSaveToolResult,
} from "../hooks/useNexusQueries";

interface SaveResultButtonProps {
  toolName: string;
  toolCategory: string;
  result: unknown;
  inputs: unknown;
}

export default function SaveResultButton({
  toolName,
  toolCategory,
  result,
  inputs,
}: SaveResultButtonProps) {
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [saved, setSaved] = useState(false);

  const saveResult = useSaveToolResult();
  const generateInsights = useGenerateNexusInsights();

  async function handleSave() {
    if (!projectName.trim()) return;
    const outputsJson = JSON.stringify(result);
    let nexusInsightsJson = "[]";
    try {
      const insights = await generateInsights.mutateAsync({
        toolName,
        outputsJson,
      });
      nexusInsightsJson = JSON.stringify(insights);
    } catch {
      nexusInsightsJson = "[]";
    }
    await saveResult.mutateAsync({
      toolName,
      toolCategory,
      projectName: projectName.trim(),
      inputsJson: JSON.stringify(inputs),
      outputsJson,
      nexusInsightsJson,
    });
    setSaved(true);
    setTimeout(() => setOpen(false), 1500);
  }

  if (!isLoggedIn) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
        onClick={() => login()}
        data-ocid="save_result.sign_in_button"
      >
        <Save className="w-4 h-4 mr-2" />
        Sign in to Save
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
        onClick={() => {
          setSaved(false);
          setProjectName("");
          setOpen(true);
        }}
        data-ocid="save_result.open_modal_button"
      >
        <Save className="w-4 h-4 mr-2" />
        Save to Account
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-md bg-card border-border"
          data-ocid="save_result.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
                <Save className="w-3 h-3 text-orange-400" />
              </div>
              Save Result
            </DialogTitle>
          </DialogHeader>

          {saved ? (
            <div
              className="flex flex-col items-center gap-4 py-6"
              data-ocid="save_result.success_state"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <BookmarkCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-foreground font-medium">Result saved!</p>
              <a
                href="/account/history"
                className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                View in Calculation History
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-orange-500/40 text-orange-400"
                  >
                    {toolCategory}
                  </Badge>
                  <span className="text-sm text-foreground font-medium">
                    {toolName}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  OIS Nexus insights will be generated and embedded with this
                  result.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g. Marriott Downtown Renovation"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  data-ocid="save_result.project_name_input"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  data-ocid="save_result.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={
                    !projectName.trim() ||
                    saveResult.isPending ||
                    generateInsights.isPending
                  }
                  onClick={handleSave}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  data-ocid="save_result.submit_button"
                >
                  {saveResult.isPending || generateInsights.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Result
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

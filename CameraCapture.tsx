import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Printer,
  Share2,
} from "lucide-react";
import { useState } from "react";

export interface DeliverableOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

export interface DeliverableManifestProps {
  title: string;
  options: DeliverableOption[];
  onGenerate?: (selectedIds: string[]) => void;
  onEmail?: (selectedIds: string[]) => void;
  onShare?: (selectedIds: string[]) => void;
  onPrint?: (selectedIds: string[]) => void;
  isGenerating?: boolean;
}

export default function DeliverableManifest({
  title,
  options,
  onGenerate,
  onEmail,
  onShare,
  onPrint,
  isGenerating = false,
}: DeliverableManifestProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(options.filter((o) => o.enabled).map((o) => o.id)),
  );

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectedIds = Array.from(selected);
  const hasSelection = selectedIds.length > 0;

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-construction-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected.has(opt.id);
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => toggle(opt.id)}
                disabled={!opt.enabled}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? "border-construction-primary/40 bg-construction-primary/5"
                    : "border-border/40 hover:border-border/80 bg-card"
                } ${!opt.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                data-ocid={`deliverable.option.${opt.id}`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-construction-primary border-construction-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
          <Button
            size="sm"
            variant="default"
            disabled={!hasSelection || isGenerating}
            onClick={() => onGenerate?.(selectedIds)}
            data-ocid="deliverable.generate_button"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!hasSelection}
            onClick={() => onEmail?.(selectedIds)}
            data-ocid="deliverable.email_button"
          >
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Email
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!hasSelection}
            onClick={() => onShare?.(selectedIds)}
            data-ocid="deliverable.share_button"
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!hasSelection}
            onClick={() => onPrint?.(selectedIds)}
            data-ocid="deliverable.print_button"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

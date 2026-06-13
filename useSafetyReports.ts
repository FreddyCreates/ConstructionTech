import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useEffect, useState } from "react";
import type {
  ReportRecipient,
  SafetyReportRecord,
} from "../types/safetyTemplates";

type ActorLike = Record<string, (...args: unknown[]) => Promise<unknown>>;

export function useSafetyReports() {
  const [reports, setReports] = useState<SafetyReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { actor, isFetching } = useActor(createActor);

  useEffect(() => {
    if (!isFetching) fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  async function fetchReports() {
    setLoading(true);
    try {
      if (actor && "getMySafetyReports" in actor) {
        const result = await (
          actor as unknown as ActorLike
        ).getMySafetyReports();
        setReports(result as SafetyReportRecord[]);
      } else {
        setReports([]);
      }
    } catch {
      setError("Could not load safety reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  async function createReport(
    reportData: Omit<SafetyReportRecord, "reportId" | "generatedAt" | "sentTo">,
  ): Promise<string | null> {
    try {
      if (actor && "createSafetyReport" in actor) {
        const result = await (actor as unknown as ActorLike).createSafetyReport(
          reportData,
        );
        const r = result as { ok?: string };
        if (r.ok) {
          await fetchReports();
          return r.ok;
        }
      } else {
        // LocalStorage fallback — generate a stub ID
        const stubId = `report-${Date.now()}`;
        const full: SafetyReportRecord = {
          ...reportData,
          reportId: stubId,
          generatedAt: BigInt(Date.now()),
          sentTo: [],
        };
        const existing = JSON.parse(
          localStorage.getItem("ois_safety_reports") ?? "[]",
        ) as SafetyReportRecord[];
        existing.unshift(full);
        localStorage.setItem("ois_safety_reports", JSON.stringify(existing));
        setReports(existing);
        return stubId;
      }
    } catch {
      setError("Failed to create safety report");
    }
    return null;
  }

  async function addRecipient(
    reportId: string,
    recipient: ReportRecipient,
  ): Promise<boolean> {
    try {
      if (actor && "addReportRecipient" in actor) {
        const result = await (actor as unknown as ActorLike).addReportRecipient(
          reportId,
          recipient,
        );
        const r = result as { ok?: unknown };
        if ("ok" in r) {
          await fetchReports();
          return true;
        }
      }
    } catch {
      setError("Failed to add recipient");
    }
    return false;
  }

  return { reports, loading, error, createReport, addRecipient };
}

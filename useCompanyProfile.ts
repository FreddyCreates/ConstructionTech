import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useEffect, useState } from "react";
import type { CompanyProfile } from "../types/safetyTemplates";

const STORAGE_KEY = "ois_company_profile";

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { actor, isFetching } = useActor(createActor);

  useEffect(() => {
    if (!isFetching) loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  async function loadProfile() {
    setLoading(true);
    try {
      if (actor && "getMyCompanyProfile" in actor) {
        const result = await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).getMyCompanyProfile();
        const arr = result as CompanyProfile[];
        if (arr && arr.length > 0) {
          setProfile(arr[0]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(arr[0]));
        } else {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) setProfile(JSON.parse(cached) as CompanyProfile);
        }
      } else {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) setProfile(JSON.parse(cached) as CompanyProfile);
      }
    } catch {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) setProfile(JSON.parse(cached) as CompanyProfile);
      setError("Could not load company profile from network");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(data: CompanyProfile): Promise<boolean> {
    try {
      if (actor && "setCompanyProfile" in actor) {
        const result = await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).setCompanyProfile(data);
        const r = result as { ok?: unknown };
        if ("ok" in r) {
          setProfile(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return true;
        }
      } else {
        setProfile(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      }
    } catch {
      setError("Failed to save company profile");
    }
    return false;
  }

  return { profile, loading, error, saveProfile, hasProfile: !!profile };
}

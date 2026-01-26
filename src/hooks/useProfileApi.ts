"use client";

import { useCallback, useEffect, useState } from "react";
import { profileService } from "../services/api/profileService";
import type { ProfilePayload } from "../types/api/profile";

export function useProfileApi() {
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await profileService.getProfile();
      setData(res);
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to load profile"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
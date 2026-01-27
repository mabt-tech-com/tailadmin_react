"use client";

import { useCallback, useEffect, useState } from "react";
import { organizationService } from "../services/api/organizationService";
import type { OrganizationPayload } from "../types/api/organization";

export function useOrganizationApi() {
  const [data, setData] = useState<OrganizationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await organizationService.getOrganization();
      setData(res);
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to load organization"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
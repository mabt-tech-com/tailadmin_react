import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";

type MeResponse = {
  authenticated: boolean;
  user: null | {
    id: number;
    organization_id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: string;
    is_verified: boolean;
  };
  organization: null | {
    id: number;
    name: string;
    slug: string;
  };
};

export function getSession() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await apiClient.request<MeResponse>("/api/auth/me", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (mounted) setData(res);
      } catch {
        if (mounted) setData({ authenticated: false, user: null, organization: null });
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading };
}
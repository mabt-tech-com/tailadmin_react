// src/hooks/useDashboard.ts
import { useEffect, useState } from "react";
import type { DashboardPayload } from "../types/api/dashboard";
import { dashboardService } from "../services/api/dashboardService";
import { ApiError } from "../services/api/apiClient";

type UseDashboardState = {
  data: DashboardPayload | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};



export function useDashboard(): UseDashboardState {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await dashboardService.getDashboard();
          
      setData(payload);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.status === 401 ? "Not authenticated" : e.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
  }, []);

  return { data, loading, error, refetch };
}
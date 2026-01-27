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

export const dummyDashboardPayload = {
  active_calls: 3,
  uptime: "0:42:18",

  active_assistants: 2,
  total_calls: 128,
  completed_calls: 119,
  success_rate: 93.0,
  assistant_availability: 66.7,

  daily_call_data: [
    { date: "Mon", count: 12 },
    { date: "Tue", count: 18 },
    { date: "Wed", count: 16 },
    { date: "Thu", count: 21 },
    { date: "Fri", count: 14 },
    { date: "Sat", count: 9 },
    { date: "Sun", count: 5 },
    { date: "Mon", count: 7 },
  ],

  recent_calls: [
    {
      id: 1001,
      assistant_id: 11,
      assistant_name: "Qall Receptionist",
      to_phone_number: "+49 30 1234567",
      customer_phone_number: "+49 176 5550001",
      status: "ongoing",
      started_at: "2026-01-26T22:55:10.000Z",
    },
    {
      id: 1002,
      assistant_id: 11,
      assistant_name: "Qall Receptionist",
      to_phone_number: "+49 30 1234567",
      customer_phone_number: "+49 176 5550002",
      status: "completed",
      started_at: "2026-01-26T22:41:03.000Z",
    },
    {
      id: 1003,
      assistant_id: 12,
      assistant_name: "Billing Assistant",
      to_phone_number: "+49 30 7654321",
      customer_phone_number: "+49 151 7771003",
      status: "failed",
      started_at: "2026-01-26T22:33:48.000Z",
    },
    {
      id: 1004,
      assistant_id: 12,
      assistant_name: "Billing Assistant",
      to_phone_number: "+49 30 7654321",
      customer_phone_number: "+49 176 5550004",
      status: "completed",
      started_at: "2026-01-26T22:19:22.000Z",
    },
    {
      id: 1005,
      assistant_id: 13,
      assistant_name: "Restaurant Host",
      to_phone_number: "+49 30 9988776",
      customer_phone_number: "+49 160 8080805",
      status: "busy",
      started_at: "2026-01-26T21:58:50.000Z",
    },
    {
      id: 1006,
      assistant_id: 13,
      assistant_name: "Restaurant Host",
      to_phone_number: "+49 30 9988776",
      customer_phone_number: "+49 176 5550006",
      status: "completed",
      started_at: "2026-01-26T21:42:15.000Z",
    },
    {
      id: 1007,
      assistant_id: 14,
      assistant_name: "IT Support Agent",
      to_phone_number: "+49 30 4433221",
      customer_phone_number: "+49 171 9101107",
      status: "no-answer",
      started_at: "2026-01-26T21:30:01.000Z",
    },
    {
      id: 1008,
      assistant_id: 14,
      assistant_name: "IT Support Agent",
      to_phone_number: "+49 30 4433221",
      customer_phone_number: "+49 152 3030308",
      status: "completed",
      started_at: "2026-01-26T21:11:47.000Z",
    },
    {
      id: 1009,
      assistant_id: 11,
      assistant_name: "Qall Receptionist",
      to_phone_number: "+49 30 1234567",
      customer_phone_number: "+49 176 5550009",
      status: "failed",
      started_at: "2026-01-26T20:59:12.000Z",
    },
    {
      id: 1010,
      assistant_id: 12,
      assistant_name: "Billing Assistant",
      to_phone_number: "+49 30 7654321",
      customer_phone_number: "+49 176 5550010",
      status: "completed",
      started_at: "2026-01-26T20:41:33.000Z",
    },
  ],
} as const;


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
      setData(dummyDashboardPayload as any);
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
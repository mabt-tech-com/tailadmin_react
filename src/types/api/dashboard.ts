// src/types/dashboard.ts

export type DailyCallPoint = {
  date: string; // "Mon"
  count: number;
};

export type DashboardRecentCall = {
  id: number;
  assistant_id: number;
  assistant_name: string;
  to_phone_number: string;
  customer_phone_number: string;
  status: string;
  started_at: string | null; // ISO string from FastAPI (or null)
};

export type DashboardPayload = {
  // Hero
  active_calls: number;
  uptime: string;

  // Metrics
  active_assistants: number;
  total_calls: number;
  completed_calls: number;
  success_rate: number;
  assistant_availability: number;

  // Chart
  daily_call_data: DailyCallPoint[];

  // Table
  recent_calls: DashboardRecentCall[];
};
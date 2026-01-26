// src/services/dashboardService.ts
import { apiClient } from "./apiClient";
import type { DashboardPayload } from "../../types/api/dashboard";

export const dashboardService = {
  getDashboard(): Promise<DashboardPayload> {
    return apiClient.request<DashboardPayload>("/api/dashboard");
  },
};
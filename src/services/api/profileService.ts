import { apiClient } from "./apiClient";
import type { ProfilePayload } from "../../types/api/profile";

export const profileService = {
  getProfile(): Promise<ProfilePayload> {
    return apiClient.request<ProfilePayload>("/api/profile", { method: "GET" });
  },
};
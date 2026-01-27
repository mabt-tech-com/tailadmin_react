import { apiClient } from "./apiClient";
import type { OrganizationPayload } from "../../types/api/organization";

export const organizationService = {
  getOrganization(): Promise<OrganizationPayload> {
    return apiClient.request<OrganizationPayload>("/api/organization", { method: "GET" });
  },
};
// src/services/apiKeysService.ts
import { apiClient } from "./apiClient";
import type {
  APIKeyItem,
  APIKeyListResponse,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
} from "../../types/api/apiKeys";

export const apiKeysService = {
  list(): Promise<APIKeyListResponse> {
    return apiClient.request<APIKeyListResponse>("/api/api-keys", {
      method: "GET",
    });
  },

  create(payload: CreateAPIKeyRequest): Promise<CreateAPIKeyResponse> {
    return apiClient.request<CreateAPIKeyResponse>("/api/api-keys", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  setActive(keyId: number, isActive: boolean): Promise<APIKeyItem> {
    return apiClient.request<APIKeyItem>(`/api/api-keys/${keyId}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    });
  },

  delete(keyId: number): Promise<{ success: boolean }> {
    return apiClient.request<{ success: boolean }>(`/api/api-keys/${keyId}`, {
      method: "DELETE",
    });
  },
};
// src/types/apiKeys.ts
export type APIKeyPermissions = {
  read: boolean;
  write: boolean;
  admin: boolean;
};

export type APIKeyItem = {
  id: number;
  name: string;
  key_prefix: string;
  is_active: boolean;
  usage_count: number;
  last_used_at: string | null;
  created_at: string; // ISO
  permissions: APIKeyPermissions;
};

export type APIKeyListResponse = {
  items: APIKeyItem[];
};

export type CreateAPIKeyRequest = {
  name: string;
  permissions: APIKeyPermissions;
};

export type CreateAPIKeyResponse = {
  api_key: APIKeyItem;
  plain_key: string; // returned once
};
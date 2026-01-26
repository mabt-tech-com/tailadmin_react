// src/hooks/useApiKeys.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import type { APIKeyItem, APIKeyPermissions } from "../types/api/apiKeys";
import { apiKeysService } from "./../services/api/apiService";

export function useApiKeys() {
  const [items, setItems] = useState<APIKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create-result (for "show full key once" UX)
  const [newPlainKey, setNewPlainKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiKeysService.list();
      setItems(data.items);
    } catch (e: any) {
      setError(e?.message || "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (name: string, permissions: APIKeyPermissions) => {
      setError(null);
      const res = await apiKeysService.create({ name, permissions });
      setNewPlainKey(res.plain_key);
      setNewKeyName(res.api_key.name);
      // Optimistic insert at top
      setItems((prev) => [res.api_key, ...prev]);
      return res;
    },
    []
  );

  const setActive = useCallback(async (keyId: number, isActive: boolean) => {
    setError(null);
    const updated = await apiKeysService.setActive(keyId, isActive);
    setItems((prev) => prev.map((k) => (k.id === keyId ? updated : k)));
    return updated;
  }, []);

  const remove = useCallback(async (keyId: number) => {
    setError(null);
    await apiKeysService.delete(keyId);
    setItems((prev) => prev.filter((k) => k.id !== keyId));
  }, []);

  const clearNewKeyModal = useCallback(() => {
    setNewPlainKey(null);
    setNewKeyName(null);
  }, []);

  const activeCount = useMemo(() => items.filter((k) => k.is_active).length, [items]);

  return {
    items,
    activeCount,
    loading,
    error,
    refresh,
    create,
    setActive,
    remove,
    newPlainKey,
    newKeyName,
    clearNewKeyModal,
  };
}
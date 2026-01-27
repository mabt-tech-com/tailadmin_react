// src/components/qall/api-keys/ApiKeyTable.tsx
"use client";

import { useMemo, useState } from "react";
import Switch from "../../form/switch/Switch";
import AddApiKeyModal from "./AddApiKeyModal";
import { useApiKeys } from "../../../hooks/useApiKeysApi";
import type { APIKeyItem } from "../../../types/api/apiKeys";
import { Copy, Trash2 } from "lucide-react";
import NewApiKeySuccessModal from "./ApiKeySuccessModal";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function formatLastUsed(iso: string | null) {
  if (!iso) return "Never used";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function ApiKeyTable() {
  const {
    items,
    loading,
    error,
    create,
    setActive,
    remove,
    newPlainKey,
    newKeyName,
    clearNewKeyModal,
  } = useApiKeys();

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const countLabel = useMemo(() => items.length, [items]);

  const handleCopy = async (k: APIKeyItem) => {
    try {
      await navigator.clipboard.writeText(k.key_prefix);
      setCopiedId(k.id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // ignore
    }
  };

  const handleDelete = async (k: APIKeyItem) => {
    const ok = window.confirm(`Delete API key "${k.name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      setDeletingId(k.id);
      await remove(k.id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (k: APIKeyItem, next: boolean) => {
    try {
      setTogglingId(k.id);
      await setActive(k.id, next);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 pl-5 dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center justify-between border-b border-gray-100 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            API Keys ({countLabel})
          </h3>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <div className="flex items-center gap-3 justify-end">
            <AddApiKeyModal onCreate={create} />
          </div>
          <NewApiKeySuccessModal
            isOpen={!!newPlainKey}
            plainKey={newPlainKey}
            keyName={newKeyName}
            onClose={() => {
              clearNewKeyModal();
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="custom-scrollbar overflow-x-auto px-1 pb-4">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="py-3 pr-5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Created</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Last used</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Disable/Enable</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No API keys yet. Create your first key.
                </td>
              </tr>
            ) : (
              items.map((k) => (
                <tr key={k.id}>
                  <td className="py-3 pr-5 whitespace-nowrap">
                    <div>
                      <label className="mb-2 inline-block text-sm text-gray-700 dark:text-gray-400">
                        {k.name}
                      </label>

                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            value={k.key_prefix}
                            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full min-w-[360px] rounded-lg border border-gray-300 bg-transparent py-3 pr-[90px] pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                            readOnly
                          />
                          <button
                            className="absolute top-1/2 right-0 inline-flex h-11 -translate-y-1/2 cursor-pointer items-center gap-1 rounded-r-lg border border-gray-300 py-3 pr-3 pl-3.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            onClick={() => handleCopy(k)}
                            disabled={copiedId === k.id}
                          >
                            <Copy size={18} className="mr-1" />
                            {copiedId === k.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Usage: {k.usage_count}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        k.is_active
                          ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500"
                          : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                      }`}
                    >
                      {k.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDate(k.created_at)}
                  </td>

                  <td className="px-5 py-3 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatLastUsed(k.last_used_at)}
                  </td>

                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Switch
                        defaultChecked={k.is_active}
                        onChange={(checked: boolean) => handleToggle(k, checked)}
                        disabled={togglingId === k.id}
                      />
                      {togglingId === k.id && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Saving…</span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex w-full items-center gap-3">
                      <button
                        onClick={() => handleDelete(k)}
                        disabled={deletingId === k.id}
                        className="shadow-theme-xs inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      >
                        <Trash2 size={18} className="mr-1" />
                        {deletingId === k.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
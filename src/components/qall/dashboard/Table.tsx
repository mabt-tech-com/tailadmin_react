// src/components/tables/DataTables/TableTwo/DataTableTwo.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table/index.tsx";

import PaginationWithButton from "./PaginationWithButton.tsx";
import Badge from "../../ui/badge/Badge.tsx";
import { Eye, RadioTower, RefreshCcw } from "lucide-react";

import { useDashboard } from "../../../hooks/useDashboardApi.ts";
import type { DashboardRecentCall } from "../../../types/api/dashboard.ts";

type SortKey = "assistant_name" | "customer_phone_number" | "status" | "started_at";
type SortOrder = "asc" | "desc";

function formatStartedAt(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  // Matches Jinja: '%b %d, %H:%M'
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function getStatusBadgeProps(statusRaw: string) {
  const status = (statusRaw || "").toLowerCase();

  if (status === "ongoing") {
    return {
      variant: "light" as const,
      color: "primary" as const,
      label: "Ongoing",
      showPulse: true,
    };
  }

  if (status === "completed") {
    return {
      variant: "light" as const,
      color: "success" as const,
      label: "Completed",
      showPulse: false,
    };
  }

  // Anything else => error-ish
  return {
    variant: "light" as const,
    color: "error" as const,
    label: statusRaw ? statusRaw[0].toUpperCase() + statusRaw.slice(1) : "Unknown",
    showPulse: false,
  };
}

function getSortValue(item: DashboardRecentCall, key: SortKey): string {
  switch (key) {
    case "assistant_name":
      return item.assistant_name ?? "";
    case "customer_phone_number":
      return item.customer_phone_number ?? "";
    case "status":
      return item.status ?? "";
    case "started_at":
      return item.started_at ?? ""; // ISO comparable as string
    default:
      return "";
  }
}

export default function RecentCallsTable() {
  const { data, loading, error, refetch } = useDashboard();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [sortKey, setSortKey] = useState<SortKey>("started_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm] = useState(""); // search input currently commented in your UI

  const rows: DashboardRecentCall[] = data?.recent_calls ?? [];

  const filteredAndSortedData = useMemo(() => {
    const filtered = rows.filter((item) => {
      if (!searchTerm.trim()) return true;

      const haystack = [
        item.assistant_name,
        item.to_phone_number,
        item.customer_phone_number,
        item.status,
        item.started_at ?? "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchTerm.toLowerCase());
    });

    const sorted = filtered.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);

      const cmp = av.localeCompare(bv);
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [rows, sortKey, sortOrder, searchTerm]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const isRefreshing = loading && !!data; // initial load vs refresh

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header bar (match Jinja layout: left title, right live + refresh) */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Calls
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-inter text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full animate-pulse bg-success-500" />
            Live Updates
          </span>

          <button
            onClick={() => void refetch()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            aria-label="Refresh recent calls"
            title="Refresh"
          >
            <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading / error / empty state */}
      {loading && !data && (
        <div className="border border-t-0 border-gray-100 dark:border-white/[0.05] px-6 py-8 text-sm text-gray-500 dark:text-gray-400">
          Loading recent calls…
        </div>
      )}

      {!loading && error && (
        <div className="border border-t-0 border-gray-100 dark:border-white/[0.05] px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <RefreshCcw size={18} />
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && totalItems === 0 && (
        <div className="border border-t-0 border-gray-100 dark:border-white/[0.05] px-6 py-10 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800" />
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            No recent calls
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            When your assistants start handling calls, they’ll appear here.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && totalItems > 0 && (
        <>
          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    { key: "assistant_name", label: "Assistant" },
                    { key: "customer_phone_number", label: "Caller" },
                    { key: "status", label: "Status" },
                    { key: "started_at", label: "Started" },
                  ].map(({ key, label }) => (
                    <TableCell
                      key={key}
                      isHeader
                      className="px-6 py-4 text-left border border-gray-100 dark:border-white/[0.05]"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer select-none"
                        onClick={() => handleSort(key as SortKey)}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {label}
                        </p>
                        <button className="flex flex-col gap-0.5" aria-label={`Sort by ${label}`}>
                          <svg
                            className={`text-gray-300 dark:text-gray-700 ${
                              sortKey === key && sortOrder === "asc" ? "text-brand-500" : ""
                            }`}
                            width="8"
                            height="5"
                            viewBox="0 0 8 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                              fill="currentColor"
                            />
                          </svg>
                          <svg
                            className={`text-gray-300 dark:text-gray-700 ${
                              sortKey === key && sortOrder === "desc" ? "text-brand-500" : ""
                            }`}
                            width="8"
                            height="5"
                            viewBox="0 0 8 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  ))}

                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right border border-gray-100 dark:border-white/[0.05]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </p>
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentData.map((call) => {
                  const badge = getStatusBadgeProps(call.status);
                  const initial = (call.assistant_name || "U")[0]?.toUpperCase();

                  return (
                    <TableRow
                      key={call.id}
                      className="border-b border-gray-100 dark:border-white/[0.05] hover:bg-gray-50/60 dark:hover:bg-white/[0.03]"
                    >
                      {/* Assistant cell (avatar + name + to_phone_number) */}
                      <TableCell className="px-6 py-4 border border-gray-100 dark:border-white/[0.05]">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center dark:text-white font-semibold text-sm">
                            {initial}
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
                              {call.assistant_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {call.to_phone_number}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Caller */}
                      <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                        {call.customer_phone_number}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-6 py-4 text-sm border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <Badge variant={badge.variant} color={badge.color}>
                            {badge.showPulse && (
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500/50 animate-pulse" />
                            )}
                            {badge.label}
                          </Badge>
                        </span>
                      </TableCell>

                      {/* Started */}
                      <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                        {formatStartedAt(call.started_at)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6 py-4 text-sm border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={`/calls/${call.id}`}
                            className="shadow-theme-xs inline-flex p-3  items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          >
                            <Eye size={16} className="mr-2" />
                            View
                          </a>

                          {call.status?.toLowerCase() === "ongoing" && (
                            <button
                              type="button"
                            className="shadow-theme-xs inline-flex p-3  items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                              onClick={() => {
                                // TODO: wire real monitor action (websocket / live page)
                                // For now, you can route to a monitor page if you have it:
                                // window.location.href = `/calls/${call.id}?tab=monitor`;
                              }}
                            >
                              <RadioTower size={16} className="mr-2" />
                              Monitor
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination footer */}
          <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
              <PaginationWithButton
                totalPages={totalPages}
                initialPage={currentPage}
                onPageChange={handlePageChange}
              />

              <div className="pt-3 xl:pt-0">
                <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
                  Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} entries
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
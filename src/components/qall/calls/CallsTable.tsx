// src/components/qall/calls/CallsTable.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ArrowLeft, ArrowRight, Check, CircleCheck, Eye, Search, Settings2, AlertCircle } from "lucide-react";
import { useCallsApi } from "../../../hooks/useCallsApi";
import { CallResponse } from "../../../types/api/calls";
import ConnectionStatus from "../../common/ConnectionStatus";

interface Sort {
  column: keyof Row | string;
  asc: boolean;
}

interface Row {
  id: string;
  callId: number;
  fromNumber: string;
  startedAt: string;
  assistantName: string;
  assistantNumber: string;
  assistantInitials?: string;
  status: "Live" | "Completed" | "Failed" | string;
  statusClass: string;
  performancePercent: number | null;
  durationSec: number | null;
  recorded: boolean;
  transcriptsCount: number | null;
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusLabel = (status: string): "Live" | "Completed" | "Failed" => {
  switch (status) {
    case 'ongoing': return "Live";
    case 'completed': return "Completed";
    case 'failed': return "Failed";
    default: return "Completed";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'ongoing':
      return "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 text-xs rounded-full px-2 py-0.5 font-medium";
    case 'completed':
      return "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500 text-xs rounded-full px-2 py-0.5 font-medium";
    case 'failed':
      return "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-500 text-xs rounded-full px-2 py-0.5 font-medium";
    default:
      return "bg-gray-50 dark:bg-gray-500/15 text-gray-700 dark:text-gray-400 text-xs rounded-full px-2 py-0.5 font-medium";
  }
};

const formatDuration = (sec: number | null) => {
  if (sec === null) return "–";
  return `${sec}s`;
};

const CallsTable: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calls, setCalls] = useState<CallResponse[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>({ column: "startedAt", asc: false });
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { getCalls, searchCalls, getCallRecordings, getCallTranscripts, connectionStatus } = useCallsApi();
  const perPage: number = 50;

  useEffect(() => {
    const fetchCalls = async () => {
      if (connectionStatus === 'disconnected') {
        setError('API connection failed. Please check your connection.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let callsData: CallResponse[];

        if (searchQuery.length >= 3) {
          callsData = await searchCalls(searchQuery, 200);
        } else {
          const params: any = {
            skip: (page - 1) * perPage,
            limit: perPage,
          };

          if (selectedTab !== "All") {
            params.status = selectedTab.toLowerCase();
          }

          callsData = await getCalls(params);
        }

        // Transform API data to Row format
        const transformedCalls = await Promise.all(callsData.map(async (call) => {
          let recordingsCount = 0;
          let transcriptsCount = 0;

          try {
            const recordings = await getCallRecordings(call.id);
            recordingsCount = recordings.length;

            const transcripts = await getCallTranscripts(call.id);
            transcriptsCount = transcripts.length;
          } catch (err) {
            // Silently fail for individual call details - we'll still show the call
            console.warn(`Error fetching additional data for call ${call.id}:`, err);
          }

          return {
            id: call.call_sid.substring(0, 20) + '...',
            callId: call.id,
            fromNumber: call.customer_phone_number,
            startedAt: formatDateTime(call.started_at),
            assistantName: call.assistant?.name || "Unknown",
            assistantNumber: call.to_phone_number,
            assistantInitials: call.assistant?.name?.charAt(0) || "A",
            status: getStatusLabel(call.status),
            statusClass: getStatusClass(call.status),
            performancePercent: call.call_meta?.confidence ? Math.round(call.call_meta.confidence * 100) : null,
            durationSec: call.duration || null,
            recorded: recordingsCount > 0,
            transcriptsCount: transcriptsCount || null,
          };
        }));

        setCalls(transformedCalls);
      } catch (err: any) {
        console.error('Failed to fetch calls:', err);
        setError(err.message || 'Failed to load calls. Please check your API connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [page, selectedTab, searchQuery, getCalls, searchCalls, getCallRecordings, getCallTranscripts, connectionStatus]);

  const totalPages: number = Math.ceil(calls.length / perPage);
  const startRow: number = (page - 1) * perPage;
  const endRow: number = page * perPage;

  const toggleAll = (): void => {
    if (selectedRows.length === calls.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(calls.map(r => r.id));
    }
  };

  const toggleRow = (id: string): void => {
    setSelectedRows((prev) =>
        prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const prevPage = (): void => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = (): void => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPage = (n: number): void => {
    setPage(n);
  };

  const getPaginatedRows = (): Row[] => {
    const sorted = [...calls];

    sorted.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';

      switch (sort.column) {
        case "startedAt":
          aVal = new Date(a.startedAt).getTime();
          bVal = new Date(b.startedAt).getTime();
          break;
        case "assistantName":
          aVal = a.assistantName.toLowerCase();
          bVal = b.assistantName.toLowerCase();
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "performancePercent":
          aVal = a.performancePercent ?? -1;
          bVal = b.performancePercent ?? -1;
          break;
        case "durationSec":
          aVal = a.durationSec ?? -1;
          bVal = b.durationSec ?? -1;
          break;
        default:
          aVal = a[sort.column as keyof Row] || '';
          bVal = b[sort.column as keyof Row] || '';
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * (sort.asc ? 1 : -1);
      }

      return aVal < bVal ? (sort.asc ? -1 : 1) : aVal > bVal ? (sort.asc ? 1 : -1) : 0;
    });

    return sorted.slice(startRow, endRow);
  };

  const paginatedRows: Row[] = getPaginatedRows();

  if (connectionStatus === 'disconnected') {
    return (
        <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">API Connection Required</h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Cannot load calls without API connection. Please verify:
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>The Qall API server is running on http://localhost:9000</li>
                  <li>Your Bearer token is correctly configured</li>
                  <li>The API is accessible from your browser</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
    );
  }

  if (loading && calls.length === 0) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
          <p className="text-red-600 dark:text-red-400">Error loading calls: {error}</p>
        </div>
    );
  }

  return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <ConnectionStatus status={connectionStatus} />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between dark:border-gray-800">
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Call Records
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analytics and insights from your voice AI conversations
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:items-center">
              <div className="inline-flex h-11 flex-1 w-full gap-0.5 overflow-x-auto rounded-lg bg-gray-100 p-0.5 sm:w-auto lg:min-w-fit dark:bg-gray-900">
                {["All", "Completed", "Live", "Failed"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                          setSelectedTab(tab);
                          setPage(1);
                        }}
                        className={`h-10 flex-1 rounded-md px-2 py-2 text-xs font-medium sm:px-3 sm:text-sm lg:flex-initial ${
                            selectedTab === tab
                                ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      {tab}
                    </button>
                ))}
              </div>
              <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <Search size={20} />
              </span>
                <input
                    type="text"
                    placeholder="Search calls..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <div className="relative">
                <button
                    className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    onClick={() => setShowFilter(!showFilter)}
                >
                  <Settings2 size={20} />
                  Filter
                </button>
              </div>
              <div className="inline-flex text-xs text-gray-500 dark:text-gray-400">
                {calls.length} {calls.length === 1 ? 'call' : 'calls'} found
              </div>
            </div>
          </div>
          <div>
            <div className="custom-scrollbar overflow-x-auto">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                    <TableCell isHeader className="p-4">
                      <div className="flex w-full cursor-pointer items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <label className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                            <span className="relative">
                              <input
                                  type="checkbox"
                                  className="sr-only"
                                  onChange={toggleAll}
                                  checked={selectedRows.length === calls.length && calls.length > 0}
                              />
                              <span
                                  className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                                      selectedRows.length === calls.length && calls.length > 0
                                          ? "border-brand-500 bg-brand-500"
                                          : "bg-transparent border-gray-300 dark:border-gray-700"
                                  }`}
                              >
                                <span className={selectedRows.length === calls.length && calls.length > 0 ? "" : "opacity-0"}>
                                  <Check color="white" size={12}/>
                                </span>
                              </span>
                            </span>
                            </label>
                          </div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            CALL DETAILS
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      ASSISTANT
                    </th>

                    <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      STATUS
                    </th>

                    <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      PERFORMANCE
                    </th>

                    <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      DURATION
                    </th>

                    <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      DATA
                    </th>

                    <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      ACTIONS
                    </th>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
                  {paginatedRows.map((row) => (
                      <TableRow
                          key={row.id}
                          className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <TableCell className="p-4 whitespace-nowrap">
                          <div className="group flex items-start gap-3">
                            <div className="pt-1">
                              <label className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                            <span className="relative">
                              <input
                                  type="checkbox"
                                  className="sr-only"
                                  onChange={() => toggleRow(row.id)}
                                  checked={selectedRows.includes(row.id)}
                              />
                              <span
                                  className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                                      selectedRows.includes(row.id)
                                          ? "border-brand-500 bg-brand-500"
                                          : "bg-transparent border-gray-300 dark:border-gray-700"
                                  }`}
                              >
                                <span className={selectedRows.includes(row.id) ? "" : "opacity-0"}>
                                  <Check color="white" size={12}/>
                                </span>
                              </span>
                            </span>
                              </label>
                            </div>

                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {row.id}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {row.fromNumber}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {row.startedAt}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-800 dark:bg-gray-800 dark:text-white/90">
                              {row.assistantInitials}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {row.assistantName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {row.assistantNumber}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-4 whitespace-nowrap">
                          <span className={row.statusClass}>{row.status}</span>
                        </TableCell>

                        <TableCell className="p-4 whitespace-nowrap">
                          {row.performancePercent === null ? (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                          No data
                        </span>
                          ) : (
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-800">
                                  <div
                                      className="h-2 rounded-full bg-success-500"
                                      style={{ width: `${row.performancePercent}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                            {row.performancePercent}%
                          </span>
                              </div>
                          )}
                        </TableCell>

                        <TableCell className="p-4 whitespace-nowrap text-sm font-normal text-gray-700 dark:text-white/90">
                          {formatDuration(row.durationSec)}
                        </TableCell>

                        <TableCell className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {row.recorded ? (
                                  <span className="inline-flex text-success-700 dark:text-success-500">
                              <div className="text-white dark:text-[#171f2e]"><CircleCheck size={16} fill="#0fb86a" /></div>
                              Recorded
                            </span>
                              ) : (
                                  "No Recording"
                              )}
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {row.transcriptsCount === null ? (
                                  "No Transcript"
                              ) : (
                                  <span className="text-brand-700 dark:text-brand-400">
                              {row.transcriptsCount} Transcripts
                            </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-4 whitespace-nowrap">
                          <button
                              type="button"
                              className="shadow-theme-xs inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                              aria-label="View"
                          >
                            <a href={`/call/${row.callId}`}>
                              <Eye size={18} />
                            </a>
                          </button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="pb-3 sm:pb-0">
              <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="text-gray-800 dark:text-white/90">
                  {startRow + 1}
                </span>{" "}
                to{" "}
                <span className="text-gray-800 dark:text-white/90">
                  {Math.min(endRow, calls.length)}
                </span>{" "}
                of{" "}
                <span className="text-gray-800 dark:text-white/90">
                  {calls.length}
                </span>
              </span>
              </div>
              <div className="flex bg-gray-50 dark:sm:bg-transparent dark:bg-white/[0.03] sm:bg-transparent rounded-lg w-full sm:w-auto p-4 sm:p-0 items-center justify-between gap-2 sm:justify-normal">
                <button
                    onClick={prevPage}
                    disabled={page === 1}
                    className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <ArrowLeft/>
                </button>
                <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
                Page <span>{page}</span> of <span>{totalPages}</span>
              </span>
                <ul className="hidden items-center gap-0.5 sm:flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <li key={n}>
                        <a
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                              goToPage(n);
                            }}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                                page === n
                                    ? "bg-brand-500 text-white"
                                    : "text-gray-700 dark:text-gray-400 hover:bg-brand-500 hover:text-white dark:hover:text-white"
                            }`}
                        >
                          {n}
                        </a>
                      </li>
                  ))}
                </ul>
                <button
                    onClick={nextPage}
                    disabled={page === totalPages || calls.length === 0}
                    className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CallsTable;
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ArrowLeft, ArrowRight, Check, CircleCheck, Eye, Search, Settings2 } from "lucide-react";



interface Sort {
  column: string;
  asc: boolean;
}
interface Row {
  id: string; // call id
  fromNumber: string;
  startedAt: string;

  assistantName: string;
  assistantNumber: string;
  assistantInitials?: string; // "A"

  status: "Live" | "Completed" | "Failed";
  statusClass: string;

  performancePercent: number | null; // null => "No data"
  durationSec: number | null; // null => "-"

  recorded: boolean;
  transcriptsCount: number | null; // null => "No Transcript"

  // optional: show "No Recording" text when false
}

const initialRows: Row[] = [
  {
    id: "384b0612-5441-41cf-965d",
    fromNumber: "+491639194536",
    startedAt: "Jan 21, 2026 23:17",
    assistantName: "Assistant-1",
    assistantNumber: "+16592157434",
    assistantInitials: "A",
    status: "Live",
    statusClass:
      "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 text-xs rounded-full px-2 py-0.5 font-medium",
    performancePercent: null,
    durationSec: null,
    recorded: false,
    transcriptsCount: null,
  },
  {
    id: "1769s0ds327-1s21a3-di2j4",
    fromNumber: "+491639194536",
    startedAt: "Jan 21, 2026 22:35",
    assistantName: "Assistant-1",
    assistantNumber: "+16592157434",
    assistantInitials: "A",
    status: "Completed",
    statusClass:
      "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500 text-xs rounded-full px-2 py-0.5 font-medium",
    performancePercent: 98,
    durationSec: 68,
    recorded: true,
    transcriptsCount: 9,
  },
];

const formatDuration = (sec: number | null) => {
  if (sec === null) return "–";
  return `${sec}s`;
};

const CallsTable: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rows] = useState<Row[]>(initialRows);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>({ column: "", asc: true });
  const [page, setPage] = useState<number>(1);
  const perPage: number = 50;

  const totalPages: number = Math.ceil(rows.length / perPage);
  const startRow: number = (page - 1) * perPage;
  const endRow: number = page * perPage;

  const toggleAll = (): void => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((r) => r.id));
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
    const sorted: Row[] = [...rows];

    const getSortValue = (r: Row) => {
      switch (sort.column) {
        case "startedAt": {
          // startedAt is a display string; Date.parse handles many formats
          // If parse fails, fallback to 0 so it sorts consistently.
          const t = Date.parse(r.startedAt);
          return Number.isNaN(t) ? 0 : t;
        }

        case "id":
        case "fromNumber":
        case "assistantName":
        case "assistantNumber":
        case "status":
          return (r[sort.column] ?? "").toString().toLowerCase();

        case "performancePercent":
          return r.performancePercent ?? -1; // nulls go last/first depending on asc

        case "durationSec":
          return r.durationSec ?? -1;

        case "recorded":
          return r.recorded ? 1 : 0;

        case "transcriptsCount":
          return r.transcriptsCount ?? -1;

        default:
          return "";
      }
    };

    if (sort.column) {
      sorted.sort((a, b) => {
        const aVal = getSortValue(a);
        const bVal = getSortValue(b);

        // numbers
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * (sort.asc ? 1 : -1);
        }

        // strings (fallback)
        return aVal < bVal ? (sort.asc ? -1 : 1) : aVal > bVal ? (sort.asc ? 1 : -1) : 0;
      });
    }

    return sorted.slice(startRow, endRow);
  };

  const paginatedRows: Row[] = getPaginatedRows();

  return (
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
            {["All", "Completed", "Live", "Failed"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`h-10 flex-1 rounded-md px-2 py-2 text-xs font-medium sm:px-3 sm:text-sm lg:flex-initial ${
                    selectedTab === tab
                      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
           <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <Search size={20} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            {showFilter && (
              <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <input
                    type="text"
                    className="shadow-theme-xs h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Search category..."
                  />
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Company
                  </label>
                  <input
                    type="text"
                    className="shadow-theme-xs h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Search company..."
                  />
                </div>
                <button className="bg-brand-500 hover:bg-brand-600 h-10 w-full rounded-lg px-3 py-2 text-sm font-medium text-white">
                  Apply
                </button>
              </div>
            )}
          </div>
          <div className=" inline-flex text-xs text-gray-500 dark:text-gray-400">{initialRows.length} results</div>

        </div>
      </div>
      <div>
        <div className="custom-scrollbar overflow-x-auto">
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                {/* checkbox + CALL DETAILS */}
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
                              checked={selectedRows.length === rows.length}
                            />
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${
                                selectedRows.length === rows.length
                                  ? "border-brand-500 bg-brand-500"
                                  : "bg-transparent border-gray-300 dark:border-gray-700"
                              }`}
                            >
                              <span className={selectedRows.length === rows.length ? "" : "opacity-0"}>
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

                {/* ASSISTANT */}
                <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  ASSISTANT
                </th>

                {/* STATUS */}
                <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  STATUS
                </th>

                {/* PERFORMANCE */}
                <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  PERFORMANCE
                </th>

                {/* DURATION */}
                <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  DURATION
                </th>

                {/* DATA */}
                <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  DATA
                </th>

                {/* ACTIONS */}
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
                  {/* CALL DETAILS (checkbox + 3 lines) */}
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

                  {/* ASSISTANT (avatar + name + number) */}
                  <TableCell className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-800 dark:bg-gray-800 dark:text-white/90">
                        {row.assistantInitials ?? "A"}
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

                  {/* STATUS (pill) */}
                  <TableCell className="p-4 whitespace-nowrap">
                    <span className={row.statusClass}>{row.status}</span>
                  </TableCell>

                  {/* PERFORMANCE (bar + percent OR No data) */}
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

                  {/* DURATION */}
                  <TableCell className="p-4 whitespace-nowrap text-sm font-normal text-gray-700 dark:text-white/90">
                    {formatDuration(row.durationSec)}
                  </TableCell>

                  {/* DATA (Recorded / No Recording + Transcripts) */}
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

                  {/* ACTIONS (eye icon button) */}
                  <TableCell className="p-4 whitespace-nowrap">
                    <button
                      type="button"
                      className="shadow-theme-xs inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      aria-label="View"
                      
                    >
                      <a href="/call"><Eye size={18} /></a>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center flex-col sm:flex-row  justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="pb-3 sm:pb-0">
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="text-gray-800 dark:text-white/90">
                {startRow + 1}
              </span>{" "}
              to{" "}
              <span className="text-gray-800 dark:text-white/90">
                {Math.min(endRow, rows.length)}
              </span>{" "}
              of{" "}
              <span className="text-gray-800 dark:text-white/90">
                {rows.length}
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
              disabled={page === totalPages}
              className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallsTable;

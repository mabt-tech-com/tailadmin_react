// src/components/tables/DataTables/TableTwo/DataTableTwo.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  DotSmallIcon,

  EyeViewIcon, LoadIcon,
  RadioTowerIcon,

} from "../../../../icons";
import PaginationWithButton from "./PaginationWithButton";
import Badge from "../../../ui/badge/Badge.tsx";
import Button from "../../../ui/button/Button.tsx";
import CustomTooltip from "../../../ui/tooltip/CustomToolTip.tsx";

const tableRowData = [
  {
    id: 1,
    assistantName: "Abram Schleifer",
    assistantPhone: "(555) 123-4567",
    callerPhone: "(555) 987-6543",
    started: "25 Apr, 2027",
    status: "Ongoing",
  },
  {
    id: 2,
    assistantName: "Charlotte Anderson",
    assistantPhone: "(555) 234-5678",
    callerPhone: "(555) 876-5432",
    started: "12 Mar, 2025",
    status: "Ongoing",
  },
  {
    id: 3,
    assistantName: "Ethan Brown",
    assistantPhone: "(555) 345-6789",
    callerPhone: "(555) 765-4321",
    started: "01 Jan, 2024",
    status: "Ongoing",
  },
  {
    id: 4,
    assistantName: "Sophia Martinez",
    assistantPhone: "(555) 456-7890",
    callerPhone: "(555) 654-3210",
    started: "15 Jun, 2026",
    status: "Ongoing",
  },
  {
    id: 5,
    assistantName: "James Wilson",
    assistantPhone: "(555) 567-8901",
    callerPhone: "(555) 543-2109",
    started: "20 Sep, 2025",
    status: "Ongoing",
  },
  {
    id: 6,
    assistantName: "Olivia Johnson",
    assistantPhone: "(555) 678-9012",
    callerPhone: "(555) 432-1098",
    started: "08 Nov, 2026",
    status: "Ongoing",
  },
  {
    id: 7,
    assistantName: "William Smith",
    assistantPhone: "(555) 789-0123",
    callerPhone: "(555) 321-0987",
    started: "03 Feb, 2026",
    status: "Ongoing",
  },
  {
    id: 8,
    assistantName: "Isabella Davis",
    assistantPhone: "(555) 890-1234",
    callerPhone: "(555) 210-9876",
    started: "18 Jul, 2025",
    status: "Ongoing",
  },
  {
    id: 9,
    assistantName: "Liam Moore",
    assistantPhone: "(555) 901-2345",
    callerPhone: "(555) 109-8765",
    started: "30 Oct, 2024",
    status: "Ongoing",
  },
  {
    id: 10,
    assistantName: "Mia Garcia",
    assistantPhone: "(555) 012-3456",
    callerPhone: "(555) 098-7654",
    started: "12 Dec, 2027",
    status: "Ongoing",
  },
];
type SortKey = "assistantName" | "callerPhone" | "status" | "started";
type SortOrder = "asc" | "desc";

export default function DataTableTwo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("assistantName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedData = useMemo(() => {
    return tableRowData
        .filter((item) =>
            Object.values(item).some(
                (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
          return sortOrder === "asc"
              ? String(a[sortKey]).localeCompare(String(b[sortKey]))
              : String(b[sortKey]).localeCompare(String(a[sortKey]));
        });
  }, [sortKey, sortOrder, searchTerm]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  return (
      <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
        <div
            className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400"> Show </span>
            <div className="relative z-20 bg-transparent">
              <select
                  className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                {[5, 8, 10].map((value) => (
                    <option
                        key={value}
                        value={value}
                        className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                    >
                      {value}
                    </option>
                ))}
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
              </svg>
            </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400"> entries </span>
          </div>


          <div className="flex items-center gap-3">
            <Badge variant="light" color="success" startIcon={<DotSmallIcon/>}>
              Live Server
            </Badge>{" "}


            <Button variant="outline" size="sm">
              <LoadIcon className="size-5"/>
              Refresh Data Button
            </Button>

          </div>


          {/*  THIS IS THE SEARCH FIELD I COMMENTED IT */}
          {/*<div className="relative">
          <span
              className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-4 top-1/2 dark:text-gray-400">
            <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
              />
            </svg>
          </span>
          <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
          />
        </div>*/}

          {/*  THIS IS THE SEARCH FIELD I COMMENTED IT */}



        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    {key: "assistantName", label: "Assistant"},
                    {key: "callerPhone", label: "Caller"},
                    {key: "status", label: "Status"},
                    {key: "started", label: "Started"},
                  ].map(({ key, label }) => (
                      <TableCell
                          key={key}
                          isHeader
                          className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                      >
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => handleSort(key as SortKey)}
                        >
                          <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                            {label}
                          </p>
                          <button className="flex flex-col gap-0.5">
                            <svg
                                className={`text-gray-300 dark:text-gray-700  ${
                                    sortKey === key && sortOrder === "asc"
                                        ? "text-brand-500"
                                        : ""
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
                                className={`text-gray-300 dark:text-gray-700  ${
                                    sortKey === key && sortOrder === "desc"
                                        ? "text-brand-500"
                                        : ""
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
                      className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                  >
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Action
                    </p>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item, i) => (
                    <TableRow key={i + 1}>
                      <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                        <div>
                          <div>{item.assistantName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">user <br/> {item.assistantPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                        {item.callerPhone}
                      </TableCell>
                      <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                        <Badge variant="light" color="success" startIcon={<DotSmallIcon/>}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                        {item.started}
                      </TableCell>
                      <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                        <div className="flex items-center w-full gap-2">

                          <CustomTooltip text="View Details">
                            <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                              <EyeViewIcon className="size-5" />
                            </button>
                          </CustomTooltip>

                          <CustomTooltip text="Monitor">
                            <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
                              <RadioTowerIcon className="size-5" />
                            </button>
                          </CustomTooltip>

                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
            {/* Left side: Showing entries */}

            <PaginationWithButton
                totalPages={totalPages}
                initialPage={currentPage}
                onPageChange={handlePageChange}
            />
            <div className="pt-3 xl:pt-0">
              <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
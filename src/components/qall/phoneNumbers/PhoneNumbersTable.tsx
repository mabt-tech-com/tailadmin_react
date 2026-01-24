import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, ChevronDown, ChevronUp, PhoneCall, Save } from "lucide-react";

interface PhoneNumber {
  id: number;
  number: string;
  name: string;
  integration: string;
  assistant: string | null;
  status: string;
  createdAt: string;
}

const PhoneNumbersTable: React.FC = () => {
  const [products] = useState<PhoneNumber[]>([
    {
      id: 1,
      name: "Trunk Support",
      number: "+491639194536",
      integration: "SIP",
      assistant: "Assistant-1",
      status: "Active",
      createdAt: "12 Feb. 2027",
    },
    {
      id: 2,
      name: "Sales",
      number: "+491734394336",
      integration: "Twilio",
      assistant: null,
      status: "Inactive",
      createdAt: "01 Feb. 2027",
    },
    {
      id: 3,
      name: "Production",
      number: "+49401237438",
      integration: "SIP",
      assistant: "Assistant-2",
      status: "Active",
      createdAt: "19 Mar. 2027",
    },
  ]);

  // mock assistants list (replace with API data later)
  const assistants = useMemo(
    () => ["Assistant-1", "Assistant-2", "Assistant-3"],
    []
  );

  // ✅ allow multiple expanded rows
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // per-row form state (test number + assistant selection)
  const [rowState, setRowState] = useState<
    Record<number, { testTo: string; assistant: string | "" }>
  >({});

  const toggleRow = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setRowState((prev) => ({
      ...prev,
      [id]: prev[id] ?? { testTo: "", assistant: "" },
    }));
  };

  const updateRowState = (
    id: number,
    patch: Partial<{ testTo: string; assistant: string | "" }>
  ) => {
    setRowState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { testTo: "", assistant: "" }), ...patch },
    }));
  };

  const onTestOutboundCall = (p: PhoneNumber) => {
    const s = rowState[p.id] ?? { testTo: "", assistant: "" };

    // TODO: replace with your real API call
    console.log("TEST OUTBOUND CALL", {
      fromNumberId: p.id,
      fromNumber: p.number,
      to: s.testTo,
      assistant: s.assistant || p.assistant,
    });

    alert(
      `Testing outbound call\nFrom: ${p.number}\nTo: ${s.testTo || "(missing)"}\nAssistant: ${
        s.assistant || p.assistant || "(none)"
      }`
    );
  };

  const onAssignAssistant = (p: PhoneNumber) => {
    const s = rowState[p.id] ?? { testTo: "", assistant: "" };

    // TODO: replace with your real API call (PATCH number -> assistant)
    console.log("ASSIGN ASSISTANT", {
      numberId: p.id,
      assistant: s.assistant,
    });

    alert(`Assigned "${s.assistant || "(none)"}" to ${p.number}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Phone Numbers
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Test and edit your phone numbers.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/add-product"
            className="bg-brand-500 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            <Plus size={20} />
            Add Number
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3 pl-4">Numbers</div>
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Friendly Name
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Integration
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Assistant
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Created At
              </th>
              <th className="px-5 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {products.map((p) => {
              const isOpen = expandedIds.includes(p.id);
              const s = rowState[p.id] ?? { testTo: "", assistant: "" };

              return (
                <React.Fragment key={p.id}>
                  {/* MAIN ROW */}
                  <tr className="transition hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {p.number}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {p.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {p.integration}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {p.assistant ?? "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                          p.status === "Active"
                            ? "bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-500"
                            : "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {p.createdAt}
                      </p>
                    </td>

                    {/* EXPAND BUTTON (replaces 3-dots) */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => toggleRow(p.id)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                        aria-expanded={isOpen}
                        aria-controls={`row-expand-${p.id}`}
                        title={isOpen ? "Hide actions" : "Show actions"}
                      >
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* EXPANDED ROW (buttons only) */}
                  {isOpen && (
                    <tr
                       id={`row-expand-${p.id}`}
                       className="bg-gray-50 dark:bg-gray-900/30"
                     >
                       <td colSpan={7} className="px-5 py-4">
                         <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">

                    <div className="space-y-6">
                          {/* Assign assistant (stacked, simple) */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                  Assign assistant
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Choose who should answer calls for this number.
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <select
                                className="w-full sm:flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200"
                                value={s.assistant}
                                onChange={(e) =>
                                  updateRowState(p.id, {
                                    assistant: e.target.value,
                                  })
                                }
                              >
                                {assistants.map((a) => (
                                  <option key={a} value={a}>
                                    {a}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                onClick={() => onAssignAssistant(p)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
                              >
                                <Save className="h-4 w-4" />
                                Save
                              </button>
                            </div>
                          </div>

                          <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />

                          {/* Test outbound call (stacked, production-ready) */}
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                Test outbound call
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Place a test call from this number to verify routing.
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                value={s.testTo}
                                onChange={(e) =>
                                  updateRowState(p.id, {
                                    testTo: e.target.value,
                                  })
                                }
                                placeholder="Destination number (e.g. +49...)"
                                className="w-full sm:flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200"
                              />

                              <button
                                type="button"
                                onClick={() => onTestOutboundCall(p)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={!s.testTo.trim()}
                              >
                                <PhoneCall className="h-4 w-4" />
                                Test call
                              </button>
                            </div>

                            {!s.testTo.trim() && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Enter a destination number to enable testing.
                              </p>
                            )}
                          </div>
                        </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhoneNumbersTable;
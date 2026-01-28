// src/pages/Crm.tsx
import PageMeta from "../components/common/PageMeta";
import DashboardMetrics from "../components/qall/dashboard/Metrics";
import DashboardChart from "../components/qall/dashboard/Chart";
import { useDashboard } from "../hooks/useDashboardApi";
import RecentCallsTable from "../components/qall/dashboard/Table";

export default function Dashboard() {
  const { data, loading, error, refetch } = useDashboard();

  return (
    <>
      <PageMeta title="Qall Voice AI Dashboard" description="" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="text-gray-600 dark:text-gray-300">Loading dashboard…</div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-white p-5 dark:border-red-900/30 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-red-600 dark:text-red-400">
                  {error}
                </div>
                <button
                  onClick={() => void refetch()}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.06]"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && data && (
            <div>
              {/* <!-- Metric Group Four --> */}
              <DashboardMetrics
                activeAssistants={data.active_assistants}
                totalCalls={data.total_calls}
                activeCalls={data.active_calls}
                successRate={data.success_rate}
                assistantAvailability={data.assistant_availability}
              />
              {/* <!-- Metric Group Four --> */}
            </div>
          )}
        </div>

        <div className="col-span-12">
          {!loading && !error && data ? (
            <DashboardChart points={data.daily_call_data} />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
              <div className="text-gray-600 dark:text-gray-300">Chart loading…</div>
            </div>
          )}
        </div>

        <div className="col-span-12">
          {/* Your existing table component */}
          <RecentCallsTable />
          {/* If you want, we can wire recent_calls into this table next */}
        </div>
      </div>
    </>
  );
}
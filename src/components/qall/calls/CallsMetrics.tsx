// src/components/qall/calls/CallsMetrics.tsx
import { CheckCircle, Clock, Phone, Sparkle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useCallsApi } from "../../../hooks/useCallsApi";
import { CallAnalyticsResponse } from "../../../types/api/calls";
import ConnectionStatus from "../../common/ConnectionStatus";

export default function CallsMetrics() {
  const [analytics, setAnalytics] = useState<CallAnalyticsResponse | null>(null);
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { getAnalytics, getCallCount, loading, error, connectionStatus } = useCallsApi();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch analytics for the last 7 days
        const analyticsData = await getAnalytics('7d');
        setAnalytics(analyticsData);

        // Fetch live calls count
        const liveCallsData = await getCallCount({ status: 'ongoing' });
        setLiveCount(liveCallsData.count);
        setConnectionError(null);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
        setConnectionError('Unable to fetch metrics. Please check your API connection.');
      }
    };

    fetchMetrics();
  }, [getAnalytics, getCallCount]);

  if (connectionStatus === 'disconnected') {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">API Connection Failed</h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Unable to connect to the API. Please verify:
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>The API server is running on http://localhost:9000</li>
                  <li>Your Bearer token is valid: qall_uvpprwa6bmvsz31l227oft6vggrj0yau</li>
                  <li>CORS is properly configured on the server</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
    );
  }

  if (loading && !analytics) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
    );
  }

  if (error || connectionError) {
    return (
        <div className="space-y-4">
          <ConnectionStatus status={connectionStatus} />
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">
              {error || connectionError}
            </p>
          </div>
        </div>
    );
  }

  const successRate = analytics && analytics.total_calls > 0
      ? Math.round((analytics.completed_calls / analytics.total_calls) * 100)
      : 0;

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Call Analytics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time metrics from your Qall Voice AI
            </p>
          </div>
          <ConnectionStatus status={connectionStatus} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-200/40 text-gray-800 dark:bg-blue-700/30 dark:text-white/90">
              <Phone className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {analytics?.total_calls?.toLocaleString() || 0}
              </h3>
              <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                Total Calls
              </p>
            </div>
          </article>

          <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-green-200/40 text-gray-800 dark:bg-green-700/30 dark:text-white/90">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {successRate}%
              </h3>
              <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                Success Rate
              </p>
            </div>
          </article>

          <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-purple-200/40 text-gray-800 dark:bg-purple-800/30 dark:text-white/90">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {analytics ? `${Math.round(analytics.avg_duration)}s` : '0s'}
              </h3>
              <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                Average Duration
              </p>
            </div>
          </article>

          <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-orange-200/40 text-gray-800 dark:bg-orange-600/30 dark:text-white/90">
              <Sparkle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {liveCount !== null ? liveCount : '0'}
              </h3>
              <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center w-4 h-4 rounded-full ripple bg-success-500/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-success-500"></div>
                </div>
                Live Now
              </p>
            </div>
          </article>
        </div>
      </div>
  );
}
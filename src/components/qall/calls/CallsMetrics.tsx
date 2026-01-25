// src/components/qall/calls/CallsMetrics.tsx
import { CheckCircle, Clock, Phone, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import { useCallsApi } from "../../../hooks/useCallsApi";
import { CallAnalyticsResponse } from "../../../types/api/calls";

export default function CallsMetrics() {
  const [analytics, setAnalytics] = useState<CallAnalyticsResponse | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const { getAnalytics, getCallCount, loading, error } = useCallsApi();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch analytics for the last 7 days
        const analyticsData = await getAnalytics('7d');
        setAnalytics(analyticsData);

        // Fetch live calls count
        const liveCallsData = await getCallCount({ status: 'ongoing' });
        setLiveCount(liveCallsData.count);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
      }
    };

    fetchMetrics();
  }, [getAnalytics, getCallCount]);

  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
    );
  }

  if (error) {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">Error loading metrics: {error}</p>
        </div>
    );
  }

  const successRate = analytics
      ? ((analytics.completed_calls / analytics.total_calls) * 100)
      : 0;

  return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-200/40 text-gray-800 dark:bg-blue-700/30 dark:text-white/90">
            <Phone className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {analytics?.total_calls.toLocaleString() || 0}
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
              {Math.round(successRate)}%
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
              {liveCount}
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
  );
}
import React from "react";
import { Zap, Play, Check, LineChart } from "lucide-react";

type Props = {
  metrics: {
    avgResponseTime: number;
    fastestResponseTime: number;
    responseConsistency: number;
    processingLatency: number;
  };
};

const ResponseTimePanel: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          Response Time Intelligence
        </h3>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800 dark:text-white/90">
            {metrics.avgResponseTime}s
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Avg Response
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fastest */}
        <div className="rounded-lg p-4 bg-brand-500/10 border border-brand-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-brand-500 mb-1">Fastest Response</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white/90">
                {metrics.fastestResponseTime}s
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
              <Play className="h-5 w-5 text-brand-500" />
            </div>
          </div>
        </div>

        {/* Consistency */}
        <div className="rounded-lg p-4 bg-success-500/10 border border-success-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-success-700 dark:text-success-500 mb-1">
                Response Consistency
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white/90">
                {metrics.responseConsistency}%
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-success-500/20 flex items-center justify-center">
              <Check className="h-5 w-5 text-success-700 dark:text-success-500" />
            </div>
          </div>
        </div>

        {/* Latency */}
        <div className="rounded-lg p-4 bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-400 mb-1">Processing Latency</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white/90">
                {metrics.processingLatency}s
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <LineChart className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimePanel;
import React from "react";
import { FileDown, Download, FileText } from "lucide-react";
import { CallStatus } from "./types";

type Props = {
  call: {
    status: CallStatus;
    durationSec: number;
    assistantName: string;
    customerPhone: string;
  };
  metrics: {
    qualityScore: number;
    conversationFlowScore: number;
    engagementScore: number;
    userPercentage: number;
    aiPercentage: number;
    userTurns: number;
    aiTurns: number;
  };
  animateBars: boolean;
  onGenerateReport: () => void;
};

const RightSidebar: React.FC<Props> = ({
  call,
  metrics,
  animateBars,
  onGenerateReport,
}) => {
  const statusPill =
    call.status === "completed"
      ? "bg-success-500/20 text-success-700 dark:text-success-500 border border-success-500/30"
      : call.status === "ongoing"
      ? "bg-brand-500/20 text-brand-500 border border-brand-500/30"
      : "bg-warning-500/20 text-warning-600 dark:text-warning-400 border border-warning-500/30";

  return (
    <div className="space-y-6">
      {/* Call Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Call Status
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className={`px-2 py-1 rounded text-xs ${statusPill}`}>
              {call.status === "ongoing"
                ? "Live"
                : call.status === "completed"
                ? "Completed"
                : "Failed"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Duration</span>
            <span className="text-gray-800 dark:text-white/90">
              {call.durationSec}s
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Assistant</span>
            <span className="text-brand-500">{call.assistantName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Customer</span>
            <span className="text-gray-800 dark:text-white/90 font-mono">
              {call.customerPhone}
            </span>
          </div>
        </div>
      </div>

      {/* AI Performance */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          AI Performance
        </h3>

        {[
          ["Response Accuracy", metrics.qualityScore, "bg-success-500"],
          ["Conversation Flow", metrics.conversationFlowScore, "bg-brand-500"],
          ["Engagement Score", metrics.engagementScore, "bg-purple-500"],
        ].map(([label, value, color]) => (
          <div key={label as string} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm dark:text-gray-400">
                {label as string}
              </span>
              <span className="text-gray-800 dark:text-white/90 text-sm">
                {value as number}%
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-1000`}
                style={{
                  width: animateBars ? `${value as number}%` : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 flex items-center mb-4">
        Conversation Flow
      </h3>

      {/* Speaking Time */}
      <div className="space-y-3 mb-5">
        {[
          ["Customer", metrics.userPercentage, "bg-brand-500"],
          ["AI", metrics.aiPercentage, "bg-success-500"],
        ].map(([label, value, color]) => (
          <div key={label as string}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500 dark:text-gray-400">
                {label as string}
              </span>
              <span className="text-gray-800 dark:text-white/90 font-medium">
                {value as number}%
              </span>
            </div>

            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`${color} h-full rounded-full transition-all duration-700`}
                style={{ width: animateBars ? `${value}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Turns + Quality */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
          <div className="text-sm font-bold text-brand-500">
            {metrics.userTurns}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Customer Turns
          </div>
        </div>

        <div className="p-2 rounded-lg bg-success-500/10 border border-success-500/20">
          <div className="text-sm font-bold text-success-700 dark:text-success-500">
            {metrics.aiTurns}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            AI Responses
          </div>
        </div>

        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 col-span-2">
          <div className="text-sm font-bold text-purple-400">
            {metrics.qualityScore}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Confidence Score
          </div>
        </div>
      </div>
    </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Quick Actions
        </h3>

        <div className="space-y-3">
          <button
            type="button"
            className="w-full px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export Transcript
          </button>

          <button
            type="button"
            className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Audio
          </button>

          <button
            type="button"
            onClick={onGenerateReport}
            className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Analytics Report
          </button>
        </div>
      </div>

    </div>
  );
};

export default RightSidebar;
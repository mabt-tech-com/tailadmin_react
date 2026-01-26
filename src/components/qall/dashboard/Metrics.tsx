// src/components/qall/dashboard/Metrics.tsx
import React from "react";
import { Bot, Phone, Radio, CheckCircle } from "lucide-react";

type Props = {
  activeAssistants: number;
  totalCalls: number;
  activeCalls: number;
  successRate: number; // 0-100
  assistantAvailability: number; // 0-100
};

const clampPercent = (v: number) => Math.max(0, Math.min(100, Number.isFinite(v) ? v : 0));

const DashboardMetrics: React.FC<Props> = ({
  activeAssistants,
  totalCalls,
  activeCalls,
  successRate,
  assistantAvailability,
}) => {
  const data = [
    {
      id: 1,
      title: "AI Assistants",
      subtitle: "Ready to serve",
      value: activeAssistants,
      valueLabel: "Active",
      progress: clampPercent(assistantAvailability),
      icon: Bot,
    },
    {
      id: 2,
      title: "Voice Calls",
      subtitle: "All time",
      value: totalCalls,
      valueLabel: "Total",
      progress: 100,
      icon: Phone,
    },
    {
      id: 3,
      title: "Live Sessions",
      subtitle: "Real-time",
      value: activeCalls,
      valueLabel: "Live",
      progress: null,
      icon: Radio,
    },
    {
      id: 4,
      title: "Call Success",
      subtitle: "Completed Calls",
      value: Number(successRate.toFixed(1)),
      valueLabel: "Success Rate",
      progress: clampPercent(successRate),
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {data.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between">
              {/* Left */}
              <div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  <Icon className="size-6 text-gray-800 dark:text-white/90" />
                </div>

                <p className="mt-4 text-xl font-bold text-black dark:text-gray-100">
                  {item.title}
                </p>

                {item.subtitle && (
                  <p className="flex mt-1 text-sm text-gray-400 dark:text-gray-500 gap-2">
                    {item.subtitle === "Real-time" && (
                      <div className="flex mt-0.5 items-center justify-center w-4 h-4 rounded-full ripple bg-success-500/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-success-500 "></div>
                      </div>
                    )}
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Right */}
              <div className="text-right">
                <h4 className="text-3xl font-bold text-gray-800 dark:text-white/90">
                  {item.value}
                  {item.title === "Call Success" ? "%" : ""}
                </h4>

                {item.valueLabel && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.valueLabel}
                  </p>
                )}

                {/* Progress (conditional) */}
                {item.progress !== null && (
                  <div className="mt-2 flex flex-col items-end gap-1 mt-6">
                    <span className="text-sm font-medium text-success-500">
                      {item.progress}%
                    </span>

                    <div className="h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-800">
                      <div
                        className="h-1.5 rounded-full bg-success-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
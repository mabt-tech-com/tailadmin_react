// src/components/qall/dashboard/Chart.tsx
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import React from "react";
import type { DailyCallPoint } from "../../../types/api/dashboard";

type Props = {
  points: DailyCallPoint[];
};

export default function DashboardChart({ points }: Props) {
  const categories = points.map((p) => p.date);
  const series = [
    {
      name: "Calls",
      data: points.map((p) => p.count),
    },
  ];

  const options: ApexOptions = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 220,
      type: "area",
      toolbar: { show: false },
    },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    responsive: [
      { breakpoint: 480, options: { chart: { height: 220 } } },
      { breakpoint: 1600, options: { chart: { height: 220 } } },
      { breakpoint: 2600, options: { chart: { height: 250 } } },
    ],
    stroke: { curve: "straight", width: [2] },
    markers: { size: 0 },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { x: { format: "dd MMM yyyy" } },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: { title: { text: undefined } },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Call Volume
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Last 7 days
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-4  min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="area" height={320} />
        </div>
      </div>
    </div>
  );
}
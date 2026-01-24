import React, { useMemo, useState } from "react";
import { Play, Pause, Square, Music2, Eye, Zap, LineChart } from "lucide-react";
import { TranscriptItem } from "./types";

type Props = {
  transcripts: TranscriptItem[];
};

const AudioVisualization: React.FC<Props> = ({ transcripts }) => {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    setSpeed((s) => speeds[(speeds.indexOf(s) + 1) % speeds.length]);
  };

  const userSegments = useMemo(
    () => transcripts.filter((t) => t.speaker === "user").length,
    [transcripts]
  );

  const assistantSegments = useMemo(
    () => transcripts.filter((t) => t.speaker === "assistant").length,
    [transcripts]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6 flex items-center">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mr-3">
          <Music2 className="h-4 w-4 text-red-500" />
        </div>
        Neural Audio Intelligence
      </h3>

      {/* Controls wrapper matching your original UI */}
      <div className="rounded-xl p-4 mb-6 border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!playing ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="p-3 rounded-lg bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 transition-colors"
                aria-label="Play"
              >
                <Play className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(false)}
                className="p-3 rounded-lg bg-purple-500 text-white shadow-theme-xs hover:bg-purple-600 transition-colors"
                aria-label="Pause"
              >
                <Pause className="h-5 w-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="p-3 rounded-lg bg-gray-700 text-white shadow-theme-xs hover:bg-gray-600 transition-colors"
              aria-label="Stop"
            >
              <Square className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-2 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-brand-500 font-mono">00:00</span>
            <span className="text-gray-500 mx-2 dark:text-gray-400">/</span>
            <span className="text-gray-700 font-mono dark:text-gray-300">
              00:00
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 transition-opacity duration-300 ${
                playing ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              <span className="text-success-700 dark:text-success-500 text-sm font-medium">
                Live Analysis
              </span>
            </div>

            <button
              type="button"
              onClick={cycleSpeed}
              className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.06]"
            >
              {speed}x
            </button>
          </div>
        </div>
      </div>

      {/* Waveform placeholder styled like tabs/panels */}
      <div className="rounded-xl p-6 border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-500/5" />
        <div className="relative">
          <div className="h-32 w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Waveform placeholder
            </span>
          </div>
          <div className="mt-3 h-5 w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Timeline placeholder
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Speaker Analysis
            </h5>

            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-brand-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Customer Voice
              </span>
              <div className="ml-auto text-xs text-brand-500 font-medium">
                {userSegments} segments
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-success-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                AI Assistant
              </span>
              <div className="ml-auto text-xs text-success-700 dark:text-success-500 font-medium">
                {assistantSegments} segments
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Processing
              </span>
              <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 font-medium">
                Auto-detect
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Audio Quality
            </h5>

            {[
              ["Sample Rate", "22 kHz"],
              ["Format", "MP3"],
              ["Source", "S3"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-gray-500 text-sm dark:text-gray-400">
                  {k}
                </span>
                <span className="text-gray-800 dark:text-white/90 text-sm font-mono">
                  {v}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Interaction
            </h5>

            <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed space-y-2">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-brand-500" />
                <span>Click waveform to jump to transcript</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-success-700 dark:text-success-500" />
                <span>Real-time speaker detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <LineChart className="h-4 w-4 text-purple-400" />
                <span>Confidence visualization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualization;
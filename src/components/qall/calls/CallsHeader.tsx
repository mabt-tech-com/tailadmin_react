import React from "react";
import { ArrowLeft } from "lucide-react";
import { CallStatus } from "./types";

type Props = {
  callSid: string;
  startedAt: string;
  status: CallStatus;
};

const Header: React.FC<Props> = ({ callSid, startedAt, status }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <a
          href="/calls"
          className="p-2 text-gray-500 hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition-colors dark:text-gray-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </a>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Voice Analytics Intelligence
          </h1>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {callSid} • {startedAt}
          </p>
        </div>
      </div>

      {status === "ongoing" && (
        <div className="flex items-center space-x-2 px-3 py-2 bg-success-500/20 border border-success-500/30 rounded-lg">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
          <span className="text-success-700 dark:text-success-500 text-sm font-medium">
            Live Analysis
          </span>
        </div>
      )}
    </div>
  );
};

export default Header;
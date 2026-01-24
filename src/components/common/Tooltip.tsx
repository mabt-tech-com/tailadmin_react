import { CircleQuestionMark } from "lucide-react";
import { FC } from "react";

interface ToolTipProps {
  text: string;
}

export const Tooltip: FC<ToolTipProps> = ({ text }) => {
  return (
    <div className="relative inline-block group px-1">
      <CircleQuestionMark size={10} />
      <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          <div className="relative">
            <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-[#1E2634] px-3 py-2 text-xs font-medium text-white">
              {text}
            </div>
            <div className="absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-[#1E2634]"></div>
          </div>
        </div>
    </div>
  );
}

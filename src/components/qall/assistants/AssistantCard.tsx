import React from "react";
import { Link } from "react-router";
import { Pencil, Trash2, Bot } from "lucide-react";

export type AssistantStatus = "Active" | "Inactive";

export type AssistantPreview = {
  id: string | number;
  name: string;
  description: string;
  status: AssistantStatus;

  llmProvider: string;
  llmModel: string;

  sttProvider: string;
  sttModel: string;
  language: string;

  ttsProvider: string;
  ttsModel: string;
  voice: string;

  editHref: string;
  iconUrl?: string;
};

type Props = {
  assistant: AssistantPreview;
  onDelete?: (assistant: AssistantPreview) => void;
};

const StatusPill: React.FC<{ status: AssistantStatus }> = ({ status }) => {
  const active = status === "Active";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium border",
        active
          ? "bg-success-50 text-success-700 border-success-200/60 dark:bg-success-500/15 dark:text-success-500 dark:border-success-500/20"
          : "bg-gray-50 text-gray-600 border-gray-200/60 dark:bg-white/5 dark:text-gray-300 dark:border-gray-800",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          active ? "bg-success-600 dark:bg-success-500" : "bg-gray-400",
        ].join(" ")}
      />
      {status}
    </span>
  );
};


const Row: React.FC<{
  label: string;
  provider: string;
  model: string;
  meta?: string;
}> = ({ label, provider, model, meta }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </div>
        <div className="mt-1 text-sm text-gray-800 dark:text-white/90">
          <span className="font-medium">{provider}</span>
          <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
          <span className="font-mono text-[13px] text-gray-700 dark:text-gray-300">
            {model}
          </span>
        </div>
      </div>

      {meta ? (
        <div className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
          {meta}
        </div>
      ) : null}
    </div>
  );
};

const AssistantCard: React.FC<Props> = ({ assistant, onDelete }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Top */}
      <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-15 w-18 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
              <Bot size={25} className="text-gray-500 dark:text-gray-400" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate">
              {assistant.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
              {assistant.description}
            </p>
          </div>
        </div>

        <StatusPill status={assistant.status} />
      </div>

      
      {/* ONE combined stack block */}
      <div className="px-2 py-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">


          <div className="space-y-4">
            <Row
              label="LLM"
              provider={assistant.llmProvider}
              model={assistant.llmModel}
            />

            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            <Row
              label="Speech-to-Text"
              provider={assistant.sttProvider}
              model={assistant.sttModel}
              meta={assistant.language}
            />

            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            <Row
              label="Text-to-Speech"
              provider={assistant.ttsProvider}
              model={assistant.ttsModel}
              meta={assistant.voice}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to={assistant.editHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200 dark:hover:bg-white/5"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete?.(assistant)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AssistantCard;
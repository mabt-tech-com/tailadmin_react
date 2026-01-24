import React, { useMemo, useState } from "react";
import { MessageSquare, Monitor, Link2, Check, X, User, Bot } from "lucide-react";

import type { ChatMessage, TranscriptItem, WebhookLog } from "./types";

/* ---------------- shared types ---------------- */

type TabsId = "timeline" | "llm" | "webhooks";

export interface CallAnalyticsTabsProps {
  transcripts: TranscriptItem[];
  metrics: {
    userTurns: number;
    aiTurns: number;
    qualityScore: number;
  };

  chatMessages: ChatMessage[];
  chatStats: {
    totalMessages: number;
    systemMessages: number;
    userMessages: number;
    assistantMessages: number;
    totalTokens: number;
  };

  webhookLogs: WebhookLog[];
  webhookStats: {
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    avgResponseTimeMs: number;
    typesCount: number;
  };

  // keep your original styling/logic injectable so nothing is lost:
  confidenceDot: (c?: number) => string;
  roleStyles: (role: ChatMessage["role"]) => string;
  roleBadge: (role: ChatMessage["role"]) => { label: string; bg: string };
}

/* ---------------- tabs ui ---------------- */

interface TabData {
  id: TabsId;
  label: string;
  icon: React.ReactNode;
}

interface TabButtonProps extends TabData {
  isActive: boolean;
  onClick: () => void;
}


const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full inline-flex items-center justify-center border-b-2 px-2.5 py-1 pb-2 transition-colors duration-200 ${
        isActive
          ? "border-brand-500 dark:border-brand-400"
          : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
      }`}
    >
      <h3
        className={`text-lg font-semibold flex items-center ${
          isActive
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {icon}
        {label}
      </h3>
    </button>
  );
};

/* ---------------- component ---------------- */

const CallAnalyticsTabs: React.FC<CallAnalyticsTabsProps> = ({
  transcripts,
  metrics,
  chatMessages,
  chatStats,
  webhookLogs,
  webhookStats,
  confidenceDot,
  roleStyles,
  roleBadge,
}) => {
  const [activeTab, setActiveTab] = useState<TabsId>("timeline");
  const [expandedWebhookIds, setExpandedWebhookIds] = useState<string[]>([]);

// ✅ CHANGE 2: update your tabs definition to use the "title style" icon blocks (keep labels the same)
const tabs: TabData[] = useMemo(
  () => [
    {
      id: "timeline",
      label: "Messages",
      icon: (
        <div className="w-8 h-8 rounded-lg bg-success-500/20 flex items-center justify-center mr-3">
          <MessageSquare className="h-4 w-4 text-success-700 dark:text-success-500" />
        </div>
      ),
    },
    {
      id: "llm",
      label: "LLM Conversation",
      icon: (
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
          <Monitor className="h-4 w-4 text-purple-400" />
        </div>
      ),
    },
    {
      id: "webhooks",
      label: "Webhook Logs",
      icon: (
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mr-3">
          <Link2 className="w-4 h-4 text-orange-400" />
        </div>
      ),
    },
  ],
  []
);

  const toggleWebhookDetails = (id: string) => {
    setExpandedWebhookIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-3 bg-white dark:bg-white/[0.03] border border-gray-200 rounded-xl dark:border-gray-800">
      {/* Tab Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-6">
        <nav className="grid grid-cols-3">
            {tabs.map((tab) => (
            <TabButton
                key={tab.id}
                {...tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
            />
            ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* ---------------- Conversation Timeline ---------------- */}
        {activeTab === "timeline" && (
          <div>
            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{transcripts.length} messages</span>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-800" />
                <span>Live transcript</span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {transcripts.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
                  data-confidence={t.confidence ?? 0.9}
                >
                  <div className="flex-shrink-0">
                    {t.speaker === "assistant" ? (
                      <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            t.speaker === "assistant"
                              ? "text-success-700 dark:text-success-500"
                              : "text-brand-500"
                          }`}
                        >
                          {t.speaker === "assistant" ? "Assistant" : "User"}
                        </span>

                        {t.confidence !== undefined && (
                          <div className="flex items-center space-x-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${confidenceDot(
                                t.confidence
                              )}`}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.round(t.confidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t.time}
                        </span>
                        {t.segmentStart !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {t.segmentStart.toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                      {t.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-brand-500">
                    {metrics.userTurns}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Customer
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-success-700 dark:text-success-500">
                    {metrics.aiTurns}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Assistant
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-400">
                    {metrics.qualityScore}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Accuracy
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- LLM Conversation History ---------------- */}
        {activeTab === "llm" && (
          <div>
            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{chatStats.totalMessages} messages</span>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-800" />
                <span>{chatStats.totalTokens} tokens</span>
              </div>
            </div>

            {/* Chat Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-3">
                <div className="text-brand-500 text-xl font-bold">
                  {chatStats.systemMessages}
                </div>
                <div className="text-brand-500 text-xs">System</div>
              </div>
              <div className="bg-success-500/10 border border-success-500/20 rounded-lg p-3">
                <div className="text-success-700 dark:text-success-500 text-xl font-bold">
                  {chatStats.userMessages}
                </div>
                <div className="text-success-700 dark:text-success-500 text-xs">
                  User
                </div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="text-purple-400 text-xl font-bold">
                  {chatStats.assistantMessages}
                </div>
                <div className="text-purple-400 text-xs">Assistant</div>
              </div>
              <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-3">
                <div className="text-warning-600 dark:text-warning-400 text-xl font-bold">
                  {chatStats.totalTokens}
                </div>
                <div className="text-warning-600 dark:text-warning-400 text-xs">
                  Total Tokens
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {chatMessages.length > 0 ? (
                chatMessages.map((m) => {
                  const badge = roleBadge(m.role);
                  return (
                    <div key={m.id} className={`p-4 rounded-lg ${roleStyles(m.role)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-6 h-6 rounded-full ${badge.bg} flex items-center justify-center`}
                          >
                            {m.role === "system" ? (
                              <Monitor className="h-3 w-3 text-white" />
                            ) : m.role === "user" ? (
                              <User className="h-3 w-3 text-white" />
                            ) : (
                              <Bot className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-800 dark:text-white/90 font-medium text-sm">
                            {badge.label}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            #{m.messageIndex + 1}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{m.timestamp}</span>
                          {m.llmProvider && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                              {m.llmProvider}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-3">
                        {m.content}
                      </div>

                      {m.role === "assistant" && m.totalTokens !== undefined && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-2">
                          {m.llmModel && (
                            <span className="text-gray-500">{m.llmModel}</span>
                          )}
                          {m.promptTokens !== undefined && (
                            <span>Prompt: {m.promptTokens}</span>
                          )}
                          {m.completionTokens !== undefined && (
                            <span>Completion: {m.completionTokens}</span>
                          )}
                          <span className="font-medium">Total: {m.totalTokens}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
                    No LLM Conversation Data
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    LLM conversation history will appear here when available
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- Webhook Logs ---------------- */}
        {activeTab === "webhooks" && (
          <div>
            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{webhookStats.totalAttempts} attempts</span>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                <span>
                  {webhookStats.successfulAttempts}/{webhookStats.totalAttempts} success
                </span>
              </div>
            </div>

            {webhookLogs.length > 0 ? (
              <>
                {/* Webhook Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-success-50 dark:bg-success-500/15 border border-success-200/50 dark:border-success-500/20 rounded-lg p-3">
                    <div className="text-success-700 dark:text-success-500 text-xl font-bold">
                      {webhookStats.successfulAttempts}
                    </div>
                    <div className="text-success-600 dark:text-success-400 text-xs">
                      Successful
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-500/15 border border-red-200/50 dark:border-red-500/20 rounded-lg p-3">
                    <div className="text-red-600 dark:text-red-500 text-xl font-bold">
                      {webhookStats.failedAttempts}
                    </div>
                    <div className="text-red-500 dark:text-red-400 text-xs">Failed</div>
                  </div>

                  <div className="bg-brand-50 dark:bg-brand-500/15 border border-brand-200/50 dark:border-brand-500/20 rounded-lg p-3">
                    <div className="text-brand-700 dark:text-brand-400 text-xl font-bold">
                      {Math.round(webhookStats.avgResponseTimeMs)}ms
                    </div>
                    <div className="text-brand-600 dark:text-brand-400 text-xs">
                      Avg Response
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-500/15 border border-purple-200/50 dark:border-purple-500/20 rounded-lg p-3">
                    <div className="text-purple-600 dark:text-purple-400 text-xl font-bold">
                      {webhookStats.typesCount}
                    </div>
                    <div className="text-purple-500 dark:text-purple-400 text-xs">
                      Types
                    </div>
                  </div>
                </div>

                {/* Webhook Attempts */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {webhookLogs.map((w) => {
                    const statusCode = w.responseStatusCode;

                    const containerClass = w.success
                      ? "bg-success-50 dark:bg-success-500/15 border border-success-200/50 dark:border-success-500/20"
                      : "bg-red-50 dark:bg-red-500/15 border border-red-200/50 dark:border-red-500/20";

                    const statusPillClass =
                      statusCode === undefined
                        ? "bg-gray-700 text-white"
                        : statusCode < 300
                        ? "bg-success-600 text-white"
                        : statusCode < 400
                        ? "bg-warning-600 text-white"
                        : "bg-red-600 text-white";

                    return (
                      <div key={w.id} className={`p-4 rounded-lg ${containerClass}`}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                w.success ? "bg-success-600" : "bg-red-600"
                              }`}
                            >
                              {w.success ? (
                                <Check className="w-3 h-3 text-white" />
                              ) : (
                                <X className="w-3 h-3 text-white" />
                              )}
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {w.webhookType}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[420px]">
                                {w.webhookUrl}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {w.attemptedAt}
                            </div>
                            {w.responseTimeMs !== undefined && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {w.responseTimeMs}ms
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">
                              Response
                            </div>
                            {statusCode !== undefined ? (
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded ${statusPillClass}`}>
                                  {statusCode}
                                </span>
                                {(w.retryCount ?? 0) > 0 && (
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {w.retryCount} retries
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">
                                No response
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">
                              Error
                            </div>
                            {w.errorMessage ? (
                              <div className="text-red-600 dark:text-red-500 truncate">
                                {w.errorMessage}
                              </div>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">
                                None
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expand */}
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => toggleWebhookDetails(w.id)}
                            className="text-xs text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
                          >
                            View Details
                          </button>

                          {expandedWebhookIds.includes(w.id) && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded border border-gray-200 dark:border-gray-800">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                                    Request Payload
                                  </div>
                                  <pre className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto border border-gray-200 dark:border-gray-800">
{JSON.stringify(w.requestPayload ?? "None", null, 2)}
                                  </pre>
                                </div>

                                <div>
                                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                                    Response Body
                                  </div>
                                  <pre className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto border border-gray-200 dark:border-gray-800">
{w.responseBody ?? "None"}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Link2 className="w-8 h-8 text-orange-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
                  No Webhook Logs
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Webhook delivery attempts will appear here when configured
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallAnalyticsTabs;
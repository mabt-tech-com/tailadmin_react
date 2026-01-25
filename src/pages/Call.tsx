// src/pages/Call.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/qall/calls/CallsHeader";
import ResponseTimePanel from "../components/qall/calls/ResponseTimePanel";
import AudioVisualization from "../components/qall/calls/AudioVisualization";
import RightSidebar from "../components/qall/calls/RightSidebar";
import ConversationDetails from "../components/qall/calls/ConversationDetails";
import {
  CallStatus,
  TranscriptItem,
  ChatMessage,
  WebhookLog,
} from "../components/qall/calls/types";

/* ---------------- helpers ---------------- */

const confidenceDot = (c?: number) => {
  if (c === undefined) return "bg-gray-400";
  if (c > 0.9) return "bg-success-500";
  if (c > 0.7) return "bg-warning-500";
  return "bg-red-500";
};

const roleStyles = (role: ChatMessage["role"]) => {
  if (role === "system") return "bg-brand-500/10 border border-brand-500/20";
  if (role === "user") return "bg-success-500/10 border border-success-500/20";
  return "bg-purple-500/10 border border-purple-500/20";
};

const roleBadge = (role: ChatMessage["role"]) => {
  if (role === "system") return { label: "System", bg: "bg-brand-500" };
  if (role === "user") return { label: "User", bg: "bg-success-500" };
  return { label: "Assistant", bg: "bg-purple-500" };
};

/* ---------------- page ---------------- */

const CallAnalyticsPage: React.FC = () => {
  /* ---------- data ---------- */

  const call = useMemo(
    () => ({
      callSid: "384b0612-5441-41cf-965d-80f1097a8a7c",
      startedAt: "January 21, 2026 at 23:17",
      status: "ongoing" as CallStatus,
      durationSec: 68,
      assistantName: "Assistant-1",
      customerPhone: "+491639194536",
    }),
    []
  );

  const metrics = useMemo(
    () => ({
      avgResponseTime: 1.2,
      fastestResponseTime: 0.6,
      responseConsistency: 92,
      processingLatency: 1.2,

      userPercentage: 54,
      aiPercentage: 46,
      userTurns: 18,
      aiTurns: 17,

      qualityScore: 89,
      conversationFlowScore: 84,
      engagementScore: 76,
    }),
    []
  );

  const transcripts: TranscriptItem[] = useMemo(
    () => [
      {
        id: "t1",
        speaker: "user",
        content: "Hi, I’m calling about my recent order—can you check the status?",
        confidence: 0.92,
        time: "23:17:04",
        segmentStart: 1.2,
      },
      {
        id: "t2",
        speaker: "assistant",
        content:
          "Sure—can you share the order ID or the phone number used at checkout?",
        confidence: 0.94,
        time: "23:17:07",
        segmentStart: 4.1,
      },
    ],
    []
  );

  const chatMessages: ChatMessage[] = useMemo(
    () => [
      {
        id: "m1",
        role: "system",
        messageIndex: 0,
        timestamp: "23:17:01",
        llmProvider: "OpenAI",
        content:
          "You are a helpful voice assistant. Keep responses short and clear.",
      },
      {
        id: "m2",
        role: "user",
        messageIndex: 1,
        timestamp: "23:17:04",
        content:
          "Hi, I’m calling about my recent order—can you check the status?",
      },
      {
        id: "m3",
        role: "assistant",
        messageIndex: 2,
        timestamp: "23:17:07",
        llmProvider: "OpenAI",
        llmModel: "gpt-4.1-mini",
        promptTokens: 210,
        completionTokens: 47,
        totalTokens: 257,
        content:
          "Sure—can you share the order ID or the phone number used at checkout?",
      },
    ],
    []
  );

  const webhookLogs: WebhookLog[] = useMemo(
    () => [
      {
        id: "w1",
        success: true,
        webhookType: "call.completed",
        webhookUrl: "https://example.com/webhooks/calls",
        attemptedAt: "23:18:21",
        responseTimeMs: 183,
        responseStatusCode: 200,
        retryCount: 0,
        requestPayload: { call_sid: call.callSid, status: "completed" },
        responseBody: '{"ok": true}',
      },
    ],
    [call.callSid]
  );

  /* ---------- derived ---------- */

  const chatStats = useMemo(() => {
    const totalTokens = chatMessages.reduce(
      (s, m) => s + (m.totalTokens ?? 0),
      0
    );
    return {
      totalMessages: chatMessages.length,
      systemMessages: chatMessages.filter((m) => m.role === "system").length,
      userMessages: chatMessages.filter((m) => m.role === "user").length,
      assistantMessages: chatMessages.filter((m) => m.role === "assistant").length,
      totalTokens,
    };
  }, [chatMessages]);

  const webhookStats = useMemo(() => {
    const totalAttempts = webhookLogs.length;
    const successfulAttempts = webhookLogs.filter((w) => w.success).length;
    const failedAttempts = totalAttempts - successfulAttempts;
    const avgResponseTimeMs =
      webhookLogs.reduce((s, w) => s + (w.responseTimeMs ?? 0), 0) /
      Math.max(1, totalAttempts);

    return {
      totalAttempts,
      successfulAttempts,
      failedAttempts,
      avgResponseTimeMs,
      typesCount: new Set(webhookLogs.map((w) => w.webhookType)).size,
    };
  }, [webhookLogs]);

  /* ---------- UI state ---------- */

  const [expandedWebhookIds, setExpandedWebhookIds] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateBars(true), 150);
    return () => clearTimeout(t);
  }, []);

  const toggleWebhook = (id: string) => {
    setExpandedWebhookIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    setSpeed((s) => speeds[(speeds.indexOf(s) + 1) % speeds.length]);
  };

  const generateReport = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            call,
            metrics,
            transcriptsCount: transcripts.length,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-analytics-${call.callSid}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- render ---------- */

  return (
    <div className="space-y-6">
      <Header callSid={call.callSid}
      startedAt={call.startedAt}
       status={call.status} />

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3 space-y-6">
    <ResponseTimePanel metrics={metrics} />
    <AudioVisualization transcripts={transcripts} />
    <ConversationDetails
        transcripts={transcripts}
        metrics={metrics}
        chatMessages={chatMessages}
        chatStats={chatStats}
        webhookLogs={webhookLogs}
        webhookStats={webhookStats}
        confidenceDot={confidenceDot}
        roleStyles={roleStyles}
        roleBadge={roleBadge}
    />
  </div>

  <div className="lg:col-span-1">
    <RightSidebar
      call={call}
      metrics={metrics}
      animateBars={animateBars}
      onGenerateReport={generateReport}
    />
  </div>
</div>


    </div>
  );
};

export default CallAnalyticsPage;
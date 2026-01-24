// types.ts

export type CallStatus = "completed" | "ongoing" | "failed";

export type TranscriptItem = {
  id: string;
  speaker: "assistant" | "user";
  content: string;
  confidence?: number; // 0..1
  time: string; // "23:17:04"
  segmentStart?: number; // seconds
};

export type ChatMessage = {
  id: string;
  role: "system" | "user" | "assistant";
  messageIndex: number;
  timestamp: string; // "23:17:04"
  llmProvider?: string;
  llmModel?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  content: string;
};

export type WebhookLog = {
  id: string;
  success: boolean;
  webhookType: string;
  webhookUrl: string;
  attemptedAt: string; // "23:17:04"
  responseTimeMs?: number;
  responseStatusCode?: number;
  retryCount?: number;
  errorMessage?: string;
  requestPayload?: Record<string, any>;
  responseBody?: string;
};
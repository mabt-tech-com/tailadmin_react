// src/services/api/callsService.ts
import { apiClient } from "./apiClient";
import type {
  CallResponse,
  TranscriptResponse,
  RecordingResponse,
  CallAnalyticsResponse,
  CallStatsResponse,
  CallCountResponse,
  GetCallsParams,
} from "../../types/api/calls";

function toQuery(params?: Record<string, any>) {
  const qs = new URLSearchParams();
  if (!params) return "";
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

const callsService = {
  // Get calls with filters
  getCalls(params: GetCallsParams = {}) {
    return apiClient.request<CallResponse[]>(`/api/v1/calls${toQuery(params)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Export calls (csv/json) -> Blob
  exportCalls(format: "csv" | "json", params?: GetCallsParams) {
    const query = toQuery({ format, ...(params || {}) });
    return apiClient.requestBlob(`/api/v1/calls/export${query}`, {
      method: "GET",
      // no content-type needed
    });
  },

  // Get analytics
  getAnalytics(period: "1d" | "7d" | "30d" | "90d" = "7d") {
    return apiClient.request<CallAnalyticsResponse>(`/api/v1/calls/analytics?period=${period}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Get call count
  getCallCount(params?: GetCallsParams) {
    return apiClient.request<CallCountResponse>(`/api/v1/calls/count${toQuery(params)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Get specific call
  getCall(callId: number) {
    return apiClient.request<CallResponse>(`/api/v1/calls/${callId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Get call by SID
  getCallBySid(callSid: string) {
    return apiClient.request<CallResponse>(`/api/v1/calls/sid/${encodeURIComponent(callSid)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Update call metadata
  updateCallMetadata(callId: number, metadata: Record<string, any>) {
    return apiClient.request<CallResponse>(`/api/v1/calls/${callId}/metadata`, {
      method: "PATCH",
      body: JSON.stringify({ metadata }),
      headers: { Accept: "application/json" },
    });
  },

  // Get call transcripts
  getCallTranscripts(callId: number, speaker?: string, includeInterim = false) {
    const query = toQuery({ speaker, include_interim: includeInterim });
    return apiClient.request<TranscriptResponse[]>(`/api/v1/calls/${callId}/transcripts${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Export transcripts -> Blob
  exportTranscripts(callId: number, format: "txt" | "json" | "csv", speaker?: string) {
    const query = toQuery({ format, speaker });
    return apiClient.requestBlob(`/api/v1/calls/${callId}/transcripts/export${query}`, {
      method: "GET",
    });
  },

  // Get call recordings
  getCallRecordings(callId: number, recordingType?: string) {
    const query = toQuery({ recording_type: recordingType });
    return apiClient.request<RecordingResponse[]>(`/api/v1/calls/${callId}/recordings${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Get call stats
  getCallStats() {
    return apiClient.request<CallStatsResponse>(`/api/v1/calls/stats`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // Search calls
  searchCalls(query: string, limit = 50) {
    return apiClient.request<CallResponse[]>(
      `/api/v1/calls/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );
  },

  // Test API connection
  async testConnection() {
    try {
      await callsService.getCalls({ limit: 1 });
      return true;
    } catch {
      return false;
    }
  },
};

export default callsService;
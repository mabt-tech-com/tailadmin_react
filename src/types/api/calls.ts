// src/types/api/calls.ts

export interface CallResponse {
    id: number;
    call_sid: string;
    assistant_id: number;
    to_phone_number: string;
    customer_phone_number: string;
    status: 'ongoing' | 'completed' | 'failed' | string;
    started_at: string;
    ended_at?: string;
    duration?: number;
    cost?: number;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    assistant?: {
        id: number;
        name: string;
    };
}

export interface TranscriptResponse {
    id: number;
    call_id: number;
    content: string;
    is_final: boolean;
    segment_start?: number;
    segment_end?: number;
    confidence?: number;
    speaker?: string;
    created_at?: string;
}

export interface RecordingResponse {
    id: number;
    call_id: number;
    recording_sid?: string;
    s3_key?: string;
    s3_url?: string;
    duration?: number;
    format: string;
    recording_type: string;
    recording_source: string;
    status: string;
    created_at?: string;
}

export interface CallAnalyticsResponse {
    total_calls: number;
    completed_calls: number;
    failed_calls: number;
    ongoing_calls: number;
    total_duration: number;
    avg_duration: number;
    success_rate: number;
    daily_stats: Record<string, DailyStat>;
    top_assistants: AssistantStat[];
}

export interface DailyStat {
    total: number;
    completed: number;
    failed: number;
}

export interface AssistantStat {
    assistant_id: number;
    assistant_name: string;
    calls: number;
    duration: number;
}

export interface CallStatsResponse {
    total_calls: number;
    total_duration: number;
    average_duration: number;
}

export interface CallCountResponse {
    count: number;
}

export interface GetCallsParams {
    skip?: number;
    limit?: number;
    status?: string;
    assistant_id?: number;
    customer_phone?: string;
    date_from?: string;
    date_to?: string;
    min_duration?: number;
    max_duration?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
}
// src/services/api/callsService.ts
import {
    CallResponse,
    TranscriptResponse,
    RecordingResponse,
    CallAnalyticsResponse,
    CallStatsResponse,
    CallCountResponse,
    GetCallsParams
} from '../../types/api/calls';

//const API_BASE_URL = 'http://localhost:9000/api/v1';
//const API_BASE_URL = 'http://qall.io/api/v1';

// Your static Bearer token - hardcoded as provided
//const STATIC_BEARER_TOKEN = 'qall_uvpprwa6bmvsz31l227oft6vggrj0yau';


// Update this line in src/services/api/callsService.ts
const API_BASE_URL = import.meta.env.VITE_API_URL ||  'http://localhost:9000/api/v1';
// 'http://qall.io/api/v1';

const STATIC_BEARER_TOKEN = import.meta.env.VITE_API_TOKEN || 'qall_uvpprwa6bmvsz31l227oft6vggrj0yau';



// Update this line in src/services/api/callsService.ts
/*const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1';

const STATIC_BEARER_TOKEN = import.meta.env.VITE_API_TOKEN || 'qall_uvpprwa6bmvsz31l227oft6vggrj0yau';*/

class CallsService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Always use the static Bearer token
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${STATIC_BEARER_TOKEN}`,
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error [${response.status}]:`, errorText);
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return response.json();
    }

    // Get calls with filters
    async getCalls(params: GetCallsParams = {}): Promise<CallResponse[]> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        const endpoint = `/calls${queryString ? `?${queryString}` : ''}`;

        return this.request<CallResponse[]>(endpoint);
    }

    // Export calls
    async exportCalls(format: 'csv' | 'json', params?: GetCallsParams): Promise<Blob> {
        const queryParams = new URLSearchParams({ format });

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const response = await fetch(`${API_BASE_URL}/calls/export?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${STATIC_BEARER_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Export error: ${response.status} ${response.statusText}`);
        }

        return response.blob();
    }

    // Get analytics
    async getAnalytics(period: '1d' | '7d' | '30d' | '90d' = '7d'): Promise<CallAnalyticsResponse> {
        return this.request<CallAnalyticsResponse>(`/calls/analytics?period=${period}`);
    }

    // Get call count
    async getCallCount(params?: GetCallsParams): Promise<CallCountResponse> {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = `/calls/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.request<CallCountResponse>(endpoint);
    }

    // Get specific call
    async getCall(callId: number): Promise<CallResponse> {
        return this.request<CallResponse>(`/calls/${callId}`);
    }

    // Get call by SID
    async getCallBySid(callSid: string): Promise<CallResponse> {
        return this.request<CallResponse>(`/calls/sid/${callSid}`);
    }

    // Update call metadata
    async updateCallMetadata(callId: number, metadata: Record<string, any>): Promise<CallResponse> {
        return this.request<CallResponse>(`/calls/${callId}/metadata`, {
            method: 'PATCH',
            body: JSON.stringify({ metadata }),
        });
    }

    // Get call transcripts
    async getCallTranscripts(callId: number, speaker?: string, includeInterim: boolean = false): Promise<TranscriptResponse[]> {
        const queryParams = new URLSearchParams();
        if (speaker) queryParams.append('speaker', speaker);
        queryParams.append('include_interim', includeInterim.toString());

        return this.request<TranscriptResponse[]>(`/calls/${callId}/transcripts?${queryParams.toString()}`);
    }

    // Export transcripts
    async exportTranscripts(callId: number, format: 'txt' | 'json' | 'csv', speaker?: string): Promise<Blob> {
        const queryParams = new URLSearchParams({ format });
        if (speaker) queryParams.append('speaker', speaker);

        const response = await fetch(`${API_BASE_URL}/calls/${callId}/transcripts/export?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${STATIC_BEARER_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Export error: ${response.status} ${response.statusText}`);
        }

        return response.blob();
    }

    // Get call recordings
    async getCallRecordings(callId: number, recordingType?: string): Promise<RecordingResponse[]> {
        const queryParams = new URLSearchParams();
        if (recordingType) queryParams.append('recording_type', recordingType);

        const endpoint = `/calls/${callId}/recordings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.request<RecordingResponse[]>(endpoint);
    }

    // Get call stats
    async getCallStats(): Promise<CallStatsResponse> {
        return this.request<CallStatsResponse>('/calls/stats');
    }

    // Search calls
    async searchCalls(query: string, limit: number = 50): Promise<CallResponse[]> {
        return this.request<CallResponse[]>(`/calls/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    }

    // Test API connection
    async testConnection(): Promise<boolean> {
        try {
            // Try to get calls with a minimal query to test connection
            await this.getCalls({ limit: 1 });
            return true;
        } catch (error) {
            console.error('API Connection test failed:', error);
            return false;
        }
    }
}

export default new CallsService();
// src/hooks/useCallsApi.ts
import { useState, useCallback, useEffect } from 'react';
import callsService from '../services/api/callsService';
import {
    CallResponse,
    CallAnalyticsResponse,
    CallStatsResponse,
    CallCountResponse,
    GetCallsParams
} from '../types/api/calls';

export const useCallsApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

    // Test API connection on mount
    useEffect(() => {
        const testConnection = async () => {
            try {
                const connected = await callsService.testConnection();
                setConnectionStatus(connected ? 'connected' : 'disconnected');
            } catch {
                setConnectionStatus('disconnected');
            }
        };

        testConnection();
    }, []);

    const getCalls = useCallback(async (params?: GetCallsParams): Promise<CallResponse[]> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.getCalls(params);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch calls';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const exportCalls = useCallback(async (format: 'csv' | 'json', params?: GetCallsParams): Promise<Blob> => {
        setLoading(true);
        setError(null);
        try {
            const blob = await callsService.exportCalls(format, params);
            return blob;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to export calls';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAnalytics = useCallback(async (period: '1d' | '7d' | '30d' | '90d' = '7d'): Promise<CallAnalyticsResponse> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.getAnalytics(period);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCallCount = useCallback(async (params?: GetCallsParams): Promise<CallCountResponse> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.getCallCount(params);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch call count';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCall = useCallback(async (callId: number): Promise<CallResponse> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.getCall(callId);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch call';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCallStats = useCallback(async (): Promise<CallStatsResponse> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.getCallStats();
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch call stats';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCallMetadata = useCallback(async (callId: number, metadata: Record<string, any>): Promise<CallResponse> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.updateCallMetadata(callId, metadata);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update call metadata';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCallTranscripts = useCallback(async (callId: number, speaker?: string, includeInterim: boolean = false): Promise<any[]> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.getCallTranscripts(callId, speaker, includeInterim);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch transcripts';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCallRecordings = useCallback(async (callId: number, recordingType?: string): Promise<any[]> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.getCallRecordings(callId, recordingType);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch recordings';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCalls = useCallback(async (query: string, limit: number = 50): Promise<CallResponse[]> => {
        setLoading(true);
        setError(null);
        try {
            const data = await callsService.searchCalls(query, limit);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to search calls';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        connectionStatus,
        getCalls,
        exportCalls,
        getAnalytics,
        getCallCount,
        getCall,
        getCallStats,
        updateCallMetadata,
        getCallTranscripts,
        getCallRecordings,
        searchCalls,
    };
};
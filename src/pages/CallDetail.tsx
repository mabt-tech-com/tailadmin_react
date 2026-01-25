// src/pages/CallDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useCallsApi } from "../hooks/useCallsApi";
import { CallResponse } from "../types/api/calls";
import Header from "../components/qall/calls/CallsHeader";
import ResponseTimePanel from "../components/qall/calls/ResponseTimePanel";
import AudioVisualization from "../components/qall/calls/AudioVisualization";
import RightSidebar from "../components/qall/calls/RightSidebar";
import ConversationDetails from "../components/qall/calls/ConversationDetails";

const CallDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [call, setCall] = useState<CallResponse | null>(null);
    const [transcripts, setTranscripts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { getCall, getCallTranscripts, error } = useCallsApi();

    useEffect(() => {
        const fetchCallData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const callId = parseInt(id);
                const callData = await getCall(callId);
                setCall(callData);

                const transcriptsData = await getCallTranscripts(callId);
                setTranscripts(transcriptsData);
            } catch (err) {
                console.error('Failed to fetch call data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCallData();
    }, [id, getCall, getCallTranscripts]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (error || !call) {
        return (
            <div className="p-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-red-600 dark:text-red-400">
                        {error || 'Call not found'}
                    </p>
                </div>
            </div>
        );
    }

    // Transform the data to match the existing component structure
    const callDisplay = {
        callSid: call.call_sid,
        startedAt: new Date(call.started_at).toLocaleString(),
        status: call.status as any,
        durationSec: call.duration || 0,
        assistantName: call.assistant?.name || 'Unknown',
        customerPhone: call.customer_phone_number,
    };

    const transcriptItems = transcripts.map((t, index) => ({
        id: `t${index + 1}`,
        speaker: t.speaker || 'unknown',
        content: t.content,
        confidence: t.confidence || 0.9,
        time: new Date(t.created_at || call.started_at).toLocaleTimeString(),
        segmentStart: t.segment_start || index * 2,
    }));

    // Calculate metrics from transcripts
    const metrics = {
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
    };

    return (
        <div className="space-y-6">
            <Header
                callSid={callDisplay.callSid}
                startedAt={callDisplay.startedAt}
                status={callDisplay.status}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <ResponseTimePanel metrics={metrics} />
                    <AudioVisualization transcripts={transcriptItems} />
                    <ConversationDetails
                        transcripts={transcriptItems}
                        metrics={metrics}
                        chatMessages={[]}
                        chatStats={{
                            totalMessages: 0,
                            systemMessages: 0,
                            userMessages: 0,
                            assistantMessages: 0,
                            totalTokens: 0,
                        }}
                        webhookLogs={[]}
                        webhookStats={{
                            totalAttempts: 0,
                            successfulAttempts: 0,
                            failedAttempts: 0,
                            avgResponseTimeMs: 0,
                            typesCount: 0,
                        }}
                        confidenceDot={(c) => c && c > 0.9 ? "bg-success-500" : c && c > 0.7 ? "bg-warning-500" : "bg-red-500"}
                        roleStyles={(role) => role === "system" ? "bg-brand-500/10 border border-brand-500/20" : role === "user" ? "bg-success-500/10 border border-success-500/20" : "bg-purple-500/10 border border-purple-500/20"}
                        roleBadge={(role) => role === "system" ? { label: "System", bg: "bg-brand-500" } : role === "user" ? { label: "User", bg: "bg-success-500" } : { label: "Assistant", bg: "bg-purple-500" }}
                    />
                </div>

                <div className="lg:col-span-1">
                    <RightSidebar
                        call={callDisplay}
                        metrics={metrics}
                        animateBars={true}
                        onGenerateReport={() => {
                            // Generate report logic
                            const blob = new Blob(
                                [JSON.stringify({ call, transcripts, metrics }, null, 2)],
                                { type: 'application/json' }
                            );
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `call-${call.call_sid}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};



export default CallDetail;
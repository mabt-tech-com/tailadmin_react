import { apiClient } from "./apiClient";
import type {
  AssistantsListParams,
  AssistantsListResponse,
  CreateAssistantFormInput,
  Assistant,
} from "../../types/api/assistants";

function buildQuery(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v);
    if (!s) return;
    sp.set(k, s);
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
}

function buildFallbacks(input: CreateAssistantFormInput) {
  const out: any[] = [];

  const pushIfEnabled = (i: 0 | 1 | 2) => {
    const enabled = !!(input as any)[`fallback_${i}_enabled`];
    if (!enabled) return;

    const provider = ((input as any)[`fallback_${i}_provider`] || "").trim();
    const model = ((input as any)[`fallback_${i}_model`] || "").trim();
    const api_key = ((input as any)[`fallback_${i}_api_key`] || "").trim() || null;
    const base_url = ((input as any)[`fallback_${i}_base_url`] || "").trim() || null;

    // If provider/model empty, skip (or keep with nulls—your choice)
    if (!provider && !model && !api_key && !base_url) return;

    out.push({
      provider: provider || null,
      config: {
        model: model || null,
        api_key,
        base_url,
      },
    });
  };

  pushIfEnabled(0);
  pushIfEnabled(1);
  pushIfEnabled(2);

  return out;
}

/**
 * Convert your UI form shape (CreateAssistantFormInput)
 * into the backend JSON payload (AssistantCreate / AssistantUpdate).
*/
function buildAssistantPayload(input: CreateAssistantFormInput): Record<string, any> {
  const terms = (input.stt_keyterms || input.stt_keywords || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const payload: Record<string, any> = {
    name: input.name,
    description: input.description ?? null,
    is_active: !!input.is_active,

    llm_provider: input.llm_provider,

    llm_provider_config: {
      api_key: input.llm_provider_api_key || null,
      base_url: input.llm_provider_base_url || null,
      model: input.llm_provider_model || null,
      custom_config: {},
    },

    llm_settings: {
      temperature: input.llm_temperature ?? 0.7,
      max_tokens: input.llm_max_tokens ?? 250,
      system_prompt: input.llm_system_prompt ?? null,
      welcome_message: input.welcome_message ?? null,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop_sequences: [],
    },

    tts_settings: {
      provider: input.tts_provider ?? "elevenlabs",
      voice_id: input.tts_voice_id || "rachel",
      model_id: input.tts_model_id || null,
      latency: input.tts_latency ?? 1,
      stability: input.tts_stability ?? 0.5,
      similarity_boost: input.tts_similarity_boost ?? 0.75,
      style: input.tts_style ?? 0.0,
      use_speaker_boost: !!input.tts_use_speaker_boost,
      provider_config: {
        language: input.tts_language ?? "en",
        // keep any other provider-specific values you want later
      },
    },

    stt_settings: {
      model: input.stt_model || null,
      language: input.stt_language || "en-US",
      punctuate: !!input.stt_punctuate,
      interim_results: !!input.stt_interim_results,
      endpointing: {
        silence_threshold: input.stt_silence_threshold ?? 500,
        min_silence_duration: input.stt_min_silence_duration ?? 500,
      },
      utterance_end_ms: input.stt_utterance_end_ms ?? 1000,
      vad_turnoff: input.stt_vad_turnoff ?? 500,
      smart_format: !!input.stt_smart_format,
      // NOTE: your backend expects keywords as list[Keyword] and keyterms as list[str]
      // If your backend accepts plain lists, convert here:

      keyterms: terms,
      keywords: terms.map((t) => ({ keyword: t, boost: 1.0 })), // ONLY if backend expects objects

      audio_denoising: !!input.stt_audio_denoising,
    },

    interruption_settings: {
      interruption_threshold: input.interruption_threshold ?? 3,
      min_speaking_time: input.min_speaking_time ?? 0.5,
      interruption_cooldown: input.interruption_cooldown ?? 2.0,
    },

    end_call_message: input.end_call_message ?? null,
    transfer_call_message: input.transfer_call_message ?? null,
    idle_message: input.idle_message ?? null,
    max_idle_messages: input.max_idle_messages ?? null,
    idle_timeout: input.idle_timeout ?? null,

    webhook_url: input.webhook_url ?? null,

    rag_settings: {
      enabled: !!input.rag_enabled,
      search_limit: input.rag_search_limit ?? 3,
      similarity_threshold: input.rag_similarity_threshold ?? 0.7,
      chunk_size: input.rag_chunk_size ?? 1000,
      // keep defaults for other rag fields (backend has defaults)
    },

    tools_settings: {
      end_call: {
        enabled: !!input.end_call_enabled,
        scenarios: (input.end_call_scenarios || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        custom_message: input.end_call_custom_message || null,
      },
      transfer_call: {
        enabled: !!input.transfer_call_enabled,
        scenarios: (input.transfer_call_scenarios || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        transfer_numbers: (input.transfer_call_numbers || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        custom_message: input.transfer_call_custom_message || null,
      },
      custom_tools: [],
      enabled_tools: [], // backend validator can rebuild this
    },

    llm_fallback_providers: {
      enabled: !!input.fallback_enabled,
      fallbacks: buildFallbacks(input),
    },

    custom_settings: {
      structured_data_prompt: input.structured_data_prompt || null,
      structured_data_schema: input.structured_data_schema
        ? safeParseJson(input.structured_data_schema)
        : null,
    },
  };

  return payload;
}

function safeParseJson(v: string) {
  try {
    return JSON.parse(v);
  } catch {
    // keep it as string? I'd rather send null and let UI show an error
    return null;
  }
}

export const assistantsService = {
  listPreview(params: AssistantsListParams = {}) {
    const query = buildQuery({
      page: params.page ?? 1,
      per_page: params.per_page ?? 24,
      search: params.search ?? "",
      status: params.status ?? "",
      sort_by: params.sort_by ?? "name",
      sort_order: params.sort_order ?? "asc",
    });

    return apiClient.request<AssistantsListResponse>(`/api/assistants/preview${query}`);
  },

  // if you still need full list for something else
  listFull(params: AssistantsListParams = {}) {
    const query = buildQuery({
      page: params.page ?? 1,
      per_page: params.per_page ?? 24,
      search: params.search ?? "",
      status: params.status ?? "",
      sort_by: params.sort_by ?? "name",
      sort_order: params.sort_order ?? "asc",
    });

    return apiClient.request<any>(`/api/assistants${query}`);
  },

  async remove(assistantId: number) {
    await apiClient.request<void>(`/api/assistants/${assistantId}`, { method: "DELETE" });
  },

  getById(assistantId: number) {
    return apiClient.request<Assistant>(`/api/assistants/${assistantId}`);
  },

  create(input: CreateAssistantFormInput) {
    const payload = buildAssistantPayload(input);
    return apiClient.request<Assistant>(`/api/assistants`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  },

  update(assistantId: number, input: CreateAssistantFormInput) {
    const payload = buildAssistantPayload(input);
    return apiClient.request<Assistant>(`/api/assistants/${assistantId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  },
};
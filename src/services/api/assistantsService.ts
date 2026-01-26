import { apiClient } from "./apiClient";
import type {
  AssistantsListParams,
  AssistantsListResponse,
  AssistantDetailResponse,
  CreateAssistantFormInput,
  CreateAssistantResponse,
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

function fdAppend(fd: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;

  if (typeof value === "boolean") {
    fd.append(key, value ? "true" : "false");
    return;
  }

  if (typeof value === "number") {
    fd.append(key, String(value));
    return;
  }

  fd.append(key, value as any);
}

/** ✅ single source of truth for form -> FormData */
function buildAssistantFormData(input: CreateAssistantFormInput) {
  const fd = new FormData();

  // required
  fdAppend(fd, "name", input.name);
  fdAppend(fd, "llm_provider", input.llm_provider);

  // basic
  fdAppend(fd, "description", input.description);
  fdAppend(fd, "is_active", input.is_active ?? false);

  // llm provider config
  fdAppend(fd, "llm_provider_api_key", input.llm_provider_api_key);
  fdAppend(fd, "llm_provider_model", input.llm_provider_model);
  fdAppend(fd, "llm_provider_base_url", input.llm_provider_base_url);

  // service keys
  fdAppend(fd, "deepgram_api_key", input.deepgram_api_key);
  fdAppend(fd, "elevenlabs_api_key", input.elevenlabs_api_key);
  fdAppend(fd, "inworld_bearer_token", input.inworld_bearer_token);
  fdAppend(fd, "resemble_api_key", input.resemble_api_key);

  // llm settings
  fdAppend(fd, "llm_temperature", input.llm_temperature);
  fdAppend(fd, "llm_max_tokens", input.llm_max_tokens);
  fdAppend(fd, "llm_system_prompt", input.llm_system_prompt);
  fdAppend(fd, "welcome_message", input.welcome_message);

  // tts
  fdAppend(fd, "tts_voice_id", input.tts_voice_id);
  fdAppend(fd, "tts_model_id", input.tts_model_id);
  fdAppend(fd, "tts_latency", input.tts_latency);
  fdAppend(fd, "tts_stability", input.tts_stability);
  fdAppend(fd, "tts_similarity_boost", input.tts_similarity_boost);
  fdAppend(fd, "tts_style", input.tts_style);
  fdAppend(fd, "tts_use_speaker_boost", input.tts_use_speaker_boost ?? false);
  fdAppend(fd, "tts_provider", input.tts_provider ?? "elevenlabs");

  // deepgram tts
  fdAppend(fd, "tts_encoding", input.tts_encoding ?? "mulaw");
  fdAppend(fd, "tts_sample_rate", input.tts_sample_rate ?? 8000);

  // resemble
  fdAppend(fd, "tts_project_uuid", input.tts_project_uuid);

  // stt
  fdAppend(fd, "stt_model", input.stt_model);
  fdAppend(fd, "stt_language", input.stt_language);
  fdAppend(fd, "stt_punctuate", input.stt_punctuate ?? false);
  fdAppend(fd, "stt_interim_results", input.stt_interim_results ?? false);
  fdAppend(fd, "stt_silence_threshold", input.stt_silence_threshold);
  fdAppend(fd, "stt_min_silence_duration", input.stt_min_silence_duration);
  fdAppend(fd, "stt_utterance_end_ms", input.stt_utterance_end_ms);
  fdAppend(fd, "stt_vad_turnoff", input.stt_vad_turnoff);
  fdAppend(fd, "stt_smart_format", input.stt_smart_format ?? false);
  fdAppend(fd, "stt_keywords", input.stt_keywords);
  fdAppend(fd, "stt_keyterms", input.stt_keyterms);
  fdAppend(fd, "stt_audio_denoising", input.stt_audio_denoising ?? false);

  // interruption
  fdAppend(fd, "interruption_threshold", input.interruption_threshold);
  fdAppend(fd, "min_speaking_time", input.min_speaking_time);
  fdAppend(fd, "interruption_cooldown", input.interruption_cooldown);

  // call control
  fdAppend(fd, "end_call_message", input.end_call_message);
  fdAppend(fd, "transfer_call_message", input.transfer_call_message);
  fdAppend(fd, "idle_message", input.idle_message);
  fdAppend(fd, "max_idle_messages", input.max_idle_messages);
  fdAppend(fd, "idle_timeout", input.idle_timeout);

  // webhook / structured data
  fdAppend(fd, "webhook_url", input.webhook_url);
  fdAppend(fd, "structured_data_schema", input.structured_data_schema);
  fdAppend(fd, "structured_data_prompt", input.structured_data_prompt);

  // rag
  fdAppend(fd, "rag_enabled", input.rag_enabled ?? false);
  fdAppend(fd, "rag_search_limit", input.rag_search_limit);
  fdAppend(fd, "rag_similarity_threshold", input.rag_similarity_threshold);
  fdAppend(fd, "rag_chunk_size", input.rag_chunk_size);

  // tools
  fdAppend(fd, "end_call_enabled", input.end_call_enabled ?? false);
  fdAppend(fd, "end_call_scenarios", input.end_call_scenarios);
  fdAppend(fd, "end_call_custom_message", input.end_call_custom_message);

  fdAppend(fd, "transfer_call_enabled", input.transfer_call_enabled ?? false);
  fdAppend(fd, "transfer_call_scenarios", input.transfer_call_scenarios);
  fdAppend(fd, "transfer_call_numbers", input.transfer_call_numbers);
  fdAppend(fd, "transfer_call_custom_message", input.transfer_call_custom_message);

  // fallbacks
  fdAppend(fd, "fallback_enabled", input.fallback_enabled ?? false);

  fdAppend(fd, "fallback_0_enabled", input.fallback_0_enabled ?? false);
  fdAppend(fd, "fallback_0_provider", input.fallback_0_provider);
  fdAppend(fd, "fallback_0_model", input.fallback_0_model);
  fdAppend(fd, "fallback_0_api_key", input.fallback_0_api_key);
  fdAppend(fd, "fallback_0_base_url", input.fallback_0_base_url);

  fdAppend(fd, "fallback_1_enabled", input.fallback_1_enabled ?? false);
  fdAppend(fd, "fallback_1_provider", input.fallback_1_provider);
  fdAppend(fd, "fallback_1_model", input.fallback_1_model);
  fdAppend(fd, "fallback_1_api_key", input.fallback_1_api_key);
  fdAppend(fd, "fallback_1_base_url", input.fallback_1_base_url);

  fdAppend(fd, "fallback_2_enabled", input.fallback_2_enabled ?? false);
  fdAppend(fd, "fallback_2_provider", input.fallback_2_provider);
  fdAppend(fd, "fallback_2_model", input.fallback_2_model);
  fdAppend(fd, "fallback_2_api_key", input.fallback_2_api_key);
  fdAppend(fd, "fallback_2_base_url", input.fallback_2_base_url);

  // languages
  fdAppend(fd, "tts_language", input.tts_language ?? "en");
  fdAppend(fd, "custom_voice_id", input.custom_voice_id);
  fdAppend(fd, "elevenlabs_language", input.elevenlabs_language ?? "en");

  return fd;
}

export const assistantsService = {
  list(params: AssistantsListParams = {}) {
    const query = buildQuery({
      page: params.page ?? 1,
      per_page: params.per_page ?? 24,
      search: params.search ?? "",
      status: params.status ?? "",
      sort_by: params.sort_by ?? "name",
      sort_order: params.sort_order ?? "asc",
    });

    return apiClient.request<AssistantsListResponse>(`/api/assistants${query}`);
  },

  async remove(assistantId: number) {
    await apiClient.request<void>(`/api/assistants/${assistantId}`, { method: "DELETE" });
  },

  getById(assistantId: number) {
    return apiClient.request<AssistantDetailResponse>(`/api/v2/assistants/${assistantId}`);
  },

  create(input: CreateAssistantFormInput) {
    const fd = buildAssistantFormData(input);
    return apiClient.request<CreateAssistantResponse>(`/api/v2/assistants/new`, {
      method: "POST",
      body: fd,
    });
  },

  /** ✅ Update existing assistant (endpoint assumed REST-style) */
  update(assistantId: number, input: CreateAssistantFormInput) {
    const fd = buildAssistantFormData(input);
    return apiClient.request<{ success: boolean }>(`/api/v2/assistants/${assistantId}`, {
      method: "PUT",
      body: fd,
    });
  },
};
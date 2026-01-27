import type { Assistant, CreateAssistantFormInput } from "../../../types/api/assistants";

/**
 * One UI-friendly state for the page.
 * We keep it close to CreateAssistantFormInput keys so "Save/Create" is easy.
 */
export type AssistantFormState = CreateAssistantFormInput & {
  // UI-only (not sent to backend directly unless you add upload endpoint)
  kbFiles?: File[];
};

export const createEmptyAssistantForm = (): AssistantFormState => ({
  // required
  name: "",
  llm_provider: "openai",

  // basic
  description: "",
  is_active: false,

  // llm config
  llm_provider_api_key: "",
  llm_provider_model: "",
  llm_provider_base_url: "",

  // service keys
  deepgram_api_key: "",
  elevenlabs_api_key: "",
  inworld_bearer_token: "",
  resemble_api_key: "",

  // llm settings
  llm_temperature: 0.7,
  llm_max_tokens: 250,
  llm_system_prompt: "",
  welcome_message: "",

  // tts
  tts_provider: "elevenlabs",
  tts_voice_id: "",
  tts_model_id: "",
  tts_latency: null,
  tts_stability: null,
  tts_similarity_boost: null,
  tts_style: null,
  tts_use_speaker_boost: false,

  // deepgram tts
  tts_encoding: "mulaw",
  tts_sample_rate: 8000,

  // resemble
  tts_project_uuid: "",

  // stt
  stt_model: "",
  stt_language: "en",
  stt_punctuate: false,
  stt_interim_results: false,
  stt_silence_threshold: 500,
  stt_min_silence_duration: 1000,
  stt_utterance_end_ms: 100,
  stt_vad_turnoff: 500,
  stt_smart_format: false,
  stt_keywords: "",
  stt_keyterms: "",
  stt_audio_denoising: false,

  // interruption
  interruption_threshold: 3,
  min_speaking_time: 0.5,
  interruption_cooldown: 2.0,

  // call control
  end_call_message: "Thank you for calling. Goodbye!",
  transfer_call_message: "Please hold while I transfer your call.",
  idle_message: "Are you still there? I'm here to help if you need anything.",
  max_idle_messages: 3,
  idle_timeout: 30,

  // webhook / structured data
  webhook_url: "",
  structured_data_schema: "",
  structured_data_prompt: "",

  // rag
  rag_enabled: true,
  rag_search_limit: 3,
  rag_similarity_threshold: 0.7,
  rag_chunk_size: 1000,

  // tools
  end_call_enabled: false,
  end_call_scenarios: "",
  end_call_custom_message: "",

  transfer_call_enabled: false,
  transfer_call_scenarios: "",
  transfer_call_numbers: "",
  transfer_call_custom_message: "",

  // fallbacks
  fallback_enabled: false,

  fallback_0_enabled: false,
  fallback_0_provider: "",
  fallback_0_model: "",
  fallback_0_api_key: "",
  fallback_0_base_url: "",

  fallback_1_enabled: false,
  fallback_1_provider: "",
  fallback_1_model: "",
  fallback_1_api_key: "",
  fallback_1_base_url: "",

  fallback_2_enabled: false,
  fallback_2_provider: "",
  fallback_2_model: "",
  fallback_2_api_key: "",
  fallback_2_base_url: "",

  // languages
  tts_language: "en",
  custom_voice_id: "",
  elevenlabs_language: "en",

  // UI
  kbFiles: [],
});

/**
 * Hydrate the form from the backend Assistant detail shape.
 * You can expand this mapping as your backend fields solidify.
 */
export function mapAssistantToForm(a: Assistant): AssistantFormState {
  const base = createEmptyAssistantForm();

  const llmProviderConfig = (a.llm_provider_config ?? {}) as any;
  const llmSettings = (a.llm_settings ?? {}) as any;
  const tts = (a.tts_settings ?? {}) as any;
  const stt = (a.stt_settings ?? {}) as any;
  const endpointing = (stt.endpointing ?? {}) as any;
  const interruption = (a.interruption_settings ?? {}) as any;
  const rag = (a.rag_settings ?? {}) as any;
  const tools = (a.tools_settings ?? {}) as any;
  const endCall = (tools.end_call ?? {}) as any;
  const transferCall = (tools.transfer_call ?? {}) as any;
  const custom = (a.custom_settings ?? {}) as any;
  const fallbacks = (a.llm_fallback_providers ?? {}) as any;

  const normalizeLang = (lang: any) => {
    if (!lang) return "";
    const s = String(lang);
    // "en-US" -> "en"
    return s.split("-")[0].toLowerCase();
  };

  const arrToLines = (v: any) => {
    if (!v) return "";
    if (Array.isArray(v)) return v.filter(Boolean).join("\n");
    return String(v);
  };

  return {
    ...base,

    // basic
    name: a.name ?? "",
    description: a.description ?? "",
    is_active: !!a.is_active,

    // llm provider config
    llm_provider: a.llm_provider ?? base.llm_provider,
    llm_provider_api_key: llmProviderConfig.api_key ?? "",
    llm_provider_model: llmProviderConfig.model ?? "",
    llm_provider_base_url: llmProviderConfig.base_url ?? "",

    // llm settings
    llm_temperature: llmSettings.temperature ?? base.llm_temperature,
    llm_max_tokens: llmSettings.max_tokens ?? base.llm_max_tokens,
    llm_system_prompt: llmSettings.system_prompt ?? "",
    welcome_message: llmSettings.welcome_message ?? "",

    // tts settings
    tts_provider: tts.provider ?? base.tts_provider,
    tts_voice_id: tts.voice_id ?? "",
    tts_model_id: tts.model_id ?? "",
    tts_latency: tts.latency ?? base.tts_latency,
    tts_stability: tts.stability ?? base.tts_stability,
    tts_similarity_boost: tts.similarity_boost ?? base.tts_similarity_boost,
    tts_style: tts.style ?? base.tts_style,
    tts_use_speaker_boost: !!tts.use_speaker_boost,

    // languages (your backend currently stores TTS language under provider_config.language)
    tts_language: tts.provider_config?.language ?? base.tts_language,
    elevenlabs_language: tts.provider_config?.language ?? base.elevenlabs_language,

    // stt settings
    stt_model: stt.model ?? "",
    stt_language: normalizeLang(stt.language) || base.stt_language, // "en-US" -> "en"
    stt_punctuate: !!stt.punctuate,
    stt_interim_results: !!stt.interim_results,
    stt_silence_threshold: endpointing.silence_threshold ?? base.stt_silence_threshold,
    stt_min_silence_duration: endpointing.min_silence_duration ?? base.stt_min_silence_duration,
    stt_utterance_end_ms: stt.utterance_end_ms ?? base.stt_utterance_end_ms,
    stt_vad_turnoff: stt.vad_turnoff ?? base.stt_vad_turnoff,
    stt_smart_format: !!stt.smart_format,
    stt_audio_denoising: !!stt.audio_denoising,

    // backend returns arrays; UI currently stores as strings
    stt_keywords: arrToLines(stt.keywords),
    stt_keyterms: arrToLines(stt.keyterms),

    // interruption settings (note naming!)
    interruption_threshold:
      interruption.interruption_threshold ?? base.interruption_threshold,
    min_speaking_time: interruption.min_speaking_time ?? base.min_speaking_time,
    interruption_cooldown: interruption.interruption_cooldown ?? base.interruption_cooldown,

    // call control (top-level fields in your response)
    end_call_message: a.end_call_message ?? base.end_call_message,
    transfer_call_message: a.transfer_call_message ?? base.transfer_call_message,
    idle_message: a.idle_message ?? base.idle_message,
    max_idle_messages: a.max_idle_messages ?? base.max_idle_messages,
    idle_timeout: a.idle_timeout ?? base.idle_timeout,

    // webhook / structured data
    webhook_url: a.webhook_url ?? "",
    structured_data_prompt: custom.structured_data_prompt ?? "",
    structured_data_schema: custom.structured_data_schema
      ? JSON.stringify(custom.structured_data_schema, null, 2)
      : "",

    // rag
    rag_enabled: rag.enabled ?? base.rag_enabled,
    rag_search_limit: rag.search_limit ?? base.rag_search_limit,
    rag_similarity_threshold: rag.similarity_threshold ?? base.rag_similarity_threshold,
    rag_chunk_size: rag.chunk_size ?? base.rag_chunk_size,

    // tools (new nested structure)
    end_call_enabled: !!endCall.enabled,
    end_call_scenarios: arrToLines(endCall.scenarios),
    end_call_custom_message: endCall.custom_message ?? "",

    transfer_call_enabled: !!transferCall.enabled,
    transfer_call_scenarios: arrToLines(transferCall.scenarios),
    transfer_call_numbers: arrToLines(transferCall.transfer_numbers),
    transfer_call_custom_message: transferCall.custom_message ?? "",

    // fallbacks
    fallback_enabled: !!fallbacks.enabled,
    
    // UI only
    kbFiles: [],
  };
}
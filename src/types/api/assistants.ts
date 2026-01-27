export type AssistantStatus = "active" | "inactive";

export type AssistantPreview = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  llm_provider: string;
  llm_model: string;
  stt_provider: string;
  stt_model: string;
  language: string;
  tts_provider: string;
  tts_model: string;
  voice: string;
  total_calls?: number;
};

export type AssistantsListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "active" | "inactive" | "";
  sort_by?: "name" | "created_at";
  sort_order?: "asc" | "desc";
};

export type AssistantsListResponse = {
  items: AssistantPreview[];
  page: number;
  per_page: number;
  total: number;
  pages: number;
};

export type AssistantPhoneNumber = {
  id: number;
  phone_number: string;
  provider?: string | null;
};

export type AssistantCall = {
  id: number;
  call_sid: string | null;
  status: string | null;
  direction: string | null;
  provider: string | null;
  to_phone_number: string | null;
  customer_phone_number: string | null;
  duration: number | null;
  started_at: string | null; // ISO
  ended_at: string | null;   // ISO
};

export type Assistant = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;

  llm_provider: string | null;
  llm_provider_config: Record<string, any> | null;

  llm_fallback_providers: Record<string, any> | null;
  llm_settings: Record<string, any> | null;

  tts_settings: Record<string, any> | null;
  stt_settings: Record<string, any> | null;

  interruption_settings: Record<string, any> | null;
  tools_settings: Record<string, any> | null;

  rag_settings: Record<string, any> | null;
  custom_settings: Record<string, any> | null;

  webhook_url: string | null;

  end_call_message: string | null;
  transfer_call_message: string | null;

  idle_message: string | null;
  max_idle_messages: number | null;
  idle_timeout: number | null;

  created_at: string | null; // ISO
  updated_at: string | null; // ISO

  phone_numbers: AssistantPhoneNumber[];
};

export type AssistantDetailResponse = {
  assistant: Assistant;
  recent_calls: AssistantCall[];
  telephony_provider: string | null;
};

export type CreateAssistantResponse = {
  success: boolean;
  assistant_id: number;
  redirect_url: string;
};

export type CreateAssistantErrorResponse = {
  success?: false;
  error?: string;
  field?: string;
  default_schema?: string;
};



export type CreateAssistantFormInput = {
  // Basic
  name: string;
  description?: string | null;
  is_active?: boolean;

  // LLM Provider Configuration
  llm_provider: string;
  llm_provider_api_key?: string | null;
  llm_provider_model?: string | null;
  llm_provider_base_url?: string | null;

  // Service API Keys
  deepgram_api_key?: string | null;
  elevenlabs_api_key?: string | null;
  inworld_bearer_token?: string | null;
  resemble_api_key?: string | null;

  // LLM Settings
  llm_temperature?: number | null;
  llm_max_tokens?: number | null;
  llm_system_prompt?: string | null;
  welcome_message?: string | null;

  // TTS
  tts_voice_id?: string | null;
  tts_model_id?: string | null;
  tts_latency?: number | null;
  tts_stability?: number | null;
  tts_similarity_boost?: number | null;
  tts_style?: number | null;
  tts_use_speaker_boost?: boolean;
  tts_provider?: string | null;

  // Deepgram TTS
  tts_encoding?: string | null;
  tts_sample_rate?: number | null;

  // Resemble
  tts_project_uuid?: string | null;

  // STT
  stt_model?: string | null;
  stt_language?: string | null;
  stt_punctuate?: boolean;
  stt_interim_results?: boolean;
  stt_silence_threshold?: number | null;
  stt_min_silence_duration?: number | null;
  stt_utterance_end_ms?: number | null;
  stt_vad_turnoff?: number | null;
  stt_smart_format?: boolean;
  stt_keywords?: string | null;
  stt_keyterms?: string | null;
  stt_audio_denoising?: boolean;

  // Interruption
  interruption_threshold?: number | null;
  min_speaking_time?: number | null;
  interruption_cooldown?: number | null;

  // Call control
  end_call_message?: string | null;
  transfer_call_message?: string | null;
  idle_message?: string | null;
  max_idle_messages?: number | null;
  idle_timeout?: number | null;

  // Webhook / structured data
  webhook_url?: string | null;
  structured_data_schema?: string | null; // IMPORTANT: backend expects JSON string
  structured_data_prompt?: string | null;

  // RAG
  rag_enabled?: boolean;
  rag_search_limit?: number | null;
  rag_similarity_threshold?: number | null;
  rag_chunk_size?: number | null;

  // Tools
  end_call_enabled?: boolean;
  end_call_scenarios?: string | null;
  end_call_custom_message?: string | null;

  transfer_call_enabled?: boolean;
  transfer_call_scenarios?: string | null;
  transfer_call_numbers?: string | null;
  transfer_call_custom_message?: string | null;

  // Fallback LLMs
  fallback_enabled?: boolean;

  fallback_0_enabled?: boolean;
  fallback_0_provider?: string | null;
  fallback_0_model?: string | null;
  fallback_0_api_key?: string | null;
  fallback_0_base_url?: string | null;

  fallback_1_enabled?: boolean;
  fallback_1_provider?: string | null;
  fallback_1_model?: string | null;
  fallback_1_api_key?: string | null;
  fallback_1_base_url?: string | null;

  fallback_2_enabled?: boolean;
  fallback_2_provider?: string | null;
  fallback_2_model?: string | null;
  fallback_2_api_key?: string | null;
  fallback_2_base_url?: string | null;

  // Inworld / Elevenlabs languages
  tts_language?: string | null;
  custom_voice_id?: string | null;
  elevenlabs_language?: string | null;
};
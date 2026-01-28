import { useEffect, useMemo, useState } from "react";
import ComponentCard from "../../../common/ComponentCard";
import Label from "../../../form/Label";
import TextArea from "../../../common/input/TextArea";
import Input from "../../../common/input/InputField";
import Checkbox from "../../../common/input/Checkbox";
import Select from "../../../form/Select";
import { Tooltip } from "../../../common/Tooltip";
import { AudioLines, Brain, Captions, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import type { AssistantFormState } from "../assistantForm";


type Props = {
  open: boolean;
  value: AssistantFormState;
  setField: <K extends keyof AssistantFormState>(key: K, value: AssistantFormState[K]) => void;
  loading?: boolean;
};

type Opt = { value: string; label: string };

const LLM_PROVIDER_CONFIG: Record<
  string,
  {
    models: Opt[];
    showBaseUrl: boolean;
    defaultBaseUrl?: string;
    modelHelp?: string[];
    apiKeyHelp?: string;
  }
> = {
  openai: {
    models: [
      { value: "gpt-4o", label: "GPT-4o (Most Advanced)" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini (Fast & Efficient)" },
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (Cost Effective)" },
    ],
    showBaseUrl: false,
  },
  anthropic: {
    models: [
      { value: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet (Recommended)" },
      { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku (Fast)" },
    ],
    showBaseUrl: false,
  },
  gemini: {
    models: [
      { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash (Latest)" },
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    ],
    showBaseUrl: true,
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
  },
  xai: {
    models: [
      { value: "grok-beta", label: "Grok Beta (Recommended)" },
      { value: "grok-2-1212", label: "Grok 2 (Latest)" },
    ],
    showBaseUrl: true,
    defaultBaseUrl: "https://api.x.ai/v1",
  },
  groq: {
    models: [
      { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Recommended)" },
      { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Ultra Fast)" },
    ],
    showBaseUrl: false,
  },
    custom: { models: [], showBaseUrl: true }
};

const INWORLD_LANGUAGES: Opt[] = [
  { value: "en", label: "🇺🇸 English (Production)" },
  { value: "zh", label: "🇨🇳 Chinese (Production)" },
  { value: "ko", label: "🇰🇷 Korean (Production)" },
  { value: "nl", label: "🇳🇱 Dutch (Production)" },
  { value: "fr", label: "🇫🇷 French (Production)" },
  { value: "es", label: "🇪🇸 Spanish (Production)" },
  { value: "ja", label: "🇯🇵 Japanese (Experimental)" },
  { value: "de", label: "🇩🇪 German (Experimental)" },
  { value: "it", label: "🇮🇹 Italian (Experimental)" },
  { value: "pl", label: "🇵🇱 Polish (Experimental)" },
  { value: "pt", label: "🇧🇷 Portuguese (Experimental)" },
];

const INWORLD_VOICES_BY_LANG: Record<string, Opt[]> = {
  en: [
    { value: "hades", label: "Hades (Deep & Commanding Male)" },
    { value: "alex", label: "Alex (Clear & Natural Male)" },
    { value: "ashley", label: "Ashley (Warm & Friendly Female)" },
    { value: "aria", label: "Aria (Professional Female)" },
    { value: "ethan", label: "Ethan (Friendly Male)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  es: [
    { value: "diego", label: "Diego (Warm & Expressive Male)" },
    { value: "lupita", label: "Lupita (Elegant & Clear Female)" },
    { value: "miguel", label: "Miguel (Strong & Confident Male)" },
    { value: "rafael", label: "Rafael (Smooth & Professional Male)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  fr: [
    { value: "alain", label: "Alain (Sophisticated Male)" },
    { value: "helene", label: "Hélène (Graceful & Articulate Female)" },
    { value: "mathieu", label: "Mathieu (Clear & Natural Male)" },
    { value: "etienne", label: "Étienne (Expressive & Warm Male)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  de: [
    { value: "johanna", label: "Johanna (Precise & Professional Female)" },
    { value: "josef", label: "Josef (Strong & Clear Male)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  zh: [
    { value: "yichen", label: "Yichen (Natural & Expressive Male)" },
    { value: "xiaoyin", label: "Xiaoyin (Melodic & Clear Female)" },
    { value: "xinyi", label: "Xinyi (Gentle & Articulate Female)" },
    { value: "jing", label: "Jing (Smooth & Professional Female)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  it: [
    { value: "marco", label: "Marco (Expressive & Warm Male)" },
    { value: "giulia", label: "Giulia (Elegant & Musical Female)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  pt: [
    { value: "joao", label: "João (Rich & Warm Male)" },
    { value: "ana", label: "Ana (Smooth & Expressive Female)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  ja: [
    { value: "hiroshi", label: "Hiroshi (Polite & Clear Male)" },
    { value: "sakura", label: "Sakura (Gentle & Melodic Female)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  nl: [
    { value: "jan", label: "Jan (Friendly & Clear Male)" },
    { value: "emma", label: "Emma (Warm & Approachable Female)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  ko: [
    { value: "min", label: "Min (Professional & Clear Male)" },
    { value: "soo", label: "Soo (Gentle & Articulate Female)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
  pl: [
    { value: "piotr", label: "Piotr (Strong & Expressive Male)" },
    { value: "anna", label: "Anna (Clear & Professional Female)" },
    { value: "custom", label: "Custom Voice ID (Voice Cloning)" },
  ],
};

const TTS_PROVIDER_CONFIG: Record<
  string,
  {
    models: Opt[];
    voices?: Opt[]; // not for inworld; it uses voicesByLanguage
    alwaysCustomVoice?: boolean; // resemble
  }
> = {
  elevenlabs: {
    models: [
      { value: "eleven_v3", label: "Eleven v3 (Most Expressive - 70+ Languages)" },
      { value: "eleven_ttv_v3", label: "TTV v3 (Voice Design - 70+ Languages)" },
      { value: "eleven_multilingual_v2", label: "Multilingual v2 (Rich Emotions)" },
      { value: "eleven_flash_v2_5", label: "Flash v2.5 (Ultra Fast - Recommended)" },
      { value: "eleven_flash_v2", label: "Flash v2 (Ultra Fast English Only)" },
      { value: "eleven_turbo_v2_5", label: "Turbo v2.5 (Balanced)" },
      { value: "eleven_turbo_v2", label: "Turbo v2 (Legacy)" },
    ],
    voices: [
      { value: "rachel", label: "Rachel (Professional Female)" },
      { value: "domi", label: "Domi (Warm Female)" },
      { value: "bella", label: "Bella (Friendly Female)" },
      { value: "antoni", label: "Antoni (Calm Male)" },
      { value: "eli", label: "Eli (Professional Male)" },
      { value: "josh", label: "Josh (Confident Male)" },
      { value: "custom", label: "Custom Voice ID" },
    ],
  },
  deepgram: {
    models: [
      { value: "aura-2", label: "Aura-2 (Latest Generation - Recommended)" },
      { value: "aura", label: "Aura (Original - Fast)" },
    ],
    voices: [
      { value: "asteria", label: "Asteria (Clear & Professional Female)" },
      { value: "luna", label: "Luna (Warm & Friendly Female)" },
      { value: "stella", label: "Stella (Energetic & Bright Female)" },
      { value: "athena", label: "Athena (Sophisticated UK Female)" },
      { value: "hera", label: "Hera (Confident & Authoritative Female)" },
      { value: "orion", label: "Orion (Deep & Resonant Male)" },
      { value: "arcas", label: "Arcas (Strong & Commanding Male)" },
      { value: "perseus", label: "Perseus (Smooth & Professional Male)" },
      { value: "zeus", label: "Zeus (Powerful & Authoritative Male)" },
      { value: "thalia", label: "Thalia (Aura-2 Professional Female)" },
      { value: "aurora", label: "Aurora (Aura-2 Warm Female)" },
    ],
  },
  inworld: {
    models: [
      { value: "inworld-tts-1", label: "Inworld TTS-1 (Flagship Model)" },
      { value: "inworld-tts-1-max", label: "Inworld TTS-1-Max (More Expressive - Experimental)" },
    ],
  },
  resemble: {
    models: [{ value: "default", label: "Default (WebSocket Streaming)" }],
    voices: [{ value: "custom", label: "Enter Voice UUID" }],
    alwaysCustomVoice: true,
  },
};

const llmProviders: Opt[] = [
  { value: "openai", label: "OpenAI (GPT Models)" },
  { value: "anthropic", label: "Anthropic (Claude)" },
  { value: "gemini", label: "Google Gemini" },
  { value: "xai", label: "xAI" },
  { value: "groq", label: "Groq" },
  { value: "custom", label: "Custom" },
];

const ttsProviders: Opt[] = [
  { value: "elevenlabs", label: "ElevenLabs" },
  { value: "deepgram", label: "Deepgram Aura" },
  { value: "inworld", label: "Inworld" },
  { value: "resemble", label: "Resemble AI" },
];

const sttModels: Opt[] = [
  { value: "nova-2", label: "Deepgram Nova-2" },
  { value: "nova-3", label: "Deepgram Nova-3" },
];

const sttLanguages: Opt[] = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
];

export default function AssistantAiSection({ open, value, setField, loading }: Props) {
    const [isModelOpen, setModelOpen] = useState(true);
    const [isVoiceOpen, setVoiceOpen] = useState(false);
    const [isTranscriberOpen, setTranscriberOpen] = useState(false);

    const llmProvider = value.llm_provider || "openai";
    const ttsProvider = value.tts_provider || "elevenlabs";
    const inworldLang = value.tts_language || "en";

    const llmModels = useMemo(() => {
    return (LLM_PROVIDER_CONFIG[llmProvider]?.models ?? LLM_PROVIDER_CONFIG.openai.models);
    }, [llmProvider]);

    const ttsModels = useMemo(() => {
    return (TTS_PROVIDER_CONFIG[ttsProvider]?.models ?? TTS_PROVIDER_CONFIG.elevenlabs.models);
    }, [ttsProvider]);

    const ttsVoices = useMemo(() => {
    if (ttsProvider === "inworld") {
        return INWORLD_VOICES_BY_LANG[inworldLang] ?? INWORLD_VOICES_BY_LANG.en;
    }
    return (TTS_PROVIDER_CONFIG[ttsProvider]?.voices ?? TTS_PROVIDER_CONFIG.elevenlabs.voices ?? []);
    }, [ttsProvider, inworldLang]);

    const showInworldLanguage = ttsProvider === "inworld";
    const alwaysCustomVoice = !!TTS_PROVIDER_CONFIG[ttsProvider]?.alwaysCustomVoice;
    const allowCustomVoice = ttsProvider === "elevenlabs" || ttsProvider === "resemble" || ttsProvider === "inworld";
    const disableVoiceSelect = alwaysCustomVoice;

    useEffect(() => {
    const cfg = LLM_PROVIDER_CONFIG[llmProvider];
    if (!cfg?.showBaseUrl) return;

    const current = (value.llm_provider_base_url || "").trim();
    if (!current && cfg.defaultBaseUrl) {
        setField("llm_provider_base_url", cfg.defaultBaseUrl as any);
    }
    }, [llmProvider, value.llm_provider_base_url, setField]);

    useEffect(() => {
        if (llmProvider === "custom") return;
        const valid = llmModels.some((m) => m.value === (value.llm_provider_model || ""));
        if (!valid) setField("llm_provider_model", (llmModels[0]?.value ?? "") as any);
    }, [llmProvider, llmModels, value.llm_provider_model, setField]);

    useEffect(() => {
        const valid = ttsModels.some((m) => m.value === (value.tts_model_id || ""));
        if (!valid) setField("tts_model_id", (ttsModels[0]?.value ?? "") as any);
    }, [ttsModels, value.tts_model_id, setField]);

    useEffect(() => {
        if (alwaysCustomVoice) {
            setField("tts_voice_id", "custom" as any);
            if (!value.custom_voice_id) setField("custom_voice_id", "" as any);
        } else if (ttsProvider === "deepgram" && value.custom_voice_id) {
            setField("custom_voice_id", "" as any);
        }
    }, [ttsProvider, alwaysCustomVoice, value.custom_voice_id, setField]);

    useEffect(() => {
        if (llmProvider !== "custom") return;

        setField("llm_provider_model", "" as any);
        setField("llm_provider_base_url", "" as any);
        setField("llm_provider_api_key", "" as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [llmProvider]);
  
  return (
    <div>
      {open && (
        <div className="space-y-6">
          {/* Model */}
          <div className="my-4" id="model"/>
          <ComponentCard
            title={        
            <span className="inline-flex items-center gap-2">
                <Brain size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
                <span>LLM Model</span>
            </span>
            }
            desc="Configure the behavior of the assistant."
            headerRight={
              <button
                type="button"
                onClick={() => setModelOpen((v) => !v)}
                className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
                aria-label={isModelOpen ? "Collapse" : "Expand"}
                aria-expanded={isModelOpen}
              >
                {isModelOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            }
          >
            {isModelOpen && (
              <div className="space-y-6">

                <div className="grid grid-cols-2 gap-4">
                {/* Row 1 - Col 1: Provider (always) */}
                <div>
                    <Label>
                    LLM Provider <Tooltip text="Choose your AI provider." />
                    </Label>
                    <Select
                    options={llmProviders}
                    placeholder="Select Provider"
                    value={value.llm_provider ?? ""}
                    onChange={(v) => setField("llm_provider", v as any)}
                    className="dark:bg-dark-900"
                    disabled={!!loading}
                    />
                </div>

                {/* Row 1 - Col 2: Model OR Custom Model Name */}
                {llmProvider !== "custom" ? (
                    <div>
                    <Label>
                        Model <Tooltip text="Choose your model 🧠" />
                    </Label>
                    <Select
                        options={llmModels}
                        value={value.llm_provider_model ?? ""}
                        placeholder="Select Model"
                        onChange={(v) => setField("llm_provider_model", v as any)}
                        className="dark:bg-dark-900"
                        disabled={!!loading}
                    />
                    </div>
                ) : (
                    <div>
                    <Label>Custom Model Name</Label>
                    <Input
                        type="text"
                        value={value.llm_provider_model ?? ""}
                        onChange={(e) => setField("llm_provider_model", e.target.value as any)}
                        placeholder="e.g. llama-3.1-70b"
                        disabled={!!loading}
                    />
                    </div>
                )}

                {/* Row 2 (only if custom): API key + Base URL */}
                {llmProvider === "custom" && (
                    <>
                    <div>
                        <Label>API Key</Label>
                        <Input
                        type="password"
                        value={value.llm_provider_api_key ?? ""}
                        onChange={(e) => setField("llm_provider_api_key", e.target.value as any)}
                        placeholder="Optional (if required)"
                        disabled={!!loading}
                        />
                    </div>

                    <div>
                        <Label>Base URL</Label>
                        <Input
                        type="text"
                        value={value.llm_provider_base_url ?? ""}
                        onChange={(e) => setField("llm_provider_base_url", e.target.value as any)}
                        placeholder="https://api.example.com/v1"
                        disabled={!!loading}
                        />
                    </div>
                    </>
                )}                  
                </div>

                <div>
                  <Label>First Message</Label>
                  <Input
                    type="text"
                    value={value.welcome_message ?? ""}
                    onChange={(e) => setField("welcome_message", e.target.value)}
                    disabled={!!loading}
                  />
                </div>

                <div>
                  <Label>System Prompt</Label>
                  <TextArea
                    value={value.llm_system_prompt ?? ""}
                    onChange={(v) => setField("llm_system_prompt", v)}
                    rows={9}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Creativity Level (Temperature) <Tooltip text="" />
                    </Label>
                    <Input
                      type="number"
                      step={0.1}
                      value={Number(value.llm_temperature ?? 0.7)}
                      onChange={(e) => setField("llm_temperature", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>
                      Response Length (Max Tokens)
                      <Tooltip text="Maximum response length 📏 ~4 tokens = 1 word" />
                    </Label>
                    <Input
                      type="number"
                      value={Number(value.llm_max_tokens ?? 250)}
                      onChange={(e) => setField("llm_max_tokens", Number(e.target.value))}
                    />
                  </div>
                </div>
                {/* Fallback Providers */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-gray-700 dark:text-gray-400" />
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">Fallback Providers</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                        If the primary provider fails, the system tries fallbacks in order.
                        </div>
                    </div>
                    </div>

                    <div className="flex items-center gap-3">
                    <Label className="mb-0">
                        Enable <Tooltip text="Recommended for reliability in production." />
                    </Label>
                    <Checkbox
                        checked={!!value.fallback_enabled}
                        onChange={(v) => setField("fallback_enabled", v)}
                    />
                    </div>
                </div>

                {!!value.fallback_enabled && (
                    <div className="mt-4 space-y-4">
                    <FallbackRow
                        index={0}
                        accent="amber"
                        label="First fallback"
                        providers={llmProviders}
                        models={llmModels}
                        value={value}
                        setField={setField}
                        loading={loading}
                    />

                    <FallbackRow
                        index={1}
                        accent="orange"
                        label="Second fallback"
                        providers={llmProviders}
                        models={llmModels}
                        value={value}
                        setField={setField}
                        loading={loading}
                    />

                    <FallbackRow
                        index={2}
                        accent="red"
                        label="Third fallback"
                        providers={llmProviders}
                        models={llmModels}
                        value={value}
                        setField={setField}
                        loading={loading}
                    />
                    </div>
                )}
                </div>
              </div>
            )}
          </ComponentCard>

          {/* Voice Configuration */}
          <div className="my-4"  id="voice"/>
          <ComponentCard
            title={        
            <span className="inline-flex items-center gap-2">
                <AudioLines size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
                <span>Voice Configuration</span>
            </span>
            }
            desc="Select a voice from the list, or enable custom voice and add a voice ID."
            headerRight={
              <button
                type="button"
                onClick={() => setVoiceOpen((v) => !v)}
                className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
                aria-label={isVoiceOpen ? "Collapse" : "Expand"}
                aria-expanded={isVoiceOpen}
              >
                {isVoiceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            }
          >
            {isVoiceOpen && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Provider <Tooltip text="Choose your TTS provider." />
                    </Label>
                    <Select
                      options={ttsProviders}
                      placeholder="Select Provider"
                      value={value.tts_provider ?? ""}
                      onChange={(v) => setField("tts_provider", v)}
                      className="dark:bg-dark-900"
                    />
                  </div>

                  <div>
                    <Label>
                      Voice <Tooltip text="Choose your voice." />
                    </Label>
                    <Select
                        placeholder="Select Voice"
                        options={ttsVoices}
                        disabled={disableVoiceSelect}
                        value={alwaysCustomVoice ? "custom" : (value.custom_voice_id ? "custom" : (value.tts_voice_id ?? ""))}
                        onChange={(v) => {
                            if (v === "custom") {
                            setField("custom_voice_id", value.custom_voice_id || "");
                            setField("tts_voice_id", "custom" as any);
                            } else {
                            setField("tts_voice_id", v as any);
                            setField("custom_voice_id", "" as any);
                            }
                      }}
                      className="dark:bg-dark-900"
                    />
                  </div>

                  {showInworldLanguage && (
                    <div>
                        <Label>
                        Inworld Language <Tooltip text="Voices change based on language." />
                        </Label>
                        <Select
                        options={INWORLD_LANGUAGES}
                        value={value.tts_language ?? "en"}
                        onChange={(v) => setField("tts_language", v as any)}
                        className="dark:bg-dark-900"
                        />
                    </div>
                    )}
                </div>

                {allowCustomVoice && !alwaysCustomVoice && (
                <div className="flex items-center gap-3">
                    <Checkbox
                    checked={!!value.custom_voice_id}
                    onChange={(v) => setField("custom_voice_id", v ? value.custom_voice_id || "" : "")}
                    />
                    <Label className="mb-0">
                    Add custom voice <Tooltip text="Enable to paste your own voice ID." />
                    </Label>
                </div>
                )}

                {(alwaysCustomVoice || !!value.custom_voice_id) && allowCustomVoice && (
                <div>
                    <Label>
                    Custom Voice ID <Tooltip text="Provider-specific voice id / UUID." />
                    </Label>
                    <Input
                    type="text"
                    value={value.custom_voice_id ?? ""}
                    onChange={(e) => setField("custom_voice_id", e.target.value as any)}
                    disabled={!!loading}
                    />
                </div>
                )}

                <div>
                  <Label>
                    Model <Tooltip text="Choose your TTS model 🧠" />
                  </Label>
                  <Select
                    options={ttsModels}
                    placeholder="Select Model"
                    value={value.tts_model_id ?? ""}
                    onChange={(v) => setField("tts_model_id", v)}
                    className="dark:bg-dark-900"
                  />
                </div>
              </div>
            )}
          </ComponentCard>

          {/* Transcriber */}
          <div className="my-4"  id="transcriber"/>
          <ComponentCard
            title={        
            <span className="inline-flex items-center gap-2">
                <Captions size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
                <span>Transcriber</span>
            </span>
            }
            desc="Configure the transcription (STT) settings for the assistant."
            headerRight={
              <button
                type="button"
                onClick={() => setTranscriberOpen((v) => !v)}
                className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
                aria-label={isTranscriberOpen ? "Collapse" : "Expand"}
                aria-expanded={isTranscriberOpen}
              >
                {isTranscriberOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            }
          >
            {isTranscriberOpen && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 grid-rows-3 gap-4">
                  <div>
                    <Label>
                      Model <Tooltip text="Choose your STT model/provider." />
                    </Label>
                    <Select
                      options={sttModels}
                      placeholder="Select Model"
                      value={value.stt_model ?? ""}
                      onChange={(v) => setField("stt_model", v)}
                      className="dark:bg-dark-900"
                    />
                  </div>

                  <div>
                    <Label>
                      Language <Tooltip text="Choose your language." />
                    </Label>
                    <Select
                      options={sttLanguages}
                      placeholder="Select Language"
                      value={value.stt_language ?? ""}
                      onChange={(v) => setField("stt_language", v)}
                      className="dark:bg-dark-900"
                    />
                  </div>

                  <div>
                    <Label>Silence Threshold (ms)</Label>
                    <Input
                      type="number"
                      value={Number(value.stt_silence_threshold ?? 500)}
                      onChange={(e) => setField("stt_silence_threshold", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Min Silence Duration (ms)</Label>
                    <Input
                      type="number"
                      value={Number(value.stt_min_silence_duration ?? 1000)}
                      onChange={(e) => setField("stt_min_silence_duration", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Utterance End (ms)</Label>
                    <Input
                      type="number"
                      value={Number(value.stt_utterance_end_ms ?? 100)}
                      onChange={(e) => setField("stt_utterance_end_ms", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>VAD Turnoff (ms)</Label>
                    <Input
                      type="number"
                      value={Number(value.stt_vad_turnoff ?? 500)}
                      onChange={(e) => setField("stt_vad_turnoff", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={!!value.stt_punctuate} onChange={(v) => setField("stt_punctuate", v)} />
                    <Label className="mb-0">Add Punctuation</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={!!value.stt_interim_results}
                      onChange={(v) => setField("stt_interim_results", v)}
                    />
                    <Label className="mb-0">Interim Results</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox checked={!!value.stt_smart_format} onChange={(v) => setField("stt_smart_format", v)} />
                    <Label className="mb-0">Smart Format</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={!!value.stt_audio_denoising}
                      onChange={(v) => setField("stt_audio_denoising", v)}
                    />
                    <Label className="mb-0">
                      Audio Denoising <Tooltip text="Reduces background noise." />
                    </Label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Keywords & Keyterms</Label>
                    <TextArea
                        value={value.stt_keyterms ?? ""}
                        onChange={(v) => setField("stt_keyterms", v as any)}
                        rows={2}
                        placeholder="One term per line (or comma-separated)"
                    />
                  </div>
                </div>
              </div>
            )}
          </ComponentCard>
        </div>
      )}
    </div>
  );
}


// LLM Fallback component.

type Accent = "amber" | "orange" | "red";

function accentClasses(accent: Accent) {
  switch (accent) {
    case "amber":
      return {
        badgeBg: "bg-amber-500/20",
        badgeText: "text-amber-400",
        ring: "focus:ring-amber-500/10",
      };
    case "orange":
      return {
        badgeBg: "bg-orange-500/20",
        badgeText: "text-orange-400",
        ring: "focus:ring-orange-500/10",
      };
    case "red":
      return {
        badgeBg: "bg-red-500/20",
        badgeText: "text-red-400",
        ring: "focus:ring-red-500/10",
      };
  }
}

function FallbackRow({
  index,
  label,
  accent,
  providers,
  value,
  setField,
  loading,
}: {
  index: 0 | 1 | 2;
  label: string;
  accent: Accent;
  providers: { value: string; label: string }[];
  models: { value: string; label: string }[];
  value: AssistantFormState;
  setField: <K extends keyof AssistantFormState>(key: K, value: AssistantFormState[K]) => void;
  loading?: boolean;
}) {
  const a = accentClasses(accent);

  const enabledKey = `fallback_${index}_enabled` as const;
  const providerKey = `fallback_${index}_provider` as const;
  const modelKey = `fallback_${index}_model` as const;
  const apiKeyKey = `fallback_${index}_api_key` as const;
  const baseUrlKey = `fallback_${index}_base_url` as const;

  const enabled = !!value[enabledKey];
  const fallbackProvider = (value[providerKey] as any) || "openai";
  const modelsForFallback = LLM_PROVIDER_CONFIG[fallbackProvider]?.models ?? LLM_PROVIDER_CONFIG.openai.models;   
  const custom_provider = (value[providerKey] as any) === "custom";

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${a.badgeBg} ${a.badgeText}`}
          >
            {index + 1}
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
        </div>

        <Checkbox
          checked={enabled}
          onChange={(v) => {
            setField(enabledKey, v as any);

            // Optional niceness: clear fields when disabling
            if (!v) {
              setField(providerKey, "" as any);
              setField(modelKey, "" as any);
              setField(apiKeyKey, "" as any);
              setField(baseUrlKey, "" as any);
            }
          }}
        />
      </div>

      {enabled && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label>Provider</Label>
            <Select
              options={providers}
              placeholder="Select Provider"
              value={(value[providerKey] as any) ?? ""}
              onChange={(v) => setField(providerKey, v as any)}
              className="dark:bg-dark-900"
            />
          </div>

        <div>
        {!custom_provider ? 
            <div>
                <Label>Model</Label>
                <Select
                    options={modelsForFallback}
                    placeholder="Select Model"
                    value={(value[modelKey] as any) ?? ""}
                    onChange={(v) => setField(modelKey, v as any)}
                    className="dark:bg-dark-900"
                />
            </div>
            :
            <></>
        }
        </div>

          <div>
            <Label>
              API Key <Tooltip text="Used only if this fallback provider is reached." />
            </Label>
            <Input
              type="password"
              value={((value[apiKeyKey] as any) ?? "") as string}
              onChange={(e) => setField(apiKeyKey, e.target.value as any)}
              disabled={!!loading}
            />
          </div>

          <div>
            <Label>
              Base URL <Tooltip text="Optional (custom endpoints / gateways)." />
            </Label>
            <Input
              type="text"
              value={((value[baseUrlKey] as any) ?? "") as string}
              onChange={(e) => setField(baseUrlKey, e.target.value as any)}
              disabled={!!loading}
              placeholder="https://api.example.com/v1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
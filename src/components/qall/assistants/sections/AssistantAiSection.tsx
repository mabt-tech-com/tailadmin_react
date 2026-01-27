import { useMemo, useState } from "react";
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
  onToggle: () => void;
  value: AssistantFormState;
  setField: <K extends keyof AssistantFormState>(key: K, value: AssistantFormState[K]) => void;
  loading?: boolean;
};

export default function AssistantAiSection({ open, onToggle, value, setField, loading }: Props) {
  const [isModelOpen, setModelOpen] = useState(true);
  const [isVoiceOpen, setVoiceOpen] = useState(false);
  const [isTranscriberOpen, setTranscriberOpen] = useState(false);

  // (Later) fetch options from backend. For now keep local options.
  const llmProviders = useMemo(
    () => [
      { value: "openai", label: "OpenAI (GPT Models)" },
      { value: "anthropic", label: "Anthropic (Claude)" },
      { value: "xai", label: "xAi" },
      { value: "groq", label: "Groq" },
      { value: "custom", label: "Custom" },
    ],
    [],
  );

  const llmModels = useMemo(
    () => [
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini" },
      { value: "gpt-3.5-turbo", label: "GPT 3.5 Turbo" },
    ],
    [],
  );

  const ttsProviders = useMemo(
    () => [
      { value: "elevenlabs", label: "Elevenlabs" },
      { value: "deepgram", label: "Deepgram Aura" },
      { value: "resemble", label: "Resemble Ai" },
      { value: "inworld", label: "Inworld" },
    ],
    [],
  );

  const ttsVoices = useMemo(
    () => [
      { value: "rachel", label: "Rachel" },
      { value: "michael", label: "Michael" },
      { value: "jenny", label: "Jenny" },
      { value: "custom", label: "Custom Voice ID" },
    ],
    [],
  );

  const ttsModels = useMemo(
    () => [
      { value: "eleven_v3", label: "Eleven v3" },
      { value: "eleven_multilingual_v2", label: "Multilingual v2" },
      { value: "eleven_turbo_v2_5", label: "Turbo v2.5" },
    ],
    [],
  );

  const sttModels = useMemo(
    () => [
      { value: "nova-2", label: "Deepgram Nova-2" },
      { value: "nova-3", label: "Deepgram Nova-3" },
    ],
    [],
  );

  const sttLanguages = useMemo(
    () => [
      { value: "en", label: "English" },
      { value: "de", label: "German" },
      { value: "es", label: "Spanish" },
    ],
    [],
  );

  const isCustomVoice = !!value.custom_voice_id;

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
                  <div>
                    <Label>
                      LLM Provider <Tooltip text="Choose your AI provider." />
                    </Label>
                    <Select
                      options={llmProviders}
                      placeholder="Select Provider"
                      value={value.llm_provider ?? ""}
                      onChange={(v) => setField("llm_provider", v)}
                      className="dark:bg-dark-900"
                    />
                  </div>

                  <div>
                    <Label>
                      Model <Tooltip text="Choose your model 🧠" />
                    </Label>
                    <Select
                      options={llmModels}
                      value={value.llm_provider_model ?? ""}
                      placeholder="Select Model"
                      onChange={(v) => setField("llm_provider_model", v)}
                      className="dark:bg-dark-900"
                    />
                  </div>
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
                      options={ttsVoices}
                      placeholder="Select Voice"
                        value={value.custom_voice_id ? "custom" : (value.tts_voice_id ?? "")}
                      onChange={(v) => {
                        // if user selects custom, keep existing custom_voice_id or set placeholder
                        if (v === "custom") {
                          setField("custom_voice_id", value.custom_voice_id || "");
                        } else {
                          // normal voice id goes into tts_voice_id
                          setField("tts_voice_id", v);
                        }
                      }}
                      className="dark:bg-dark-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isCustomVoice}
                    onChange={(v) => setField("custom_voice_id", v ? value.custom_voice_id || "" : "")}
                  />
                  <Label className="mb-0">
                    Add custom voice <Tooltip text="Enable to paste your own voice ID." />
                  </Label>
                </div>

                {isCustomVoice && (
                  <div>
                    <Label>
                      Custom Voice ID <Tooltip text="Paste the provider-specific voice ID." />
                    </Label>
                    <Input
                      type="text"
                      value={value.custom_voice_id ?? ""}
                      onChange={(e) => setField("custom_voice_id", e.target.value)}
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
                      value={value.stt_keywords ?? ""}
                      onChange={(v) => setField("stt_keywords", v)}
                      rows={2}
                      placeholder="Comma-separated keywords or keyterms..."
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
  models,
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
            <Label>Model</Label>
            <Select
              options={models}
              placeholder="Select Model"
              value={(value[modelKey] as any) ?? ""}
              onChange={(v) => setField(modelKey, v as any)}
              className="dark:bg-dark-900"
            />
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
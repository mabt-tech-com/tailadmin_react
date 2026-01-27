import PageMeta from "../components/common/PageMeta";
import AssistantHeader from "../components/qall/assistants/AssistantHeader";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAssistantDetail, useSaveAssistant } from "../hooks/useAssistantsApi";
import type { AssistantFormState } from "../components/qall/assistants/assistantForm";
import { createEmptyAssistantForm, mapAssistantToForm } from "../components/qall/assistants/assistantForm";

import AssistantBasicInfoSection from "../components/qall/assistants/sections/AssistantBasicInfoSection";
import AssistantAiSection from "../components/qall/assistants/sections/AssistantAiSection";
import AssistantRagSection from "../components/qall/assistants/sections/AssistantRagSection";
import AssistantCallManagementSection from "../components/qall/assistants/sections/AssistantCallManagementSection";
import AssistantToolsSection from "../components/qall/assistants/sections/AssistantToolsSection";
import AssistantAdvancedSection from "../components/qall/assistants/sections/AssistantAdvancedSection";

export default function AssistantPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const assistantId = id ? Number(id) : null;

  const { assistant, loading, error, reload } = useAssistantDetail(assistantId);
  const { save, loading: saving, error: saveError, clearError } = useSaveAssistant();

  const [open, setOpen] = useState({
    basic: true,
    ai: true,
    rag: false,
    call: false,
    tools: false,
    advanced: false,
  });

  const assistantMeta = useMemo(
    () => ({
      assistantName : assistant?.name ? assistant.name : "",
      assistantSid: assistantId ? String(assistantId) : "",
      createdAt: assistant?.created_at ? new Date(assistant.created_at).toLocaleString() : "",
    }),
    [assistant?.created_at, assistantId],
  );

  const [form, setForm] = useState<AssistantFormState>(() => createEmptyAssistantForm());

  useEffect(() => {
    if (!assistant) return;
    setForm(mapAssistantToForm(assistant));
  }, [assistant]);

  const setField = <K extends keyof AssistantFormState>(key: K, value: AssistantFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    clearError();

    // minimal validation
    if (!form.name?.trim()) {
      alert("Name is required");
      return;
    }
    if (!form.llm_provider?.trim()) {
      alert("LLM Provider is required");
      return;
    }

    try {
      const res: any = await save(assistantId, form);

      // created new assistant → go to its page
      if (!assistantId && res?.assistant_id) {
        navigate(`/assistants/${res.assistant_id}`);
        return;
      }

      // updated existing → refresh detail
      await reload();
    } catch (e: any) {
      // you already store saveError, keep this as last-resort
      console.error(e);
    }
  };

  return (
    <div>
      <PageMeta title="Assistants" description="Manage AI assistants" />

      <AssistantHeader
        assistantName={assistantMeta.assistantName}
        assistantSid={assistantMeta.assistantSid}
        createdAt={assistantMeta.createdAt}
        onSave={handleSave}
        saving={saving}
      />

      <div className="flex-col gap-y-12" id="basic">
        {(error || saveError) && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error ?? saveError}
          </div>
        )}

        <AssistantBasicInfoSection
          open={open.basic}
          onToggle={() => setOpen((p) => ({ ...p, basic: !p.basic }))}
          name={form.name}
          description={form.description ?? ""}
          isActive={!!form.is_active}
          onChangeName={(v) => setField("name", v)}
          onChangeDescription={(v) => setField("description", v)}
          onChangeIsActive={(v) => setField("is_active", v)}
          loading={loading || saving}
        />

        <div className="my-4" id="model" />

        <AssistantAiSection
          open={open.ai}
          onToggle={() => setOpen((p) => ({ ...p, ai: !p.ai }))}
          value={form}
          setField={setField}
          loading={loading || saving}
        />

        <div className="my-4" id="rag" />

        <AssistantRagSection
          open={open.rag}
          onToggle={() => setOpen((p) => ({ ...p, rag: !p.rag }))}
          ragEnabled={!!form.rag_enabled}
          ragSearchLimit={Number(form.rag_search_limit ?? 3)}
          ragSimilarityThreshold={Number(form.rag_similarity_threshold ?? 0.7)}
          ragChunkSize={String(form.rag_chunk_size ?? 1000)}
          kbFiles={form.kbFiles ?? []}
          onChangeRagEnabled={(v) => setField("rag_enabled", v)}
          onChangeSearchLimit={(v) => setField("rag_search_limit", v)}
          onChangeSimilarity={(v) => setField("rag_similarity_threshold", v)}
          onChangeChunkSize={(v) => setField("rag_chunk_size", Number(v))}
          onChangeKbFiles={(files) => setForm((p) => ({ ...p, kbFiles: files }))}
        />

        <div className="my-4" id="call-management" />

        <AssistantCallManagementSection
          open={open.call}
          onToggle={() => setOpen((p) => ({ ...p, call: !p.call }))}
          interruptionThreshold={Number(form.interruption_threshold ?? 3)}
          minSpeakingTime={Number(form.min_speaking_time ?? 0.5)}
          interruptionCooldown={Number(form.interruption_cooldown ?? 2)}
          endCallMessage={form.end_call_message ?? ""}
          transferCallMessage={form.transfer_call_message ?? ""}
          idleMessage={form.idle_message ?? ""}
          maxIdleMessages={Number(form.max_idle_messages ?? 3)}
          idleTimeout={Number(form.idle_timeout ?? 30)}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        />

        <div className="my-4" id="tools" />

        <AssistantToolsSection
          open={open.tools}
          onToggle={() => setOpen((p) => ({ ...p, tools: !p.tools }))}
          endCallEnabled={!!form.end_call_enabled}
          endCallScenarios={form.end_call_scenarios ?? ""}
          endCallCustomMessage={form.end_call_custom_message ?? ""}
          transferCallEnabled={!!form.transfer_call_enabled}
          transferCallScenarios={form.transfer_call_scenarios ?? ""}
          transferCallNumbers={form.transfer_call_numbers ?? ""}
          transferCallCustomMessage={form.transfer_call_custom_message ?? ""}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        />

        <div className="my-4" id="advanced" />

        <AssistantAdvancedSection
          open={open.advanced}
          onToggle={() => setOpen((p) => ({ ...p, advanced: !p.advanced }))}
          structuredDataPrompt={form.structured_data_prompt ?? ""}
          structuredDataSchemaJson={form.structured_data_schema ?? ""}
          onChangePrompt={(v) => setField("structured_data_prompt", v)}
          onChangeSchemaJson={(v) => setField("structured_data_schema", v)}
        />
      </div>
    </div>
  );
}
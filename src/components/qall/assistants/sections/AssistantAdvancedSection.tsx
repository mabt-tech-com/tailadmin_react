// src/components/qall/assistants/sections/AssistantAdvancedSection.tsx
import { useEffect, useMemo, useState } from "react";
import ComponentCard from "../../../common/ComponentCard";
import Label from "../../../form/Label";
import TextArea from "../../../common/input/TextArea";
import Input from "../../../common/input/InputField";
import Checkbox from "../../../common/input/Checkbox";
import Select from "../../../form/Select";
import { Tooltip } from "../../../common/Tooltip";
import { BookOpen, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

type ExtractionFieldType = "string" | "number" | "boolean" | "array" | "enum";

type ExtractionField = {
  id: string;
  name: string;
  type: ExtractionFieldType;
  description: string;
  required: boolean;
  enumValues?: string[];
};

type Props = {
  open: boolean;
  onToggle: () => void;

  structuredDataPrompt: string;
  structuredDataSchemaJson: string;

  onChangePrompt: (value: string) => void;
  onChangeSchemaJson: (value: string) => void;
};

function uid() {
  return crypto?.randomUUID?.() ?? `id_${Math.random().toString(16).slice(2)}`;
}

function safeParseJsonObject(value: string): { ok: true; obj: any } | { ok: false; error: string } {
  if (!value?.trim()) return { ok: true, obj: {} };
  try {
    const parsed = JSON.parse(value);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: "Schema must be a JSON object." };
    }
    return { ok: true, obj: parsed };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Invalid JSON." };
  }
}

function normalizeSchemaToFields(schemaObj: any): ExtractionField[] {
  // Expecting JSON Schema-like object:
  // { type: "object", properties: { key: {type, description, enum, items}}, required: ["key"] }
  const props = schemaObj?.properties && typeof schemaObj.properties === "object" ? schemaObj.properties : {};
  const required: string[] = Array.isArray(schemaObj?.required) ? schemaObj.required : [];

  const toTitle = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const fields: ExtractionField[] = [];

  Object.entries(props).forEach(([key, def]: any) => {
    if (!def || typeof def !== "object") return;

    let type: ExtractionFieldType = "string";
    let enumValues: string[] | undefined;

    if (Array.isArray(def.enum)) {
      type = "enum";
      enumValues = def.enum.map((v: any) => String(v));
    } else if (def.type === "array") {
      type = "array";
    } else if (def.type === "number") {
      type = "number";
    } else if (def.type === "boolean") {
      type = "boolean";
    } else {
      type = "string";
    }

    fields.push({
      id: uid(),
      name: toTitle(key),
      type,
      description: typeof def.description === "string" ? def.description : "",
      required: required.includes(key),
      enumValues: enumValues ?? (type === "enum" ? ["Option 1", "Option 2"] : []),
    });
  });

  return fields;
}

function buildSchemaFromFields(fields: ExtractionField[]) {
  const schema: any = {
    type: "object",
    properties: {} as Record<string, any>,
    required: [] as string[],
  };

  const toKey = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  fields.forEach((f) => {
    const name = f.name.trim();
    if (!name) return;

    const key = toKey(name);
    if (!key) return;

    if (f.type === "enum") {
      const enumValues = (f.enumValues ?? []).map((v) => v.trim()).filter(Boolean);
      if (enumValues.length === 0) return;

      schema.properties[key] = {
        type: "string",
        enum: enumValues,
        description:
          f.description?.trim() ||
          `The ${name.toLowerCase()} from the conversation (one of: ${enumValues.join(", ")})`,
      };
    } else if (f.type === "array") {
      schema.properties[key] = {
        type: "array",
        items: { type: "string" },
        description: f.description?.trim() || `A list of ${name.toLowerCase()} items from the conversation`,
      };
    } else {
      schema.properties[key] = {
        type: f.type,
        description: f.description?.trim() || `The ${name.toLowerCase()} from the conversation`,
      };
    }

    if (f.required && schema.properties[key]) schema.required.push(key);
  });

  if (schema.required.length === 0) delete schema.required;
  return schema;
}

export default function AssistantAdvancedSection({
  open,
  onToggle,
  structuredDataPrompt,
  structuredDataSchemaJson,
  onChangePrompt,
  onChangeSchemaJson,
}: Props) {
  // Builder state
  const [extractionFields, setExtractionFields] = useState<ExtractionField[]>([]);
  const [schemaJsonError, setSchemaJsonError] = useState<string | null>(null);

  // Tabs: "builder" or "json"
  const [mode, setMode] = useState<"builder" | "json">("builder");

  // Initialize builder from existing JSON schema (one-time per open, and whenever schema changes externally)
  useEffect(() => {
    const parsed = safeParseJsonObject(structuredDataSchemaJson || "{}");
    if (!parsed.ok) {
      setSchemaJsonError(parsed.error);
      // keep existing fields (don’t wipe) if json is invalid
      return;
    }
    setSchemaJsonError(null);

    const nextFields = normalizeSchemaToFields(parsed.obj);
    setExtractionFields(nextFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // initialize when opening

  // When fields change, update JSON schema string (builder => JSON source of truth)
  const builtSchemaJson = useMemo(() => {
    const schemaObj = buildSchemaFromFields(extractionFields);
    return JSON.stringify(schemaObj, null, 2);
  }, [extractionFields]);

  useEffect(() => {
    if (mode !== "builder") return;
    onChangeSchemaJson(builtSchemaJson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builtSchemaJson, mode]);

  const addField = (preset?: Partial<ExtractionField>) => {
    setExtractionFields((prev) => [
      ...prev,
      {
        id: uid(),
        name: preset?.name ?? "",
        type: (preset?.type as ExtractionFieldType) ?? "string",
        description: preset?.description ?? "",
        required: preset?.required ?? false,
        enumValues: preset?.enumValues ?? (preset?.type === "enum" ? ["Option 1", "Option 2"] : []),
      },
    ]);
  };

  const removeField = (id: string) => {
    setExtractionFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateField = (id: string, patch: Partial<ExtractionField>) => {
    setExtractionFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;

        if (patch.type && patch.type !== "enum") {
          return { ...f, ...patch, enumValues: [] };
        }

        if (patch.type === "enum" && (!f.enumValues || f.enumValues.length === 0)) {
          return { ...f, ...patch, enumValues: ["Option 1", "Option 2"] };
        }

        return { ...f, ...patch };
      }),
    );
  };

  const loadTemplate = (template: "sales" | "support" | "booking" | "feedback") => {
    const templates: Record<string, Omit<ExtractionField, "id">[]> = {
      sales: [
        { name: "Customer Name", type: "string", description: "The customer's full name", required: true, enumValues: [] },
        { name: "Product Interest", type: "string", description: "Which product/service they are interested in", required: true, enumValues: [] },
        {
          name: "Budget Range",
          type: "enum",
          description: "Customer budget range",
          required: false,
          enumValues: ["Under €1,000", "€1,000–€5,000", "€5,000–€10,000", "€10,000+", "Not discussed"],
        },
        {
          name: "Purchase Intent",
          type: "enum",
          description: "How likely they are to purchase",
          required: false,
          enumValues: ["High", "Medium", "Low", "Not specified"],
        },
        { name: "Follow-up Required", type: "boolean", description: "Whether follow-up is needed", required: false, enumValues: [] },
      ],
      support: [
        {
          name: "Issue Type",
          type: "enum",
          description: "Main category of the problem",
          required: true,
          enumValues: ["Technical", "Billing", "Account", "Product", "Service", "Other"],
        },
        { name: "Issue Description", type: "string", description: "Detailed description of the problem", required: true, enumValues: [] },
        { name: "Urgency", type: "enum", description: "How urgent the issue is", required: false, enumValues: ["Critical", "High", "Medium", "Low"] },
        {
          name: "Resolved",
          type: "enum",
          description: "Resolution status",
          required: false,
          enumValues: ["Resolved", "Partially resolved", "Escalated", "Unresolved"],
        },
        { name: "Escalation Needed", type: "boolean", description: "Needs escalation to specialist", required: false, enumValues: [] },
      ],
      booking: [
        { name: "Service Type", type: "string", description: "Service/appointment requested", required: true, enumValues: [] },
        { name: "Preferred Date", type: "string", description: "Preferred date mentioned", required: false, enumValues: [] },
        {
          name: "Preferred Time",
          type: "enum",
          description: "Preferred time slot",
          required: false,
          enumValues: ["Morning", "Afternoon", "Evening", "Flexible", "Not specified"],
        },
        { name: "Special Requirements", type: "string", description: "Any special requirements", required: false, enumValues: [] },
        { name: "Booking Confirmed", type: "boolean", description: "Was booking confirmed", required: false, enumValues: [] },
      ],
      feedback: [
        {
          name: "Overall Rating",
          type: "enum",
          description: "Satisfaction rating",
          required: false,
          enumValues: ["1 - Very poor", "2 - Poor", "3 - Average", "4 - Good", "5 - Excellent"],
        },
        { name: "Positive Feedback", type: "string", description: "What they liked", required: false, enumValues: [] },
        { name: "Improvements", type: "string", description: "What should be improved", required: false, enumValues: [] },
        { name: "Follow-up Requested", type: "boolean", description: "Did they request follow-up", required: false, enumValues: [] },
      ],
    };

    setExtractionFields(templates[template].map((t) => ({ ...t, id: uid() })));
    setMode("builder");
  };

  const applyJsonToBuilder = () => {
    const parsed = safeParseJsonObject(structuredDataSchemaJson || "{}");
    if (!parsed.ok) {
      setSchemaJsonError(parsed.error);
      return;
    }
    setSchemaJsonError(null);
    setExtractionFields(normalizeSchemaToFields(parsed.obj));
    setMode("builder");
  };

  const onJsonChange = (v: string) => {
    onChangeSchemaJson(v);
    const parsed = safeParseJsonObject(v || "{}");
    setSchemaJsonError(parsed.ok ? null : parsed.error);
  };

  return (
    <ComponentCard
      title={        
            <span className="inline-flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
                <span>Advanced Settings</span>
            </span>
            }
      desc="Structured data extraction and custom configurations"
      headerRight={
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
          aria-label={open ? "Collapse" : "Expand"}
          aria-expanded={open}
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      }
    >
      {open && (
        <div className="space-y-6">
          {/* Mode switch */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode("builder")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === "builder"
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                Builder
              </button>
              <button
                type="button"
                onClick={() => setMode("json")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === "json"
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                JSON
              </button>
              <Tooltip text="Use Builder for a friendly UI, or JSON for full control. Builder will keep JSON in sync." />
            </div>

            {mode === "json" && (
              <button
                type="button"
                onClick={applyJsonToBuilder}
                className="rounded-lg border border-blue-500 bg-white px-3 py-2 text-xs font-medium text-blue-500 hover:bg-gray-50 dark:border-blue-500 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                Apply JSON → Builder
              </button>
            )}
          </div>

          {/* Field builder */}
          {mode === "builder" && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">
                  What information do you want to capture from calls?
                </h5>

                <button
                  type="button"
                  onClick={() => addField()}
                  className="text-blue-500 inline-flex items-center rounded-lg border border-blue-500 bg-white px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {extractionFields.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    No fields yet. Click <span className="font-medium">Add Field</span> or load a template below.
                  </div>
                )}

                {extractionFields.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-950/30"
                  >
                    {/* Top row */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
                      <div className="md:col-span-5">
                        <Label>Field name</Label>
                        <Input
                          type="text"
                          value={f.name}
                          onChange={(e) => updateField(f.id, { name: e.target.value })}
                          placeholder="Customer name"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <Label>Type</Label>
                        <Select
                          options={[
                            { value: "string", label: "Text" },
                            { value: "number", label: "Number" },
                            { value: "boolean", label: "Yes/No" },
                            { value: "array", label: "List" },
                            { value: "enum", label: "Multiple choice" },
                          ]}
                          placeholder="Select type"
                          value={f.type ?? ""}
                          onChange={(value) => updateField(f.id, { type: value as ExtractionFieldType })}
                          className="dark:bg-dark-900"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Label className="opacity-0 select-none">Actions</Label>
                        <button
                          type="button"
                          onClick={() => removeField(f.id)}
                          className="h-11 w-full rounded-lg border border-red-400 bg-white px-4 text-sm font-medium text-red-400 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Description + required */}
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
                      <div className="md:col-span-9">
                        <Label>Description</Label>
                        <Input
                          type="text"
                          value={f.description}
                          onChange={(e) => updateField(f.id, { description: e.target.value })}
                          placeholder="Helps the AI understand what to extract"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-gray-800 dark:bg-gray-900/40">
                          <Checkbox checked={f.required} onChange={(v) => updateField(f.id, { required: v })} />
                          <span className="ml-3 text-sm text-gray-700 dark:text-gray-200">Required</span>
                        </div>
                      </div>
                    </div>

                    {/* Enum options */}
                    {f.type === "enum" && (
                      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <h6 className="text-sm font-medium text-gray-800 dark:text-white/90">Options</h6>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              The model must pick one of these exact values.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateField(f.id, {
                                enumValues: [...(f.enumValues ?? []), `Option ${(f.enumValues?.length ?? 0) + 1}`],
                              })
                            }
                            className="h-9 rounded-lg border border-blue-500 bg-white px-3 text-xs font-medium text-blue-500 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors"
                          >
                            Add option
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(f.enumValues ?? []).map((opt, idx) => (
                            <div key={`${f.id}_opt_${idx}`} className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const next = [...(f.enumValues ?? [])];
                                  next[idx] = e.target.value;
                                  updateField(f.id, { enumValues: next });
                                }}
                                placeholder={`Option ${idx + 1}`}
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const next = (f.enumValues ?? []).filter((_, i) => i !== idx);
                                  updateField(f.id, { enumValues: next });
                                }}
                                className="h-11 w-11 shrink-0 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Remove option"
                                title="Remove option"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          {(f.enumValues ?? []).length === 0 && (
                            <div className="rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                              No options yet. Click “Add option”.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Templates */}
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
                <h6 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Quick Templates:</h6>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadTemplate("sales")}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sales call
                  </button>

                  <button
                    type="button"
                    onClick={() => loadTemplate("support")}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Customer support
                  </button>

                  <button
                    type="button"
                    onClick={() => loadTemplate("booking")}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Appointment booking
                  </button>

                  <button
                    type="button"
                    onClick={() => loadTemplate("feedback")}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Feedback collection
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtractionFields([])}
                    className="ml-auto rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-4">
                  <Label>Schema Preview (read-only)</Label>
                  <TextArea value={builtSchemaJson} onChange={() => {}} rows={8} />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This is what will be sent as <code>structured_data_schema</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* JSON editor */}
          {mode === "json" && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
              <div className="mb-2 flex items-center justify-between">
                <Label className="mb-0">Structured Data Schema (JSON)</Label>
                {schemaJsonError ? (
                  <span className="text-xs font-medium text-red-500">Invalid JSON</span>
                ) : (
                  <span className="text-xs font-medium text-emerald-500">Valid</span>
                )}
              </div>

              <TextArea
                value={structuredDataSchemaJson}
                onChange={onJsonChange}
                rows={14}
                placeholder='{"type":"object","properties":{"call_topic":{"type":"string"}}}'
              />

              {schemaJsonError && (
                <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
                  <strong>JSON error:</strong> {schemaJsonError}
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Tip: keep it a JSON object. Expected shape is JSON Schema-like{" "}
                <code>{"{ type, properties, required }"}</code>.
              </div>
            </div>
          )}

          {/* Custom instructions */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>

              <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">Custom Instructions</h5>
              <span className="text-xs text-gray-500 italic">Optional</span>
              <Tooltip text="Provide extra guidance about terminology, business context, or any special extraction rules." />
            </div>

            <TextArea
              value={structuredDataPrompt}
              onChange={(v) => onChangePrompt(v)}
              rows={4}
              placeholder='Add any specific instructions... e.g. "Focus on urgency level and product mentions (X, Y, Z)."'
            />

            <div className="mt-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
              <div className="text-xs text-yellow-700 dark:text-yellow-200">
                <strong>Example:</strong> Focus on identifying customer urgency levels and any specific product mentions.
              </div>
            </div>
          </div>
        </div>
      )}
    </ComponentCard>
  );
}
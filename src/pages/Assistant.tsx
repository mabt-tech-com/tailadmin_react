import PageMeta from "../components/common/PageMeta";
import { useMemo } from "react";
import AssistantHeader from "../components/qall/assistants/AssistantHeader";
import KnowledgebaseDropzone from "../components/qall/assistants/KnowledgebaseDropZone"; 
import { useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import TextArea from "../components/common/input/TextArea";
import Input from "../components/common/input/InputField";
import Checkbox from "../components/common/input/Checkbox";
import Select from "../components/form/Select";
import { Tooltip } from "../components/common/Tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";


export default function AssistantPage() {
    // tab controls : 
    const [isBasicInformationOpen, setBasicInformationOpen] = useState(true);
    const [isModelOpen, setModelOpen] = useState(true);
    const [isVoiceOpen, setVoiceOpen] = useState(false);
    const [isTranscriberOpen, setTranscriberOpen] = useState(false);
    const [isCallManagementOpen, setCallManagementOpen] = useState(false);
    const [isToolsOpen, setToolsOpen] = useState(false);
    const [isRagOpen, setRagOpen] = useState(false);
    const [isAdvancedOpen, setAdvancedOpen] = useState(false);

    // Basic Information
    const assistant = useMemo(
        () => ({
          assistantSid: "384b0612-5441-41cf-965d-80f1097a8a7c",
          createdAt: "January 21, 2026 at 23:17",
        }),
        []
      );  
    const [description, setDescription] = useState("");
    const [isAssistantActive, setAssistantActive] = useState(false);
    
    // llm model configuration
    const llm_provider = [
        { value: "OpenAI (GPT Models)", label: "OpenAI (GPT Models)" },
        { value: "Anthropic (Claude)", label: "Anthropic (Claude)" },
        { value: "xAi", label: "xAi" },
    ];
    const llm_model = [
        { value: "GPT-4o", label: "GPT-4o" },
        { value: "GPT-4o Mini", label: "GPT-4o Mini" },
        { value: "GPT 3.5 Turbo", label: "GPT 3.5 Turbo" },
    ];
    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };
    const [systemPrompot, setSystemPrompot] = useState("");

    // tts voice configuration 
    const tts_provider = [
        { value: "Elevenlabs", label: "Elevenlabs" },
        { value: "Deepgram", label: "Deepgram Aura" },
        { value: "Resemble", label: "Resemble Ai" },
    ];    
    const tts_voice = [
        { value: "id-8123", label: "Rachel" },
        { value: "id-4543", label: "Michael" },
        { value: "id-1242", label: "Jenny" },
    ];
    const tts_model = [
        { value: "eleven-v3", label: "Eleven v3" },
        { value: "multilingual-v3", label: "Multilingual v3" },
        { value: "turbo-v2.5", label: "Turbo v2.5" },
    ];
    const [isCustomVoice, setCustomVoice] = useState(false);

    // stt transcript configuration 
    const stt_model = [
        { value: "id-8123", label: "Rachel" },
        { value: "id-4543", label: "Michael" },
        { value: "id-1242", label: "Jenny" },
    ];
    const stt_language = [
        { value: "english", label: "english" },
        { value: "german", label: "german" },
        { value: "spanish", label: "spanish" },
    ];
    const [isSttPunctiation, setSttPunctiation] = useState(false);
    const [isSttInterimResults, setSttInterimResults] = useState(false);
    const [isSttSmartFormat, setSttSmartFormat] = useState(false);
    const [isSttAudioDenoising, setSttAudioDenoising] = useState(false);
    const [sttKeywords, setSttKeywords] = useState("");


    // call management : 
    const [interruptionThreshold, setInterruptionThreshold] = useState<number>(3);
    const [minSpeakingTime, setMinSpeakingTime] = useState<number>(0.5);
    const [interruptionCooldown, setInterruptionCooldown] = useState<number>(2.0);
    const [endCallMessage, setEndCallMessage] = useState<string>("Thank you for calling. Goodbye!");
    const [transferCallMessage, setTransferCallMessage] = useState<string>("Please hold while I transfer your call.");
    const [idleMessage, setIdleMessage] = useState<string>("Are you still there? I'm here to help if you need anything.");
    const [maxIdleMessages, setMaxIdleMessages] = useState<number>(3);
    const [idleTimeout, setIdleTimeout] = useState<number>(30);

    // RAG (Knowledge Base): 
    const rag_chunk_sizes = [
        { value: "500", label: "500 chars (Precise)" },
        { value: "1000", label: "1000 chars (Balanced)" },
        { value: "1500", label: "1500 chars (Contextual)" },
        { value: "2000", label: "2000 chars (Large Context)" },
    ];
    const [ragEnabled, setRagEnabled] = useState(true);

    const [ragSearchLimit, setRagSearchLimit] = useState<number>(3);
    const [ragSimilarityThreshold, setRagSimilarityThreshold] = useState<number>(0.7);
    const [ragChunkSize, setRagChunkSize] = useState<string>("1000");

    const [isUploadOpen, setUploadOpen] = useState(false);
    const [kbFiles, setKbFiles] = useState<File[]>([]);


    // tools section :
    // End Call Tool
    const [endCallEnabled, setEndCallEnabled] = useState(false);
    const [endCallScenarios, setEndCallScenarios] = useState<string>("");
    const [endCallCustomMessage, setEndCallCustomMessage] = useState<string>("");

    // Transfer Call Tool
    const [transferCallEnabled, setTransferCallEnabled] = useState(false);
    const [transferCallScenarios, setTransferCallScenarios] = useState<string>("");
    const [transferCallNumbers, setTransferCallNumbers] = useState<string>("");
    const [transferCallCustomMessage, setTransferCallCustomMessage] = useState<string>("");

    // advanced settings configurations : 
    type ExtractionFieldType = "string" | "number" | "boolean" | "array" | "enum";

    type ExtractionField = {
    id: string;
    name: string;
    type: ExtractionFieldType;
    description: string;
    required: boolean;
    enumValues?: string[]; // only for enum
    };

    const uid = () => crypto?.randomUUID?.() ?? `id_${Math.random().toString(16).slice(2)}`;

    const [structuredDataPrompt, setStructuredDataPrompt] = useState<string>("");

    const [extractionFields, setExtractionFields] = useState<ExtractionField[]>([
    // optional: start empty; or add 1 default field
    // { id: uid(), name: "Customer Name", type: "string", description: "The customer's full name", required: true }
    ]);

    const structuredDataSchema = useMemo(() => {
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

    extractionFields.forEach((f) => {
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
    }, [extractionFields]);

    const structuredDataSchemaJson = useMemo(
    () => JSON.stringify(structuredDataSchema, null, 2),
    [structuredDataSchema]
    );

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

        // if switching away from enum, drop enumValues
        if (patch.type && patch.type !== "enum") {
            return { ...f, ...patch, enumValues: [] };
        }

        // if switching to enum and no enumValues, provide defaults
        if (patch.type === "enum" && (!f.enumValues || f.enumValues.length === 0)) {
            return { ...f, ...patch, enumValues: ["Option 1", "Option 2"] };
        }

        return { ...f, ...patch };
        })
    );
    };

    const loadTemplate = (template: "sales" | "support" | "booking" | "feedback") => {
    const templates: Record<string, Omit<ExtractionField, "id">[]> = {
        sales: [
        { name: "Customer Name", type: "string", description: "The customer's full name", required: true, enumValues: [] },
        { name: "Product Interest", type: "string", description: "Which product/service they are interested in", required: true, enumValues: [] },
        { name: "Budget Range", type: "enum", description: "Customer budget range", required: false, enumValues: ["Under €1,000", "€1,000–€5,000", "€5,000–€10,000", "€10,000+", "Not discussed"] },
        { name: "Purchase Intent", type: "enum", description: "How likely they are to purchase", required: false, enumValues: ["High", "Medium", "Low", "Not specified"] },
        { name: "Follow-up Required", type: "boolean", description: "Whether follow-up is needed", required: false, enumValues: [] },
        ],
        support: [
        { name: "Issue Type", type: "enum", description: "Main category of the problem", required: true, enumValues: ["Technical", "Billing", "Account", "Product", "Service", "Other"] },
        { name: "Issue Description", type: "string", description: "Detailed description of the problem", required: true, enumValues: [] },
        { name: "Urgency", type: "enum", description: "How urgent the issue is", required: false, enumValues: ["Critical", "High", "Medium", "Low"] },
        { name: "Resolved", type: "enum", description: "Resolution status", required: false, enumValues: ["Resolved", "Partially resolved", "Escalated", "Unresolved"] },
        { name: "Escalation Needed", type: "boolean", description: "Needs escalation to specialist", required: false, enumValues: [] },
        ],
        booking: [
        { name: "Service Type", type: "string", description: "Service/appointment requested", required: true, enumValues: [] },
        { name: "Preferred Date", type: "string", description: "Preferred date mentioned", required: false, enumValues: [] },
        { name: "Preferred Time", type: "enum", description: "Preferred time slot", required: false, enumValues: ["Morning", "Afternoon", "Evening", "Flexible", "Not specified"] },
        { name: "Special Requirements", type: "string", description: "Any special requirements", required: false, enumValues: [] },
        { name: "Booking Confirmed", type: "boolean", description: "Was booking confirmed", required: false, enumValues: [] },
        ],
        feedback: [
        { name: "Overall Rating", type: "enum", description: "Satisfaction rating", required: false, enumValues: ["1 - Very poor", "2 - Poor", "3 - Average", "4 - Good", "5 - Excellent"] },
        { name: "Positive Feedback", type: "string", description: "What they liked", required: false, enumValues: [] },
        { name: "Improvements", type: "string", description: "What should be improved", required: false, enumValues: [] },
        { name: "Follow-up Requested", type: "boolean", description: "Did they request follow-up", required: false, enumValues: [] },
        ],
    };

    setExtractionFields(templates[template].map((t) => ({ ...t, id: uid() })));
    };


  return (
    <div>
      <PageMeta
        title="Assistants "
        description="Manage AI assistants"
      />

      <AssistantHeader assistantSid={assistant.assistantSid}
      createdAt={assistant.createdAt}/>

    
    {/* Header row */}
    <div className="flex-col gap-y-12">
     <ComponentCard title="Basic Information" 
        desc="Core details about your assistant"
        headerRight={
            <button
                type="button"
                onClick={() => setBasicInformationOpen((v) => !v)}
                className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
                aria-label={isBasicInformationOpen ? "Collapse" : "Expand"}
                aria-expanded={isBasicInformationOpen}
            >
                {isBasicInformationOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
        }>
        {isBasicInformationOpen && (
        <div>
            <div>
                <Label>Assistant Name</Label>
                <Input type="text"/>
            </div>
            <div className="space-y-6">
                <div>
                    <Label>Description</Label>
                    <TextArea
                        value={description}
                        onChange={(value) => setDescription(value)}
                        rows={3}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Checkbox checked={isAssistantActive} onChange={setAssistantActive} />
                <Label className="mb-0"> 
                    Active Assistant
                </Label>
                <span className="text-gray-400 text-sm">When active, the assistant can receive and handle calls</span>
            </div>
        </div>
        )}
    </ComponentCard>
    
    {/**/}
    <div className="my-4"></div>
    <ComponentCard title="Model" 
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
        }>
        {isModelOpen && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>LLM Provider <Tooltip text="Choose Your AI Provider ...." /> 
                        </Label>
                        <Select
                            options={llm_provider}
                            placeholder="Select Provider"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                    
                    <div>
                        <Label>Model <Tooltip text="Choose Your Model 🧠 ...."  /> 
                        </Label>
                        <Select
                            options={llm_model}
                            placeholder="Select Model"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                </div>
                <div>
                    <Label>First Message</Label>
                    <Input type="text"/>
                </div>
                <div className="space-y-6">
                    <div>
                        <Label>System Prompt</Label>
                        <TextArea
                            value={systemPrompot}
                            onChange={(value) => setSystemPrompot(value)}
                            rows={9}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Creativity Level (Temperature) <Tooltip text="" /></Label>
                        <Input type="text" value={0.7}/>
                    </div>
                    
                    <div>
                        <Label>Response Length (Max Tokens)<Tooltip text="Maximum Response Length 📏 ~4 tokens = 1 word " /></Label>
                        <Input type="text" value={250}/>
                    </div>
                </div>
        </div>
      )}
    </ComponentCard>
   
   
    {/**/}
    <div className="my-4"></div>
    <ComponentCard 
        title="Voice Configuration" 
        desc="Select a voice from the list, or sync your voice library if it's missing. If errors persist, enable custom voice and add a voice ID."
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
        }>
        {isVoiceOpen && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Provider <Tooltip text="Choose Your TTS Provider ...." /> 
                        </Label>
                        <Select
                            options={tts_provider}
                            placeholder="Select Provider"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                    
                    <div>
                        <Label>Voice <Tooltip text="Choose Your Voice  ...."  /> 
                        </Label>
                        <Select
                            options={tts_voice}
                            placeholder="Select Voice"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Checkbox checked={isCustomVoice} onChange={setCustomVoice} />
                    <Label className="mb-0"> 
                        Add custom voice <Tooltip text="" />
                    </Label>
                </div>
                <div>
                    <Label>Model <Tooltip text="Choose Your Model 🧠 ...."  /> 
                    </Label>
                    <Select
                        options={tts_model}
                        placeholder="Select Model"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                    />
                </div>
            </div>
        )}
    </ComponentCard>
    
    {/**/}
    <div className="my-4"></div>
    <ComponentCard 
            title="Transcriber" 
            desc="This section allows you to configure the transcription settings for the assistant."
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
        }>
        {isTranscriberOpen && (
        <div className="space-y-6">
            <div className="grid grid-cols-2 grid-rows-3 gap-4">
                <div>
                    <Label>Model <Tooltip text="Choose Your STT Provider ...." /> 
                    </Label>
                    <Select
                        options={stt_model}
                        placeholder="Select Model"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                    />
                </div>
                <div>
                    <Label>Language <Tooltip text="Choose Your Language ...."  /> 
                    </Label>
                    <Select
                        options={stt_language}
                        placeholder="Select Language"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                    />
                </div>
                <div>
                    <Label>Silence Threshold (ms) </Label>
                    <Input type="text" value={500}/>
                </div>
                
                <div>
                    <Label>Min Silence Duration (ms) </Label>
                    <Input type="text" value={1000}/>
                </div>
                            <div>
                    <Label>Utterance End (ms) </Label>
                    <Input type="text" value={100}/>
                </div>
                
                <div>
                    <Label>VAD Turnoff (ms)</Label>
                    <Input type="text" value={500}/>
                </div>
            </div>
            
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <div className="flex items-center gap-3">
                <Checkbox checked={isSttPunctiation} onChange={setSttPunctiation} />
                <Label className="mb-0"> 
                    Add Punctuation
                </Label>
                </div>
                <div className="flex items-center gap-3">
                <Checkbox checked={isSttInterimResults} onChange={setSttInterimResults} />
                <Label className="mb-0"> 
                    Interim Results
                </Label>
                </div>
                <div className="flex items-center gap-3">
                <Checkbox checked={isSttSmartFormat} onChange={setSttSmartFormat} />
                <Label className="mb-0"> 
                    Smart Format
                </Label>
                </div>
                <div className="flex items-center gap-3">
                <Checkbox checked={isSttAudioDenoising} onChange={setSttAudioDenoising} />
                <Label className="mb-0"> 
                    Audio Denoising <Tooltip text=" " />
                </Label>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <Label>Keywords & Keyterms</Label>
                    <TextArea
                        value={sttKeywords}
                        onChange={(value) => setSttKeywords(value)}
                        rows={2}
                    />
                </div>
            </div>
        </div>
        )}
    </ComponentCard>


    <div className="my-4"></div>
    <ComponentCard
    title="Knowledge Base (RAG)"
    desc="Upload documents to enhance AI responses with your knowledge"
    headerRight={
        <button
        type="button"
        onClick={() => setRagOpen((v) => !v)}
        className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
        aria-label={isRagOpen ? "Collapse" : "Expand"}
        aria-expanded={isRagOpen}
        >
        {isRagOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
    }
    >
    {isRagOpen && (
        <div className="space-y-6">
        {/* RAG Settings Header Row */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">RAG Settings</h4>
            </div>

            <div className="flex items-center gap-3">
            <Checkbox checked={ragEnabled} onChange={setRagEnabled} />
            <Label className="mb-0">Enable Knowledge Base</Label>
            </div>
        </div>

        {ragEnabled && (
            <>
            {/* Settings Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                <Label>Max Documents per Query</Label>
                <Input
                    type="number"
                    min={"1"}
                    max={"10"}
                    value={ragSearchLimit}
                    onChange={(e) => setRagSearchLimit(Number(e.target.value))}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Number of document chunks to retrieve per query
                </p>
                </div>

                <div>
                <Label>Relevance Threshold</Label>
                <Input
                    type="number"
                    step={0.1}
                    min="0.1"
                    max="1.0"
                    value={ragSimilarityThreshold}
                    onChange={(e) => setRagSimilarityThreshold(Number(e.target.value))}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum similarity score (0.1–1.0)
                </p>
                </div>

                <div>
                <Label>Chunk Size</Label>
                <Select
                    options={rag_chunk_sizes}
                    placeholder="Select Chunk Size"
                    onChange={(value) => setRagChunkSize(value)}
                    className="dark:bg-dark-900"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Size of text chunks for processing
                </p>
                </div>
            </div>

            {/* How RAG Works */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">How RAG Works</span>
                </div>
                <p className="text-xs text-emerald-500 dark:text-emerald-200">
                When enabled, your AI searches uploaded documents to find relevant info before answering.
                This enables more accurate, context-aware responses based on your knowledge base.
                </p>
            </div>

            {/* Upload Documents section */}
            <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Upload Documents
                        </h4>
                    </div>

                    <button
                        type="button"
                        onClick={() => setUploadOpen((v) => !v)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        {isUploadOpen ? "Hide Upload" : "Add Documents"}
                    </button>
                </div>

                {isUploadOpen && (
                <div className="mt-4">
                    <KnowledgebaseDropzone value={kbFiles} onChange={setKbFiles} maxSizeMb={10} />
                </div>
                )}

                {/* Tips */}
                <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-300">Document Tips</span>
                    </div>
                    <ul className="space-y-1 text-xs text-blue-200">
                        <li>• Upload manuals, FAQs, policies, and other reference documents</li>
                        <li>• Supported formats: PDF, Word documents, text files, and Markdown</li>
                        <li>• Documents are automatically processed and indexed for fast retrieval</li>
                        <li>• Each document is private to this assistant only</li>
                    </ul>
                </div>
            </div>
            </>
        )}

        {!ragEnabled && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300">
            Knowledge Base is disabled. Enable it to configure settings and upload documents.
            </div>
        )}
        </div>
    )}
    </ComponentCard>


    <div className="my-4"></div>
    <ComponentCard
        title="Call Management"
        desc="Configure call behavior and interruption handling"
        headerRight={
            <button
            type="button"
            onClick={() => setCallManagementOpen((v) => !v)}
            className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
            aria-label={isCallManagementOpen ? "Collapse" : "Expand"}
            aria-expanded={isCallManagementOpen}
            >
            {isCallManagementOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
        }
        >
        {isCallManagementOpen && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Interruption Settings */}
            <div>
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Interruption Settings
                </h4>

                <div className="space-y-4">
                <div>
                    <Label>Interruption Threshold (words)</Label>
                    <Input
                    type="number"
                    value={interruptionThreshold}
                    onChange={(e) => setInterruptionThreshold(Number(e.target.value))}
                    />
                </div>

                <div>
                    <Label>Min Speaking Time (seconds)</Label>
                    <Input
                    type="number"
                    step={0.1}
                    value={minSpeakingTime}
                    onChange={(e) => setMinSpeakingTime(Number(e.target.value))}
                    />
                </div>

                <div>
                    <Label>Interruption Cooldown (seconds)</Label>
                    <Input
                    type="number"
                    step={0.1}
                    value={interruptionCooldown}
                    onChange={(e) => setInterruptionCooldown(Number(e.target.value))}
                    />
                </div>
                </div>
            </div>

            {/* Call Control Messages */}
            <div>
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Call Control Messages
                </h4>

                <div className="space-y-4">
                <div>
                    <Label>End Call Message</Label>
                    <Input
                    type="text"
                    value={endCallMessage}
                    onChange={(e) => setEndCallMessage(e.target.value)}
                    placeholder="Thank you for calling. Goodbye!"
                    />
                </div>

                <div>
                    <Label>Transfer Call Message</Label>
                    <Input
                    type="text"
                    value={transferCallMessage}
                    onChange={(e) => setTransferCallMessage(e.target.value)}
                    placeholder="Please hold while I transfer your call."
                    />
                </div>

                <div>
                    <Label>Idle Message</Label>
                    <Input
                    type="text"
                    value={idleMessage}
                    onChange={(e) => setIdleMessage(e.target.value)}
                    placeholder="Are you still there? I'm here to help if you need anything."
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Message sent when no activity is detected during a call
                    </p>
                </div>
                </div>
            </div>

            {/* Timeout Settings */}
            <div className="lg:col-span-2">
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Timeout Settings
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label>Max Idle Messages</Label>
                    <Input
                    type="number"
                    value={maxIdleMessages}
                    onChange={(e) => setMaxIdleMessages(Number(e.target.value))}
                    />
                </div>

                <div>
                    <Label>Idle Timeout (seconds)</Label>
                    <Input
                    type="number"
                    value={idleTimeout}
                    onChange={(e) => setIdleTimeout(Number(e.target.value))}
                    />
                </div>
                </div>
            </div>

            {/* Recording Settings */}
            <div className="lg:col-span-2">
                <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Recording Settings
                </h4>

                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-emerald-500/50 to-green-500/50 p-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                    </svg>

                    <span className="text-sm font-medium text-white">Twilio Call Recording</span>

                    <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-xs text-white">
                        🎙️ Always Enabled
                    </span>
                    </div>

                    <p className="mt-1 text-xs text-white/80">
                    All calls are automatically recorded by Twilio with high-quality MP3 format and stored securely in S3.
                    </p>
                </div>
                </div>
            </div>
            </div>
        )}
    </ComponentCard>

    <div className="my-4"></div>
    <ComponentCard
    title="Tools"
    desc="Enable tools to allow the assistant to perform actions during calls."
    headerRight={
        <button
        type="button"
        onClick={() => setToolsOpen((v) => !v)}
        className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
        aria-label={isToolsOpen ? "Collapse" : "Expand"}
        aria-expanded={isToolsOpen}
        >
        {isToolsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
    }
    >
    {isToolsOpen && (
        <div className="space-y-6">
        {/* End Call Tool */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 16l-2 2m2-2l2 2m-2-2l-2-2m2 2l2-2"
                />
                </svg>

                <Label className="mb-0">Enable End Call Tool</Label>
            </div>

            <Checkbox checked={endCallEnabled} onChange={setEndCallEnabled} />
            </div>

            {endCallEnabled && (
            <div className="space-y-4">
                <div>
                <Label>
                    End Call Scenarios{" "}
                    <Tooltip text="Comma-separated triggers where the assistant should end the call." />
                </Label>
                <TextArea
                    value={endCallScenarios}
                    onChange={(v) => setEndCallScenarios(v)}
                    rows={2}
                    placeholder="customer says goodbye, issue resolved, complaint escalated"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    When should the assistant automatically end the call?
                </p>
                </div>

                <div>
                <Label>
                    Custom End Call Message{" "}
                    <Tooltip text="Leave empty to use your default end call message from Call Management." />
                </Label>
                <Input
                    type="text"
                    value={endCallCustomMessage}
                    onChange={(e) => setEndCallCustomMessage(e.target.value)}
                    placeholder="Thank you for calling. Goodbye!"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty to use the default end call message above
                </p>
                </div>
            </div>
            )}
        </div>

        {/* Transfer Call Tool */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
                </svg>

                <Label className="mb-0">Enable Transfer Call Tool</Label>
            </div>

            <Checkbox checked={transferCallEnabled} onChange={setTransferCallEnabled} />
            </div>

            {transferCallEnabled && (
            <div className="space-y-4">
                <div>
                <Label>
                    Transfer Call Scenarios{" "}
                    <Tooltip text="Comma-separated triggers where the assistant should transfer to a human." />
                </Label>
                <TextArea
                    value={transferCallScenarios}
                    onChange={(v) => setTransferCallScenarios(v)}
                    rows={2}
                    placeholder="technical issue, billing inquiry, escalation request"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    When should the assistant transfer the call to a human?
                </p>
                </div>

                <div>
                <Label>
                    Transfer Phone Numbers{" "}
                    <Tooltip text="Comma-separated list (E.164 recommended). Example: +49123456789" />
                </Label>
                <TextArea
                    value={transferCallNumbers}
                    onChange={(v) => setTransferCallNumbers(v)}
                    rows={2}
                    placeholder="+1234567890, +0987654321"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Phone numbers where calls can be transferred
                </p>
                </div>

                <div>
                <Label>
                    Custom Transfer Message{" "}
                    <Tooltip text="Leave empty to use your default transfer message from Call Management." />
                </Label>
                <Input
                    type="text"
                    value={transferCallCustomMessage}
                    onChange={(e) => setTransferCallCustomMessage(e.target.value)}
                    placeholder="Please hold while I transfer your call."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty to use the default transfer call message above
                </p>
                </div>
            </div>
            )}
        </div>
        </div>
    )}
    </ComponentCard>

        
    <div className="my-4"></div>
    <ComponentCard
    title="Advanced Settings"
    desc="Structured data extraction and custom configurations"
    headerRight={
        <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        className="inline-flex h-9 w-9 mt-2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white/90"
        aria-label={isAdvancedOpen ? "Collapse" : "Expand"}
        aria-expanded={isAdvancedOpen}
        >
        {isAdvancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
    }
    >
    {isAdvancedOpen && (
        <div className="space-y-6">
        {/* Field builder */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-4 flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">
                What information do you want to capture from calls?
            </h5>

            <button
                type="button"
                onClick={() => addField()}
                className=" text-blue-500 inline-flex items-center rounded-lg border border-blue-500 bg-white px-3 py-2 text-xs font-medium  hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors">
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
            </div>
        </div>

        {/* Custom instructions */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">Custom Instructions</h5>
            <span className="text-xs text-gray-500 italic">Optional</span>
            <Tooltip text="Provide extra guidance about terminology, business context, or any special extraction rules." />
            </div>

            <TextArea
            value={structuredDataPrompt}
            onChange={(v) => setStructuredDataPrompt(v)}
            rows={4}
            placeholder='Add any specific instructions for your business context... e.g. "Focus on urgency level and product mentions (X, Y, Z)."'
            />

            <div className="mt-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
            <div className="text-xs text-yellow-700 dark:text-yellow-200">
                <strong>💡 Example:</strong> Focus on identifying customer urgency levels and any specific product mentions.
            </div>
            </div>
        </div>
        </div>
    )}
    </ComponentCard>

    </div>
    </div>
  );
}
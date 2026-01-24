import PageMeta from "../components/common/PageMeta";
import Breadcrumb from "../components/qall/assistants/AssistantBreadcrumb";

import AssistantCard, {
  AssistantPreview,
} from "../components/qall/assistants/AssistantCard";

export default function AssistantsPage() {
  // Dummy data (replace with API later)
  const assistants: AssistantPreview[] = [
    {
      id: "a1",
      name: "Assistant-1",
      description: "Order support agent for German customers.",
      status: "Active",

      llmProvider: "OpenAI",
      llmModel: "gpt-4.1-mini",

      sttProvider: "Deepgram",
      sttModel: "nova-2",
      language: "de-DE",

      ttsProvider: "ElevenLabs",
      ttsModel: "turbo-v2",
      voice: "Charlotte",

      editHref: "/assistants/a1",
      // iconUrl: "./images/brand/brand-07.svg",
    },
    {
      id: "a2",
      name: "Sales Assistant",
      description: "Lead qualification + appointment booking.",
      status: "Active",

      llmProvider: "OpenAI",
      llmModel: "gpt-4.1",

      sttProvider: "OpenAI",
      sttModel: "whisper-large-v3",
      language: "en-US",

      ttsProvider: "OpenAI",
      ttsModel: "gpt-4o-mini-tts",
      voice: "Alloy",

      editHref: "/assistants/a2",
    },
    {
      id: "a3",
      name: "After-hours Reception",
      description: "Collects details & routes tickets to inbox.",
      status: "Inactive",

      llmProvider: "Anthropic",
      llmModel: "claude-3.5-sonnet",

      sttProvider: "Deepgram",
      sttModel: "nova-2",
      language: "en-GB",

      ttsProvider: "ElevenLabs",
      ttsModel: "turbo-v2",
      voice: "James",

      editHref: "/assistants/a3",
    },
  ];

  const handleDelete = (a: AssistantPreview) => {
    // wire to real delete later
    // eslint-disable-next-line no-alert
    alert(`Delete assistant: ${a.name}`);
  };

  return (
    <div>
      <PageMeta
        title="Assistants "
        description="Manage AI assistants"
      />

      <Breadcrumb pageTitle="Assistants" />

        {/* Header row */}

        {/* Cards grid (max 3 columns) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
          {assistants.map((a) => (
            <AssistantCard
              key={a.id}
              assistant={a}
              onDelete={handleDelete}
            />
          ))}
        </div>
    </div>
  );
}
import { useState } from "react";
import ComponentCard from "../../../common/ComponentCard";
import Label from "../../../form/Label";
import Input from "../../../common/input/InputField";
import Checkbox from "../../../common/input/Checkbox";
import Select from "../../../form/Select";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import KnowledgebaseDropzone from "../KnowledgebaseDropZone";

type Props = {
  open: boolean;
  onToggle: () => void;

  ragEnabled: boolean;
  ragSearchLimit: number;
  ragSimilarityThreshold: number;
  ragChunkSize: string;

  kbFiles: File[];
  onChangeRagEnabled: (v: boolean) => void;
  onChangeSearchLimit: (v: number) => void;
  onChangeSimilarity: (v: number) => void;
  onChangeChunkSize: (v: string) => void;
  onChangeKbFiles: (files: File[]) => void;
};

export default function AssistantRagSection({
  open,
  onToggle,
  ragEnabled,
  ragSearchLimit,
  ragSimilarityThreshold,
  ragChunkSize,
  kbFiles,
  onChangeRagEnabled,
  onChangeSearchLimit,
  onChangeSimilarity,
  onChangeChunkSize,
  onChangeKbFiles,
}: Props) {
  const ragChunkSizes = [
    { value: "500", label: "500 chars (Precise)" },
    { value: "1000", label: "1000 chars (Balanced)" },
    { value: "1500", label: "1500 chars (Contextual)" },
    { value: "2000", label: "2000 chars (Large Context)" },
  ];

  const [isUploadOpen, setUploadOpen] = useState(false);

  return (
    <ComponentCard
      title={        
            <span className="inline-flex items-center gap-2">
                <BookOpen size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
                <span>Knowledge Base (RAG)</span>
            </span>
            }
      desc="Upload documents to enhance AI responses with your knowledge"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-800 dark:text-white/90">RAG Settings</span>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox checked={ragEnabled} onChange={onChangeRagEnabled} />
              <Label className="mb-0">Enable Knowledge Base</Label>
            </div>
          </div>

          {ragEnabled ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label>Max Documents per Query</Label>
                  <Input
                    type="number"
                    min={"1"}
                    max={"10"}
                    value={ragSearchLimit}
                    onChange={(e) => onChangeSearchLimit(Number(e.target.value))}
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
                    onChange={(e) => onChangeSimilarity(Number(e.target.value))}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum similarity score (0.1–1.0)
                  </p>
                </div>

                <div>
                  <Label>Chunk Size</Label>
                  <Select
                    options={ragChunkSizes}
                    placeholder="Select Chunk Size"
                    value={ragChunkSize ?? ""}
                    onChange={(v) => onChangeChunkSize(v)}
                    className="dark:bg-dark-900"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Size of text chunks for processing
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">Upload Documents</h4>

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
                    <KnowledgebaseDropzone value={kbFiles} onChange={onChangeKbFiles} maxSizeMb={10} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300">
              Knowledge Base is disabled. Enable it to configure settings and upload documents.
            </div>
          )}
        </div>
      )}
    </ComponentCard>
  );
}
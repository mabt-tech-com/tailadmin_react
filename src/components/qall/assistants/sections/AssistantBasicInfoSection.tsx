import ComponentCard from "../../../common/ComponentCard";
import Label from "../../../form/Label";
import Input from "../../../common/input/InputField";
import TextArea from "../../../common/input/TextArea";
import Checkbox from "../../../common/input/Checkbox";
import { BadgeInfo, ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  open: boolean;
  onToggle: () => void;

  name: string;
  description: string;
  isActive: boolean;

  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onChangeIsActive: (v: boolean) => void;

  loading?: boolean;
};

export default function AssistantBasicInfoSection({
  open,
  onToggle,
  name,
  description,
  isActive,
  onChangeName,
  onChangeDescription,
  onChangeIsActive,
  loading,
}: Props) {
  return (
    <ComponentCard
      title={
        <span className="inline-flex items-center gap-2">
            <BadgeInfo size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
            <span>Basic Information</span>
        </span>
        }
      desc="Core details about your assistant"
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
          <div>
            <Label>Assistant Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              disabled={!!loading}
            />
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              value={description}
              onChange={onChangeDescription}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox checked={isActive} onChange={onChangeIsActive} />
            <div>
                <Label className="mb-0">Active Assistant</Label>
                <span className="text-gray-400 text-xs">
                    When active, the assistant can receive and handle calls
                </span>
            </div>
          </div>
        </div>
      )}
    </ComponentCard>
  );
}
// src/components/qall/assistants/sections/AssistantToolsSection.tsx
import ComponentCard from "../../../common/ComponentCard";
import Label from "../../../form/Label";
import TextArea from "../../../common/input/TextArea";
import Input from "../../../common/input/InputField";
import Checkbox from "../../../common/input/Checkbox";
import { Tooltip } from "../../../common/Tooltip";
import { ChevronDown, ChevronUp, PhoneForwarded, PhoneMissed, Wrench } from "lucide-react";

export type AssistantToolsSectionPatch = {
  end_call_enabled?: boolean;
  end_call_scenarios?: string | null;
  end_call_custom_message?: string | null;

  transfer_call_enabled?: boolean;
  transfer_call_scenarios?: string | null;
  transfer_call_numbers?: string | null;
  transfer_call_custom_message?: string | null;
};

type Props = {
  open: boolean;
  onToggle: () => void;

  endCallEnabled: boolean;
  endCallScenarios: string;
  endCallCustomMessage: string;

  transferCallEnabled: boolean;
  transferCallScenarios: string;
  transferCallNumbers: string;
  transferCallCustomMessage: string;

  onChange: (patch: AssistantToolsSectionPatch) => void;
};

export default function AssistantToolsSection({
  open,
  onToggle,

  endCallEnabled,
  endCallScenarios,
  endCallCustomMessage,

  transferCallEnabled,
  transferCallScenarios,
  transferCallNumbers,
  transferCallCustomMessage,

  onChange,
}: Props) {
  return (
    <ComponentCard
      title={        
            <span className="inline-flex items-center gap-2">
                <Wrench size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
                <span>Tools</span>
            </span>
            }
      desc="Enable tools to allow the assistant to perform actions during calls."
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
          {/* End Call Tool */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-error-500">
                    <PhoneMissed size={15}/>
                </div>

                <Label className="mb-0">End Call Tool</Label>
              </div>

              <Checkbox
                checked={endCallEnabled}
                onChange={(v) =>
                  onChange({
                    end_call_enabled: v,
                    ...(v
                      ? {}
                      : {
                          // optional: clear fields when disabling
                          end_call_scenarios: "",
                          end_call_custom_message: "",
                        }),
                  })
                }
              />
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
                    onChange={(v) => onChange({ end_call_scenarios: v })}
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
                    onChange={(e) => onChange({ end_call_custom_message: e.target.value })}
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
                <div className="text-yellow-500">
                    <PhoneForwarded size={15}/>
                </div>

                <Label className="mb-0">Transfer Call Tool</Label>
              </div>

              <Checkbox
                checked={transferCallEnabled}
                onChange={(v) =>
                  onChange({
                    transfer_call_enabled: v,
                    ...(v
                      ? {}
                      : {
                          // optional: clear fields when disabling
                          transfer_call_scenarios: "",
                          transfer_call_numbers: "",
                          transfer_call_custom_message: "",
                        }),
                  })
                }
              />
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
                    onChange={(v) => onChange({ transfer_call_scenarios: v })}
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
                    onChange={(v) => onChange({ transfer_call_numbers: v })}
                    rows={2}
                    placeholder="+49123456789, +49301234567"
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
                    onChange={(e) => onChange({ transfer_call_custom_message: e.target.value })}
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
  );
}
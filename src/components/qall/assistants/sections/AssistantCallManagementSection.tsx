import ComponentCard from "../../../common/ComponentCard";
import Label from "../../../form/Label";
import Input from "../../../common/input/InputField";
import { ChevronDown, ChevronUp, PhoneCall } from "lucide-react";

type Patch = Partial<{
  interruption_threshold: number;
  min_speaking_time: number;
  interruption_cooldown: number;

  end_call_message: string;
  transfer_call_message: string;
  idle_message: string;

  max_idle_messages: number;
  idle_timeout: number;
}>;

type Props = {
  open: boolean;
  onToggle: () => void;

  interruptionThreshold: number;
  minSpeakingTime: number;
  interruptionCooldown: number;

  endCallMessage: string;
  transferCallMessage: string;
  idleMessage: string;

  maxIdleMessages: number;
  idleTimeout: number;

  onChange: (patch: Patch) => void;
};

export default function AssistantCallManagementSection({
  open,
  onToggle,
  interruptionThreshold,
  minSpeakingTime,
  interruptionCooldown,
  endCallMessage,
  transferCallMessage,
  idleMessage,
  maxIdleMessages,
  idleTimeout,
  onChange,
}: Props) {
  return (
    <ComponentCard
      title={        
            <span className="inline-flex items-center gap-2">
                <PhoneCall size={18} className="text-gray-700 dark:text-gray-400 mr-1" />
                <span>Call Management</span>
            </span>
            }
      desc="Configure call behavior and interruption handling"
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Interruption Settings</h4>

            <div className="space-y-4">
              <div>
                <Label>Interruption Threshold (words)</Label>
                <Input
                  type="number"
                  value={interruptionThreshold}
                  onChange={(e) => onChange({ interruption_threshold: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label>Min Speaking Time (seconds)</Label>
                <Input
                  type="number"
                  step={0.1}
                  value={minSpeakingTime}
                  onChange={(e) => onChange({ min_speaking_time: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label>Interruption Cooldown (seconds)</Label>
                <Input
                  type="number"
                  step={0.1}
                  value={interruptionCooldown}
                  onChange={(e) => onChange({ interruption_cooldown: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Call Control Messages</h4>

            <div className="space-y-4">
              <div>
                <Label>End Call Message</Label>
                <Input
                  type="text"
                  value={endCallMessage}
                  onChange={(e) => onChange({ end_call_message: e.target.value })}
                />
              </div>

              <div>
                <Label>Transfer Call Message</Label>
                <Input
                  type="text"
                  value={transferCallMessage}
                  onChange={(e) => onChange({ transfer_call_message: e.target.value })}
                />
              </div>

              <div>
                <Label>Idle Message</Label>
                <Input
                  type="text"
                  value={idleMessage}
                  onChange={(e) => onChange({ idle_message: e.target.value })}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Message sent when no activity is detected during a call
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Timeout Settings</h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Max Idle Messages</Label>
                <Input
                  type="number"
                  value={maxIdleMessages}
                  onChange={(e) => onChange({ max_idle_messages: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label>Idle Timeout (seconds)</Label>
                <Input
                  type="number"
                  value={idleTimeout}
                  onChange={(e) => onChange({ idle_timeout: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </ComponentCard>
  );
}